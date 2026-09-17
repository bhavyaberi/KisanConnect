import { useState } from "react";
import PageHeader from "../PageHeader";
import { regionOverview, regionStatusLegend } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

const STATUS_COLOR = { surplus: "#dc2626", shortage: "#eab308", balanced: "#166534" };

export default function RegionsHeatMapPage() {
  const { t } = useLanguage();

  // The pins used to reveal their detail on hover alone, which means they
  // were unreachable on a touch screen — there is no hover on a phone.
  // Selection is now explicit state driven by a tap/click, and hover is
  // layered on top of it as a desktop convenience rather than the only way in.
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("regions.title")} subtitle={t("regions.subtitle")} />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#5b6b3f] via-[#3f4d2c] to-[#2c3620] sm:h-[420px]">
          {regionOverview.map((r) => {
            const isSelected = selected === r.region;
            return (
              <button
                key={r.region}
                type="button"
                onClick={() => setSelected(isSelected ? null : r.region)}
                aria-label={r.region}
                aria-pressed={isSelected}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ top: r.top, left: r.left }}
              >
                {/* Generous invisible padding around the 20px dot so the tap
                    target clears the 44px minimum without enlarging the pin. */}
                <span className="block p-3">
                  <span
                    className={`block h-5 w-5 rounded-full border-2 border-white/80 shadow transition-transform ${
                      isSelected ? "scale-125 ring-2 ring-white/60" : ""
                    }`}
                    style={{ backgroundColor: STATUS_COLOR[r.statusKey] }}
                  />
                </span>

                <span
                  className={`pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs shadow-lg transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
                  }`}
                >
                  <span className="block font-semibold text-stone-800">{r.region}</span>
                  <span className="block text-stone-500">
                    {r.cropId ? t(`crop.${r.cropId.toLowerCase()}`) : "\u2014"} &middot; {t(`regionStatus.${r.statusKey}`)}
                  </span>
                </span>
              </button>
            );
          })}

          {/* On a phone the legend would sit on top of the lower pins, so it
              only overlays the map once there's room; below `sm` it moves
              out to its own row underneath. */}
          <div className="absolute bottom-3 left-3 hidden flex-wrap gap-4 rounded-lg bg-white/90 px-4 py-2 text-xs font-medium text-stone-700 shadow sm:flex">
            {regionStatusLegend.map((item) => (
              <div key={item.statusKey} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {t(`regionStatus.${item.statusKey}`)} <span className="text-stone-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-stone-700 sm:hidden">
          {regionStatusLegend.map((item) => (
            <div key={item.statusKey} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {t(`regionStatus.${item.statusKey}`)} <span className="text-stone-400">{item.count}</span>
            </div>
          ))}
        </div>

        {/* The instruction differs by input method, so each is shown only to
            the devices it actually applies to. */}
        <p className="mt-3 text-xs text-stone-400 sm:hidden">{t("regions.tapHint")}</p>
        <p className="mt-3 hidden text-xs text-stone-400 sm:block">{t("regions.hoverHint")}</p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <h3 className="mb-1 font-semibold text-stone-900">{t("regions.allRegions")}</h3>
        <div className="divide-y divide-stone-100">
          {/* Four columns don't fit a phone, so crop and status drop under
              the region name and only line up as columns at `sm`. */}
          {regionOverview.map((r) => (
            <div
              key={r.region}
              className="flex items-start gap-3 py-3 first:pt-0 sm:items-center sm:gap-4"
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full sm:mt-0"
                style={{ backgroundColor: STATUS_COLOR[r.statusKey] }}
              />
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
                <p className="flex-1 text-sm font-medium text-stone-800">{r.region}</p>
                <p className="mt-0.5 text-xs text-stone-500 sm:mt-0 sm:text-sm">
                  <span className="sm:hidden">
                    {r.cropId ? t(`crop.${r.cropId.toLowerCase()}`) : "\u2014"} &middot; {t(`regionStatus.${r.statusKey}`)}
                  </span>
                  <span className="hidden sm:inline">
                    {r.cropId ? t(`crop.${r.cropId.toLowerCase()}`) : "\u2014"}
                  </span>
                </p>
                <p className="hidden text-sm text-stone-500 sm:block">{t(`regionStatus.${r.statusKey}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
