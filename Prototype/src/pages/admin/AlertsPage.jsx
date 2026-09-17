import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { surplusAlerts } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

const SEVERITY_KEYS = ["high", "medium", "low"];
const SEVERITY_COLOR = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-stone-100 text-stone-500",
};

export default function AlertsPage() {
  const { t } = useLanguage();

  // Owned locally: acknowledging an alert here is real state, not just a
  // static list — matches Section 3.3's alert-management role for DoCA.
  const [alerts, setAlerts] = useState(surplusAlerts.map((a) => ({ ...a, acknowledged: false })));
  const [filter, setFilter] = useState("all");

  function acknowledge(id) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }

  const visible = alerts.filter((a) => filter === "all" || a.severityKey === filter);
  const activeCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("alerts.title")} subtitle={t("alerts.subtitleCount", { n: activeCount })} />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            filter === "all" ? "bg-emerald-800 text-white" : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          {t("alerts.filterAll")}
        </button>
        {SEVERITY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === key ? "bg-emerald-800 text-white" : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {t(`severity.${key}`)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="divide-y divide-stone-100">
          {/* Icon + description on one line, severity and the acknowledge
              action on a second, until there's room for a single row. */}
          {visible.map((a) => (
            <div
              key={a.id}
              className={`flex flex-col gap-2.5 py-3 first:pt-0 sm:flex-row sm:items-center sm:gap-4 ${
                a.acknowledged ? "opacity-50" : ""
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <AlertTriangle size={18} className="flex-shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800">
                    {t(`crop.${a.cropId.toLowerCase()}`)} &middot; {a.region}
                  </p>
                  <p className="text-xs text-stone-500">{t(`regionStatus.${a.typeKey}`)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-8 sm:pl-0">
                <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${SEVERITY_COLOR[a.severityKey]}`}>
                  {t(`severity.${a.severityKey}`)}
                </span>
                <button
                  onClick={() => acknowledge(a.id)}
                  disabled={a.acknowledged}
                  className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 active:bg-stone-100 disabled:cursor-not-allowed disabled:text-emerald-600 sm:ml-0 sm:py-1.5"
                >
                  <CheckCircle2 size={13} className="flex-shrink-0" />
                  {a.acknowledged ? t("alerts.acknowledged") : t("alerts.acknowledge")}
                </button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="py-6 text-center text-sm text-stone-400">{t("alerts.noAlerts")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
