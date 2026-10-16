import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  QrCode,
  Link2,
  MessageCircleQuestion,
  ArrowRight,
  ScanLine,
  ShieldCheck,
  FlagTriangleRight,
  Star,
  ListChecks,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { REGISTRY } from "../../data/registryData";

const QUICK_LINKS = [
  { to: "/snap-verify", icon: Camera, title: "Snap-to-Verify", desc: "Scan a product label to instantly confirm it's a genuine BEE-rated model." },
  { to: "/qr-verification", icon: QrCode, title: "QR Verification Portal", desc: "Scan or enter a certificate number to check validity and star rating." },
  { to: "/blockchain", icon: Link2, title: "Blockchain Certificate", desc: "Trace a certificate's tamper-proof chain-of-custody record." },
  { to: "/grievance", icon: MessageCircleQuestion, title: "AI Grievance Assistant", desc: "Report a counterfeit or mismatched product and track your complaint." },
];

const STATUS_TONE: Record<string, string> = {
  Approved: "bg-good/10 text-good",
  Pending: "bg-warn/10 text-warn",
  Rejected: "bg-bad/10 text-bad",
  Flagged: "bg-bad/10 text-bad",
};

const PAGE_SIZE = 10;

export default function ConsumerDashboard() {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);

  const approvedRecords = useMemo(() => REGISTRY.filter((r) => r.status === "Approved" && !r.isAnomaly), []);
  const totalFlagged = useMemo(() => REGISTRY.filter((r) => r.isAnomaly).length, []);

  const avgStar = useMemo(
    () => Math.round((approvedRecords.reduce((s, r) => s + r.starRating, 0) / Math.max(1, approvedRecords.length)) * 10) / 10,
    [approvedRecords]
  );

  // "Recently Verified Products" — a representative, consumer-facing slice (genuine,
  // approved registry models) rendered as a browsable ~50-row table.
  const verifiedRows = useMemo(() => approvedRecords.slice(0, 50), [approvedRecords]);
  const totalPages = Math.max(1, Math.ceil(verifiedRows.length / PAGE_SIZE));
  const pagedRows = verifiedRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gt-teal-dark via-gt-teal to-gt-purple text-white p-8 shadow-cardhover">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-2xl font-bold mb-1">Consumer Dashboard</h1>
        <p className="text-white/85 text-sm max-w-2xl">
          Verify any appliance in seconds — snap a photo of the label or scan its QR code to check authenticity against the official BEE registry.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile icon={ScanLine} label={t("kpi.productsScanned")} value={6} />
        <StatTile icon={ShieldCheck} label={t("kpi.verifiedAuthentic")} value={approvedRecords.length} good />
        <StatTile icon={FlagTriangleRight} label="Flagged Products in Registry" value={totalFlagged} bad />
        <StatTile icon={Star} label="Avg. Star Rating (Verified)" value={avgStar} suffix="★" />
      </div>

      <div className="card card-pad bg-gradient-to-br from-gt-teal/5 to-gt-purple/5 border-gt-teal/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gt-teal text-white grid place-items-center shrink-0">
            <Camera size={22} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-ink">Spot-check a product right now</div>
            <div className="text-xs text-muted">Use Snap-to-Verify to scan a label and confirm it matches the official BEE registry.</div>
          </div>
          <Link to="/snap-verify" className="btn-teal shrink-0">Scan a Product</Link>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-gt-purple" />
            <h2 className="section-title">Recently Verified Products ({verifiedRows.length})</h2>
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
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-border">
                <th className="py-2 pr-3">Brand</th>
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">State</th>
                <th className="py-2 pr-3">Star</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 font-medium text-ink whitespace-nowrap">{r.brand}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.model}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.category}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.state}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{"★".repeat(r.starRating)}</td>
                  <td className="py-2">
                    <span className={`pill ${STATUS_TONE[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-ink mb-3">What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

function StatTile({ icon: Icon, label, value, good, bad, suffix }: { icon: typeof Camera; label: string; value: number; good?: boolean; bad?: boolean; suffix?: string }) {
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
