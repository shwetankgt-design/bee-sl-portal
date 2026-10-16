import { useMemo, useState } from "react";
import { Globe2, TrendingUp, BadgeCheck, Zap, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import { GLOBAL_MIS, COUNTRIES, COUNTRY_SCHEMES } from "../data/registryData";

const COUNTRY_COLORS: Record<string, string> = {
  USA: "#4E2A84",
  "European Union": "#00A9A5",
  China: "#D97706",
  Japan: "#7B5AA6",
  Australia: "#4FC7C3",
  "United Kingdom": "#16A34A",
};

const PAGE_SIZE = 10;

export default function GlobalMis() {
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (countryFilter === "All Countries" ? GLOBAL_MIS : GLOBAL_MIS.filter((r) => r.country === countryFilter)),
    [countryFilter]
  );

  const countryBars = useMemo(() => {
    return COUNTRIES.map((c) => {
      const rows = GLOBAL_MIS.filter((r) => r.country === c);
      const avgAdoption = Math.round(rows.reduce((s, r) => s + r.adoptionRatePct, 0) / Math.max(1, rows.length));
      const totalSavings = Math.round(rows.reduce((s, r) => s + r.energySavingsGwh, 0));
      const certified = rows.reduce((s, r) => s + r.certifiedProducts, 0);
      return { country: c, avgAdoption, totalSavings, certified };
    });
  }, []);

  const yearTrend = useMemo(() => {
    const years = [2023, 2024, 2025, 2026];
    return years.map((y) => {
      const row: Record<string, number | string> = { year: y };
      COUNTRIES.forEach((c) => {
        const rows = GLOBAL_MIS.filter((r) => r.country === c && r.year === y);
        row[c] = Math.round(rows.reduce((s, r) => s + r.energySavingsGwh, 0));
      });
      return row;
    });
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const globalAvgAdoption = Math.round(GLOBAL_MIS.reduce((s, r) => s + r.adoptionRatePct, 0) / GLOBAL_MIS.length);
  const globalSavings = Math.round(GLOBAL_MIS.reduce((s, r) => s + r.energySavingsGwh, 0));
  const globalCertified = GLOBAL_MIS.reduce((s, r) => s + r.certifiedProducts, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">International MIS Dashboard</h1>
          <p className="subtle">Comparative view of energy labelling programs in other countries, benchmarked against BEE S&amp;L.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 w-full sm:w-auto">
          <Filter size={15} className="text-gt-purple shrink-0" />
          <select
            className="text-sm font-medium text-ink bg-transparent focus:outline-none cursor-pointer w-full"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setPage(0);
            }}
          >
            <option>All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card card-pad">
          <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
            <Globe2 size={16} />
          </div>
          <div className="text-2xl font-bold text-ink">{COUNTRIES.length}</div>
          <div className="text-xs text-muted mt-0.5">Countries / Schemes Tracked</div>
        </div>
        <div className="card card-pad">
          <div className="w-8 h-8 rounded-lg bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-2">
            <BadgeCheck size={16} />
          </div>
          <div className="text-2xl font-bold text-ink">{globalAvgAdoption}%</div>
          <div className="text-xs text-muted mt-0.5">Avg. Adoption Rate</div>
        </div>
        <div className="card card-pad">
          <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
            <Zap size={16} />
          </div>
          <div className="text-2xl font-bold text-ink">{globalSavings.toLocaleString()}</div>
          <div className="text-xs text-muted mt-0.5">Total Energy Savings (GWh/yr)</div>
        </div>
        <div className="card card-pad">
          <div className="w-8 h-8 rounded-lg bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-2">
            <TrendingUp size={16} />
          </div>
          <div className="text-2xl font-bold text-ink">{globalCertified.toLocaleString()}</div>
          <div className="text-xs text-muted mt-0.5">Certified Products (all schemes)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-pad">
          <h2 className="section-title mb-3">Adoption Rate by Country (%)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={countryBars} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2F0" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 10, fill: "#6B6478" }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
              <Tooltip />
              <Bar dataKey="avgAdoption" radius={[6, 6, 0, 0]}>
                {countryBars.map((c) => (
                  <Cell key={c.country} fill={COUNTRY_COLORS[c.country]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad">
          <h2 className="section-title mb-3">Energy Savings Trend by Country (GWh/yr)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yearTrend} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2F0" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B6478" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {COUNTRIES.map((c) => (
                <Line key={c} type="monotone" dataKey={c} stroke={COUNTRY_COLORS[c]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="section-title">
            Certified Products by Scheme {countryFilter !== "All Countries" ? `— ${countryFilter}` : ""} ({filtered.length})
          </h2>
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
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] text-muted border-b border-border">
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 pr-3">Scheme</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Manufacturer</th>
                <th className="py-2 pr-3">Adoption %</th>
                <th className="py-2 pr-3">Savings (GWh)</th>
                <th className="py-2 pr-3">Certified Products</th>
                <th className="py-2">YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 font-medium text-ink whitespace-nowrap">{r.productModel}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.country}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{COUNTRY_SCHEMES[r.country]}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.category}</td>
                  <td className="py-2 pr-3 text-muted whitespace-nowrap">{r.manufacturer}</td>
                  <td className="py-2 pr-3">{r.adoptionRatePct}%</td>
                  <td className="py-2 pr-3">{r.energySavingsGwh}</td>
                  <td className="py-2 pr-3">{r.certifiedProducts.toLocaleString()}</td>
                  <td className={`py-2 font-semibold ${r.yoyGrowthPct >= 0 ? "text-good" : "text-bad"}`}>
                    {r.yoyGrowthPct >= 0 ? "+" : ""}
                    {r.yoyGrowthPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
