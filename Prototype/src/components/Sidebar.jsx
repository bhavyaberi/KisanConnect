import {
  Home, ClipboardList, Package, IndianRupee, Search, Heart, Map, Bell,
  FileText, UserCircle, Settings, ArrowRight, Sprout, X,
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

export default function Sidebar({
  activeId,
  onNavigate,
  navItems,
  subtitleKey,
  missionKey,
  isOpen,
  onClose,
}) {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-shrink-0 flex-col bg-[#12291c] text-emerald-50 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800/60">
              <Sprout size={20} className="text-emerald-300" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-white">{t("brand.name")}</p>
              <p className="text-[9px] font-medium tracking-wider text-emerald-400/80">{t(subtitleKey)}</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-800/50 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-emerald-800/70 text-white font-semibold"
                    : "text-emerald-200/80 hover:bg-emerald-800/30 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-emerald-800/40 p-4">
          <p className="text-xs leading-relaxed text-emerald-100">{t(missionKey)}</p>
          <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-300 transition-colors hover:text-white">
            {t("sidebar.learnMore")} <ArrowRight size={13} />
          </button>
        </div>
      </aside>
    </>
  );
}
