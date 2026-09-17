// All mock data for the prototype lives here. Grounded in the guide's own
// running example: Kolar district tomatoes, the TOP crops (tomato, onion,
// potato), and the farmer/buyer/DoCA officer named in Section 2.3's
// walkthrough — so the demo tells the same story the pitch does.
//
// Fields ending in "Key" (statusKey, severityKey, cropId, labelKey, ...)
// are translation-dictionary keys, not display text — components look
// them up via useLanguage()'s t() at render time so every page reacts to
// the selected language. Plain fields (names, regions, numbers, prices)
// are actual data values and are shown as-is in every language.

export const navIcons = {
  dashboard: "home",
  listings: "clipboard",
  orders: "package",
  earnings: "indianRupee",
  marketplace: "search",
  savedSellers: "heart",
  regions: "map",
  alerts: "bell",
  reports: "fileText",
  profile: "userCircle",
  settings: "settings",
};

// ---------- Shared nav ----------
export const farmerNavItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: "home" },
  { id: "listings", labelKey: "nav.listings", icon: "clipboard" },
  { id: "orders", labelKey: "nav.farmerOrders", icon: "package" },
  { id: "earnings", labelKey: "nav.earnings", icon: "indianRupee" },
  { id: "profile", labelKey: "nav.profile", icon: "userCircle" },
];

export const buyerNavItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: "home" },
  { id: "marketplace", labelKey: "nav.marketplace", icon: "search" },
  { id: "orders", labelKey: "nav.buyerOrders", icon: "package" },
  { id: "savedSellers", labelKey: "nav.savedSellers", icon: "heart" },
  { id: "profile", labelKey: "nav.profile", icon: "userCircle" },
];

export const adminNavItems = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: "home" },
  { id: "regions", labelKey: "nav.regions", icon: "map" },
  { id: "alerts", labelKey: "nav.alerts", icon: "bell" },
  { id: "reports", labelKey: "nav.reports", icon: "fileText" },
  { id: "settings", labelKey: "nav.settings", icon: "settings" },
];

// ============================= FARMER =============================
export const farmerListings = [
  { id: 1, cropId: "Tomato", qty: "80 kg", price: "\u20b913/kg", statusKey: "active" },
  { id: 2, cropId: "Onion", qty: "120 kg", price: "\u20b99/kg", statusKey: "sold" },
  { id: 3, cropId: "Potato", qty: "60 kg", price: "\u20b911/kg", statusKey: "active" },
];

export const farmerOrders = [
  { id: 1, buyer: "Meera's Kitchen", buyerKey: "name.meerasKitchen", cropId: "Tomato", qtyLabel: "30 kg", statusKey: "inTransit" },
  { id: 2, buyer: "Fresh Mart Bangalore", buyerKey: "name.freshMartBangalore", cropId: "Onion", qtyLabel: "50 kg", statusKey: "delivered" },
  { id: 3, buyer: "Green Basket Retail", buyerKey: "name.greenBasketRetail", cropId: "Potato", qtyLabel: "25 kg", statusKey: "pendingPickup" },
];

// Market Insights card: current vs. AI-predicted price for the farmer's
// primary crop right now (Section 7.1 Price Prediction).
export const farmerMarketInsight = {
  cropId: "Tomato",
  currentPrice: "\u20b913/kg",
  predictedRange: "\u20b912\u201314/kg",
  trend: "up",
  trendNoteKey: "farmerDash.trendNote",
};

// 7-Day Price Forecast chart (tomato, Kolar region).
export const farmerPriceForecast = [
  { day: "Day 1", price: 12 },
  { day: "Day 2", price: 12.5 },
  { day: "Day 3", price: 12.5 },
  { day: "Day 4", price: 13 },
  { day: "Day 5", price: 13.5 },
  { day: "Day 6", price: 14 },
  { day: "Day 7", price: 14 },
];

// Surplus Alert banner shown on the farmer's own dashboard when their
// region/crop is flagged (Section 4.3 AI surplus-alert flow).
export const farmerSurplusAlert = {
  active: true,
  severityKey: "high",
  severityColor: "bg-red-50 border-red-200 text-red-700",
  messageKey: "farmerDash.surplusMessage",
};

// ============================= BUYER =============================
export const buyerListings = [
  { id: 1, cropId: "Tomato", farmer: "Suresh Kumar", farmerKey: "name.sureshKumar", distance: "4.2 km", price: "\u20b913/kg" },
  { id: 2, cropId: "Onion", farmer: "Ramesh Gowda", farmerKey: "name.rameshGowda", distance: "6.0 km", price: "\u20b99/kg" },
  { id: 3, cropId: "Potato", farmer: "Lakshmi Devi", farmerKey: "name.lakshmiDevi", distance: "3.1 km", price: "\u20b911/kg" },
];

// Market Supply Forecast — supply-side forecast (Section 7.2, read from
// the supply side) over the next week, kg/day.
export const buyerSupplyForecast = [
  { day: "Day 1", supply: 1150 },
  { day: "Day 2", supply: 1220 },
  { day: "Day 3", supply: 1180 },
  { day: "Day 4", supply: 1340 },
  { day: "Day 5", supply: 1460 },
  { day: "Day 6", supply: 1510 },
  { day: "Day 7", supply: 1590 },
];

// Expected Supply by Crop — `cropId` is translated at render time into
// the `crop` field recharts actually reads for its X-axis labels.
export const expectedSupplyByCrop = [
  { cropId: "Tomato", supply: 5200 },
  { cropId: "Onion", supply: 3400 },
  { cropId: "Potato", supply: 2800 },
];

// Price Trends — historical (not forecast) price over the last 6 days,
// \u20b9/kg. Series keys (tomato/onion/potato) are internal recharts dataKeys,
// not display text — the legend labels them via crop.* translations.
export const buyerPriceHistory = [
  { day: "Mon", tomato: 11, onion: 8, potato: 10 },
  { day: "Tue", tomato: 11.5, onion: 8.2, potato: 10 },
  { day: "Wed", tomato: 12, onion: 8.5, potato: 10.5 },
  { day: "Thu", tomato: 12.5, onion: 9, potato: 11 },
  { day: "Fri", tomato: 13, onion: 9, potato: 11 },
  { day: "Sat", tomato: 13, onion: 9.5, potato: 11.5 },
];

// Seed order history for the Buyer's Orders page (Section 4.2). New
// orders placed from the Marketplace get prepended at runtime (App.jsx
// owns this as shared state).
export const buyerOrderSeed = [
  { id: 1, cropId: "Tomato", farmer: "Suresh Kumar", farmerKey: "name.sureshKumar", qty: "30 kg", total: "\u20b9390", statusKey: "inTransit" },
  { id: 2, cropId: "Onion", farmer: "Ramesh Gowda", farmerKey: "name.rameshGowda", qty: "20 kg", total: "\u20b9180", statusKey: "delivered" },
];

// ============================= ADMIN / DoCA =============================
export const adminStatCards = [
  { id: "listings", labelKey: "adminStat.listings.label", value: "1,284", deltaKey: "adminStat.listings.delta" },
  { id: "volume", labelKey: "adminStat.volume.label", value: "\u20b94.6L", deltaKey: "adminStat.volume.delta" },
  { id: "alerts", labelKey: "adminStat.alerts.label", value: "3", deltaKey: "adminStat.alerts.delta" },
  { id: "farmers", labelKey: "adminStat.farmers.label", value: "6,240", deltaKey: "adminStat.farmers.delta" },
];

// Region status for the map-style overview card. `statusKey` drives both
// pin color and the translated status label ("surplus"/"shortage"/"balanced").
export const regionOverview = [
  { region: "Kolar", regionKey: "region.kolar", statusKey: "surplus", cropId: "Tomato", top: "38%", left: "62%" },
  { region: "Chikkaballapur", regionKey: "region.chikkaballapur", statusKey: "shortage", cropId: "Tomato", top: "22%", left: "50%" },
  { region: "Bangalore Urban", regionKey: "region.bangaloreUrban", statusKey: "balanced", cropId: null, top: "55%", left: "58%" },
  { region: "Tumkur", regionKey: "region.tumkur", statusKey: "balanced", cropId: "Onion", top: "30%", left: "30%" },
  { region: "Mysuru", regionKey: "region.mysuru", statusKey: "shortage", cropId: "Potato", top: "72%", left: "28%" },
  { region: "Mandya", regionKey: "region.mandya", statusKey: "balanced", cropId: "Onion", top: "68%", left: "44%" },
];

export const regionStatusLegend = [
  { statusKey: "surplus", count: 1, color: "#dc2626" },
  { statusKey: "shortage", count: 2, color: "#eab308" },
  { statusKey: "balanced", count: 3, color: "#166534" },
];

// Price trend: platform avg vs. traditional mandi avg for tomato, \u20b9/kg.
export const priceTrend = [
  { day: "Mon", platform: 11, mandi: 8 },
  { day: "Tue", platform: 11.5, mandi: 8 },
  { day: "Wed", platform: 12, mandi: 8.5 },
  { day: "Thu", platform: 12.5, mandi: 9 },
  { day: "Fri", platform: 13, mandi: 9 },
  { day: "Sat", platform: 13, mandi: 9.5 },
];

// Crop-wise Price Forecast — 7-day predicted price per crop, platform-wide
// (Section 7.1). Series keys are internal recharts dataKeys; the legend
// translates them via crop.*.
export const cropPriceForecast = [
  { day: "Day 1", tomato: 12, onion: 8.5, potato: 10.5 },
  { day: "Day 2", tomato: 12.5, onion: 8.5, potato: 10.5 },
  { day: "Day 3", tomato: 12.5, onion: 9, potato: 11 },
  { day: "Day 4", tomato: 13, onion: 9, potato: 11 },
  { day: "Day 5", tomato: 13.5, onion: 9.5, potato: 11.5 },
  { day: "Day 6", tomato: 14, onion: 9.5, potato: 12 },
  { day: "Day 7", tomato: 14, onion: 10, potato: 12 },
];

export const surplusAlerts = [
  { id: 1, cropId: "Tomato", region: "Kolar", regionKey: "region.kolar", typeKey: "surplus", severityKey: "high" },
  { id: 2, cropId: "Potato", region: "Mysuru", regionKey: "region.mysuru", typeKey: "shortage", severityKey: "medium" },
  { id: 3, cropId: "Tomato", region: "Chikkaballapur", regionKey: "region.chikkaballapur", typeKey: "shortage", severityKey: "medium" },
  { id: 4, cropId: "Onion", region: "Tumkur", regionKey: "region.tumkur", typeKey: "surplus", severityKey: "low" },
];

// Configurable alert thresholds (Section 3.3). Surplus/shortage triggers
// when supply diverges from demand by more than this percentage.
export const alertThresholdDefaults = {
  surplusPct: 20,
  shortagePct: 15,
  channels: { sms: true, push: true, dashboard: true },
};

// Regional languages KisanConnect supports (Section 2.2 / 3.7). `id`
// matches this app's own language codes (i18n/translations.js) where one
// exists, so selecting a language here can flip the whole app's language
// too — see farmer/ProfilePage.jsx.
export const supportedLanguages = [
  { id: "kn", key: "lang.kannada" },
  { id: "hi", key: "lang.hindi" },
  { id: "en", key: "lang.english" },
];

export const buyerTypes = [
  { id: "individual", key: "buyerType.individual" },
  { id: "retailer", key: "buyerType.retailer" },
  { id: "restaurant", key: "buyerType.restaurant" },
  { id: "bulk", key: "buyerType.bulk" },
];

// Demand vs. supply by crop (platform-wide, kg) for the bar chart.
export const demandSupplyByCrop = [
  { cropId: "Tomato", supply: 5200, demand: 4300 },
  { cropId: "Onion", supply: 3400, demand: 3600 },
  { cropId: "Potato", supply: 2800, demand: 3100 },
];

// Saved Sellers — farmers a buyer follows for quick reorder (Section 10.2).
export const savedSellersSeed = [
  { id: 1, name: "Suresh Kumar", nameKey: "name.sureshKumar", cropId: "Tomato", region: "Kolar", regionKey: "region.kolar", rating: "4.8" },
  { id: 2, name: "Ramesh Gowda", nameKey: "name.rameshGowda", cropId: "Onion", region: "Tumkur", regionKey: "region.tumkur", rating: "4.6" },
  { id: 3, name: "Lakshmi Devi", nameKey: "name.lakshmiDevi", cropId: "Potato", region: "Mysuru", regionKey: "region.mysuru", rating: "4.9" },
];

// Static earnings history for the farmer Earnings page.
export const farmerEarningsHistory = [
  { month: "Apr", amount: 11200 },
  { month: "May", amount: 13800 },
  { month: "Jun", amount: 12500 },
  { month: "Jul", amount: 15600 },
  { month: "Aug", amount: 17200 },
  { month: "Sep", amount: 18400 },
];

// Downloadable reports for the Admin Reports page.
export const adminReports = [
  { id: 1, nameKey: "reports.weeklyPrice.name", descKey: "reports.weeklyPrice.desc" },
  { id: 2, nameKey: "reports.regionalSupplyDemand.name", descKey: "reports.regionalSupplyDemand.desc" },
  { id: 3, nameKey: "reports.alertLog.name", descKey: "reports.alertLog.desc" },
  { id: 4, nameKey: "reports.earningsImpact.name", descKey: "reports.earningsImpact.desc" },
];
