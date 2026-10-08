"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Lock } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const DENIED_ATTEMPTS_KEY = "nmit-google-denied-attempts";
const DENIED_ATTEMPTS_EVENT = "nmit-google-denied-attempts-change";

function subscribeToDeniedAttempts(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(DENIED_ATTEMPTS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DENIED_ATTEMPTS_EVENT, onChange);
  };
}

function getDeniedAttempts() {
  const attempts = Number.parseInt(window.sessionStorage.getItem(DENIED_ATTEMPTS_KEY) ?? "0", 10);
  return Number.isSafeInteger(attempts) && attempts > 0 ? attempts : 0;
}

export default function LoginForm({
  googleConfigured,
  errorNotice,
  accessDenied = false,
}: {
  googleConfigured: boolean;
  errorNotice?: string;
  accessDenied?: boolean;
}) {
  const deniedAttempts = useSyncExternalStore(subscribeToDeniedAttempts, getDeniedAttempts, () => 0);
  const hasRecordedDenial = useRef(false);

  useEffect(() => {
    if (!accessDenied || hasRecordedDenial.current) return;
    hasRecordedDenial.current = true;

    try {
      window.sessionStorage.setItem(DENIED_ATTEMPTS_KEY, String(getDeniedAttempts() + 1));
      window.dispatchEvent(new Event(DENIED_ATTEMPTS_EVENT));
    } catch (error) {
      console.error("Could not record the rejected Google sign-in attempt:", error);
    }
  }, [accessDenied]);

  const loginNotice = accessDenied && deniedAttempts > 1
    ? "You’ve tried signing in with an unverified account more than once. Please use your college email ID ending in @nmit.ac.in."
    : errorNotice;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_32px_90px_-40px_rgba(79,70,229,0.4)]">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Log in to buy, sell, and connect with your college community.</p>
        </div>

        {loginNotice ? <div role="status" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{loginNotice}</div> : null}
        <p className="mb-5 text-sm leading-6 text-slate-600">
          Sign in with your verified NMIT Google account. No password or verification email is needed.
        </p>
        <GoogleAuthButton configured={googleConfigured} />

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Campus Marketplace? <Link href="/register" className="font-semibold text-indigo-600">Continue with Google</Link>
        </p>
      </div>
    </main>
  );
}
