import { AlertTriangle } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import {
  adminStatCards, cropPriceForecast, demandSupplyByCrop, surplusAlerts, priceTrend,
} from "../data/kisanConnectData";
import { useLanguage } from "../i18n/LanguageContext";

export default function AdminDashboard() {
  const { t } = useLanguage();

  const supplyDemand = demandSupplyByCrop.map((d) => ({
    ...d,
    crop: t(`crop.${d.cropId.toLowerCase()}`),
  }));

  const localizedCropPriceForecast = cropPriceForecast.map((d) => ({
    ...d,
    day: t(d.day),
  }));

  const localizedPriceTrend = priceTrend.map((d) => ({
    ...d,
    day: t(d.day),
  }));

  return (
    <>
      {/* Market Intelligence Overview — the 4 headline KPIs */}
      <div>
        <h2 className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wide text-stone-500">
          {t("adminDash.overview")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {adminStatCards.map((card) => (
            <StatCard key={card.id} label={t(card.labelKey)} value={card.value} delta={t(card.deltaKey)} />
          ))}
        </div>
      </div>

      {/* Row 2 — Crop-wise Price Forecast + Supply vs Demand */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("adminDash.priceForecastTitle")}</h3>
          <div className="mt-1 flex items-center gap-3 sm:gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-emerald-700" /> {t("crop.tomato")}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-amber-500" /> {t("crop.onion")}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-stone-400" /> {t("crop.potato")}</span>
          </div>

          <div className="mt-4 h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedCropPriceForecast} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="tomato" stroke="#166534" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="onion" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="potato" stroke="#a8a29e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("adminDash.supplyDemandTitle")}</h3>
          <p className="mt-1 text-xs text-stone-400">{t("adminDash.supplyDemandSubtitle")}</p>

          <div className="mt-4 h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemand} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="crop" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip />
                <Bar dataKey="supply" name={t("adminDash.supplyLegend")} fill="#166534" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="demand" name={t("adminDash.demandLegend")} fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-700" /> {t("adminDash.supplyLegend")}</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> {t("adminDash.demandLegend")}</span>
          </div>
        </div>
      </div>

      {/* Row 3 — Surplus Alerts + Market Trends */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("adminDash.surplusAlertsTitle")}</h3>
          <ul className="mt-3 flex-1 divide-y divide-stone-100">
            {surplusAlerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3 py-3 first:pt-0">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">
                    {t(`crop.${alert.cropId.toLowerCase()}`)} &middot; {t(alert.regionKey ?? alert.region)}
                  </p>
                  <p className="text-xs text-stone-500">{t(`regionStatus.${alert.typeKey}`)}</p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    alert.severityKey === "high"
                      ? "bg-red-100 text-red-700"
                      : alert.severityKey === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {t(`severity.${alert.severityKey}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("adminDash.marketTrendsTitle")}</h3>
          <div className="mt-1 flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-emerald-700" /> {t("adminDash.platformAvg")}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-stone-400" /> {t("adminDash.mandiAvg")}</span>
          </div>

          <div className="mt-4 h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedPriceTrend} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="platform" stroke="#166534" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mandi" stroke="#a8a29e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
