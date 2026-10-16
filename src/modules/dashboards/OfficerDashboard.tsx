import { Link } from "react-router-dom";
import { AlertOctagon, Search, Link2, MessageCircleQuestion, ArrowRight, ShieldAlert, Gauge, CheckCircle2, LayoutDashboard } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { FLAGGED_CASES } from "../../data/registryData";

const QUICK_LINKS = [
  { to: "/anomaly-dashboard", icon: AlertOctagon, title: "Anomaly Detection Dashboard", desc: "Review flagged registrations ranked by severity and deviation." },
  { to: "/dashboard", icon: LayoutDashboard, title: "Compliance Dashboard", desc: "State-wise registrations, trends, and non-compliant manufacturers." },
  { to: "/qr-verification", icon: Search, title: "Registry Search", desc: "Look up any certificate or model in the official BEE registry." },
  { to: "/blockchain", icon: Link2, title: "Blockchain Certificate", desc: "Audit the tamper-proof chain-of-custody for any certificate." },
  { to: "/grievance", icon: MessageCircleQuestion, title: "AI Grievance Assistant", desc: "Review and respond to manufacturer/consumer tickets." },
];

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const highSeverity = FLAGGED_CASES.filter((c) => c.anomalySeverity === "High").length;
  const avgDeviation = Math.round(
    FLAGGED_CASES.reduce((sum, c) => sum + (c.deviationPct ?? 0), 0) / Math.max(1, FLAGGED_CASES.length)
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gt-purple-dark via-gt-purple to-gt-teal-dark text-white p-8 shadow-cardhover">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-2xl font-bold mb-1">BEE Officer Dashboard</h1>
        <p className="text-white/85 text-sm max-w-2xl">
          Anomaly detection, compliance surveillance, and registry oversight across all manufacturer filings.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile icon={ShieldAlert} label={t("kpi.totalFlagged")} value={FLAGGED_CASES.length} bad />
        <StatTile icon={AlertOctagon} label={t("kpi.highSeverity")} value={highSeverity} bad />
        <StatTile icon={Gauge} label={t("kpi.avgDeviation")} value={avgDeviation} suffix="%" />
        <StatTile icon={CheckCircle2} label={t("kpi.resolvedThisMonth")} value={17} good />
      </div>

      <div className="card card-pad bg-gradient-to-br from-bad/5 to-gt-purple/5 border-bad/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-bad text-white grid place-items-center shrink-0">
            <AlertOctagon size={22} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-ink">{FLAGGED_CASES.length} cases currently flagged for review</div>
            <div className="text-xs text-muted">Highest severity cases include ISEER anomalies and duplicate test report hashes.</div>
          </div>
          <Link to="/anomaly-dashboard" className="btn-primary shrink-0">Open Anomaly Dashboard</Link>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-ink mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((m) => (
            <Link key={m.to} to={m.to} className="card card-pad group hover:shadow-cardhover hover:-translate-y-0.5 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gt-purple/10 to-gt-teal/10 grid place-items-center mb-3 text-gt-purple group-hover:scale-105 transition-transform">
                <m.icon size={20} />
              </div>
              <div className="font-semibold text-sm text-ink mb-1">{m.title}</div>
              <div className="text-xs text-muted leading-relaxed mb-3">{m.desc}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gt-teal-dark">
                Open <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, good, bad, suffix }: { icon: typeof AlertOctagon; label: string; value: number; good?: boolean; bad?: boolean; suffix?: string }) {
  return (
    <div className="card card-pad">
      <div className={`w-8 h-8 rounded-lg grid place-items-center mb-2 ${bad ? "bg-bad/10 text-bad" : good ? "bg-good/10 text-good" : "bg-gt-purple/10 text-gt-purple"}`}>
        <Icon size={16} />
      </div>
      <div className="text-2xl font-bold text-ink">{value.toLocaleString()}{suffix ?? ""}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
