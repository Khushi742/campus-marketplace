import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { landingMockListings } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/currency";

export default function MyListingsPage() {
  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Seller dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Your listings</h1>
        </div>
        <Link href="/create" className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">+ New listing</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {landingMockListings.map((listing) => (
          <article key={listing.id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
            <img src={listing.imageUrls[0]} alt={listing.title} className="h-52 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">{listing.category}</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(listing.price)}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{listing.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="h-4 w-4 text-indigo-600" /> {listing.seller.branch}</div>
              <div className="mt-5 flex gap-3">
                <Link href={`/edit/${listing.id}`} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Edit</Link>
                <button className="flex-1 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Mark sold</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
