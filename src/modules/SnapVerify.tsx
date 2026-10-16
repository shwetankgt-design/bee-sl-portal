import { useState } from "react";
import { Camera, ScanLine, CheckCircle2, AlertTriangle, XCircle, Flag, RotateCcw } from "lucide-react";
import { SCAN_SCENARIOS, type ScanScenario } from "../data/registryData";

type Stage = "pick" | "scanning" | "result";

const SCAN_STEPS = ["Analyzing label", "Cross-checking registry", "Verifying star rating"];

export default function SnapVerify() {
  const [stage, setStage] = useState<Stage>("pick");
  const [scenario, setScenario] = useState<ScanScenario | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [reported, setReported] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  function startScan(s: ScanScenario) {
    setScenario(s);
    setStage("scanning");
    setStepIdx(0);
    setReported(false);
    setTicketId(null);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStepIdx(i);
      if (i >= SCAN_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setStage("result"), 400);
      }
    }, 600);
  }

  function reportProduct() {
    setTicketId(`GRV-CF-${1000 + Math.floor(Math.random() * 900)}`);
    setReported(true);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Snap-to-Verify</h1>
        <p className="subtle">Scan a product label to instantly cross-check it against the official BEE registry.</p>
      </div>

      {stage === "pick" && (
        <div className="card card-pad space-y-5">
          <div className="border-2 border-dashed border-gt-teal/30 rounded-xl py-10 text-center bg-gt-teal/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-3">
              <Camera size={26} />
            </div>
            <div className="font-semibold text-ink mb-1">Camera viewfinder (mock)</div>
            <div className="text-xs text-muted">Pick a sample product below to simulate a scan</div>
          </div>
          <div>
            <h2 className="section-title mb-3">Sample Scan Scenarios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCAN_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startScan(s)}
                  className="text-left rounded-lg border border-border hover:border-gt-teal hover:shadow-card transition-all p-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-2">
                    <ScanLine size={15} />
                  </div>
                  <div className="text-sm font-semibold text-ink mb-0.5">{s.label}</div>
                  <div className="text-xs text-muted">{s.productImageLabel}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "scanning" && scenario && (
        <div className="card card-pad text-center py-14 spark-fade">
          <div className="w-16 h-16 mx-auto rounded-full bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-4 pulse-soft">
            <ScanLine size={28} />
          </div>
          <h2 className="font-semibold text-ink mb-1">Analyzing {scenario.label}...</h2>
          <p className="subtle mb-6">On-device AI is reading the label and checking the registry.</p>
          <div className="max-w-xs mx-auto space-y-2.5">
            {SCAN_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2.5 text-sm">
                {i < stepIdx ? (
                  <CheckCircle2 size={16} className="text-good shrink-0" />
                ) : i === stepIdx ? (
                  <span className="w-4 h-4 rounded-full border-2 border-gt-teal-dark border-t-transparent animate-spin shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                )}
                <span className={i <= stepIdx ? "text-ink font-medium" : "text-muted"}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === "result" && scenario && (
        <div className="space-y-6 spark-fade">
          {scenario.outcome === "authentic" && (
            <div className="card card-pad bg-gradient-to-br from-good/5 to-gt-teal/5 border-good/20">
              <div className="flex items-center gap-2 text-good font-semibold text-base mb-3">
                <CheckCircle2 size={20} /> Authentic — matches official BEE registry
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Brand" value={scenario.scannedBrand} />
                <Field label="Model" value={scenario.scannedModel} />
                <Field label="Star Rating" value={`${scenario.scannedStars}★`} />
                <Field label="Certificate ID" value={scenario.matchedRecord?.certificateId ?? "—"} />
                <Field label="Category" value={scenario.matchedRecord?.category ?? "—"} />
                <Field label="Status" value={scenario.matchedRecord?.status ?? "Approved"} />
              </div>
            </div>
          )}

          {scenario.outcome === "mismatch" && (
            <div className="card card-pad bg-gradient-to-br from-warn/5 to-bad/5 border-warn/30">
              <div className="flex items-center gap-2 text-warn font-semibold text-base mb-3">
                <AlertTriangle size={20} /> Mismatch Detected — Suspected Discrepancy
              </div>
              <p className="text-sm text-ink mb-3">{scenario.reason}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Scanned Brand" value={scenario.scannedBrand} />
                <Field label="Scanned Model" value={scenario.scannedModel} />
                <Field label="Label Claims" value={`${scenario.scannedStars}★`} />
                <Field label="Registry Record" value={`${scenario.matchedRecord?.starRating ?? "?"}★`} />
              </div>
            </div>
          )}

          {scenario.outcome === "not-found" && (
            <div className="card card-pad bg-gradient-to-br from-bad/5 to-warn/5 border-bad/30">
              <div className="flex items-center gap-2 text-bad font-semibold text-base mb-3">
                <XCircle size={20} /> Suspected Counterfeit — No Registry Match
              </div>
              <p className="text-sm text-ink mb-3">{scenario.reason}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Scanned Brand" value={scenario.scannedBrand} />
                <Field label="Scanned Model" value={scenario.scannedModel} />
              </div>
            </div>
          )}

          {scenario.outcome !== "authentic" && (
            <div className="flex items-center justify-end gap-3">
              {!reported ? (
                <button className="btn bg-bad text-white hover:bg-bad/90" onClick={reportProduct}>
                  <Flag size={15} /> Report this product
                </button>
              ) : (
                <span className="pill bg-good/10 text-good">
                  <CheckCircle2 size={13} /> Grievance ticket #{ticketId} created
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button className="btn-ghost" onClick={() => { setStage("pick"); setScenario(null); }}>
              <RotateCcw size={14} /> Scan Another Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/70 rounded-lg px-3 py-2 border border-border/60">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}
