import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Record<string, unknown>;
  return (message.role === "user" || message.role === "model")
    && typeof message.text === "string"
    && message.text.trim().length > 0
    && message.text.length <= 1000;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to use the Campus Marketplace assistant." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid chat message." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12 || !messages.every(isChatMessage)) {
    return NextResponse.json({ error: "Send up to 12 valid chat messages, each under 1,000 characters." }, { status: 400 });
  }

  if (messages[0].role !== "user" || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "The conversation must start and end with your message." }, { status: 400 });
  }
  if (messages.some((message, index) => index > 0 && message.role === messages[index - 1].role)) {
    return NextResponse.json({ error: "Conversation messages must alternate between you and the assistant." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The AI assistant is not configured yet. Please contact the administrator." }, { status: 503 });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "You are the Campus Marketplace assistant for an Indian college community. Help users browse categories, understand listings, create safe campus transactions, and use the site. Prices are in INR. Do not claim to contact sellers, verify accounts, make purchases, or access private account data. Keep answers concise and never ask users to share passwords, verification codes, or API keys.",
          }],
        },
        contents: messages.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 500,
        },
      }),
    });
  } catch (error) {
    console.error("Could not reach the Gemini API:", error);
    return NextResponse.json({ error: "The assistant is temporarily unavailable. Please try again." }, { status: 502 });
  }

  if (!geminiResponse.ok) {
    console.error("Gemini API returned an error:", geminiResponse.status);
    return NextResponse.json({ error: "The assistant could not answer just now. Please try again." }, { status: 502 });
  }

  let result: unknown;
  try {
    result = await geminiResponse.json();
  } catch (error) {
    console.error("Gemini API returned an invalid JSON response:", error);
    return NextResponse.json({ error: "The assistant returned an invalid response. Please try again." }, { status: 502 });
  }
  const candidates = (result as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;
  const answer = candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

  if (!answer) {
    console.error("Gemini API returned no text candidate.");
    return NextResponse.json({ error: "The assistant returned an empty response. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ answer });
}
