import { GraduationCap } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

const soldItems = [
  { title: "Desk lamp", price: 900, branch: "Information Science and Engineering" },
  { title: "Microeconomics textbook", price: 1400, branch: "Computer Science and Engineering" },
  { title: "Wireless earbuds", price: 3200, branch: "Electronics and Communication Engineering" },
];

export default function SoldPage() {
  return (
    <div className="container-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Sales history</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Sold listings</h1>
      </div>

      <div className="space-y-4">
        {soldItems.map((item, index) => (
          <div key={item.title} className="flex flex-col items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-700">{index + 1}</div>
              <div>
                <div className="text-lg font-bold text-slate-900">{item.title}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="h-4 w-4 text-indigo-600" /> {item.branch}</div>
              </div>
            </div>
            <div className="text-xl font-black text-slate-900">{formatCurrency(item.price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
