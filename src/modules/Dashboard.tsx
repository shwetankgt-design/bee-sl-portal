import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Factory,
  Boxes,
  Clock,
  Tags,
  RefreshCw,
  XCircle,
  AlertOctagon,
  MapPin,
  Gauge,
  Percent,
  Zap,
  Award,
  Timer,
  BadgeCheck,
} from "lucide-react";
import { QUARTERLY_TREND, CATEGORY_SPLIT, CATEGORY_COLORS, AI_INSIGHTS, DASHBOARD_STATES } from "../data/mockData";
import { REGISTRY, APPLIANCE_CATEGORIES, type RegistryRecord } from "../data/registryData";

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      setVal(Math.round(target * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function KpiTile({
  label,
  value,
  suffix,
  trend,
  up,
  Icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  up?: boolean;
  Icon: typeof Factory;
}) {
  const animated = useCountUp(value);
  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center">
          <Icon size={16} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-good" : "text-bad"}`}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-ink">
        {animated.toLocaleString()}
        {suffix ?? ""}
      </div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}

const STATUS_PILL: Record<string, string> = {
  Approved: "bg-good/10 text-good",
  Pending: "bg-warn/10 text-warn",
  Rejected: "bg-bad/10 text-bad",
  Flagged: "bg-bad/10 text-bad",
};

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState(DASHBOARD_STATES[0]);
  const [page, setPage] = useState(0);

  // Core bug fix: all derived data below is computed from REGISTRY filtered by
  // selectedState, so every KPI / chart / table genuinely changes when the
  // state filter changes (previously only two of the panels reacted and the
  // top KPI strip was a static array that never varied by state).
  const stateRecords: RegistryRecord[] = useMemo(
    () => (selectedState === "All States" ? REGISTRY : REGISTRY.filter((r) => r.state === selectedState)),
    [selectedState]
  );

  const trendData = useMemo(() => {
    if (selectedState === "All States") return QUARTERLY_TREND;
    // Derive a quarterly trend from the filtered records' registration months.
    const quarters = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];
    const counts = [0, 0, 0, 0];
    stateRecords.forEach((r) => {
      const month = r.registrationDate.split("-")[1];
      const idx = ["Jan", "Feb", "Mar"].includes(month) ? 0 : ["Apr", "May", "Jun"].includes(month) ? 1 : ["Jul", "Aug", "Sep"].includes(month) ? 2 : 3;
      counts[idx] += 1;
    });
    return quarters.map((q, i) => ({ quarter: q, registrations: counts[i] * 14 + 20 }));
  }, [selectedState, stateRecords]);

  const kpis = useMemo(() => {
    const total = stateRecords.length || 1;
    const approved = stateRecords.filter((r) => r.status === "Approved").length;
    const pending = stateRecords.filter((r) => r.status === "Pending").length;
    const rejected = stateRecords.filter((r) => r.status === "Rejected").length;
    const flagged = stateRecords.filter((r) => r.status === "Flagged").length;
    const manufacturers = new Set(stateRecords.map((r) => r.manufacturer)).size;
    const avgCompliance = Math.round(stateRecords.reduce((s, r) => s + r.complianceScore, 0) / total);
    const avgStars = stateRecords.reduce((s, r) => s + r.starRating, 0) / total;
    const rejectionRate = Math.round((rejected / total) * 1000) / 10;
    const complianceRate = Math.round((approved / total) * 1000) / 10;
    const avgProcessingDays = Math.round(5 + (100 - avgCompliance) / 6);
    const energySavingsMwh = Math.round(stateRecords.filter((r) => r.status === "Approved").length * 2.4 + avgStars * 18);
    const categoryCounts: Record<string, number> = {};
    stateRecords.forEach((r) => (categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1));
    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? APPLIANCE_CATEGORIES[0];
    const renewalRate = Math.round(60 + avgCompliance / 3);
    return {
      total,
      manufacturers,
      approved,
      pending,
      rejected,
      flagged,
      avgCompliance,
      avgStars: Math.round(avgStars * 10) / 10,
      rejectionRate,
      complianceRate,
      avgProcessingDays,
      energySavingsMwh,
      topCategory,
      renewalRate,
    };
  }, [stateRecords]);

  const nonCompliant = useMemo(
    () =>
      [...stateRecords]
        .filter((r) => r.isAnomaly || r.status === "Rejected")
        .sort((a, b) => a.complianceScore - b.complianceScore)
        .slice(0, 8),
    [stateRecords]
  );

  const categorySplit = useMemo(() => {
    const counts: Record<string, number> = {};
    stateRecords.forEach((r) => (counts[r.category] = (counts[r.category] ?? 0) + 1));
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return entries.length ? entries.map(([name, value]) => ({ name, value })) : CATEGORY_SPLIT;
  }, [stateRecords]);

  // Always computed across the full REGISTRY (not just the filtered subset) so the
  // chart still shows a cross-state comparison — the selected state's bar is
  // highlighted in teal so the filter's effect is visibly confirmed either way.
  const stateWiseAll = useMemo(() => {
    const counts: Record<string, number> = {};
    REGISTRY.forEach((r) => (counts[r.state] = (counts[r.state] ?? 0) + 1));
    return Object.entries(counts)
      .map(([state, registrations]) => ({ state, registrations }))
      .sort((a, b) => b.registrations - a.registrations);
  }, []);

  const productRows = useMemo(() => stateRecords.slice(0, 50), [stateRecords]);
  const totalPages = Math.max(1, Math.ceil(productRows.length / PAGE_SIZE));
  const pagedRows = productRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function changeState(s: string) {
    setSelectedState(s);
    setPage(0);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">AI-Powered Dashboard</h1>
          <p className="subtle">Live MIS &amp; analytics across the BEE S&amp;L registration lifecycle.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-full sm:w-auto">
          <MapPin size={15} className="text-gt-purple shrink-0" />
          <select
            className="text-sm font-medium text-ink bg-transparent focus:outline-none cursor-pointer w-full"
            value={selectedState}
            onChange={(e) => changeState(e.target.value)}
          >
            {DASHBOARD_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiTile label="Registered Models" value={kpis.total} Icon={Boxes} trend={8.4} up />
        <KpiTile label="Manufacturers" value={kpis.manufacturers} Icon={Factory} trend={4.1} up />
        <KpiTile label="Pending Approvals" value={kpis.pending} Icon={Clock} trend={-6.3} up={false} />
        <KpiTile label="Flagged / Anomalies" value={kpis.flagged} Icon={AlertOctagon} trend={-3.2} up={false} />
        <KpiTile label="Avg. Compliance Score" value={kpis.avgCompliance} Icon={Gauge} suffix="/100" />
        <KpiTile label="Compliance Rate" value={kpis.complianceRate} Icon={BadgeCheck} suffix="%" />
        <KpiTile label="Rejection Rate" value={kpis.rejectionRate} Icon={XCircle} suffix="%" />
        <KpiTile label="Avg. Processing Time" value={kpis.avgProcessingDays} Icon={Timer} suffix=" days" />
        <KpiTile label="Energy Savings" value={kpis.energySavingsMwh} Icon={Zap} suffix=" MWh/yr" />
        <KpiTile label="Avg. Star Rating" value={kpis.avgStars} Icon={Tags} suffix="★" />
        <KpiTile label="Label Renewal Rate" value={kpis.renewalRate} Icon={RefreshCw} suffix="%" />
        <div className="card card-pad flex flex-col justify-center">
          <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
            <Award size={16} />
          </div>
          <div className="text-sm font-bold text-ink leading-tight">{kpis.topCategory}</div>
          <div className="text-xs text-muted mt-0.5">Top Performing Category</div>
        </div>
      </div>

      <div className="rounded-xl p-[1px] bg-gradient-to-r from-gt-purple/40 via-gt-teal/40 to-gt-purple/40">
        <div className="card-pad bg-card rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-gt-purple" />
            <h2 className="section-title">AI Insights</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {AI_INSIGHTS.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gt-teal mt-1.5 shrink-0" />
                <span className="text-ink/90">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-pad">
          <h2 className="section-title mb-3">
            State-wise Registrations{selectedState !== "All States" ? ` — ${selectedState} highlighted` : ""}
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stateWiseAll} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2F0" vertical={false} />
              <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#6B6478" }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
              <Tooltip />
              <Bar dataKey="registrations" radius={[6, 6, 0, 0]}>
                {stateWiseAll.map((s) => (
                  <Cell
                    key={s.state}
                    fill={selectedState === "All States" ? "#4E2A84" : s.state === selectedState ? "#00A9A5" : "#D8CFEA"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad">
          <h2 className="section-title mb-3">Quarterly Registration Trend{selectedState !== "All States" ? ` — ${selectedState}` : ""}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A9A5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00A9A5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2F0" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#6B6478" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
              <Tooltip />
              <Area type="monotone" dataKey="registrations" stroke="#00A9A5" strokeWidth={2.5} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad lg:col-span-2">
          <h2 className="section-title mb-3">Top Appliance Categories{selectedState !== "All States" ? ` — ${selectedState}` : ""}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={2}>
                {categorySplit.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-2 mb-3">
          <AlertOctagon size={16} className="text-bad" />
          <h2 className="section-title">Top Non-Compliant / Flagged Records{selectedState !== "All States" ? ` — ${selectedState}` : ""}</h2>
        </div>
        {nonCompliant.length === 0 ? (
          <div className="text-sm text-muted text-center py-6">No non-compliance records for {selectedState}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-[11px] text-muted border-b border-border">
                  <th className="py-2 pr-3">Manufacturer</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">State</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Compliance Score</th>
                </tr>
              </thead>
              <tbody>
                {nonCompliant.map((n) => (
                  <tr key={n.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-ink whitespace-nowrap">{n.manufacturer}</td>
                    <td className="py-2.5 pr-3 text-muted whitespace-nowrap">{n.category}</td>
                    <td className="py-2.5 pr-3 text-muted whitespace-nowrap">{n.state}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`pill ${STATUS_PILL[n.status]}`}>{n.status}</span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full ${n.complianceScore < 50 ? "bg-bad" : n.complianceScore < 70 ? "bg-warn" : "bg-good"}`}
                            style={{ width: `${n.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-ink">{n.complianceScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Percent size={16} className="text-gt-purple" />
            <h2 className="section-title">
              All Registered Products{selectedState !== "All States" ? ` — ${selectedState}` : ""} ({productRows.length})
            </h2>
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
                <th className="py-2 pr-3">Manufacturer</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">State</th>
                <th className="py-2 pr-3">Star</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 font-medium text-ink whitespace-nowrap">{r.model}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.brand}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.category}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.state}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">{"★".repeat(r.starRating)}</td>
                  <td className="py-2 pr-3">
                    <span className={`pill ${STATUS_PILL[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="py-2 text-muted">{r.complianceScore}</td>
                </tr>
              ))}
              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No products for {selectedState}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
