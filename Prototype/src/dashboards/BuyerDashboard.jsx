import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { buyerSupplyForecast, expectedSupplyByCrop, buyerPriceHistory } from "../data/kisanConnectData";
import { useLanguage } from "../i18n/LanguageContext";

export default function BuyerDashboard() {
  const { t } = useLanguage();

  const supplyByCrop = expectedSupplyByCrop.map((d) => ({
    ...d,
    crop: t(`crop.${d.cropId.toLowerCase()}`),
  }));

  const localizedSupplyForecast = buyerSupplyForecast.map((d) => ({
    ...d,
    day: t(d.day),
  }));

  const localizedPriceHistory = buyerPriceHistory.map((d) => ({
    ...d,
    day: t(d.day),
  }));

  return (
    <>
      {/* Row 1 — Market Supply Forecast + Expected Supply by Crop */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("buyerDash.supplyForecastTitle")}</h3>
          <p className="mt-1 text-xs text-stone-400">{t("buyerDash.supplyForecastSubtitle")}</p>

          <div className="mt-4 h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={localizedSupplyForecast} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="supplyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#166534" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="supply" stroke="#166534" strokeWidth={2.5} fill="url(#supplyFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900">{t("buyerDash.supplyByCropTitle")}</h3>
          <p className="mt-1 text-xs text-stone-400">{t("buyerDash.supplyByCropSubtitle")}</p>

          <div className="mt-4 h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyByCrop} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke="#f1f1ea" />
                <XAxis dataKey="crop" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip />
                <Bar dataKey="supply" fill="#166534" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 — Price Trends (historical, multi-crop) */}
      <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-stone-900">{t("buyerDash.priceTrendsTitle")}</h3>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-emerald-700" /> {t("crop.tomato")}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-amber-500" /> {t("crop.onion")}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-stone-400" /> {t("crop.potato")}</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-stone-400">{t("buyerDash.priceTrendsSubtitle")}</p>

        <div className="mt-4 h-48 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={localizedPriceHistory} margin={{ left: -20, right: 10 }}>
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
    </>
  );
}
