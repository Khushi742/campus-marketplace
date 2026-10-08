"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";

export default function SellerRatingForm({
  sellerId,
  currentRating,
  canRate,
}: {
  sellerId: string;
  currentRating: number | null;
  canRate: boolean;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(currentRating ?? 0);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function submitRating() {
    if (rating < 1 || rating > 5) return;
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/sellers/${sellerId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error ?? "Could not save your rating.");
        setIsSaving(false);
        return;
      }
      setMessage("Your rating has been saved.");
      router.refresh();
    } catch {
      setMessage("Could not reach the server. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!canRate) {
    return (
      <p className="mt-2 text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-indigo-700 hover:underline">Sign in</Link> as a different student to rate this seller.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <label htmlFor="seller-rating" className="block text-sm text-slate-600">
        {currentRating ? "Update your rating" : "Rate this seller"}
      </label>
      <div className="mt-2 flex items-center gap-1" id="seller-rating" role="radiogroup" aria-label="Seller rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            onClick={() => setRating(value)}
            className="rounded p-1 text-amber-500"
          >
            <Star className={`h-5 w-5 ${rating >= value ? "fill-current" : ""}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={submitRating}
          disabled={rating === 0 || isSaving}
          className="ml-2 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
      {message ? <p role="status" className="mt-2 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
