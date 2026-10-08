"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-shell py-20">
      <div role="alert" className="mx-auto max-w-xl rounded-[28px] border border-red-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">We couldn’t load this page</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">Something went wrong while loading marketplace data. Please try again.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Try again
        </button>
      </div>
    </div>
  );
}
