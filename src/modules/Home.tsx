import { Link } from "react-router-dom";
import {
  FileSignature,
  Star,
  QrCode,
  Link2,
  LayoutDashboard,
  MessageCircleQuestion,
  ArrowRight,
  Sparkles,
  ScanLine,
  Camera,
  AlertOctagon,
} from "lucide-react";

const MODULES = [
  {
    to: "/registration",
    icon: FileSignature,
    title: "Manufacturer Registration Portal",
    desc: "Manufacturer login, company onboarding, and product registration with test-lab report upload.",
  },
  {
    to: "/ocr-registration",
    icon: ScanLine,
    title: "OCR Auto-fill",
    desc: "Upload a test lab report and let edge AI auto-extract fields straight into registration.",
  },
  {
    to: "/star-predictor",
    icon: Star,
    title: "Pre-Check Star Predictor",
    desc: "Live, real-time pre-submission star rating and pass/fail eligibility check.",
  },
  {
    to: "/star-rating",
    icon: Star,
    title: "AI-Based Star Rating Calculator",
    desc: "Extracts test parameters and computes a live, adjustable BEE star rating with AI validation.",
  },
  {
    to: "/snap-verify",
    icon: Camera,
    title: "Snap-to-Verify",
    desc: "Scan a product label and cross-check it against the BEE registry for authenticity.",
  },
  {
    to: "/qr-verification",
    icon: QrCode,
    title: "QR Verification Portal",
    desc: "Scannable QR on approved models; simulate a consumer scan to confirm authenticity instantly.",
  },
  {
    to: "/blockchain",
    icon: Link2,
    title: "Blockchain Certificate Verification",
    desc: "Tamper-proof certificate issuance with a simulated chain-of-custody explorer view.",
  },
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    title: "AI-Powered Dashboard",
    desc: "State-wise registrations, quarterly trends, category mix, KPIs and natural-language AI insights.",
  },
  {
    to: "/anomaly-dashboard",
    icon: AlertOctagon,
    title: "Anomaly Detection Dashboard",
    desc: "Officer view of AI-flagged registrations ranked by severity and deviation.",
  },
  {
    to: "/grievance",
    icon: MessageCircleQuestion,
    title: "AI Grievance Assistant",
    desc: "Conversational assistant for manufacturers to track status, raise tickets, and get instant answers.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gt-purple via-gt-purple to-gt-teal-dark text-white p-10 shadow-cardhover">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-gt-teal/30 blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="pill bg-white/15 text-white mb-4">
            <Sparkles size={12} /> BEE Standards &amp; Labelling — RFP Technical Demo
          </span>
          <h1 className="text-3xl font-bold leading-tight mb-3">BEE S&amp;L Smart Compliance Portal</h1>
          <p className="text-white/85 text-sm leading-relaxed max-w-2xl">
            A unified digital platform covering the full Standards &amp; Labelling lifecycle envisioned in the
            BEE RFP scope — Manufacturer Registration, Label Lifecycle Management, QR-based Traceability,
            Grievance Management, MIS &amp; Analytics, Blockchain-backed Certificates, and AI/BI-driven Compliance
            Monitoring — brought together in one consistent, evaluator-ready experience.
          </p>
        </div>
      </div>

      {/* Module cards */}
      <div>
        <h2 className="text-lg font-bold text-ink mb-1">Explore the Modules</h2>
        <p className="subtle mb-4">Click any module below to open its interactive demo.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="card card-pad group hover:shadow-cardhover hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gt-purple/10 to-gt-teal/10 grid place-items-center mb-3 text-gt-purple group-hover:scale-105 transition-transform">
                <m.icon size={20} />
              </div>
              <div className="font-semibold text-sm text-ink mb-1">{m.title}</div>
              <div className="text-xs text-muted leading-relaxed mb-3">{m.desc}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gt-teal-dark">
                Open module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
