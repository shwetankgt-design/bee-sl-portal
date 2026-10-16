import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileSignature,
  Star,
  QrCode,
  Link2,
  LayoutDashboard,
  MessageCircleQuestion,
  ScanLine,
  Camera,
  AlertOctagon,
  Search,
  ChevronDown,
  UserCircle2,
  Languages,
  Grid3x3,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useRole, type Role, ROLE_LABELS } from "../context/RoleContext";
import { useLanguage } from "../context/LanguageContext";

const NAV_BY_ROLE: Record<Role, { to: string; labelKey: string; label: string; icon: typeof Home }[]> = {
  manufacturer: [
    { to: "/", labelKey: "nav.dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/registration", labelKey: "nav.registration", label: "Manufacturer Registration", icon: FileSignature },
    { to: "/ocr-registration", labelKey: "nav.ocr", label: "OCR Auto-fill", icon: ScanLine },
    { to: "/star-predictor", labelKey: "nav.starPredictor", label: "Pre-Check Star Predictor", icon: Star },
    { to: "/star-rating", labelKey: "nav.starRating", label: "AI Star Rating Calculator", icon: Star },
    { to: "/blockchain", labelKey: "nav.blockchain", label: "Blockchain Certificate", icon: Link2 },
    { to: "/grievance", labelKey: "nav.grievance", label: "AI Grievance Assistant", icon: MessageCircleQuestion },
    { to: "/explore", labelKey: "nav.explore", label: "Explore All Modules", icon: Grid3x3 },
  ],
  consumer: [
    { to: "/", labelKey: "nav.dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/snap-verify", labelKey: "nav.snapVerify", label: "Snap-to-Verify", icon: Camera },
    { to: "/qr-verification", labelKey: "nav.qr", label: "QR Verification Portal", icon: QrCode },
    { to: "/blockchain", labelKey: "nav.blockchain", label: "Blockchain Certificate", icon: Link2 },
    { to: "/grievance", labelKey: "nav.grievance", label: "AI Grievance Assistant", icon: MessageCircleQuestion },
    { to: "/explore", labelKey: "nav.explore", label: "Explore All Modules", icon: Grid3x3 },
  ],
  officer: [
    { to: "/", labelKey: "nav.dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/anomaly-dashboard", labelKey: "nav.anomaly", label: "Anomaly Detection Dashboard", icon: AlertOctagon },
    { to: "/dashboard", labelKey: "nav.compliance", label: "Compliance Dashboard", icon: LayoutDashboard },
    { to: "/qr-verification", labelKey: "nav.registry", label: "Registry Search", icon: Search },
    { to: "/blockchain", labelKey: "nav.blockchain", label: "Blockchain Certificate", icon: Link2 },
    { to: "/grievance", labelKey: "nav.grievance", label: "AI Grievance Assistant", icon: MessageCircleQuestion },
    { to: "/explore", labelKey: "nav.explore", label: "Explore All Modules", icon: Grid3x3 },
  ],
};

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-4">
      <div className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-gt-purple to-gt-teal text-white font-bold text-sm shadow">
        GT
      </div>
      <div className="leading-tight">
        <div className="text-white font-bold text-sm">Grant Thornton Bharat</div>
        <div className="text-white/60 text-[10px] font-medium tracking-wide">BEE S&amp;L COMPLIANCE PORTAL</div>
      </div>
    </div>
  );
}

function RoleSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const roles: Role[] = ["manufacturer", "consumer", "officer"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface transition-colors"
      >
        <UserCircle2 size={15} className="text-gt-purple" />
        <span className="text-muted">Viewing as:</span>
        <span className="font-semibold">{ROLE_LABELS[role]}</span>
        <ChevronDown size={13} className="text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-border rounded-lg shadow-cardhover z-20 overflow-hidden">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                  navigate("/");
                }}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                  r === role ? "bg-gt-purple/10 text-gt-purple" : "text-ink hover:bg-surface"
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border px-1 py-1 text-xs font-semibold">
      <Languages size={13} className="text-gt-purple ml-1" />
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded-md transition-colors ${lang === "en" ? "bg-gt-purple text-white" : "text-muted hover:text-ink"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-2 py-1 rounded-md transition-colors ${lang === "hi" ? "bg-gt-purple text-white" : "text-muted hover:text-ink"}`}
      >
        हिंदी
      </button>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { role } = useRole();
  const { t } = useLanguage();
  const nav = NAV_BY_ROLE[role];

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gradient-to-b from-gt-purple-dark to-gt-purple flex flex-col fixed inset-y-0 z-10">
        <Logo />
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white text-gt-purple shadow" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              <span>{t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="text-white/30 text-[10px] text-center">
            Demo Prototype — Prepared for BEE by Grant Thornton Bharat
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-[5]">
          <div className="text-sm font-semibold text-ink">{t("app.title")}</div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <RoleSwitcher />
          </div>
        </header>
        <main className="flex-1 min-w-0">
          <div key={location.pathname} className="max-w-[1400px] mx-auto px-6 py-6 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
