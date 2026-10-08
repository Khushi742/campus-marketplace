import { Mail, MapPin, Phone } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-xl font-black text-white">AA</div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Ananya Rao</h1>
              <p className="mt-1 text-sm font-semibold tracking-wide text-indigo-700">USN: NB25ISE111</p>
            </div>
          </div>
          <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Edit profile</button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Listings</div>
            <div className="mt-2 text-3xl font-black text-slate-900">18</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Sales</div>
            <div className="mt-2 text-3xl font-black text-slate-900">7</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Rating</div>
            <div className="mt-2 text-3xl font-black text-slate-900">4.9</div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">About</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Student seller focused on textbooks, dorm essentials, and study gear. I like quick, safe campus pickups and transparent pricing.</p>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-600" /> ananya.rao@campus.edu</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-indigo-600" /> BE • Information Science and Engineering</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-600" /> +91 98765 43210</div>
          </div>
        </div>
      </div>
    </div>
  );
}
