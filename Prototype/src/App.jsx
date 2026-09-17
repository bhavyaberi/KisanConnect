import { useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FarmerDashboard from "./dashboards/FarmerDashboard";
import BuyerDashboard from "./dashboards/BuyerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import MyListingsPage from "./pages/farmer/MyListingsPage";
import FarmerOrdersPage from "./pages/farmer/FarmerOrdersPage";
import EarningsPage from "./pages/farmer/EarningsPage";
import FarmerProfilePage from "./pages/farmer/ProfilePage";
import MarketplacePage from "./pages/buyer/MarketplacePage";
import BuyerOrdersPage from "./pages/buyer/BuyerOrdersPage";
import SavedSellersPage from "./pages/buyer/SavedSellersPage";
import BuyerProfilePage from "./pages/buyer/ProfilePage";
import RegionsHeatMapPage from "./pages/admin/RegionsHeatMapPage";
import AlertsPage from "./pages/admin/AlertsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import {
  farmerNavItems, buyerNavItems, adminNavItems, buyerOrderSeed,
} from "./data/kisanConnectData";
import {
  Home as HomeIcon, ClipboardList, Package, IndianRupee, Search,
  Heart, Map, Bell, FileText, UserCircle, Settings,
} from "lucide-react";
import { useLanguage } from "./i18n/LanguageContext";

const BOTTOM_ICONS = {
  home: HomeIcon,
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

const ROLE_CONFIG = {
  farmer: {
    navItems: farmerNavItems,
    subtitleKey: "sidebar.subtitle.farmer",
    missionKey: "sidebar.mission.farmer",
    topbarSubtitleKey: "topbar.subtitle.farmer",
    pages: {
      dashboard: FarmerDashboard,
      listings: MyListingsPage,
      orders: FarmerOrdersPage,
      earnings: EarningsPage,
      profile: FarmerProfilePage,
    },
  },
  buyer: {
    navItems: buyerNavItems,
    subtitleKey: "sidebar.subtitle.buyer",
    missionKey: "sidebar.mission.buyer",
    topbarSubtitleKey: "topbar.subtitle.buyer",
    pages: {
      dashboard: BuyerDashboard,
      marketplace: MarketplacePage,
      orders: BuyerOrdersPage,
      savedSellers: SavedSellersPage,
      profile: BuyerProfilePage,
    },
  },
  admin: {
    navItems: adminNavItems,
    subtitleKey: "sidebar.subtitle.admin",
    missionKey: "sidebar.mission.admin",
    topbarSubtitleKey: "topbar.subtitle.admin",
    pages: {
      dashboard: AdminDashboard,
      regions: RegionsHeatMapPage,
      alerts: AlertsPage,
      reports: ReportsPage,
      settings: SettingsPage,
    },
  },
};

export default function App() {
  const { t } = useLanguage();
  const [view, setView] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [buyerOrders, setBuyerOrders] = useState(buyerOrderSeed);

  function handlePlaceOrder(order) {
    setBuyerOrders((prev) => [order, ...prev]);
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setActiveNav("dashboard");
  }

  function handleLogout() {
    setCurrentUser(null);
    setView("home");
    setMobileMenuOpen(false);
  }

  if (!currentUser && view === "home") {
    return <Home onGetStarted={() => setView("login")} />;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const config = ROLE_CONFIG[currentUser.roleKey];
  const PageComponent = config.pages[activeNav] ?? config.pages.dashboard;

  const pageProps =
    currentUser.roleKey === "buyer"
      ? activeNav === "marketplace"
        ? { onPlaceOrder: handlePlaceOrder }
        : activeNav === "orders"
        ? { orders: buyerOrders }
        : {}
      : {};

  return (
    <div className="flex min-h-screen bg-[#fbfaf6]">
      {/* Sidebar: Desktop fixed sidebar + Mobile slide-out drawer */}
      <Sidebar
        activeId={activeNav}
        onNavigate={setActiveNav}
        navItems={config.navItems}
        subtitleKey={config.subtitleKey}
        missionKey={config.missionKey}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <Topbar
          user={currentUser}
          onLogout={handleLogout}
          subtitleKey={config.topbarSubtitleKey}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />

        <main className="flex flex-1 flex-col gap-4 p-3.5 pb-24 sm:p-6 lg:pb-6">
          <PageComponent {...pageProps} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for rapid 1-tap phone access */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-stone-200 bg-white/95 backdrop-blur-md px-1 py-1.5 shadow-lg lg:hidden">
        {config.navItems.map((item) => {
          const Icon = BOTTOM_ICONS[item.icon] ?? HomeIcon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-emerald-700 font-semibold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span className={`p-1 rounded-lg ${isActive ? "bg-emerald-50 text-emerald-700" : ""}`}>
                <Icon size={18} />
              </span>
              <span className="truncate max-w-[64px]">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
