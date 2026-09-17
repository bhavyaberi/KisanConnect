import { useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
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
import { farmerNavItems, buyerNavItems, adminNavItems, buyerOrderSeed } from "./data/kisanConnectData";

// Per-role config: nav list, sidebar copy, topbar subtitle, and a map of
// nav id -> page component. "dashboard" always maps to that role's
// Dashboard; every other id maps to the real page that replaces what used
// to be a PagePlaceholder.
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
  const [view, setView] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Buyer's order list lives here (not inside MarketplacePage/BuyerOrdersPage)
  // specifically so a purchase made on one page is immediately visible on
  // the other — this is the one piece of state genuinely shared across
  // pages within a role.
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
  }

  if (!currentUser && view === "home") {
    return <Home onGetStarted={() => setView("login")} />;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const config = ROLE_CONFIG[currentUser.roleKey];
  const PageComponent = config.pages[activeNav] ?? config.pages.dashboard;

  // Only the buyer's Marketplace/Orders pages need the shared order state;
  // every other page ignores extra props it doesn't declare.
  const pageProps =
    currentUser.roleKey === "buyer"
      ? activeNav === "marketplace"
        ? { onPlaceOrder: handlePlaceOrder }
        : activeNav === "orders"
        ? { orders: buyerOrders }
        : {}
      : {};

  return (
    <div className="flex min-h-dvh bg-[#fbfaf6]">
      {/* Desktop navigation — hidden below `md`. */}
      <Sidebar
        activeId={activeNav}
        onNavigate={setActiveNav}
        navItems={config.navItems}
        subtitleKey={config.subtitleKey}
        missionKey={config.missionKey}
      />

      {/* min-w-0 is load-bearing: without it this flex child refuses to
          shrink below its content's intrinsic width, and wide children
          (charts, tables) push the whole page sideways on a phone. */}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Topbar user={currentUser} onLogout={handleLogout} subtitleKey={config.topbarSubtitleKey} />

        {/* pb-bottomnav keeps the last row of every page clear of the
            fixed mobile tab bar; desktop drops it since there is none. */}
        <main className="flex flex-1 flex-col gap-4 p-4 pb-bottomnav md:p-6 md:pb-6">
          <PageComponent {...pageProps} />
        </main>
      </div>

      {/* Mobile navigation — hidden at `md` and up. */}
      <BottomNav activeId={activeNav} onNavigate={setActiveNav} navItems={config.navItems} />
    </div>
  );
}
