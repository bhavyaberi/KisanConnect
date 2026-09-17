import { CheckCircle2, Circle } from "lucide-react";
import PageHeader from "../PageHeader";
import { useLanguage } from "../../i18n/LanguageContext";

const TRACKING_KEYS = ["confirmed", "pickedUp", "inTransit", "delivered"];
const STATUS_COLOR = {
  confirmed: "bg-amber-100 text-amber-700",
  pickedUp: "bg-amber-100 text-amber-700",
  inTransit: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

// `orders` comes from App's shared state — includes both the seeded demo
// history and anything just bought on the Marketplace page.
export default function BuyerOrdersPage({ orders }) {
  const { t } = useLanguage();
  const latest = orders[0];
  const currentStepIndex = latest ? TRACKING_KEYS.indexOf(latest.statusKey) : -1;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("buyerOrdersPage.title")} subtitle={t("buyerOrdersPage.subtitle")} />

      {latest && (
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <h3 className="font-semibold text-stone-900">
            {t("buyerOrdersPage.fromLabel", {
              crop: t(`crop.${latest.cropId.toLowerCase()}`),
              qty: latest.qty,
              farmer: latest.farmer,
            })}
          </h3>
          {/* The step labels are the tight part on a phone — they're given a
              fixed narrow column and allowed to wrap onto two lines, so the
              connector bars between steps keep their alignment either way. */}
          <div className="mt-5 flex items-start">
            {TRACKING_KEYS.map((key, i) => (
              <div key={key} className="flex flex-1 items-start last:flex-none">
                <div className="flex w-14 flex-shrink-0 flex-col items-center sm:w-20">
                  {i <= currentStepIndex ? (
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  ) : (
                    <Circle size={20} className="text-stone-300" />
                  )}
                  <p
                    className={`mt-1 text-center text-[10px] leading-tight sm:text-[11px] ${
                      i <= currentStepIndex ? "text-stone-700" : "text-stone-400"
                    }`}
                  >
                    {t(`status.${key}`)}
                  </p>
                </div>
                {i < TRACKING_KEYS.length - 1 && (
                  <div
                    className={`mt-2.5 h-0.5 flex-1 ${
                      i < currentStepIndex ? "bg-emerald-600" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <h3 className="mb-1 font-semibold text-stone-900">{t("buyerOrdersPage.orderHistory")}</h3>
        <div className="divide-y divide-stone-100">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center gap-3 py-3 first:pt-0 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">
                  {t(`crop.${o.cropId.toLowerCase()}`)} &middot; {o.qty}
                </p>
                <p className="truncate text-xs text-stone-500">{o.farmer} &middot; {o.total}</p>
              </div>
              <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[o.statusKey]}`}>
                {t(`status.${o.statusKey}`)}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="py-6 text-center text-sm text-stone-400">{t("buyerOrdersPage.noOrders")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
