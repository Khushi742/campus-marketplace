"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkListingSoldButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function markSold() {
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SOLD" }),
      });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "Could not update this listing.");
        setIsSaving(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setIsSaving(false);
    }
  }

  return (
    <div className="flex-1">
      <button onClick={markSold} disabled={isSaving} className="w-full rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
        {isSaving ? "Updating..." : "Mark sold"}
      </button>
      {error ? <p role="alert" className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
