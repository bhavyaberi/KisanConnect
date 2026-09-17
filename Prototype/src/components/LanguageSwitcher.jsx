import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

// A small pill button + dropdown, same interaction pattern as Topbar's own
// profile menu. Picking a language calls `setLanguage`, which is owned by
// LanguageProvider (see i18n/LanguageContext.jsx) — every component that
// reads `t()` re-renders in the new language immediately, app-wide.
export default function LanguageSwitcher() {
  const { language, setLanguage, languages, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    // Without touchstart the menu stays stuck open on phones, since a tap
    // outside never produces a mousedown until the tap has resolved.
    document.addEventListener("touchstart", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("touchstart", onClickOutside);
    };
  }, []);

  const current = languages.find((l) => l.code === language);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={t("topbar.language")}
        aria-label={t("topbar.language")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition-colors duration-150 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <Languages size={15} className="flex-shrink-0" />
        {/* With only two languages the native label is short enough to keep
            even on a phone, so it stays visible at every width. */}
        <span className="max-w-[5rem] truncate">{current?.nativeLabel ?? "English"}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-44 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              role="menuitemradio"
              aria-checked={l.code === language}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-stone-700 transition-colors duration-150 hover:bg-emerald-50"
            >
              <span>{l.nativeLabel}</span>
              {l.code === language && <Check size={15} className="flex-shrink-0 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
