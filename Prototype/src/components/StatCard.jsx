// Deliberately simpler than a typical KPI card (no icon, no chart) — just
// the number and one line of context. Keeps the dashboard from feeling
// dense, per the "don't make it overcrowded" brief.
export default function StatCard({ label, value, delta }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-emerald-600">{delta}</p>
    </div>
  );
}
