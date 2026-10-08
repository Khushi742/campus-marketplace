"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/sample-data";

export default function CreateListingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      category: String(formData.get("category") ?? "Other"),
      condition: String(formData.get("condition") ?? "Used"),
      location: String(formData.get("location") ?? "Campus"),
      imageUrls: [String(formData.get("imageUrl") ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80")],
    };

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to create listing");
      setIsLoading(false);
      return;
    }

    router.push("/my-listings");
  }

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Create listing</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">List an item in minutes</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">Title</label>
              <input id="title" name="title" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="Vintage desk lamp" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea id="description" name="description" rows={5} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="Describe the item condition, specs, and pickup details." />
            </div>
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700">Price (INR)</label>
              <input id="price" name="price" type="number" min="0" step="1" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="2500" />
            </div>
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select id="category" name="category" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="condition" className="mb-2 block text-sm font-medium text-slate-700">Condition</label>
              <select id="condition" name="condition" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white">
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">Campus/location</label>
              <input id="location" name="location" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="North Residence Hall" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-slate-700">Image URL</label>
              <input id="imageUrl" name="imageUrl" type="url" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="https://images.unsplash.com/..." />
            </div>
          </div>

          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <button type="submit" disabled={isLoading} className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">
            {isLoading ? "Creating listing..." : "Create listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
