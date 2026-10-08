import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { GraduationCap } from "lucide-react";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import MarkListingSoldButton from "./MarkListingSoldButton";

export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const listings = await (await getPrisma()).listing.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-shell py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Seller dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Your listings</h1>
        </div>
        <Link href="/create" className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">+ New listing</Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">You haven’t listed anything yet</h2>
          <p className="mt-2 text-sm text-slate-600">Create a listing and it will appear here and in the marketplace.</p>
          <Link href="/create" className="mt-5 inline-flex rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">Create your first listing</Link>
        </div>
      ) : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <article key={listing.id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
            <img src={listing.imageUrls[0] ?? ""} alt={listing.title} className="h-52 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">{listing.category}</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(listing.price)}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{listing.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="h-4 w-4 text-indigo-600" /> {listing.status === "SOLD" ? "Sold" : "Active"}</div>
              <div className="mt-5 flex gap-3">
                <Link href={`/edit/${listing.id}`} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Edit</Link>
                {listing.status === "ACTIVE" ? <MarkListingSoldButton listingId={listing.id} /> : null}
              </div>
            </div>
          </article>
        ))}
      </div>}
    </div>
  );
}
