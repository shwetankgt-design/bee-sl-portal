import { useMemo, useState } from "react";
import { AlertOctagon, ShieldAlert, Gauge, CheckCircle2, X, Flag, MessageSquareWarning, ThumbsDown, BarChart3 } from "lucide-react";
import { FLAGGED_CASES, type RegistryRecord } from "../data/registryData";

type CaseStatus = "Open" | "Flagged for Inspection" | "Clarification Requested" | "Dismissed";

interface Case extends RegistryRecord {
  caseStatus: CaseStatus;
}

const SEVERITY_TONE: Record<string, string> = {
  High: "bg-bad/10 text-bad",
  Medium: "bg-warn/10 text-warn",
  Low: "bg-muted/10 text-muted",
};

export default function AnomalyDashboard() {
  const [cases, setCases] = useState<Case[]>(() => FLAGGED_CASES.map((c) => ({ ...c, caseStatus: "Open" as CaseStatus })));
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<"severity" | "deviation">("severity");
  const [selected, setSelected] = useState<Case | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(FLAGGED_CASES.map((c) => c.category))), []);
  const severityRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  const filtered = cases
    .filter((c) => (severityFilter === "All" ? true : c.anomalySeverity === severityFilter))
    .filter((c) => (categoryFilter === "All" ? true : c.category === categoryFilter))
    .sort((a, b) =>
      sortKey === "severity"
        ? severityRank[b.anomalySeverity ?? "Low"] - severityRank[a.anomalySeverity ?? "Low"]
        : (b.deviationPct ?? 0) - (a.deviationPct ?? 0)
    );

  const totalFlagged = cases.length;
  const highSeverity = cases.filter((c) => c.anomalySeverity === "High").length;
  const avgDeviation = Math.round(cases.reduce((s, c) => s + (c.deviationPct ?? 0), 0) / Math.max(1, cases.length));
  const resolved = cases.filter((c) => c.caseStatus !== "Open").length;

  function updateStatus(id: string, status: CaseStatus, message: string) {
    setCases((cs) => cs.map((c) => (c.id === id ? { ...c, caseStatus: status } : c)));
    setSelected((s) => (s && s.id === id ? { ...s, caseStatus: status } : s));
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-xl font-bold text-ink">Anomaly Detection Dashboard</h1>
        <p className="subtle">AI-flagged registrations ranked by severity and deviation from expected category norms.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiTile icon={ShieldAlert} label="Total Flagged" value={totalFlagged} bad />
        <KpiTile icon={AlertOctagon} label="High Severity" value={highSeverity} bad />
        <KpiTile icon={Gauge} label="Avg. Deviation %" value={avgDeviation} suffix="%" />
        <KpiTile icon={CheckCircle2} label="Cases Resolved This Month" value={resolved} good />
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="section-title">Flagged Cases ({filtered.length})</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select className="input !w-auto !py-1.5 text-xs" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="All">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select className="input !w-auto !py-1.5 text-xs" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select className="input !w-auto !py-1.5 text-xs" value={sortKey} onChange={(e) => setSortKey(e.target.value as "severity" | "deviation")}>
              <option value="severity">Sort: Severity</option>
              <option value="deviation">Sort: Deviation %</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-border">
                <th className="py-2 pr-3">Manufacturer / Model</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">State</th>
                <th className="py-2 pr-3">Severity</th>
                <th className="py-2 pr-3">Deviation</th>
                <th className="py-2 pr-3">Case Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface/60">
                  <td className="py-2.5 pr-3">
                    <div className="font-medium text-ink">{c.manufacturer}</div>
                    <div className="text-xs text-muted">{c.model}</div>
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{c.category}</td>
                  <td className="py-2.5 pr-3 text-muted">{c.state}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`pill ${SEVERITY_TONE[c.anomalySeverity ?? "Low"]}`}>{c.anomalySeverity}</span>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-ink">{c.deviationPct}%</td>
                  <td className="py-2.5 pr-3">
                    <span className={`pill ${c.caseStatus === "Open" ? "bg-warn/10 text-warn" : c.caseStatus === "Dismissed" ? "bg-muted/10 text-muted" : "bg-gt-teal/10 text-gt-teal-dark"}`}>
                      {c.caseStatus}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button className="text-xs font-semibold text-gt-purple hover:underline" onClick={() => setSelected(c)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-8">No cases match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md h-full bg-white shadow-cardhover p-5 overflow-y-auto spark-fade" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">Case Detail</h2>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm mb-5">
              <Row label="Manufacturer" value={selected.manufacturer} />
              <Row label="Model" value={selected.model} />
              <Row label="Category" value={selected.category} />
              <Row label="State" value={`${selected.state} (${selected.city})`} />
              <Row label="Certificate ID" value={selected.certificateId} />
              <Row label="Declared Star Rating" value={`${selected.starRating}★`} />
              <Row label="Compliance Score" value={String(selected.complianceScore)} />
              <Row label="Severity" value={selected.anomalySeverity ?? "—"} />
              <Row label="Deviation" value={`${selected.deviationPct}%`} />
            </div>

            <div className="rounded-lg bg-bad/5 border border-bad/20 px-3 py-2.5 text-sm text-ink mb-5">
              <div className="flex items-center gap-1.5 text-bad font-semibold mb-1 text-xs">
                <MessageSquareWarning size={13} /> Anomaly Reason
              </div>
              {selected.anomalyReason}
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-ink">
                <BarChart3 size={13} className="text-gt-purple" /> Declared vs Category Distribution
              </div>
              <DeviationBars value={selected.metricValue} deviation={selected.deviationPct ?? 0} unit={selected.metricUnit} />
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="btn bg-warn text-white hover:bg-warn/90 justify-center"
                onClick={() => updateStatus(selected.id, "Flagged for Inspection", `${selected.id} flagged for field inspection.`)}
              >
                <Flag size={14} /> Flag for Field Inspection
              </button>
              <button
                className="btn-ghost justify-center"
                onClick={() => updateStatus(selected.id, "Clarification Requested", `Clarification request sent to ${selected.manufacturer}.`)}
              >
                <MessageSquareWarning size={14} /> Request Clarification from Manufacturer
              </button>
              <button
                className="btn bg-muted/10 text-muted hover:bg-muted/20 justify-center"
                onClick={() => updateStatus(selected.id, "Dismissed", `${selected.id} dismissed as false positive.`)}
              >
                <ThumbsDown size={14} /> Dismiss as False Positive
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-lg shadow-cardhover spark-fade">
          {toast}
        </div>
      )}
    </div>
  );
}

function DeviationBars({ value, deviation, unit }: { value: number; deviation: number; unit: string }) {
  const categoryMedian = value / (1 + deviation / 100);
  const maxVal = Math.max(value, categoryMedian) * 1.2;
  return (
    <div className="space-y-2 bg-surface rounded-lg p-3 border border-border">
      <BarRow label="Category Median" value={categoryMedian} max={maxVal} unit={unit} color="bg-gt-teal" />
      <BarRow label="Declared Value" value={value} max={maxVal} unit={unit} color="bg-bad" />
    </div>
  );
}

function BarRow({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted mb-1">
        <span>{label}</span>
        <span className="font-semibold text-ink">{value.toFixed(2)} {unit}</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 pb-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink text-right">{value}</span>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, good, bad, suffix }: { icon: typeof AlertOctagon; label: string; value: number; good?: boolean; bad?: boolean; suffix?: string }) {
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
