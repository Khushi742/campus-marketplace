"use client";

import { useState } from "react";
import { GraduationCap, Mail, X } from "lucide-react";

type SellerContactButtonProps = {
  seller: {
    name: string;
    branch: string;
    email: string;
  };
};

export default function SellerContactButton({ seller }: SellerContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200/60 transition hover:bg-indigo-500"
      >
        Contact seller
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-contact-title"
            className="w-full max-w-lg animate-[slide-up_280ms_cubic-bezier(0.16,1,0.3,1)] rounded-[30px] border border-white/70 bg-[#fffdf6]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">Seller contact</p>
                <h2 id="seller-contact-title" className="mt-2 text-2xl font-black text-slate-900">Connect with {seller.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close seller contact"
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white/75 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">{seller.name}</p>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Branch</p>
                  <p className="mt-1 font-medium leading-6 text-slate-800">{seller.branch}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
                  <a href={`mailto:${seller.email}`} className="mt-1 block break-all font-medium text-indigo-700 underline-offset-4 hover:underline">
                    {seller.email}
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">Email the seller to ask about the item and arrange a convenient campus pickup.</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
