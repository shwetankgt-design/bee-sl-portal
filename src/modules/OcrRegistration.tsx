import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, ScanLine, CheckCircle2, FileSearch, Table2, Sparkles, ArrowRight } from "lucide-react";
import { OCR_SAMPLE_REPORTS, type OcrSampleReport } from "../data/registryData";

type Stage = "pick" | "scanning" | "result";

const SCAN_STEPS = ["Detecting document type", "Reading tables", "Extracting values"];

interface FieldRow {
  label: string;
  value: string;
  confidence: number;
}

function buildFields(report: OcrSampleReport): FieldRow[] {
  const rows: FieldRow[] = [
    { label: "Brand", value: report.brand, confidence: 98 },
    { label: "Model", value: report.model, confidence: 95 },
    { label: "Category", value: report.category, confidence: 97 },
    { label: "Capacity", value: report.capacity, confidence: 93 },
  ];
  if (report.annualEnergyConsumption !== undefined) {
    rows.push({ label: "Annual Energy Consumption (kWh)", value: String(report.annualEnergyConsumption), confidence: 96 });
  }
  if (report.iseer !== undefined) {
    rows.push({ label: "ISEER Value", value: report.iseer.toFixed(2), confidence: 94 });
  }
  rows.push({ label: "Test Lab Name", value: report.testLab, confidence: 99 });
  rows.push({ label: "Report Date", value: report.reportDate, confidence: 97 });
  return rows;
}

export default function OcrRegistration() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("pick");
  const [report, setReport] = useState<OcrSampleReport | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [fields, setFields] = useState<FieldRow[]>([]);

  function startScan(r: OcrSampleReport) {
    setReport(r);
    setStage("scanning");
    setStepIdx(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStepIdx(i);
      if (i >= SCAN_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setFields(buildFields(r));
          setStage("result");
        }, 400);
      }
    }, 650);
  }

  function updateField(idx: number, value: string) {
    setFields((f) => f.map((row, i) => (i === idx ? { ...row, value } : row)));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">OCR Auto-fill</h1>
        <p className="subtle">Upload a test lab report and let edge AI extract fields automatically, ready to confirm into Registration.</p>
      </div>

      {stage === "pick" && (
        <div className="card card-pad space-y-5">
          <div className="border-2 border-dashed border-gt-purple/30 rounded-xl py-10 text-center bg-gt-purple/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center mb-3">
              <FileUp size={26} />
            </div>
            <div className="font-semibold text-ink mb-1">Drop a test lab report here</div>
            <div className="text-xs text-muted">or pick one of the sample reports below to simulate an upload</div>
          </div>
          <div>
            <h2 className="section-title mb-3">Load Sample Report</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OCR_SAMPLE_REPORTS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => startScan(r)}
                  className="text-left rounded-lg border border-border hover:border-gt-purple-light hover:shadow-card transition-all p-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-2">
                    <FileSearch size={15} />
                  </div>
                  <div className="text-sm font-semibold text-ink mb-0.5">{r.label}</div>
                  <div className="text-xs text-muted">{r.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === "scanning" && report && (
        <div className="card card-pad text-center py-14 spark-fade">
          <div className="w-16 h-16 mx-auto rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center mb-4 pulse-soft">
            <ScanLine size={28} />
          </div>
          <h2 className="font-semibold text-ink mb-1">Scanning {report.label}...</h2>
          <p className="subtle mb-6">On-device AI is extracting structured fields from the document.</p>
          <div className="max-w-xs mx-auto space-y-2.5">
            {SCAN_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2.5 text-sm">
                {i < stepIdx ? (
                  <CheckCircle2 size={16} className="text-good shrink-0" />
                ) : i === stepIdx ? (
                  <span className="w-4 h-4 rounded-full border-2 border-gt-purple border-t-transparent animate-spin shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                )}
                <span className={i <= stepIdx ? "text-ink font-medium" : "text-muted"}>{s}</span>
              </div>
            ))}
          </div>
          <div className="max-w-xs mx-auto mt-6 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-gt-purple transition-all duration-500"
              style={{ width: `${(stepIdx / SCAN_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {stage === "result" && report && (
        <div className="space-y-6 spark-fade">
          <div className="card card-pad bg-gradient-to-br from-good/5 to-gt-teal/5 border-good/20">
            <div className="flex items-center gap-2 text-good font-semibold text-sm">
              <CheckCircle2 size={16} /> Document scanned successfully — fields extracted with high confidence
            </div>
          </div>

          <div className="card card-pad">
            <div className="flex items-center gap-2 mb-4">
              <Table2 size={16} className="text-gt-purple" />
              <h2 className="section-title">Auto-filled Fields — review &amp; edit before confirming</h2>
            </div>
            <div className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.label} className="grid grid-cols-[1fr_1.4fr_auto] items-center gap-3">
                  <label className="text-xs text-muted">{f.label}</label>
                  <input className="input" value={f.value} onChange={(e) => updateField(i, e.target.value)} />
                  <span className="pill bg-good/10 text-good whitespace-nowrap">
                    <CheckCircle2 size={11} /> {f.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad bg-gradient-to-br from-gt-purple/5 to-gt-teal/5 border-gt-purple/20 flex items-center gap-3">
            <Sparkles size={18} className="text-gt-purple shrink-0" />
            <div className="text-xs text-muted flex-1">
              Edge AI confidence for this extraction: <span className="font-semibold text-ink">96.4%</span>. All fields are editable above before you continue.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="btn-ghost" onClick={() => { setStage("pick"); setReport(null); }}>
              Try Another Report
            </button>
            <button className="btn-primary" onClick={() => navigate("/registration")}>
              Confirm &amp; Continue to Registration <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
