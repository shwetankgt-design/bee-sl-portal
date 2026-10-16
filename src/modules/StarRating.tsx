import { useState } from "react";
import { Star, FileUp, Sparkles, CheckCircle2 } from "lucide-react";
import { SAMPLE_REPORT, computeStarRating, efficiencyMargin } from "../data/mockData";

export default function StarRating() {
  const [loaded, setLoaded] = useState(false);
  const [energy, setEnergy] = useState(SAMPLE_REPORT.annualEnergyConsumption);

  const stars = computeStarRating(energy);
  const margin = efficiencyMargin(energy);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">AI-Based Star Rating Calculator</h1>
        <p className="subtle">Upload a test lab report and let the engine extract parameters and compute a live BEE star rating.</p>
      </div>

      {!loaded ? (
        <div className="card card-pad text-center py-14">
          <div className="w-14 h-14 mx-auto rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center mb-4">
            <FileUp size={26} />
          </div>
          <h2 className="font-semibold text-ink mb-1">No report loaded yet</h2>
          <p className="subtle mb-5">Load a sample test lab report to extract parameters automatically.</p>
          <button className="btn-primary mx-auto" onClick={() => setLoaded(true)}>
            Load Sample Report
          </button>
        </div>
      ) : (
        <>
          <div className="card card-pad spark-fade">
            <h2 className="section-title mb-3">Extracted Test Parameters</h2>
            <table className="w-full text-sm">
              <tbody>
                <Row label="Product Category" value={SAMPLE_REPORT.productCategory} />
                <Row label="Capacity" value={SAMPLE_REPORT.capacity} />
                <Row label="Annual Energy Consumption" value={`${SAMPLE_REPORT.annualEnergyConsumption} kWh`} />
                <Row label="ISEER Value" value={SAMPLE_REPORT.iseer.toFixed(2)} />
                <Row label="Refrigerant Type" value={SAMPLE_REPORT.refrigerantType} />
                <Row label="Test Lab" value={SAMPLE_REPORT.testLab} />
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card card-pad spark-fade">
              <h2 className="section-title mb-4">Adjust Annual Energy Consumption</h2>
              <input
                type="range"
                min={700}
                max={1500}
                step={5}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-gt-purple"
              />
              <div className="flex justify-between text-xs text-muted mt-1 mb-6">
                <span>700 kWh</span>
                <span className="font-semibold text-ink">{energy} kWh</span>
                <span>1500 kWh</span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={34}
                    className={i <= stars ? "fill-gt-teal text-gt-teal-dark" : "fill-border text-border"}
                  />
                ))}
              </div>
              <div className="text-sm font-semibold text-ink">{stars}-Star Rating</div>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Efficiency margin vs 5-star threshold</span>
                  <span className={margin >= 0 ? "text-good font-semibold" : "text-bad font-semibold"}>
                    {margin >= 0 ? "+" : ""}{margin}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-border overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${margin >= 0 ? "bg-gt-teal" : "bg-warn"}`}
                    style={{ width: `${Math.min(100, Math.max(5, 50 + margin))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card card-pad spark-fade bg-gradient-to-br from-gt-purple/5 to-gt-teal/5 border-gt-purple/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-gt-purple" />
                <h2 className="section-title">AI Validation Panel</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-good mt-0.5 shrink-0" />
                  <span>
                    Model qualifies for <strong>{stars}-star rating</strong> based on submitted Annual Energy
                    Consumption of {energy} kWh.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className={margin >= 0 ? "text-good mt-0.5 shrink-0" : "text-warn mt-0.5 shrink-0"} />
                  <span>
                    Efficiency {margin >= 0 ? "exceeds" : "falls short of"} BEE 5-star threshold by{" "}
                    <strong>{Math.abs(margin)}%</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-good mt-0.5 shrink-0" />
                  <span>ISEER value of {SAMPLE_REPORT.iseer.toFixed(2)} is consistent with declared star band.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-good mt-0.5 shrink-0" />
                  <span>Refrigerant type {SAMPLE_REPORT.refrigerantType} matches low-GWP compliance list.</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gt-purple/10 text-[11px] text-muted">
                AI confidence: <span className="font-semibold text-ink">97.3%</span> — recommendation auto-generated from mock BEE threshold engine.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-2 text-muted w-1/2">{label}</td>
      <td className="py-2 font-medium text-ink">{value}</td>
    </tr>
  );
}
