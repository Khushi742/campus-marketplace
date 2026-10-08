"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const maxIntroductionLength = 280;

export default function ProfileIntroductionEditor({ initialBio }: { initialBio: string }) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(!initialBio);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveIntroduction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Could not save your introduction.");
        setIsSaving(false);
        return;
      }
      setBio(result.bio);
      setIsEditing(false);
      setMessage("Introduction saved.");
      router.refresh();
    } catch {
      setMessage("Could not reach the server. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-3">
      {!isEditing ? (
        <>
          <p className="text-sm leading-7 text-slate-600">{bio}</p>
          <button
            type="button"
            onClick={() => { setMessage(""); setIsEditing(true); }}
            className="mt-3 text-sm font-semibold text-indigo-700 hover:underline"
          >
            Edit introduction
          </button>
        </>
      ) : (
        <form onSubmit={saveIntroduction}>
          <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-700">
            Short introduction
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={maxIntroductionLength}
            rows={3}
            placeholder="Tell other students a little about yourself."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-indigo-400"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">{bio.length}/{maxIntroductionLength}</span>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save introduction"}
            </button>
          </div>
        </form>
      )}
      {message ? <p role="status" className="mt-2 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
