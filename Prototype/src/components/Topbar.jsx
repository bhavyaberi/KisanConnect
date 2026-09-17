import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserCircle, Menu } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Topbar({ user, onLogout, subtitleKey, onMenuToggle }) {
  const { t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const translatedName = user?.name ? t(user.name) : t("name.sureshKumar");
  const translatedRole = user?.role ? t(user.role) : "";

  return (
    <header className="flex items-center justify-between gap-3 border-b border-stone-200 bg-[#fbfaf6] px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile phones */}
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base font-bold text-stone-900 sm:text-xl">
            {t("topbar.welcome", { name: translatedName })}
          </h1>
          <p className="hidden text-xs text-stone-500 sm:block sm:text-sm">{t(subtitleKey)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-stone-100 sm:pl-1 sm:pr-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 sm:h-9 sm:w-9">
              <UserCircle size={20} />
            </span>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold text-stone-800">{translatedName}</p>
              <p className="text-xs text-stone-500">{translatedRole}</p>
            </div>
            <ChevronDown size={14} className={`text-stone-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
              <div className="border-b border-stone-100 px-3 py-2 sm:hidden">
                <p className="text-sm font-semibold text-stone-800">{translatedName}</p>
                <p className="text-xs text-stone-500">{translatedRole}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={15} /> {t("topbar.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
