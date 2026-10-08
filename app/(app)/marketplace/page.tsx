import Link from "next/link";
import { Search } from "lucide-react";
import { categories, landingMockListings } from "@/lib/sample-data";
import MarketplaceResults from "./MarketplaceResults";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: requestedCategory } = await searchParams;
  const activeCategory = categories.find((category) => category === requestedCategory) ?? null;
  const filteredListings = activeCategory
    ? landingMockListings.filter((listing) => listing.category === activeCategory)
    : landingMockListings;

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Marketplace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            {activeCategory ? `${activeCategory} listings` : "Browse campus listings"}
          </h1>
        </div>
        <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input aria-label="Search listings" placeholder="Search laptops, books, bikes..." className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
        </div>
      </div>

      <nav aria-label="Listing categories" className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/marketplace"
          aria-current={activeCategory ? undefined : "page"}
          className={`rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${activeCategory ? "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700" : "border-indigo-700 bg-indigo-700 text-white"}`}
        >
          All items
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/marketplace?category=${encodeURIComponent(category)}`}
            aria-current={activeCategory === category ? "page" : undefined}
            className={`rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${activeCategory === category ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700"}`}
          >
            {category}
          </Link>
        ))}
      </nav>

      <MarketplaceResults key={activeCategory ?? "all"} listings={filteredListings} />
    </div>
  );
}
