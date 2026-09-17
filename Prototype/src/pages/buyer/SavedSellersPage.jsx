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

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="divide-y divide-stone-100">
          {sellers.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2.5 py-3 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{s.name}</p>
                <p className="text-xs text-stone-500">{t(`crop.${s.cropId.toLowerCase()}`)} &middot; {s.region}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                  <Star size={12} className="flex-shrink-0 fill-amber-500 text-amber-500" /> {s.rating}
                </span>
                <button
                  onClick={() => unsave(s.id)}
                  className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 active:bg-red-100 sm:ml-0 sm:py-1.5"
                >
                  <Heart size={13} className="flex-shrink-0 fill-red-500" /> {t("savedSellers.unsave")}
                </button>
              </div>
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
