import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Bike, BriefcaseBusiness, ChevronRight, GraduationCap, MapPin, ShieldCheck, ShoppingBag, Sparkles, Tag, Truck } from "lucide-react";
import { categories, landingMockListings } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/currency";
import { formatListingAge } from "@/lib/listing-age";

const features = [
  {
    icon: ShieldCheck,
    title: "Student-only marketplace",
    description: "Designed for verified campus communities, with safer listings and trusted transactions.",
  },
  {
    icon: BadgeCheck,
    title: "Safe campus community",
    description: "Buy and sell within your college community, with convenient campus meetup spots.",
  },
  {
    icon: Tag,
    title: "Easy selling",
    description: "List in minutes with reusable categories, pricing, and location-based search.",
  },
  {
    icon: MapPin,
    title: "Find deals nearby",
    description: "Browse nearby items and discover campus deals close to your classes, dorms, or offices.",
  },
];

const steps = [
  "Create account",
  "List your item",
  "Connect with buyers",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight">Campus Marketplace</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Student Marketplace
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/create">Sell</Link>
            <Link href="/favorites">Wishlist</Link>
            <Link href="/profile">Profile</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-6">
            <Link href="/login" className="inline-flex min-w-24 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Log in
            </Link>
            <Link href="/register" className="inline-flex min-w-28 items-center justify-center whitespace-nowrap rounded-full bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">
              Join now
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container-shell py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                <Sparkles className="h-4 w-4" />
                Campus deals, made easy
              </div>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                Your Campus.<br />
                Your Marketplace.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Buy textbooks, electronics, furniture, sports gear and more from students around you.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/marketplace" className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500">
                  Explore Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/create" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Sell an Item
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-12 h-24 w-24 rounded-full bg-violet-200 blur-3xl" />
              <div className="absolute -right-6 bottom-8 h-24 w-24 rounded-full bg-indigo-200 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_-40px_rgba(79,70,229,0.45)]">
                <div className="rounded-[24px] bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Featured</span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Verified</span>
                      </div>
                      <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80" alt="Campus community" className="h-52 w-full rounded-2xl object-cover" />
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">Used desk setup</div>
                          <div className="text-sm text-slate-500">North Campus</div>
                        </div>
                        <div className="text-lg font-black text-indigo-600">{formatCurrency(8500)}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-lg shadow-indigo-200">
                        <div className="text-xs uppercase tracking-[0.2em] text-indigo-100">Live</div>
                        <div className="mt-3 text-3xl font-black">1.2k+</div>
                        <div className="text-sm text-indigo-100">active student listings</div>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          Nearby deals
                        </div>
                        <div className="space-y-3 text-sm text-slate-600">
                          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                            <span>Textbooks</span>
                            <span className="font-semibold text-slate-900">24</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                            <span>Bike gear</span>
                            <span className="font-semibold text-slate-900">16</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                            <span>Electronics</span>
                            <span className="font-semibold text-slate-900">43</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Categories</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Shop by category</h2>
            </div>
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              Browse all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const icons = [BookOpen, Bike, BriefcaseBusiness, ShoppingBag, Tag, Sparkles, Truck, MapPin];
              const Icon = icons[index % icons.length];

              return (
                <Link key={category} href={`/marketplace?category=${encodeURIComponent(category)}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-lg font-bold text-slate-900">{category}</div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="container-shell py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Trending</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Trending on Campus</h2>
            </div>
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              View more <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {landingMockListings.map((listing) => (
              <article key={listing.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <img src={listing.imageUrls[0]} alt={listing.title} className="h-60 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700">{listing.category}</span>
                    <span className="text-xl font-black text-slate-900">{formatCurrency(listing.price)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{listing.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                    {listing.seller.branch}
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500">{formatListingAge(listing.createdAt)}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-500">By {listing.seller.name}</span>
                    <Link href={`/listing/${listing.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                      View details <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container-shell">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Why us</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Why Campus Marketplace?</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">How it works</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Simple 3-step process</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">0{index + 1}</div>
                <h3 className="text-xl font-bold text-slate-900">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {index === 0 && "Set up your account using your campus email for trustworthy local buying and selling."}
                  {index === 1 && "Upload product photos, set the right price, and share your location or campus area."}
                  {index === 2 && "Message sellers or buyers directly and complete each transaction with confidence."}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
