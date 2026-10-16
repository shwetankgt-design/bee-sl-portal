import { useEffect, useState } from "react";
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
import { Sparkles, TrendingUp, TrendingDown, Factory, Boxes, Clock, Tags, RefreshCw, XCircle } from "lucide-react";
import { STATE_REGISTRATIONS, QUARTERLY_TREND, CATEGORY_SPLIT, CATEGORY_COLORS, KPI_TILES, AI_INSIGHTS } from "../data/mockData";

const ICONS = [Factory, Boxes, Clock, Tags, RefreshCw, XCircle];

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

function KpiTile({ label, value, trend, up, Icon }: { label: string; value: number; trend: number; up: boolean; Icon: typeof Factory }) {
  const animated = useCountUp(value);
  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center">
          <Icon size={16} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-good" : "text-bad"}`}>
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(trend)}%
        </span>
      </div>
      <div className="text-2xl font-bold text-ink">{animated.toLocaleString()}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">AI-Powered Dashboard</h1>
        <p className="subtle">Live MIS &amp; analytics across the BEE S&amp;L registration lifecycle.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_TILES.map((k, i) => (
          <KpiTile key={k.label} {...k} Icon={ICONS[i]} />
        ))}
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
          <h2 className="section-title mb-3">State-wise Registrations</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={STATE_REGISTRATIONS} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2F0" vertical={false} />
              <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#6B6478" }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6478" }} />
              <Tooltip />
              <Bar dataKey="registrations" fill="#4E2A84" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad">
          <h2 className="section-title mb-3">Quarterly Registration Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={QUARTERLY_TREND} margin={{ left: -10 }}>
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
          <h2 className="section-title mb-3">Top Appliance Categories</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={2}>
                {CATEGORY_SPLIT.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
