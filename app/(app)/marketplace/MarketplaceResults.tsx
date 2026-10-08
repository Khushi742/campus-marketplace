"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, SlidersHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { formatListingAge } from "@/lib/listing-age";
import WishlistButton from "@/components/WishlistButton";

type MarketplaceListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  createdAt: string;
  seller: { id: string; name: string; branch: string | null };
};

export default function MarketplaceResults({
  listings,
}: {
  listings: MarketplaceListing[];
}) {
  const maximumPrice = Math.max(0, ...listings.map((listing) => listing.price));
  const [priceLimit, setPriceLimit] = useState(maximumPrice);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchingListings = listings.filter((listing) =>
    [listing.title, listing.description, listing.category]
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
  const visibleListings = matchingListings.filter((listing) => listing.price <= priceLimit);

  return (
    <>
      <label className="mb-6 flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:max-w-xl">
        <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          aria-label="Search listings"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search laptops, books, bikes..."
          className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>

      <section className="mb-8 rounded-[24px] border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-indigo-700" />
            Price range
          </div>
          <span className="text-sm font-bold text-indigo-800">Up to {formatCurrency(priceLimit)}</span>
        </div>
        <input
          aria-label="Maximum listing price"
          type="range"
          min={0}
          max={maximumPrice || 1}
          step="any"
          value={priceLimit}
          onChange={(event) => setPriceLimit(Number(event.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-indigo-100 accent-indigo-700"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(maximumPrice)}</span>
        </div>
      </section>

      {visibleListings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleListings.map((listing) => (
            <article key={listing.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative">
                <Link href={`/listing/${listing.id}`}>
                  <img src={listing.imageUrls[0]} alt={listing.title} className="h-60 w-full object-cover" />
                </Link>
                <WishlistButton
                  listingId={listing.id}
                  listingTitle={listing.title}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:text-red-500"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">{listing.category}</span>
                  <span className="text-xl font-black text-slate-900">{formatCurrency(listing.price)}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{listing.title}</h2>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <GraduationCap className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span>{listing.seller.branch}</span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">{formatListingAge(listing.createdAt)}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">By {listing.seller.name}</span>
                  <Link href={`/listing/${listing.id}`} className="inline-flex min-h-10 items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-indigo-500">
                    View item
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : normalizedQuery && matchingListings.length === 0 ? (
        <div role="status" className="rounded-[24px] border border-slate-200 bg-white/75 p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">We couldn’t find that item</h2>
          <p className="mt-2 text-sm text-slate-600">The website currently doesn’t have this item. Please wait and check back later.</p>
        </div>
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white/75 p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {normalizedQuery ? "No listings in this price range" : "No listings available"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {normalizedQuery ? "Increase the maximum price to see more items." : "Check back later for new campus listings."}
          </p>
        </div>
      )}
    </>
  );
}
