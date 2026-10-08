export default function AppLoading() {
  return (
    <div role="status" aria-label="Loading page" className="container-shell py-12">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
            <div className="mt-5 h-6 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
