import { Link } from "react-router-dom";
import { FileSignature, ScanLine, Star, Link2, MessageCircleQuestion, ArrowRight, Factory, Boxes, Clock, RefreshCw } from "lucide-react";
import { TRACKED_APPLICATIONS, KPI_TILES } from "../../data/mockData";
import { useLanguage } from "../../context/LanguageContext";

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
};

export default function ManufacturerDashboard() {
  const { t } = useLanguage();
  const myApps = TRACKED_APPLICATIONS;
  const approved = myApps.filter((a) => a.status === "Approved").length;
  const pending = myApps.filter((a) => a.status === "Under Review" || a.status === "Submitted").length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gt-purple via-gt-purple to-gt-teal-dark text-white p-8 shadow-cardhover">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <h1 className="text-2xl font-bold mb-1">Manufacturer Dashboard</h1>
        <p className="text-white/85 text-sm max-w-2xl">
          Track applications, auto-fill submissions from test lab reports, and pre-check star ratings before you file.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile icon={Boxes} label={t("kpi.myApplications")} value={myApps.length} />
        <StatTile icon={Factory} label={t("kpi.approvedModels")} value={approved} />
        <StatTile icon={Clock} label="Under Review" value={pending} />
        <StatTile icon={RefreshCw} label={t("kpi.pendingRenewals")} value={KPI_TILES[4].value} />
      </div>

      <div className="card card-pad">
        <h2 className="section-title mb-3">My Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                  <td className="py-2.5 pr-3 font-medium text-ink">{a.id}</td>
                  <td className="py-2.5 pr-3 text-muted">{a.product}</td>
                  <td className="py-2.5 pr-3 text-muted">{a.category}</td>
                  <td className="py-2.5 pr-3 text-muted">{a.submitted}</td>
                  <td className="py-2.5">
                    <span className={`pill ${STATUS_TONE[a.status]}`}>{a.status}</span>
                  </td>
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

function StatTile({ icon: Icon, label, value }: { icon: typeof Factory; label: string; value: number }) {
  return (
    <div className="card card-pad">
      <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
        <Icon size={16} />
      </div>
      <div className="text-2xl font-bold text-ink">{value.toLocaleString()}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}
