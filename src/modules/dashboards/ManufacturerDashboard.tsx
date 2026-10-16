import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileSignature,
  ScanLine,
  Star,
  Link2,
  MessageCircleQuestion,
  ArrowRight,
  Factory,
  Boxes,
  Clock,
  RefreshCw,
  Gauge,
  Timer,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { TRACKED_APPLICATIONS, KPI_TILES } from "../../data/mockData";
import { useLanguage } from "../../context/LanguageContext";
import { REGISTRY } from "../../data/registryData";

const QUICK_LINKS = [
  { to: "/ocr-registration", icon: ScanLine, title: "OCR Auto-fill", desc: "Upload a test lab report and auto-fill your registration form in seconds." },
  { to: "/star-predictor", icon: Star, title: "Pre-Check Star Predictor", desc: "Check your likely star rating before you submit, live as you type." },
  { to: "/registration", icon: FileSignature, title: "Manufacturer Registration", desc: "Submit new product applications and track approval status." },
  { to: "/blockchain", icon: Link2, title: "Blockchain Certificate", desc: "Look up tamper-proof certificate chain-of-custody records." },
  { to: "/grievance", icon: MessageCircleQuestion, title: "AI Grievance Assistant", desc: "Raise tickets and get instant answers on registration queries." },
];

const STATUS_TONE: Record<string, string> = {
  Submitted: "bg-gt-teal/10 text-gt-teal-dark",
  "Under Review": "bg-warn/10 text-warn",
  Approved: "bg-good/10 text-good",
  Rejected: "bg-bad/10 text-bad",
  Pending: "bg-warn/10 text-warn",
  Flagged: "bg-bad/10 text-bad",
};

// Demo manufacturer "logged in" (matches the default company pre-filled in Registration).
const MY_COMPANY = "LG Electronics India Pvt. Ltd.";
const PAGE_SIZE = 10;

export default function ManufacturerDashboard() {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const myApps = TRACKED_APPLICATIONS;
  const approved = myApps.filter((a) => a.status === "Approved").length;
  const pending = myApps.filter((a) => a.status === "Under Review" || a.status === "Submitted").length;

  const myModels = useMemo(() => REGISTRY.filter((r) => r.manufacturer === MY_COMPANY), []);

  const stats = useMemo(() => {
    const total = myModels.length || 1;
    const myApproved = myModels.filter((r) => r.status === "Approved").length;
    const avgCompliance = Math.round(myModels.reduce((s, r) => s + r.complianceScore, 0) / total);
    const avgProcessingDays = Math.round(myModels.reduce((s, r) => s + r.processingDays, 0) / total);
    const energySavings = Math.round(myModels.reduce((s, r) => s + r.energySavingsKwh, 0) / 1000);
    const complianceRate = Math.round((myApproved / total) * 1000) / 10;
    return { total, myApproved, avgCompliance, avgProcessingDays, energySavings, complianceRate };
  }, [myModels]);

  const totalPages = Math.max(1, Math.ceil(myModels.length / PAGE_SIZE));
  const pagedRows = myModels.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gt-purple via-gt-purple to-gt-teal-dark text-white p-8 shadow-cardhover">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-2xl font-bold mb-1">Manufacturer Dashboard</h1>
        <p className="text-white/85 text-sm max-w-2xl">
          Track applications, auto-fill submissions from test lab reports, and pre-check star ratings before you file —
          viewing registered models for {MY_COMPANY}.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile icon={Boxes} label={t("kpi.myApplications")} value={myApps.length} />
        <StatTile icon={Factory} label={t("kpi.approvedModels")} value={approved} />
        <StatTile icon={Clock} label="Under Review" value={pending} />
        <StatTile icon={RefreshCw} label={t("kpi.pendingRenewals")} value={KPI_TILES[4].value} />
        <StatTile icon={Boxes} label="Registered Models (Total)" value={stats.total} />
        <StatTile icon={Gauge} label="Avg. Compliance Score" value={stats.avgCompliance} suffix="/100" />
        <StatTile icon={Timer} label="Avg. Processing Time" value={stats.avgProcessingDays} suffix=" days" />
        <StatTile icon={Zap} label="Energy Savings" value={stats.energySavings} suffix=" MWh/yr" />
      </div>

      <div className="card card-pad">
        <h2 className="section-title mb-3">My Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-border">
                <th className="py-2 pr-3">Application ID</th>
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Submitted</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {myApps.map((a) => (
                <tr key={a.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-ink whitespace-nowrap">{a.id}</td>
                  <td className="py-2.5 pr-3 text-muted whitespace-nowrap">{a.product}</td>
                  <td className="py-2.5 pr-3 text-muted whitespace-nowrap">{a.category}</td>
                  <td className="py-2.5 pr-3 text-muted whitespace-nowrap">{a.submitted}</td>
                  <td className="py-2.5">
                    <span className={`pill ${STATUS_TONE[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BadgeCheck size={16} className="text-gt-purple" />
            <h2 className="section-title">All Registered Models — {MY_COMPANY} ({myModels.length})</h2>
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
                <th className="py-2 pr-3">Model ID</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">State</th>
                <th className="py-2 pr-3">Star</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Compliance</th>
                <th className="py-2">Registered</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 font-medium text-ink whitespace-nowrap">{r.model}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.category}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.state}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{"★".repeat(r.starRating)}</td>
                  <td className="py-2 pr-3">
                    <span className={`pill ${STATUS_TONE[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="py-2 pr-3 text-muted">{r.complianceScore}</td>
                  <td className="py-2 text-muted whitespace-nowrap">{r.registrationDate}</td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No registered models found.
                  </td>
                </tr>
              )}
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

function StatTile({ icon: Icon, label, value, suffix }: { icon: typeof Factory; label: string; value: number; suffix?: string }) {
  return (
    <div className="card card-pad">
      <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
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
