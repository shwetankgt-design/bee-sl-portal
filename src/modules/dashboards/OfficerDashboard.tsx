import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertOctagon,
  Search,
  Link2,
  MessageCircleQuestion,
  ArrowRight,
  ShieldAlert,
  Gauge,
  CheckCircle2,
  LayoutDashboard,
  Timer,
  Zap,
  ListChecks,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { FLAGGED_CASES } from "../../data/registryData";

const QUICK_LINKS = [
  { to: "/anomaly-dashboard", icon: AlertOctagon, title: "Anomaly Detection Dashboard", desc: "Review flagged registrations ranked by severity and deviation." },
  { to: "/dashboard", icon: LayoutDashboard, title: "Compliance Dashboard", desc: "State-wise registrations, trends, and non-compliant manufacturers." },
  { to: "/qr-verification", icon: Search, title: "Registry Search", desc: "Look up any certificate or model in the official BEE registry." },
  { to: "/blockchain", icon: Link2, title: "Blockchain Certificate", desc: "Audit the tamper-proof chain-of-custody for any certificate." },
  { to: "/grievance", icon: MessageCircleQuestion, title: "AI Grievance Assistant", desc: "Review and respond to manufacturer/consumer tickets." },
];

const SEVERITY_TONE: Record<string, string> = {
  High: "bg-bad/10 text-bad",
  Medium: "bg-warn/10 text-warn",
  Low: "bg-muted/10 text-muted",
};

const PAGE_SIZE = 10;

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);

  const highSeverity = FLAGGED_CASES.filter((c) => c.anomalySeverity === "High").length;
  const avgDeviation = Math.round(
    FLAGGED_CASES.reduce((sum, c) => sum + (c.deviationPct ?? 0), 0) / Math.max(1, FLAGGED_CASES.length)
  );
  const avgProcessingDays = Math.round(
    FLAGGED_CASES.reduce((sum, c) => sum + c.processingDays, 0) / Math.max(1, FLAGGED_CASES.length)
  );
  const energyAtRiskMwh = Math.round(FLAGGED_CASES.reduce((s, c) => s + c.energySavingsKwh, 0) / 1000);

  const flaggedRows = useMemo(
    () => [...FLAGGED_CASES].sort((a, b) => (b.deviationPct ?? 0) - (a.deviationPct ?? 0)).slice(0, 50),
    []
  );
  const totalPages = Math.max(1, Math.ceil(flaggedRows.length / PAGE_SIZE));
  const pagedRows = flaggedRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

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
        <StatTile icon={Timer} label="Avg. Case Processing Time" value={avgProcessingDays} suffix=" days" />
        <StatTile icon={Zap} label="Energy Savings At Risk" value={energyAtRiskMwh} suffix=" MWh/yr" />
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

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-gt-purple" />
            <h2 className="section-title">Top Flagged Cases by Deviation ({flaggedRows.length})</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              className="px-2.5 py-1 rounded-md border border-border disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <span className="text-muted">
              Page {page + 1} / {totalPages}
            </span>
            <button
              className="px-2.5 py-1 rounded-md border border-border disabled:opacity-40"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-border">
                <th className="py-2 pr-3">Manufacturer / Model</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">State</th>
                <th className="py-2 pr-3">Severity</th>
                <th className="py-2">Deviation</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 whitespace-nowrap">
                    <div className="font-medium text-ink">{c.manufacturer}</div>
                    <div className="text-xs text-muted">{c.model}</div>
                  </td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{c.category}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{c.state}</td>
                  <td className="py-2 pr-3">
                    <span className={`pill ${SEVERITY_TONE[c.anomalySeverity ?? "Low"]}`}>{c.anomalySeverity}</span>
                  </td>
                  <td className="py-2 font-semibold text-ink">{c.deviationPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      <div className="text-2xl font-bold text-ink">
        {value.toLocaleString()}
        {suffix ?? ""}
      </div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
