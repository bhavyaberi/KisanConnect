import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { supportedLanguages } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

// Preferred language matters directly to the guide's accessibility pitch
// (Section 2.2 / 3.7): voice input and UI both localize to whatever the
// farmer picks here. When the chosen language has a matching app
// language (see i18n/translations.js), picking it here switches the
// whole app's language too — not just this form field.
export default function ProfilePage() {
  const { t, language, setLanguage } = useLanguage();
  const [form, setForm] = useState({
    name: "Suresh Kumar",
    phone: "+91 98765 43210",
    village: "Kolar",
    district: "Kolar",
    state: "Karnataka",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // The select reads straight from the app's live language rather than
  // keeping a second copy in `form` — that's what kept this field showing
  // one language while the UI was rendered in another.
  function handleLanguageChange(id) {
    setLanguage(id);
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("profile.titleFarmer")} subtitle={t("profile.subtitleFarmer")} />

      <form onSubmit={handleSave} className="max-w-lg rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("profile.fullName")} value={form.name} onChange={(v) => handleChange("name", v)} />
          <Field label={t("profile.phoneNumber")} value={form.phone} onChange={(v) => handleChange("phone", v)} />
          <Field label={t("profile.village")} value={form.village} onChange={(v) => handleChange("village", v)} />
          <Field label={t("profile.district")} value={form.district} onChange={(v) => handleChange("district", v)} />
          <Field label={t("profile.state")} value={form.state} onChange={(v) => handleChange("state", v)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">{t("profile.preferredLanguage")}</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {supportedLanguages.map((l) => (
                <option key={l.id} value={l.id}>
                  {t(l.key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          {saved ? <CheckCircle2 size={16} /> : null}
          {saved ? t("profile.saved") : t("profile.save")}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}
