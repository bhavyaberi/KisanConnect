import {
  Home, ClipboardList, Package, IndianRupee, Search, Heart, Map, Bell,
  FileText, UserCircle, Settings, ArrowRight, Sprout,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const ICONS = {
  home: Home,
  clipboard: ClipboardList,
  package: Package,
  indianRupee: IndianRupee,
  search: Search,
  heart: Heart,
  map: Map,
  bell: Bell,
  fileText: FileText,
  userCircle: UserCircle,
  settings: Settings,
};

// Fully generic: which items to show, what the mission box says, and what
// subtitle sits under the brand name all come from props (as translation
// keys, not literal strings) so the exact same Sidebar renders correctly
// for Farmer, Buyer, and Admin views, in whichever language is active.
//
// Desktop only — `hidden md:flex`. On phones this is replaced entirely by
// BottomNav, which takes the same navItems and renders them as tabs.
export default function Sidebar({ activeId, onNavigate, navItems, subtitleKey, missionKey }) {
  const { t } = useLanguage();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col bg-[#12291c] text-emerald-50 md:flex">
      <div className="flex items-center gap-3 px-5 pb-6 pt-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800/60">
          <Sprout size={20} className="text-emerald-300" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-white">{t("brand.name")}</p>
          <p className="text-[9px] font-medium tracking-wider text-emerald-400/80">{t(subtitleKey)}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-emerald-800/70 text-white"
                  : "text-emerald-200/80 hover:bg-emerald-800/30 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl bg-emerald-800/40 p-4">
        <p className="text-sm leading-snug text-emerald-100">{t(missionKey)}</p>
        <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-emerald-300 transition-colors hover:text-white">
          {t("sidebar.learnMore")} <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}
