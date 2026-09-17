import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";
import { buyerTypes } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "Meera Iyer",
    phone: "+91 90000 11223",
    buyerTypeId: "restaurant",
    city: "Bangalore",
  });
  const [saved, setSaved] = useState(false);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("profile.titleBuyer")} subtitle={t("profile.subtitleBuyer")} />

      <form onSubmit={handleSave} className="max-w-lg rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("profile.fullName")} value={form.name} onChange={(v) => handleChange("name", v)} />
          <Field label={t("profile.phoneNumber")} value={form.phone} onChange={(v) => handleChange("phone", v)} />
          <Field label={t("profile.city")} value={form.city} onChange={(v) => handleChange("city", v)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">{t("profile.buyerType")}</label>
            <select
              value={form.buyerTypeId}
              onChange={(e) => handleChange("buyerTypeId", e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {buyerTypes.map((bt) => (
                <option key={bt.id} value={bt.id}>
                  {t(bt.key)}
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
