"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Heart } from "lucide-react";
import { landingMockListings } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/currency";
import { formatListingAge } from "@/lib/listing-age";
import { getWishlistIds, WISHLIST_CHANGE_EVENT } from "@/lib/wishlist";
import WishlistButton from "@/components/WishlistButton";

export default function WishlistItems() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const syncWishlist = () => setSavedIds(getWishlistIds());
    syncWishlist();
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const savedListings = landingMockListings.filter((listing) => savedIds.includes(listing.id));

  if (savedListings.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white/75 p-10 text-center shadow-sm">
        <Heart className="mx-auto h-9 w-9 text-indigo-700" />
        <h2 className="mt-4 text-xl font-bold text-slate-900">Your wishlist is waiting</h2>
        <p className="mt-2 text-sm text-slate-600">Save listings you like and they’ll show up here.</p>
        <Link href="/marketplace" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Browse marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {savedListings.map((listing) => (
        <article key={listing.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <Link href={`/listing/${listing.id}`}>
              <img src={listing.imageUrls[0]} alt={listing.title} className="h-56 w-full object-cover" />
            </Link>
            <WishlistButton
              listingId={listing.id}
              listingTitle={listing.title}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm"
            />
          </div>
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">{listing.category}</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(listing.price)}</span>
            </div>
            <Link href={`/listing/${listing.id}`} className="text-xl font-bold text-slate-900 hover:text-indigo-700">{listing.title}</Link>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="h-4 w-4 text-indigo-600" /> {listing.seller.branch}</div>
            <p className="mt-3 text-xs font-medium text-slate-500">{formatListingAge(listing.createdAt)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
