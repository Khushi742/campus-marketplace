import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { GraduationCap } from "lucide-react";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function SoldPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const soldItems = await (await getPrisma()).listing.findMany({
    where: { sellerId: session.user.id, status: "SOLD" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Sales history</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Sold listings</h1>
      </div>

      {soldItems.length > 0 ? (
        <div className="space-y-4">
          {soldItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
              <div className="flex items-center gap-4">
                <img src={item.imageUrls[0] ?? ""} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <div className="text-lg font-bold text-slate-900">{item.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="h-4 w-4 text-indigo-600" /> {item.category}</div>
                </div>
              </div>
              <div className="text-xl font-black text-slate-900">{formatCurrency(item.price)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">No sold listings yet</h2>
          <p className="mt-2 text-sm text-slate-600">Items you mark as sold will appear here.</p>
        </div>
      )}
    </div>
  );
}
