import { useState } from "react";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { adminReports } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function ReportsPage() {
  const { t } = useLanguage();
  const [generated, setGenerated] = useState({});

  function handleGenerate(id) {
    setGenerated((g) => ({ ...g, [id]: "generating" }));
    setTimeout(() => setGenerated((g) => ({ ...g, [id]: "ready" })), 1000);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("reports.title")} subtitle={t("reports.subtitle")} />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="divide-y divide-stone-100">
          {adminReports.map((r) => {
            const state = generated[r.id];
            return (
              <div
                key={r.id}
                className="flex flex-col gap-2.5 py-3 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800">{t(r.nameKey)}</p>
                    <p className="text-xs text-stone-500">{t(r.descKey)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerate(r.id)}
                  disabled={state === "generating"}
                  className="ml-12 flex items-center gap-1.5 self-start whitespace-nowrap rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-60 sm:ml-0 sm:self-auto sm:py-1.5"
                >
                  {state === "ready" ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600" /> {t("reports.ready")}
                    </>
                  ) : state === "generating" ? (
                    t("reports.generating")
                  ) : (
                    <>
                      <Download size={13} /> {t("reports.generate")}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
