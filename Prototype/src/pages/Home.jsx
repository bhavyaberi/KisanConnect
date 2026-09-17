import { Sprout, Users, ShieldCheck, ArrowRight } from "lucide-react";
import HeroIllustration from "../components/HeroIllustration";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Home({ onGetStarted }) {
  const { t } = useLanguage();

  const navLinks = [
    t("home.navHome"),
    t("home.navHowItWorks"),
    t("home.navForFarmers"),
    t("home.navForBuyers"),
    t("home.navForGovernment"),
  ];

  const whyStrip = [
    { title: t("home.forFarmersTitle"), text: t("home.forFarmersText") },
    { title: t("home.forBuyersTitle"), text: t("home.forBuyersText") },
    { title: t("home.forGovernmentTitle"), text: t("home.forGovernmentText") },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d1f14] p-3 sm:p-6 overflow-x-hidden">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-2xl">
        <div className="relative flex min-h-[640px] sm:min-h-[820px] flex-col justify-between px-4 pb-8 pt-4 sm:px-10 sm:pb-12 sm:pt-6">
          {/* Illustrated background layer */}
          <HeroIllustration />
          {/* Dark gradient overlay for text legibility over the illustration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-[#12200c]/75 to-[#0d1f14]/30" />

          {/* Navbar */}
          <nav className="relative z-10 flex items-center justify-between gap-2 sm:gap-6 rounded-full bg-[#f6f4e8] px-3 py-2 sm:px-6 sm:py-3 shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-[#3f5720] text-[#e7e2c8]">
                <Sprout size={18} />
              </div>
              <p className="text-base sm:text-lg font-bold leading-none text-[#1f2a12]">{t("brand.name")}</p>

              <span className="hidden pl-3 text-sm text-[#5b5f4a] md:block">
                {t("home.subtitle")}
              </span>
            </div>

            <ul className="hidden items-center gap-8 text-sm font-medium lg:flex">
              {navLinks.map((link, i) => (
                <li
                  key={link}
                  className={i === 0 ? "font-semibold text-[#1f2a12]" : "cursor-pointer text-[#4d5440] hover:text-[#1f2a12]"}
                >
                  {link}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <LanguageSwitcher />
              <button
                onClick={onGetStarted}
                className="whitespace-nowrap rounded-full bg-[#3a4a1f] px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#f2f0dd] transition-all duration-200 hover:bg-[#2f3c18] active:scale-95 shadow"
              >
                {t("home.getStarted")}
              </button>
            </div>
          </nav>

          {/* Floating stat card */}
          <div className="relative z-10 mt-6 sm:mt-16 flex justify-end">
            <div className="relative">
              <div className="absolute -right-2 top-2 sm:-right-3 sm:top-3 h-full w-full rounded-2xl sm:rounded-3xl bg-[#f2f0dd]/80" />
              <div className="relative w-48 sm:w-64 rounded-2xl sm:rounded-3xl bg-[#7c9450] p-4 sm:p-6 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="mb-4 sm:mb-6 flex -space-x-2 sm:-space-x-3">
                  {[Sprout, Users, ShieldCheck].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#7c9450] bg-[#f5f4e6] text-[#3f5720]"
                    >
                      <Icon size={14} className="sm:w-4 sm:h-4" />
                    </span>
                  ))}
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-[#f5f4e6]">{t("home.statValue")}</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-snug text-[#eef0dc]">
                  {t("home.statLabel1")}
                  <br />
                  {t("home.statLabel2")}
                </p>
              </div>
            </div>
          </div>

          {/* Headline + copy row */}
          <div className="relative z-10 mt-auto flex flex-col justify-end gap-6 sm:gap-8 pt-10 sm:pt-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#f2f0dd]">
                <span className="h-2 w-2 rounded-full bg-[#f2f0dd]" />
                {t("home.eyebrow")}
              </p>
              <h1 className="max-w-2xl text-3xl font-bold leading-[1.1] text-[#f4f2e2] sm:text-5xl lg:text-7xl">
                {t("home.headline1")}
                <br />
                {t("home.headline2")}
                <br />
                {t("home.headline3")}
              </h1>
            </div>

            <div className="max-w-md lg:pb-2">
              <p className="text-sm sm:text-base leading-relaxed text-[#eceadb]">
                {t("home.description")}
              </p>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 rounded-full bg-[#f4f2e2] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-[#2c331c] transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-95"
                >
                  {t("home.getStarted")} <ArrowRight size={16} />
                </button>
                <button
                  onClick={onGetStarted}
                  className="rounded-full border border-[#f4f2e2] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-[#f4f2e2] transition-all duration-200 hover:bg-[#f4f2e2] hover:text-[#2c331c] active:scale-95"
                >
                  {t("home.viewLiveDemo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Why" strip below hero card */}
      <div className="mx-auto mt-4 sm:mt-6 grid max-w-[1600px] grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        {whyStrip.map((item) => (
          <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 shadow-sm">
            <p className="font-semibold text-stone-900 text-sm sm:text-base">{item.title}</p>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
