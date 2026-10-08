"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/sample-data";

type EditableListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
};

export default function EditListingForm({ listing }: { listing: EditableListing }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const price = Number(formData.get("price"));
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          price,
          category: formData.get("category"),
          condition: formData.get("condition"),
          location: formData.get("location"),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not update this listing.");
        setIsSaving(false);
        return;
      }
      router.push("/my-listings");
    } catch {
      setError("Could not reach the server. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Edit listing</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Update item details</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">Title</label>
              <input id="title" name="title" required maxLength={120} defaultValue={listing.title} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea id="description" name="description" required rows={5} maxLength={5000} defaultValue={listing.description} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700">Price</label>
              <input id="price" name="price" type="number" required min={0} step="0.01" defaultValue={listing.price} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select id="category" name="category" defaultValue={listing.category} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400">
                {!categories.some((category) => category === listing.category) ? <option>{listing.category}</option> : null}
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="condition" className="mb-2 block text-sm font-medium text-slate-700">Condition</label>
              <select id="condition" name="condition" defaultValue={listing.condition} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400">
                {!["Like New", "Good", "Used"].includes(listing.condition) ? <option>{listing.condition}</option> : null}
                <option>Like New</option>
                <option>Good</option>
                <option>Used</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input id="location" name="location" required maxLength={200} defaultValue={listing.location} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
          </div>

          {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push("/my-listings")} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={isSaving} className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
