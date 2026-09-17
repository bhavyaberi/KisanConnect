import { Construction } from "lucide-react";

export default function PagePlaceholder({ label }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white p-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Construction size={24} />
      </span>
      <h2 className="mt-4 text-xl font-bold text-stone-900">{label}</h2>
      <p className="mt-2 max-w-sm text-sm text-stone-500">
        Not built out in this prototype yet &mdash; only the Dashboard view is
        fully wired up for the demo. Click "Dashboard" in the sidebar to go back.
      </p>
    </div>
  );
}
