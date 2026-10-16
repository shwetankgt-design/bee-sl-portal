import { useMemo, useState } from "react";
import { Star, Sparkles, CheckCircle2, FileSearch, X } from "lucide-react";
import { CATEGORY_METRICS, APPLIANCE_CATEGORIES, predictStars, gapToFiveStar, type ApplianceCategory } from "../data/registryData";

interface SampleCard {
  id: string;
  brand: string;
  model: string;
  category: ApplianceCategory;
  capacity: string;
  value: number;
  testLab: string;
}

const SAMPLE_CARDS: SampleCard[] = [
  {
    id: "s1",
    brand: "Voltas",
    model: "VLT-AC-1.5T-INV-26",
    category: "Room AC (Variable Speed/Inverter)",
    capacity: "1.5 Ton",
    value: 4.35,
    testLab: "NABL-Accredited Lab, Noida",
  },
  {
    id: "s2",
    brand: "Godrej",
    model: "GDJ-FF-320-26",
    category: "Frost Free Refrigerator",
    capacity: "320L",
    value: 285,
    testLab: "NABL-Accredited Lab, Chennai",
  },
  {
    id: "s3",
    brand: "Havells",
    model: "HVL-CF-1200-BLDC",
    category: "Ceiling Fan",
    capacity: "1200mm BLDC",
    value: 6.8,
    testLab: "NABL-Accredited Lab, Bengaluru",
  },
  {
    id: "s4",
    brand: "IFB",
    model: "IFB-WM-7KG-FL-26",
    category: "Washing Machine",
    capacity: "7 kg Front Load",
    value: 1.05,
    testLab: "NABL-Accredited Lab, Pune",
  },
  {
    id: "s5",
    brand: "Crompton",
    model: "CGL-LED-9W-26",
    category: "LED Lamps",
    capacity: "9W",
    value: 112,
    testLab: "NABL-Accredited Lab, Chennai",
  },
  {
    id: "s6",
    brand: "Samsung",
    model: "SAM-AC-1.5T-FX-26",
    category: "Room AC (Fixed Speed)",
    capacity: "1.5 Ton",
    value: 3.5,
    testLab: "ERTL (North), New Delhi",
  },
];

export default function StarRating() {
  const [category, setCategory] = useState<ApplianceCategory>("Room AC (Variable Speed/Inverter)");
  const def = CATEGORY_METRICS[category];
  const [value, setValue] = useState<number>(() => {
    const d = CATEGORY_METRICS["Room AC (Variable Speed/Inverter)"];
    return Number(((d.min + d.max) / 2).toFixed(2));
  });
  const [showSamples, setShowSamples] = useState(false);
  const [activeSample, setActiveSample] = useState<string | null>(null);

  const { stars } = predictStars(category, value);
  const gapNote = useMemo(() => gapToFiveStar(category, value), [category, value]);

  function changeCategory(c: ApplianceCategory) {
    setCategory(c);
    const d = CATEGORY_METRICS[c];
    setValue(Number(((d.min + d.max) / 2).toFixed(2)));
    setActiveSample(null);
  }

  function loadSample(s: SampleCard) {
    setCategory(s.category);
    setValue(s.value);
    setActiveSample(s.id);
    setShowSamples(false);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">AI-Based Star Rating Calculator</h1>
          <p className="subtle">Pick an appliance category, adjust the test parameter, and see the BEE star rating update live.</p>
        </div>
        <button className="btn-ghost shrink-0" onClick={() => setShowSamples(true)}>
          <FileSearch size={15} /> Load Sample Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator is visible and interactive immediately — no gating. */}
        <div className="card card-pad spark-fade">
          <h2 className="section-title mb-4">Interactive Calculator</h2>

          <label className="label">Appliance Category</label>
          <select
            className="input mb-5"
            value={category}
            onChange={(e) => changeCategory(e.target.value as ApplianceCategory)}
          >
            {APPLIANCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="label">
            {def.metricLabel} {def.unit ? `(${def.unit})` : ""}
          </label>
          <input
            type="range"
            min={def.min}
            max={def.max}
            step={def.step}
            value={value}
            onChange={(e) => {
              setValue(Number(e.target.value));
              setActiveSample(null);
            }}
            className="w-full accent-gt-purple"
          />
          <div className="flex justify-between text-xs text-muted mt-1 mb-6">
            <span>{def.min}</span>
            <span className="font-semibold text-ink">
              {value} {def.unit}
            </span>
            <span>{def.max}</span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={34} className={i <= stars ? "fill-gt-teal text-gt-teal-dark" : "fill-border text-border"} />
            ))}
          </div>
          <div className="text-sm font-semibold text-ink">{stars > 0 ? `${stars}-Star Rating` : "Below 1-Star Threshold"}</div>

          <div className="mt-5 text-xs text-muted leading-relaxed">{gapNote}</div>

          {activeSample && (
            <div className="mt-4 pill bg-gt-purple/10 text-gt-purple w-fit">
              <CheckCircle2 size={12} /> Loaded from sample: {SAMPLE_CARDS.find((s) => s.id === activeSample)?.brand}{" "}
              {SAMPLE_CARDS.find((s) => s.id === activeSample)?.model}
            </div>
          )}
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
                <strong>{category}</strong> qualifies for <strong>{stars > 0 ? `${stars}-star` : "no-star"} rating</strong> based on a{" "}
                {def.metricLabel.toLowerCase()} of {value} {def.unit}.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-good mt-0.5 shrink-0" />
              <span>{gapNote}</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-good mt-0.5 shrink-0" />
              <span>
                Threshold direction: {def.higherIsBetter ? "higher values are better" : "lower values are better"} for this category.
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gt-purple/10 text-[11px] text-muted">
            AI confidence: <span className="font-semibold text-ink">97.3%</span> — recommendation auto-generated from mock BEE threshold engine.
          </div>
        </div>
      </div>

      {showSamples && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSamples(false)} />
          <div className="relative bg-white rounded-xl shadow-cardhover max-w-3xl w-full max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Load a Sample Test Report</h2>
              <button
                onClick={() => setShowSamples(false)}
                className="w-8 h-8 rounded-full grid place-items-center text-muted hover:bg-surface"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_CARDS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSample(s)}
                  className="text-left rounded-lg border border-border hover:border-gt-purple-light hover:shadow-card transition-all p-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gt-teal/10 text-gt-teal-dark grid place-items-center mb-2">
                    <FileSearch size={15} />
                  </div>
                  <div className="text-sm font-semibold text-ink mb-0.5">
                    {s.brand} {s.model}
                  </div>
                  <div className="text-xs text-muted">{s.category} &middot; {s.capacity}</div>
                  <div className="text-[11px] text-muted mt-1">{s.testLab}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
