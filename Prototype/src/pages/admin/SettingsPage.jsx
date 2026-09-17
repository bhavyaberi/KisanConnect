import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { alertThresholdDefaults } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [thresholds, setThresholds] = useState(alertThresholdDefaults);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleChannel(key) {
    setThresholds((t2) => ({ ...t2, channels: { ...t2.channels, [key]: !t2.channels[key] } }));
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <form onSubmit={handleSave} className="max-w-lg rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="font-semibold text-stone-900">{t("settings.alertThresholds")}</h3>
        <p className="mt-1 text-xs text-stone-400">{t("settings.thresholdHint")}</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-stone-700">
              {t("settings.surplusThreshold")} <span className="text-emerald-700">{thresholds.surplusPct}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={thresholds.surplusPct}
              onChange={(e) => setThresholds((t2) => ({ ...t2, surplusPct: Number(e.target.value) }))}
              className="w-full accent-emerald-700"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-stone-700">
              {t("settings.shortageThreshold")} <span className="text-emerald-700">{thresholds.shortagePct}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={thresholds.shortagePct}
              onChange={(e) => setThresholds((t2) => ({ ...t2, shortagePct: Number(e.target.value) }))}
              className="w-full accent-emerald-700"
            />
          </div>
        </div>

        <h3 className="mt-6 font-semibold text-stone-900">{t("settings.alertChannels")}</h3>
        <p className="mt-1 text-xs text-stone-400">{t("settings.channelHint")}</p>
        <div className="mt-3 space-y-2">
          {Object.entries(thresholds.channels).map(([key, enabled]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleChannel(key)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500"
              />
              {t(`channel.${key}`)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          {saved ? <CheckCircle2 size={16} /> : null}
          {saved ? t("settings.saved") : t("settings.save")}
        </button>
      </form>
    </div>
  );
}
