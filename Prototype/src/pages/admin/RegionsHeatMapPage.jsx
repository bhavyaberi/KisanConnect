import { useState } from "react";
import PageHeader from "../PageHeader";
import { regionOverview, regionStatusLegend } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

const STATUS_COLOR = { surplus: "#dc2626", shortage: "#eab308", balanced: "#166534" };

export default function RegionsHeatMapPage() {
  const { t } = useLanguage();
  const [activePin, setActivePin] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("regions.title")} subtitle={t("regions.subtitle")} />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="relative h-[360px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#5b6b3f] via-[#3f4d2c] to-[#2c3620]">
          {regionOverview.map((r) => {
            const isSelected = activePin === r.region;
            return (
              <div
                key={r.region}
                onClick={() => setActivePin(isSelected ? null : r.region)}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 z-10"
                style={{ top: r.top, left: r.left }}
              >
                <span
                  className="block h-5 w-5 rounded-full border-2 border-white/90 shadow-md transition-transform group-hover:scale-125"
                  style={{ backgroundColor: STATUS_COLOR[r.statusKey] }}
                />
                <div
                  className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg transition-opacity ${
                    isSelected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100"
                  }`}
                >
                  <p className="font-semibold text-stone-800">{t(r.regionKey ?? r.region)}</p>
                  <p className="text-stone-500">
                    {r.cropId ? t(`crop.${r.cropId.toLowerCase()}`) : "\u2014"} &middot; {t(`regionStatus.${r.statusKey}`)}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:bottom-3 sm:left-3 flex flex-wrap gap-2.5 sm:gap-4 rounded-lg bg-white/95 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-medium text-stone-700 shadow">
            {regionStatusLegend.map((item) => (
              <div key={item.statusKey} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {t(`regionStatus.${item.statusKey}`)} <span className="text-stone-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2.5 text-xs text-stone-400">{t("regions.hoverHint")}</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-2 font-semibold text-stone-900">{t("regions.allRegions")}</h3>
        <div className="divide-y divide-stone-100">
          {regionOverview.map((r) => (
            <div key={r.region} className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLOR[r.statusKey] }} />
              <p className="flex-1 text-sm font-medium text-stone-800">{t(r.regionKey ?? r.region)}</p>
              <p className="text-xs sm:text-sm text-stone-500">{r.cropId ? t(`crop.${r.cropId.toLowerCase()}`) : "\u2014"}</p>
              <p className="text-xs sm:text-sm text-stone-500">{t(`regionStatus.${r.statusKey}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
