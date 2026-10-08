import WishlistItems from "./WishlistItems";

export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  return (
    <div className="container-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Your saved items</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Wishlist</h1>
      </div>

      <WishlistItems />
    </div>
  );
}
