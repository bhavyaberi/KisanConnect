import { Sprout, Users, ShieldCheck, ArrowRight } from "lucide-react";
import HeroIllustration from "../components/HeroIllustration";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Styled after the reference hero: cream nav pill over a full-bleed
// background, eyebrow label, big 3-line headline, floating stat card,
// description + two CTA buttons. The background is a custom illustrated
// farm scene (see HeroIllustration) with a dark gradient overlay on top
// for text legibility, the same technique a real photo hero would use.
//
// The hero is built phone-first: the desktop composition (stat card
// floated right, headline and copy side by side) only assembles itself at
// `lg`. Below that everything stacks into a single readable column, and
// the hero's height follows its content instead of being pinned to 820px.
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
    <div className="min-h-dvh w-full bg-[#0d1f14] p-3 sm:p-6">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-3xl shadow-2xl sm:rounded-[32px]">
        <div className="relative flex min-h-[600px] flex-col justify-between px-4 pb-8 pt-4 sm:min-h-[720px] sm:px-10 sm:pb-12 sm:pt-6 lg:min-h-[820px]">
          {/* Illustrated background layer */}
          <HeroIllustration />
          {/* Dark gradient overlay for text legibility over the illustration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f14] via-[#12200c]/70 to-[#0d1f14]/20" />

          {/* Navbar */}
          <nav className="relative z-10 flex items-center justify-between gap-2 rounded-full bg-[#f6f4e8] px-3 py-2 sm:gap-6 sm:px-6 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#3f5720] text-[#e7e2c8] sm:h-9 sm:w-9">
                <Sprout size={16} />
              </div>
              <p className="truncate text-base font-bold leading-none text-[#1f2a12] sm:text-lg">
                {t("brand.name")}
              </p>

              <span className="hidden pl-3 text-sm text-[#5b5f4a] xl:block">
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

            <div className="flex flex-shrink-0 items-center gap-2">
              <LanguageSwitcher />
              {/* Redundant on a phone — the two large CTAs sit just below
                  the fold — so it only appears once there's room for it. */}
              <button
                onClick={onGetStarted}
                className="hidden whitespace-nowrap rounded-full bg-[#3a4a1f] px-5 py-2.5 text-sm font-semibold text-[#f2f0dd] transition-all duration-200 hover:bg-[#2f3c18] active:scale-95 sm:block"
              >
                {t("home.getStarted")}
              </button>
            </div>
          </nav>

          {/* Floating stat card */}
          <div className="relative z-10 mt-8 flex justify-end sm:mt-16">
            <div className="relative">
              <div className="absolute -right-2 top-2 h-full w-full rounded-3xl bg-[#f2f0dd]/80 sm:-right-3 sm:top-3" />
              <div className="relative w-48 rounded-3xl bg-[#7c9450] p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-64 sm:p-6">
                <div className="mb-4 flex -space-x-3 sm:mb-6">
                  {[Sprout, Users, ShieldCheck].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#7c9450] bg-[#f5f4e6] text-[#3f5720] sm:h-10 sm:w-10"
                    >
                      <Icon size={14} />
                    </span>
                  ))}
                </div>
                <p className="text-3xl font-bold text-[#f5f4e6] sm:text-4xl">{t("home.statValue")}</p>
                <p className="mt-1.5 text-xs leading-snug text-[#eef0dc] sm:mt-2 sm:text-sm">
                  {t("home.statLabel1")}
                  <br />
                  {t("home.statLabel2")}
                </p>
              </div>
            </div>
          </div>

          {/* Headline + copy row */}
          <div className="relative z-10 mt-auto flex flex-col justify-end gap-6 pt-10 sm:gap-8 sm:pt-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#f2f0dd] sm:mb-4 sm:text-sm">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#f2f0dd]" />
                {t("home.eyebrow")}
              </p>
              {/* `text-balance` keeps the Hindi headline from breaking into
                  a lopsided last line, which it otherwise does at phone widths. */}
              <h1 className="max-w-2xl text-pretty text-[2rem] font-bold leading-[1.1] text-[#f4f2e2] sm:text-5xl sm:leading-[1.05] lg:text-7xl">
                {t("home.headline1")}
                <br />
                {t("home.headline2")}
                <br />
                {t("home.headline3")}
              </h1>
            </div>

            <div className="max-w-sm lg:pb-2">
              <p className="text-sm leading-relaxed text-[#eceadb] sm:text-base">
                {t("home.description")}
              </p>
              {/* Stacked and full-width on a phone so each is a comfortable
                  thumb target, side by side once there's room. */}
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
                <button
                  onClick={onGetStarted}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#f4f2e2] px-6 py-3.5 text-sm font-semibold text-[#2c331c] transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-95 sm:py-3"
                >
                  {t("home.getStarted")} <ArrowRight size={16} />
                </button>
                <button
                  onClick={onGetStarted}
                  className="rounded-full border border-[#f4f2e2] px-6 py-3.5 text-sm font-semibold text-[#f4f2e2] transition-all duration-200 hover:bg-[#f4f2e2] hover:text-[#2c331c] active:scale-95 sm:py-3"
                >
                  {t("home.viewLiveDemo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brief "why" strip below the hero card — kept to 3 short points, no
          extra pages, so the landing page stays a single simple screen */}
      <div className="mx-auto mt-4 grid max-w-[1600px] grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {whyStrip.map((item) => (
          <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
            <p className="font-semibold text-stone-900">{item.title}</p>
            <p className="mt-1 text-sm text-stone-500">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
