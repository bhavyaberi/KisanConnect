import { useState } from "react";
import { Heart, Star } from "lucide-react";
import PageHeader from "../PageHeader";
import { savedSellersSeed } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function SavedSellersPage() {
  const { t } = useLanguage();
  const [sellers, setSellers] = useState(savedSellersSeed);

  function unsave(id) {
    setSellers((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("savedSellers.title")} subtitle={t("savedSellers.subtitle")} />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="divide-y divide-stone-100">
          {sellers.map((s) => (
            <div key={s.id} className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{t(s.nameKey ?? s.name)}</p>
                <p className="text-xs text-stone-500">
                  {t(`crop.${s.cropId.toLowerCase()}`)} &middot; {t(s.regionKey ?? s.region)}
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                <Star size={12} className="fill-amber-500 text-amber-500" /> {s.rating}
              </span>
              <button
                onClick={() => unsave(s.id)}
                className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 active:scale-95"
              >
                <Heart size={13} className="fill-red-500" /> {t("savedSellers.unsave")}
              </button>
            </div>
          ))}
          {sellers.length === 0 && (
            <p className="py-6 text-center text-sm text-stone-400">{t("savedSellers.noSellers")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
