import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileSignature,
  Star,
  QrCode,
  Link2,
  LayoutDashboard,
  MessageCircleQuestion,
} from "lucide-react";
import { type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/registration", label: "Manufacturer Registration", icon: FileSignature },
  { to: "/star-rating", label: "AI Star Rating Calculator", icon: Star },
  { to: "/qr-verification", label: "QR Verification Portal", icon: QrCode },
  { to: "/blockchain", label: "Blockchain Certificate", icon: Link2 },
  { to: "/dashboard", label: "AI-Powered Dashboard", icon: LayoutDashboard },
  { to: "/grievance", label: "AI Grievance Assistant", icon: MessageCircleQuestion },
];

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

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gradient-to-b from-gt-purple-dark to-gt-purple flex flex-col fixed inset-y-0 z-10">
        <Logo />
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
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
              <span>{item.label}</span>
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
          <div className="text-sm font-semibold text-ink">BEE Standards &amp; Labelling — Smart Compliance Portal</div>
          <div className="flex items-center gap-3">
            <span className="pill bg-good/10 text-good">
              <span className="w-1.5 h-1.5 rounded-full bg-good" /> Demo Environment
            </span>
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
