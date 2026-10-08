"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import { engineeringBranches, engineeringDegrees } from "@/lib/student";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      usn: String(formData.get("usn") ?? ""),
      degree: String(formData.get("degree") ?? ""),
      branch: String(formData.get("branch") ?? ""),
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to create your account");
      setIsLoading(false);
      return;
    }

    router.push(`/login?verification=pending&email=${encodeURIComponent(payload.email)}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_32px_90px_-40px_rgba(79,70,229,0.4)]">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
            <UserRound className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Create your account with your NMIT college email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input id="name" name="name" type="text" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="Ananya Rao" />
          </div>

          <div>
            <label htmlFor="usn" className="mb-2 block text-sm font-medium text-slate-700">Student USN</label>
            <input id="usn" name="usn" type="text" required pattern="[A-Za-z]{2}[0-9]{2}[A-Za-z]{2,4}[0-9]{3}" title="Use the format NB25ISE111" maxLength={11} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 uppercase outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="NB25ISE111" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="degree" className="mb-2 block text-sm font-medium text-slate-700">Degree</label>
              <select id="degree" name="degree" required defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                <option value="" disabled>Select degree</option>
                {engineeringDegrees.map((degree) => <option key={degree} value={degree}>{degree}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="branch" className="mb-2 block text-sm font-medium text-slate-700">Engineering branch</label>
              <select id="branch" name="branch" required defaultValue="" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                <option value="" disabled>Select branch</option>
                {engineeringBranches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
            <input id="email" name="email" type="email" required pattern="[^@\s]+@nmit\.ac\.in" title="Use your college email ending in @nmit.ac.in" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="your.name@nmit.ac.in" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" name="password" type="password" minLength={8} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="At least 8 characters" />
          </div>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">
            {isLoading ? "Creating account..." : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-indigo-600">Log in</Link>
        </p>
      </div>
    </main>
  );
}
