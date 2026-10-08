"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteListingButton({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteListing() {
    if (!window.confirm(`Delete "${listingTitle}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not delete this listing.");
        setIsDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={deleteListing}
        disabled={isDeleting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error ? <p role="alert" className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}