"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getWishlistIds, toggleWishlistId, WISHLIST_CHANGE_EVENT } from "@/lib/wishlist";

type WishlistButtonProps = {
  listingId: string;
  listingTitle: string;
  className?: string;
  showLabel?: boolean;
};

export default function WishlistButton({
  listingId,
  listingTitle,
  className = "",
  showLabel = false,
}: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const syncWishlist = () => setIsSaved(getWishlistIds().includes(listingId));
    syncWishlist();
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, [listingId]);

  function handleClick() {
    setIsSaved(toggleWishlistId(listingId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${isSaved ? "Remove from" : "Save to"} wishlist: ${listingTitle}`}
      aria-pressed={isSaved}
      className={className}
    >
      <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-rose-600" : ""}`} />
      {showLabel ? (isSaved ? "Saved to wishlist" : "Save listing") : null}
    </button>
  );
}
