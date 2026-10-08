import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { GraduationCap, Mail, Phone, Star } from "lucide-react";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const prisma = await getPrisma();
  const [user, listingCount, soldCount, ratings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, usn: true, degree: true, branch: true, bio: true, phone: true },
    }),
    prisma.listing.count({ where: { sellerId: session.user.id } }),
    prisma.listing.count({ where: { sellerId: session.user.id, status: "SOLD" } }),
    prisma.sellerRating.aggregate({ where: { sellerId: session.user.id }, _avg: { rating: true }, _count: true }),
  ]);
  if (!user) redirect("/login");
  const initials = user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-xl font-black text-white">{initials}</div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{user.name}</h1>
              {user.usn ? <p className="mt-1 text-sm font-semibold tracking-wide text-indigo-700">USN: {user.usn}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Listings</div>
            <div className="mt-2 text-3xl font-black text-slate-900">{listingCount}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Sales</div>
            <div className="mt-2 text-3xl font-black text-slate-900">{soldCount}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Rating</div>
            <div className="mt-2 flex items-center gap-2 text-3xl font-black text-slate-900">
              {ratings._avg.rating?.toFixed(1) ?? "—"}
              {ratings._count ? <span className="text-sm font-medium text-slate-500">({ratings._count})</span> : null}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">About</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{user.bio || "Add a short introduction to help other students get to know you."}</p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-600" /> {user.email}</div>
            {user.degree || user.branch ? <div className="flex items-center gap-3"><GraduationCap className="h-4 w-4 text-indigo-600" /> {[user.degree, user.branch].filter(Boolean).join(" • ")}</div> : null}
            {user.phone ? <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-600" /> {user.phone}</div> : null}
            <div className="flex items-center gap-3"><Star className="h-4 w-4 text-indigo-600" /> {ratings._count} seller rating{ratings._count === 1 ? "" : "s"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
