// `action` (when present) is a button. On a phone it drops onto its own
// full-width row beneath the title rather than squeezing in beside it.
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-stone-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {action && (
        <div className="[&>button]:w-full [&>button]:justify-center sm:[&>button]:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
