"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { engineeringBranches, engineeringDegrees } from "@/lib/student";

type StudentProfile = {
  name: string;
  email: string;
  usn: string | null;
  degree: string | null;
  branch: string | null;
};

export default function CompleteStudentProfileForm({ user }: { user: StudentProfile }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/student-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usn: String(formData.get("usn") ?? ""),
          degree: String(formData.get("degree") ?? ""),
          branch: String(formData.get("branch") ?? ""),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to save your student details.");
        setIsSaving(false);
        return;
      }

      router.replace("/marketplace");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Check your connection and try again.");
      setIsSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_32px_90px_-40px_rgba(79,70,229,0.4)]">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Complete your student profile</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Signed in as {user.name} ({user.email}). Add your student details to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="usn" className="mb-2 block text-sm font-medium text-slate-700">Student USN</label>
            <input
              id="usn"
              name="usn"
              type="text"
              required
              pattern="[A-Za-z]{2}[0-9]{2}[A-Za-z]{2,4}[0-9]{3}"
              title="Use the format NB25ISE111"
              maxLength={11}
              defaultValue={user.usn ?? ""}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 uppercase outline-none transition focus:border-indigo-400 focus:bg-white"
              placeholder="NB25ISE111"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="degree" className="mb-2 block text-sm font-medium text-slate-700">Degree</label>
              <select id="degree" name="degree" required defaultValue={user.degree ?? ""} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                <option value="" disabled>Select degree</option>
                {engineeringDegrees.map((degree) => <option key={degree} value={degree}>{degree}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="branch" className="mb-2 block text-sm font-medium text-slate-700">Engineering branch</label>
              <select id="branch" name="branch" required defaultValue={user.branch ?? ""} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                <option value="" disabled>Select branch</option>
                {engineeringBranches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </div>
          </div>
          {error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
          <button type="submit" disabled={isSaving} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">
            {isSaving ? "Saving..." : "Save and continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
