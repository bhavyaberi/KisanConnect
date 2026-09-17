import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { farmerMarketInsight, farmerPriceForecast, farmerSurplusAlert } from "../data/kisanConnectData";
import { useLanguage } from "../i18n/LanguageContext";

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const TrendIcon = farmerMarketInsight.trend === "up" ? TrendingUp : TrendingDown;
  const cropLabel = t(`crop.${farmerMarketInsight.cropId.toLowerCase()}`);

  const localizedForecast = farmerPriceForecast.map((d) => ({
    ...d,
    day: t(d.day),
  }));

  return (
    <>
      {/* Row 1 — Market Insights + 7-Day Price Forecast */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col justify-center rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 lg:w-72 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("farmerDash.marketInsights")}</h3>
          <p className="mt-1 text-xs text-stone-400">{cropLabel} &middot; {t("farmerDash.today")}</p>

          <div className="mt-4">
            <p className="text-xs text-stone-500">{t("farmerDash.currentPrice")}</p>
            <p className="text-2xl sm:text-3xl font-bold text-stone-900">{farmerMarketInsight.currentPrice}</p>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs text-emerald-700">{t("farmerDash.aiPredictedPrice")}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <p className="text-base sm:text-lg font-bold text-emerald-800">{farmerMarketInsight.predictedRange}</p>
              <TrendIcon size={16} className="text-emerald-600" />
            </div>
            <p className="mt-1 text-xs text-emerald-600">{t(farmerMarketInsight.trendNoteKey)}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("farmerDash.sevenDayForecast")}</h3>
          <p className="mt-1 text-xs text-stone-400">{cropLabel} &middot; {"\u20b9"}/kg, {t("farmerDash.aiPredictedUnit")}</p>

          <div className="mt-4 h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedForecast} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 — Surplus Alert banner */}
      {farmerSurplusAlert.active && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 sm:p-5 shadow-sm ${farmerSurplusAlert.severityColor}`}>
          <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{t("farmerDash.surplusAlertTitle")}</p>
              <span className="rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide">
                {t(`severity.${farmerSurplusAlert.severityKey}`)} {t("farmerDash.severitySuffix")}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed">{t(farmerSurplusAlert.messageKey)}</p>
          </div>
        </div>
      )}
    </>
  );
}
