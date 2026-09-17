import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "../PageHeader";
import { farmerEarningsHistory } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function EarningsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("earnings.title")} subtitle={t("earnings.subtitle")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <p className="text-sm text-stone-500">{t("earnings.thisMonth")}</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">{"\u20b9"}18,400</p>
          <p className="mt-1 text-xs text-emerald-600">{t("earnings.thisMonthDelta")}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <p className="text-sm text-stone-500">{t("earnings.last6Months")}</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">{"\u20b9"}88,700</p>
          <p className="mt-1 text-xs text-stone-400">{t("earnings.acrossMonths", { n: farmerEarningsHistory.length })}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <p className="text-sm text-stone-500">{t("earnings.ordersFulfilled")}</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">12</p>
          <p className="mt-1 text-xs text-stone-400">{t("earnings.ordersFulfilledDelta")}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <h3 className="font-semibold text-stone-900">{t("earnings.monthlyEarnings")}</h3>
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={farmerEarningsHistory} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#f1f1ea" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip />
              <Bar dataKey="amount" fill="#166534" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
