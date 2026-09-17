import { Package } from "lucide-react";
import PageHeader from "../PageHeader";
import { farmerOrders } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

const STATUS_COLOR = {
  inTransit: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  pendingPickup: "bg-amber-100 text-amber-700",
};

export default function FarmerOrdersPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("farmerOrdersPage.title")} subtitle={t("farmerOrdersPage.subtitle")} />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="divide-y divide-stone-100">
          {farmerOrders.map((o) => (
            <div key={o.id} className="flex items-center gap-3 sm:gap-4 py-3 first:pt-0">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Package size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{t(o.buyerKey ?? o.buyer)}</p>
                <p className="text-xs text-stone-500">
                  {t(`crop.${o.cropId.toLowerCase()}`)} &middot; {o.qtyLabel.replace("kg", t("unit.kg"))}
                </p>
              </div>
              <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[o.statusKey]}`}>
                {t(`status.${o.statusKey}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
