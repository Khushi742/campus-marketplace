"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function GoogleAuthButton({ configured }: { configured: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startGoogleSignIn() {
    setError("");
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/complete-profile" });
    } catch {
      setError("Google sign-in could not be started. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startGoogleSignIn}
        disabled={!configured || isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-indigo-700">G</span>
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error ? <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {!configured ? (
        <p role="status" className="mt-3 text-sm leading-6 text-slate-600">
          Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the private environment file.
        </p>
      ) : null}
    </div>
  );
}
