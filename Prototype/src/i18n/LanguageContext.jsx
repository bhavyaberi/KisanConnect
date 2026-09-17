import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGUAGES, translations } from "./translations";

// BCP-47 locale each language should use for the Web Speech API's
// SpeechRecognition (see hooks/useSpeechRecognition.js). "-IN" everywhere
// since KisanConnect is India-only for this pilot (Section 14 of the guide).
const SPEECH_LOCALES = {
  en: "en-IN",
  hi: "hi-IN",
};

const STORAGE_KEY = "kisanconnect.language";
const SUPPORTED = LANGUAGES.map((l) => l.code);

// Read the last-used language back on boot so a farmer who switches to
// Hindi doesn't land back on English every time they reopen the app.
// Guarded because localStorage throws in private-mode Safari and in SSR.
function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch {
    /* storage unavailable — fall through to the default */
  }
  return "en";
}

const LanguageContext = createContext(null);
export { LanguageContext };

// Wraps the whole app (see main.jsx). Holds the single `language` string
// that every translated string in the UI is derived from — changing it
// here is what makes "switch to Hindi" instantly re-render every
// component that calls `t(...)`, since they all read from this context.
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage);

  // Persist the choice, and keep <html lang> in sync so screen readers and
  // the browser's own text handling know which language the page is in.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage unavailable — the app still works, it just won't remember */
    }
    document.documentElement.lang = language;
  }, [language]);

  // useMemo so consumers get a stable object (and therefore don't
  // needlessly re-render) unless `language` itself actually changes.
  const value = useMemo(() => {
    const dict = translations[language] ?? translations.en;

    // t(key, vars?) -> looks up `key` in the active language, falls back
    // to English, then to the raw key so a typo never crashes the UI.
    // `vars` does simple {placeholder} substitution, e.g.
    // t("topbar.welcome", { name: "Suresh" }) -> "Welcome back, Suresh".
    function t(key, vars) {
      let text = dict[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, v);
        }
      }
      return text;
    }

    return {
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
      speechLang: SPEECH_LOCALES[language] ?? "en-IN",
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// Consumed as `const { t, language, setLanguage, speechLang } = useLanguage();`
// throughout the app instead of importing translations.js directly.
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage() must be used inside <LanguageProvider>");
  return ctx;
}
