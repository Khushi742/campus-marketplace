"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { categories } from "@/lib/sample-data";

export default function CreateListingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");
    if (file && file.size > 4 * 1024 * 1024) {
      setSelectedImage(null);
      setImagePreview("");
      event.target.value = "";
      setError("Choose an image smaller than 4 MB.");
      return;
    }
    setSelectedImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (selectedImage) {
      const uploadData = new FormData();
      uploadData.set("file", selectedImage);
      try {
        const uploadResponse = await fetch("/api/upload", { method: "POST", body: uploadData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          setError(uploadResult.error ?? "Unable to upload this image.");
          setIsLoading(false);
          return;
        }
        imageUrl = uploadResult.url;
      } catch {
        setError("Could not reach the image upload service. Try again.");
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      category: String(formData.get("category") ?? "Other"),
      condition: String(formData.get("condition") ?? "Used"),
      location: String(formData.get("location") ?? "Campus"),
      imageUrls: [imageUrl || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"],
    };

    let response: Response;
    try {
      response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setError("Could not reach the server. Try again.");
      setIsLoading(false);
      return;
    }

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
              <label htmlFor="imageFile" className="mb-2 block text-sm font-medium text-slate-700">Upload an image from your device</label>
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-200"
              />
              <p className="mt-2 text-xs text-slate-500">JPG, PNG, or WebP; maximum 4 MB.</p>
              {imagePreview ? <img src={imagePreview} alt="Selected item preview" className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}
              <label htmlFor="imageUrl" className="mb-2 mt-5 block text-sm font-medium text-slate-700">Or use an image URL</label>
              <input id="imageUrl" name="imageUrl" type="url" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none transition focus:border-indigo-400 focus:bg-white" placeholder="https://..." />
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
