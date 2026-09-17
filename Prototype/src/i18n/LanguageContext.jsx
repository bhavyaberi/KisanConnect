import { createContext, useContext, useMemo, useState } from "react";
import { LANGUAGES, translations } from "./translations";

// BCP-47 locale for each of the 3 supported languages
const SPEECH_LOCALES = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
};

// Common entity aliases so any hardcoded name, region, day, or month
// automatically resolves to its localized translation in Kannada, Hindi, and English.
const ENTITY_ALIASES = {
  // Names
  "suresh kumar": "name.sureshKumar",
  "suresh": "name.sureshKumar",
  "सुरेश कुमार": "name.sureshKumar",
  "ಸುರೇಶ್ ಕುಮಾರ್": "name.sureshKumar",
  "meera iyer": "name.meeraIyer",
  "meera": "name.meeraIyer",
  "मीरा अय्यर": "name.meeraIyer",
  "ಮೀರಾ ಅಯ್ಯರ್": "name.meeraIyer",
  "ananya rao": "name.ananyaRao",
  "ananya": "name.ananyaRao",
  "अनन्या राव": "name.ananyaRao",
  "ಅನನ್ಯಾ ರಾವ್": "name.ananyaRao",
  "ramesh gowda": "name.rameshGowda",
  "रमेश गौड़ा": "name.rameshGowda",
  "ರಮೇಶ್ ಗೌಡ": "name.rameshGowda",
  "lakshmi devi": "name.lakshmiDevi",
  "लक्ष्मी देवी": "name.lakshmiDevi",
  "ಲಕ್ಷ್ಮಿ ದೇವಿ": "name.lakshmiDevi",
  "meera's kitchen": "name.meerasKitchen",
  "meeras kitchen": "name.meerasKitchen",
  "मीराज़ किचन": "name.meerasKitchen",
  "ಮೀರಾಸ್ ಕಿಚನ್": "name.meerasKitchen",
  "fresh mart bangalore": "name.freshMartBangalore",
  "फ्रेश मार्ट बैंगलोर": "name.freshMartBangalore",
  "ಫ್ರೆಶ್ ಮಾರ್ಟ್ ಬೆಂಗಳೂರು": "name.freshMartBangalore",
  "green basket retail": "name.greenBasketRetail",
  "ग्रीन बास्केट रिटेल": "name.greenBasketRetail",
  "ಗ್ರೀನ್ ಬಾಸ್ಕೆಟ್ ರಿಟೇಲ್": "name.greenBasketRetail",

  // Regions & Cities
  "kolar": "region.kolar",
  "कोलार": "region.kolar",
  "ಕೋಲಾರ": "region.kolar",
  "chikkaballapur": "region.chikkaballapur",
  "चिक्काबल्लापुर": "region.chikkaballapur",
  "ಚಿಕ್ಕಬಳ್ಳಾಪುರ": "region.chikkaballapur",
  "bangalore urban": "region.bangaloreUrban",
  "बैंगलोर शहरी": "region.bangaloreUrban",
  "ಬೆಂಗಳೂರು ನಗರ": "region.bangaloreUrban",
  "bangalore": "region.bangalore",
  "बैंगलोर": "region.bangalore",
  "ಬೆಂಗಳೂರು": "region.bangalore",
  "tumkur": "region.tumkur",
  "तुमकुर": "region.tumkur",
  "ತುಮಕೂರು": "region.tumkur",
  "mysuru": "region.mysuru",
  "मैसूरु": "region.mysuru",
  "ಮೈಸೂರು": "region.mysuru",
  "mandya": "region.mandya",
  "मांड्या": "region.mandya",
  "ಮಂಡ್ಯ": "region.mandya",
  "karnataka": "region.karnataka",
  "कर्नाटक": "region.karnataka",
  "ಕರ್ನಾಟಕ": "region.karnataka",

  // Days
  "day 1": "day.day1",
  "day 2": "day.day2",
  "day 3": "day.day3",
  "day 4": "day.day4",
  "day 5": "day.day5",
  "day 6": "day.day6",
  "day 7": "day.day7",
  "mon": "day.mon",
  "tue": "day.tue",
  "wed": "day.wed",
  "thu": "day.thu",
  "fri": "day.fri",
  "sat": "day.sat",

  // Months
  "apr": "month.apr",
  "may": "month.may",
  "jun": "month.jun",
  "jul": "month.jul",
  "aug": "month.aug",
  "sep": "month.sep",
};

const LanguageContext = createContext(null);
export { LanguageContext };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const value = useMemo(() => {
    const dict = translations[language] ?? translations.en;

    function t(key, vars) {
      if (typeof key !== "string") return key;
      let lookupKey = key;
      if (!dict[lookupKey] && !translations.en[lookupKey]) {
        const alias = ENTITY_ALIASES[key.toLowerCase().trim()];
        if (alias) lookupKey = alias;
      }
      let text = dict[lookupKey] ?? translations.en[lookupKey] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          let resolvedVal = v;
          if (typeof v === "string") {
            const alias = ENTITY_ALIASES[v.toLowerCase().trim()];
            if (alias && (dict[alias] || translations.en[alias])) {
              resolvedVal = dict[alias] ?? translations.en[alias];
            }
          }
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), resolvedVal);
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

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage() must be used inside <LanguageProvider>");
  return ctx;
}
