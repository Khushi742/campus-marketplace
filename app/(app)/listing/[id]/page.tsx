import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { ArrowLeft, Check, GraduationCap, PackageCheck, ShieldCheck } from "lucide-react";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import { formatListingAge } from "@/lib/listing-age";
import SellerContactButton from "./SellerContactButton";
import WishlistButton from "@/components/WishlistButton";
import SellerRatingForm from "./SellerRatingForm";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = await getPrisma();
  const [listing, session] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, email: true, degree: true, branch: true } },
      },
    }),
    getServerSession(authOptions),
  ]);
  if (!listing) notFound();
  const [ratingSummary, existingRating] = await Promise.all([
    prisma.sellerRating.aggregate({ where: { sellerId: listing.sellerId }, _avg: { rating: true }, _count: true }),
    session?.user?.id
      ? prisma.sellerRating.findUnique({
          where: { sellerId_reviewerId: { sellerId: listing.sellerId, reviewerId: session.user.id } },
          select: { rating: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="container-shell py-8 md:py-12">
      <Link href="/marketplace" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-500">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">{listing.category}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{listing.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Listed by {listing.seller.name}</p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-sm md:p-5">
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-[22px] bg-[#eee8d9] md:min-h-[520px]">
            <img
              src={listing.imageUrls[0]}
              alt={listing.title}
              className="max-h-[520px] w-full object-contain"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700">
              <Check className="h-4 w-4 text-indigo-700" /> {listing.condition} condition
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700">
              <GraduationCap className="h-4 w-4 text-indigo-700" /> Student seller
            </span>
          </div>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <p className="text-sm font-medium text-slate-500">Asking price</p>
            <div className="mt-1 text-4xl font-black tracking-tight text-slate-900">{formatCurrency(listing.price)}</div>
            <p className="mt-2 text-sm font-medium text-slate-500">{formatListingAge(listing.createdAt.toISOString())}</p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
              <div>
                <p className="font-semibold text-slate-800">Campus pickup</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Message the seller to agree on a convenient campus meetup.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <SellerContactButton seller={{ ...listing.seller, branch: listing.seller.branch ?? "Engineering student" }} />
              <WishlistButton
                listingId={listing.id}
                listingTitle={listing.title}
                showLabel
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              />
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-700" />
              Connect with a fellow student and arrange pickup directly.
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Seller information</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800">
                {listing.seller.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-slate-900">{listing.seller.name}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700" />
              <span>{[listing.seller.degree, listing.seller.branch].filter(Boolean).join(" · ") || "NMIT student"}</span>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="font-semibold text-slate-900">
                Seller rating: {ratingSummary._avg.rating?.toFixed(1) ?? "Not rated"}
                {ratingSummary._count ? <span className="ml-2 text-sm font-normal text-slate-500">({ratingSummary._count})</span> : null}
              </p>
              <SellerRatingForm
                sellerId={listing.sellerId}
                currentRating={existingRating?.rating ?? null}
                canRate={Boolean(session?.user?.id) && session?.user?.id !== listing.sellerId}
              />
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-bold text-slate-900">About this item</h2>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">{listing.description}</p>
        <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</p>
            <p className="mt-1 font-semibold text-slate-800">{listing.category}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Condition</p>
            <p className="mt-1 font-semibold text-slate-800">{listing.condition}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
