# KisanConnect

Farmer-to-buyer marketplace prototype for Smart India Hackathon 2026 (SIH26033) —
direct listings, AI price/demand forecasting, and a live market dashboard for the
Department of Consumer Affairs.

React 19 + Vite 8 + Tailwind CSS v4 + Recharts. All data is mocked in
`src/data/kisanConnectData.js`; there is no backend.

## Running it

```bash
npm install     # required — the .bin shims don't survive being zipped
npm run dev     # http://localhost:5173
npm run build
npm run lint    # oxlint src
```

## Demo logins

Pick a role tab on the login screen, then use "Autofill demo credentials",
or type:

| Role         | Email                     | Password    |
| ------------ | ------------------------- | ----------- |
| Farmer       | `suresh@kisanconnect.in`  | `farmer123` |
| Buyer        | `meera@kisanconnect.in`   | `buyer123`  |
| Admin / DoCA | `ananya@doca.gov.in`      | `admin123`  |

## Languages

The app ships **English and Hindi**, and both are complete — all 222 translation
keys exist in both, so nothing falls back to English mid-screen.

Everything user-facing goes through `t()` from `src/i18n/LanguageContext.jsx`.
Data files store *translation keys* (`cropId`, `statusKey`, `severityKey`) rather
than display strings, which is why switching language also relabels chart axes,
status pills, and severity badges — not just the page chrome.

The selected language is saved to `localStorage` and restored on next visit, and
it drives voice recognition too: picking Hindi switches the Web Speech API to
`hi-IN` and teaches the listing parser to accept "50 किलो टमाटर".

To add a third language:

1. Add it to `LANGUAGES` in `src/i18n/translations.js`.
2. Add a matching block to `translations`, filled in the same way `hi` is.
3. Add its BCP-47 speech locale to `SPEECH_LOCALES` in `src/i18n/LanguageContext.jsx`.
4. Add its crop keywords to `CROP_KEYWORDS` in `src/lib/parseVoiceListing.js`.

## Layout

Phone-first, with a single `md` (768px) breakpoint separating the two shells:

- **Below `md`** — sidebar hidden; `src/components/BottomNav.jsx` renders the same
  `navItems` as a fixed bottom tab bar, safe-area padded for the iPhone home
  indicator. Pages reserve room for it with `pb-bottomnav`.
- **`md` and up** — the original 256px `Sidebar` returns and the bottom bar hides.

Notes for anyone editing layout:

- Flex children holding charts need `min-w-0`, or Recharts' measured width pushes
  the page sideways on a phone.
- Inputs are forced to 16px under `md` in `index.css`; below that iOS zooms the
  viewport on focus.
- Dropdowns listen for `touchstart` as well as `mousedown` — without it they stay
  stuck open on touch devices.
- The regions heat map uses tap-to-select state, not hover alone, since phones
  have no hover.
