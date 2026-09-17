import { useState } from "react";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { buyerListings } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function MarketplacePage({ onPlaceOrder }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [justBought, setJustBought] = useState(null);

  const filtered = buyerListings.filter((l) =>
    t(`crop.${l.cropId.toLowerCase()}`).toLowerCase().includes(query.toLowerCase()) ||
    l.cropId.toLowerCase().includes(query.toLowerCase()) ||
    t(l.farmerKey ?? l.farmer).toLowerCase().includes(query.toLowerCase())
  );

  function handleBuy(listing) {
    const unitPrice = parseInt(listing.price.replace(/[^0-9]/g, ""), 10) || 0;
    onPlaceOrder({
      id: Date.now(),
      cropId: listing.cropId,
      farmer: listing.farmer,
      farmerKey: listing.farmerKey,
      qty: "10 kg",
      total: `\u20b9${unitPrice * 10}`,
      statusKey: "confirmed",
    });
    setJustBought(listing.id);
    setTimeout(() => setJustBought(null), 2500);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("marketplace.title")} subtitle={t("marketplace.subtitle")} />

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("marketplace.searchPlaceholder")}
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-stone-900">{t(`crop.${l.cropId.toLowerCase()}`)}</p>
              <p className="text-sm font-bold text-emerald-700">{l.price.replace("/kg", t("unit.perKg"))}</p>
            </div>
            <p className="mt-1 text-sm text-stone-600 font-medium">{t(l.farmerKey ?? l.farmer)}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
              <MapPin size={12} /> {t("marketplace.away", { distance: l.distance })}
            </p>

            <button
              onClick={() => handleBuy(l)}
              disabled={justBought === l.id}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:bg-emerald-600 active:scale-98"
            >
              {justBought === l.id ? (
                <>
                  <CheckCircle2 size={16} /> {t("marketplace.orderPlaced")}
                </>
              ) : (
                t("marketplace.buy10kg")
              )}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-stone-400">
            {t("marketplace.noMatch", { query })}
          </p>
        )}
      </div>
    </div>
  );
}
