import {
  Home, ClipboardList, Package, IndianRupee, Search, Heart, Map, Bell,
  FileText, UserCircle, Settings,
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

// The phone counterpart to Sidebar. A 256px-wide rail is unusable on a
// handset, so below `md` the sidebar is hidden and this fixed tab bar
// takes over. It takes the exact same `navItems` prop, so all three roles
// (5 items each) get correct navigation with no per-role special-casing.
//
// Sits inside the thumb's natural reach at the bottom of the screen, pads
// itself past the iPhone home indicator via safe-area-inset, and gives
// every tab a 44px+ tap target.
export default function BottomNav({ activeId, onNavigate, navItems }) {
  const { t } = useLanguage();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label={t("nav.menu")}
    >
      <ul className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full w-full flex-col items-center justify-center gap-1 px-1 py-2.5 transition-colors ${
                  isActive ? "text-emerald-800" : "text-stone-400 active:text-stone-600"
                }`}
              >
                {/* The pill behind the icon is what actually reads as
                    "selected" at a glance — the label is too small to
                    carry that on its own at phone sizes. */}
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-emerald-100" : "bg-transparent"
                  }`}
                >
                  <Icon size={19} />
                </span>
                <span
                  className={`max-w-full truncate text-[10px] leading-none ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                >
                  {t(item.labelKey)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
