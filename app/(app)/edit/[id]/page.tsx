"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/lib/sample-data";

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Edit listing</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Update item details</h1>
        </div>

        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
              <input defaultValue="MacBook Air 13-inch" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={5} defaultValue="Working perfectly and includes charger, case, and original box." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
              <input type="number" defaultValue={48000} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select defaultValue="Electronics" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Condition</label>
              <select defaultValue="Good" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400">
                <option>Like New</option>
                <option>Good</option>
                <option>Used</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input defaultValue="North Quad" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-indigo-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.push(`/listing/${params.id}`)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
            <button type="submit" className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
