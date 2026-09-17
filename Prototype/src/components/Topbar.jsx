import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Sprout, UserCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Topbar({ user, onLogout, subtitleKey }) {
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
    // Touch devices never fire mousedown before the tap completes, so the
    // menu would stay open when tapping elsewhere without this second
    // listener.
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    // Sticky so the language switcher and log-out stay reachable while
    // scrolling a long dashboard on a phone.
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbfaf6]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        {/* Brand mark, phone only — with the sidebar hidden below `md`
            there's otherwise nothing on screen identifying the app. */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#12291c] text-emerald-300 md:hidden">
            <Sprout size={18} />
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-stone-900 md:text-xl">
              {t("topbar.welcome", { name: firstName })}
            </h1>
            {/* The subtitle is a nice-to-have line of context; on a phone
                it costs a whole row of vertical space, so it's desktop-only. */}
            <p className="mt-0.5 hidden text-sm text-stone-500 md:block">{t(subtitleKey)}</p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <LanguageSwitcher />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-stone-100 md:pl-1 md:pr-2"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserCircle size={20} />
              </span>
              {/* Name and role are the first things to go on a narrow
                  screen — the avatar alone is enough to find the menu. */}
              <div className="hidden text-left leading-tight lg:block">
                <p className="text-sm font-semibold text-stone-800">{user?.name}</p>
                <p className="text-xs text-stone-500">{user?.role}</p>
              </div>
              <ChevronDown
                size={16}
                className={`hidden text-stone-400 transition-transform lg:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
                {/* Shown inside the menu on phones, since the trigger
                    itself can't display them at that width. */}
                <div className="border-b border-stone-100 px-3 pb-2 pt-1 lg:hidden">
                  <p className="truncate text-sm font-semibold text-stone-800">{user?.name}</p>
                  <p className="truncate text-xs text-stone-500">{user?.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} /> {t("topbar.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
