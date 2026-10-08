import Link from "next/link";
import { Heart, LogOut, Plus, ShoppingBag, UserRound } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import MarketplaceAssistant from "@/components/MarketplaceAssistant";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="container-shell flex items-center justify-between gap-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">Campus Marketplace</div>
              <div className="text-[9px] uppercase tracking-[0.24em] text-slate-500">Student Marketplace</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/create">Create</Link>
            <Link href="/my-listings">My listings</Link>
            <Link href="/favorites">Wishlist</Link>
            <Link href="/sold">Sold</Link>
            <Link href="/profile">Profile</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-6">
            {session ? (
              <>
                <Link href="/favorites" className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Wishlist"><Heart className="h-4 w-4" /></Link>
                <Link href="/profile" className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label="Profile"><UserRound className="h-4 w-4" /></Link>
                <form action="/api/auth/signout" method="post">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex min-w-24 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Log in</Link>
                <Link href="/create" className="inline-flex min-w-36 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">
                  <Plus className="h-4 w-4" />
                  Sell an item
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      {session?.user ? <MarketplaceAssistant /> : null}
    </div>
  );
}
