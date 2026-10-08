import Link from "next/link";
import { categories } from "@/lib/sample-data";
import MarketplaceResults from "./MarketplaceResults";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: requestedCategory } = await searchParams;
  const activeCategory = categories.find((category) => category === requestedCategory) ?? null;
  const filteredListings = await (await getPrisma()).listing.findMany({
    where: { status: "ACTIVE", ...(activeCategory ? { category: activeCategory } : {}) },
    include: {
      seller: { select: { id: true, name: true, email: true, usn: true, degree: true, branch: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const maximumPrice = Math.max(0, ...filteredListings.map((listing) => listing.price));

  return (
    <div className="container-shell py-12">
      <div className="mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Marketplace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            {activeCategory ? `${activeCategory} listings` : "Browse campus listings"}
          </h1>
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

      <MarketplaceResults key={`${activeCategory ?? "all"}-${maximumPrice}`} listings={filteredListings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
      }))} />
    </div>
  );
}
