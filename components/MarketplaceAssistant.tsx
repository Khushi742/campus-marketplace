"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export default function MarketplaceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: "Hi! I can help you find items, understand listings, or use Campus Marketplace. What do you need?" },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const completedHistory = nextMessages.slice(1, -1);
      let lastCompletedAssistantIndex = -1;
      for (let index = 0; index < completedHistory.length; index += 1) {
        if (completedHistory[index].role === "model") lastCompletedAssistantIndex = index;
      }
      const conversation = [
        ...completedHistory.slice(0, lastCompletedAssistantIndex + 1),
        nextMessages[nextMessages.length - 1],
      ].slice(-12);
      if (conversation[0]?.role === "model") conversation.shift();

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      const result = await response.json() as { answer?: string; error?: string };
      if (!response.ok) {
        setError(result.error ?? "The assistant could not answer just now.");
        return;
      }
      const answer = result.answer;
      if (!answer) {
        setError("The assistant returned an empty response. Please try again.");
        return;
      }
      setMessages((current) => [...current, { role: "model", text: answer }]);
    } catch {
      setError("Could not reach the assistant. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen ? (
        <section className="mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-[#fffdf6]/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between bg-indigo-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Bot className="h-5 w-5" /></div>
              <div>
                <h2 className="font-bold">Campus assistant</h2>
                <p className="text-xs text-indigo-100">AI-powered help</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant" className="rounded-full p-2 transition hover:bg-white/15">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={conversationRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-indigo-700 text-white" : "mr-auto border border-slate-200 bg-white text-slate-800"}`}>
                {message.text}
              </div>
            ))}
            {isLoading ? (
              <div className="mr-auto flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <LoaderCircle className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            ) : null}
            {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 p-3">
            <input
              aria-label="Message the campus assistant"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1000}
              placeholder="Ask about the marketplace…"
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close campus assistant" : "Open campus assistant"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-700 text-white shadow-xl shadow-indigo-950/20 transition hover:scale-105 hover:bg-indigo-600"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
