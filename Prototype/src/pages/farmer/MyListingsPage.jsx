import { useEffect, useState } from "react";
import { Mic, Camera, Plus, X, CheckCircle2, AlertTriangle } from "lucide-react";
import PageHeader from "../PageHeader";
import { farmerListings } from "../../data/kisanConnectData";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { parseVoiceListing } from "../../lib/parseVoiceListing";

const CROP_IDS = ["Tomato", "Onion", "Potato"];
const STATUS_COLOR = {
  active: "bg-emerald-100 text-emerald-700",
  sold: "bg-stone-100 text-stone-500",
};

export default function MyListingsPage() {
  const { t, speechLang, languages, language, setLanguage } = useLanguage();

  // Seeded from shared mock data, but owned locally so adding/updating a
  // listing here is real client-side state, not just static display.
  const [listings, setListings] = useState(farmerListings);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cropId: "Tomato", qty: "", price: "", photo: "" });
  const [parseStatus, setParseStatus] = useState(null); // "ok" | "fail" | null

  // Real speech-to-text, in whichever language is currently selected
  // app-wide (see i18n/LanguageContext.jsx's speechLang). Switching the
  // language changes what this listens for immediately.
  const { isSupported, isListening, transcript, start, stop, error } = useSpeechRecognition(speechLang);

  // Every time a finished (non-listening) transcript comes in, run it
  // through the rule-based parser and autofill the form from whatever it
  // found (Section 2.2's "speak your listing, form fills itself" flow).
  useEffect(() => {
    if (isListening || !transcript) return;
    const parsed = parseVoiceListing(transcript);
    if (parsed && (parsed.crop || parsed.qty)) {
      setForm((f) => ({
        ...f,
        cropId: parsed.crop ?? f.cropId,
        qty: parsed.qty ?? f.qty,
      }));
      setParseStatus("ok");
    } else {
      setParseStatus("fail");
    }
  }, [isListening, transcript]);

  function handleAddListing(e) {
    e.preventDefault();
    if (!form.qty || !form.price) return;
    const newListing = {
      id: Date.now(),
      cropId: form.cropId,
      qty: `${form.qty} kg`,
      price: `\u20b9${form.price}/kg`,
      statusKey: "active",
    };
    setListings((prev) => [newListing, ...prev]);
    setForm({ cropId: "Tomato", qty: "", price: "", photo: "" });
    setParseStatus(null);
    setShowForm(false);
  }

  function toggleSold(id) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, statusKey: l.statusKey === "active" ? "sold" : "active" } : l))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("listings.title")}
        subtitle={t("listings.subtitle")}
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? t("listings.cancel") : t("listings.addCrop")}
          </button>
        }
      />

      {/* List-a-crop form: voice button first, manual fields as fallback,
          matching Section 10.1's UX principle. */}
      {showForm && (
        <form onSubmit={handleAddListing} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-emerald-50 p-4 text-center sm:p-6">
            {/* Voice language — drives BOTH the speech recognizer's
                language and (via setLanguage) the whole app's UI language. */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
              <span>{t("listings.voiceLanguage")}:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => (isListening ? stop() : start())}
              disabled={!isSupported}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                isListening ? "bg-red-500 animate-pulse" : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              <Mic size={26} />
            </button>

            {!isSupported ? (
              <p className="flex items-center gap-1.5 text-sm text-amber-700">
                <AlertTriangle size={14} /> {t("listings.notSupported")}
              </p>
            ) : isListening ? (
              <p className="text-sm text-emerald-800">
                {transcript ? t("listings.heard", { transcript }) : t("listings.listening")}
              </p>
            ) : parseStatus === "ok" ? (
              <p className="text-sm text-emerald-800">{t("listings.parsedOk")}</p>
            ) : parseStatus === "fail" ? (
              <p className="text-sm text-amber-700">{t("listings.parsedFail")}</p>
            ) : (
              <p className="text-sm text-emerald-800">{t("listings.tapToSpeak")}</p>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">{t("listings.cropLabel")}</label>
              <select
                value={form.cropId}
                onChange={(e) => setForm((f) => ({ ...f, cropId: e.target.value }))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                {CROP_IDS.map((c) => (
                  <option key={c} value={c}>
                    {t(`crop.${c.toLowerCase()}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">{t("listings.qtyLabel")}</label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
                placeholder="e.g. 50"
                required
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-700">{t("listings.priceLabel")}</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder={t("listings.pricePlaceholder")}
                required
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-3.5 text-left text-sm text-stone-500 hover:border-emerald-400 hover:text-emerald-700">
            <Camera size={16} className="flex-shrink-0" />
            <span className="min-w-0 flex-1">{form.photo || t("listings.photoAttach")}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.files?.[0]?.name ?? "" }))}
            />
          </label>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            {t("listings.publish")}
          </button>
        </form>
      )}

      {/* Listings table */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
        <div className="divide-y divide-stone-100">
          {/* Crop details sit on their own line on a phone, with the status
              badge and action beneath — all three side by side only once
              there's width for it. */}
          {listings.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-2.5 py-3 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{t(`crop.${l.cropId.toLowerCase()}`)}</p>
                <p className="text-xs text-stone-500">{l.qty} &middot; {l.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[l.statusKey]}`}>
                  {t(`status.${l.statusKey}`)}
                </span>
                <button
                  onClick={() => toggleSold(l.id)}
                  className="ml-auto flex items-center gap-1 whitespace-nowrap rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 active:bg-stone-100 sm:ml-0 sm:py-1.5"
                >
                  <CheckCircle2 size={13} className="flex-shrink-0" />
                  {l.statusKey === "active" ? t("listings.markSold") : t("listings.markActive")}
                </button>
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <p className="py-6 text-center text-sm text-stone-400">{t("listings.empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
