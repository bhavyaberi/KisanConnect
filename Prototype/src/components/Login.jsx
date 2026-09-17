import { useState } from "react";
import { Sprout, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Info } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

// One demo account per KisanConnect user type (Section 3.7 of the guide:
// OTP for farmers/buyers, email+password with role-based access for DoCA
// officials in the real system — this prototype keeps all three on
// email+password for simplicity).
export const DEMO_ACCOUNTS = {
  farmer: { email: "suresh@kisanconnect.in", password: "farmer123", name: "Suresh Kumar", region: "Kolar" },
  buyer: { email: "meera@kisanconnect.in", password: "buyer123", name: "Meera Iyer", region: "Bangalore" },
  admin: { email: "ananya@doca.gov.in", password: "admin123", name: "Ananya Rao", region: null },
};

// Stands in for a real backend (would be POST /auth/otp/verify per
// Section 6 of the guide). Kept async/rejectable so swapping in a real
// call later doesn't require touching the component below.
function fakeLogin(role, email, password, roleLabel) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = DEMO_ACCOUNTS[role];
      if (email.trim().toLowerCase() === account.email && password === account.password) {
        resolve({ name: account.name, role: roleLabel, roleKey: role });
      } else {
        reject(new Error("mismatch"));
      }
    }, 700);
  });
}

export default function Login({ onLogin }) {
  const { t } = useLanguage();
  const [role, setRole] = useState("farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ROLE_TABS = [
    { key: "farmer", label: t("login.roleFarmer") },
    { key: "buyer", label: t("login.roleBuyer") },
    { key: "admin", label: t("login.roleAdmin") },
  ];

  function validate() {
    const next = {};
    if (!email.trim()) next.email = t("login.emailRequired");
    if (!password) next.password = t("login.passwordRequired");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const roleTabLabel = ROLE_TABS.find((r) => r.key === role).label;
      const account = DEMO_ACCOUNTS[role];
      const roleLabel = account.region ? `${roleTabLabel} \u2014 ${account.region}` : roleTabLabel;
      const user = await fakeLogin(role, email, password, roleLabel);
      onLogin(user);
    } catch {
      setAuthError(t("login.mismatch") || "Incorrect email or password for this role.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    setErrors({});
    setAuthError("");
  }

  function fillDemoCredentials() {
    const account = DEMO_ACCOUNTS[role];
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
    setAuthError("");
  }

  const account = DEMO_ACCOUNTS[role];
  const roleTabLabel = ROLE_TABS.find((r) => r.key === role).label;
  const roleDisplayLabel = account.region ? `${roleTabLabel} \u2014 ${account.region}` : roleTabLabel;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0d1f14] p-3 py-6 sm:p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800">
            <Sprout size={20} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-lg font-bold text-stone-900">{t("brand.name")}</p>
            <p className="text-[10px] font-medium tracking-wider text-stone-400">{t("login.hackathonTag")}</p>
          </div>
        </div>

        {/* Role tabs */}
        <div className="mb-6 flex rounded-full bg-stone-100 p-1">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleRoleChange(tab.key)}
              className={`min-w-0 flex-1 truncate rounded-full px-2 py-2.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs ${
                role === tab.key ? "bg-emerald-800 text-white" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-stone-900">{t("login.welcomeBack")}</h2>
        <p className="mt-1 text-sm text-stone-500">{t("login.signInAs", { role: roleDisplayLabel })}</p>

        {/* Demo credentials — shown directly, always visible, no digging required */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">{t("login.demoLoginFor", { role: roleTabLabel })}</p>
            <p className="break-all">Email: <span className="font-mono">{account.email}</span></p>
            <p className="break-all">Password: <span className="font-mono">{account.password}</span></p>
          </div>
        </div>

        {authError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0" />
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
              {t("login.emailLabel")}
            </label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={account.email}
                className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 ${
                  errors.email ? "border-red-300" : "border-stone-200"
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
              {t("login.passwordLabel")}
            </label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={"\u2022".repeat(8)}
                className={`w-full rounded-xl border py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 ${
                  errors.password ? "border-red-300" : "border-stone-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {t("login.signingIn")}
              </>
            ) : (
              t("login.submit")
            )}
          </button>
        </form>

        <button
          onClick={fillDemoCredentials}
          className="mt-3 w-full text-center text-xs font-medium text-stone-400 hover:text-emerald-700"
        >
          {t("login.autofill")}
        </button>
      </div>
    </div>
  );
}
