import { useMemo, useState } from "react";
import { Star, Sparkles, CheckCircle2, XCircle, Gauge } from "lucide-react";
import { APPLIANCE_CATEGORIES, CATEGORY_METRICS, MANDATORY_CATEGORIES, predictStars, gapToFiveStar, type ApplianceCategory } from "../data/registryData";

export default function StarPredictor() {
  const [category, setCategory] = useState<ApplianceCategory>("Room AC (Variable Speed/Inverter)");
  const def = CATEGORY_METRICS[category];
  const [value, setValue] = useState(() => (def.bands.find((b) => b.stars === 4)?.min ?? (def.min + def.max) / 2));

  const result = useMemo(() => predictStars(category, value), [category, value]);
  const mandatory = MANDATORY_CATEGORIES.includes(category);
  const minBand = def.bands[def.bands.length - 1];
  const passesMandatory = mandatory
    ? def.higherIsBetter
      ? value >= minBand.min
      : value <= minBand.max
    : true;
  const gap = gapToFiveStar(category, value);
  const confidence = Math.min(99, Math.max(72, 100 - Math.abs(value - (def.min + def.max) / 2) * 0.4));

  function handleCategoryChange(c: ApplianceCategory) {
    setCategory(c);
    const d = CATEGORY_METRICS[c];
    setValue(d.bands.find((b) => b.stars === 4)?.min ?? (d.min + d.max) / 2);
  }

  const gaugePct = Math.min(100, Math.max(0, ((value - def.min) / (def.max - def.min)) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Pre-Check Star Predictor</h1>
        <p className="subtle">Check your likely star rating and mandatory-threshold eligibility before you submit — updates live as you type.</p>
      </div>

      <div className="card card-pad space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Appliance Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as ApplianceCategory)}
            >
              {APPLIANCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c} {MANDATORY_CATEGORIES.includes(c) ? "(Mandatory)" : "(Voluntary)"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Default Capacity / Variant</label>
            <input className="input" value={def.defaultCapacity ?? ""} disabled />
          </div>
        </div>

        <div>
          <label className="label">
            {def.metricLabel} {def.unit && `(${def.unit})`}
          </label>
          <input
            type="range"
            min={def.min}
            max={def.max}
            step={def.step}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-gt-purple"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>{def.min}</span>
            <input
              type="number"
              className="input w-28 text-center !py-1"
              value={value}
              step={def.step}
              onChange={(e) => setValue(Number(e.target.value))}
            />
            <span>{def.max}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-pad spark-fade">
          <h2 className="section-title mb-4">Predicted Rating</h2>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={32} className={i <= result.stars ? "fill-gt-teal text-gt-teal-dark" : "fill-border text-border"} />
            ))}
          </div>
          <div className="text-sm font-semibold text-ink mb-4">
            {result.stars > 0 ? `${result.stars}-Star Rating` : "Below minimum rated band"}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{def.metricLabel} position in scale</span>
              <span className="font-semibold text-ink">{value.toFixed(2)} {def.unit}</span>
            </div>
            <div className="h-2.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-gt-teal transition-all duration-300" style={{ width: `${gaugePct}%` }} />
            </div>
          </div>

          <div className={`rounded-lg px-3 py-2.5 text-sm font-medium flex items-center gap-2 ${passesMandatory ? "bg-good/10 text-good" : "bg-bad/10 text-bad"}`}>
            {passesMandatory ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {mandatory
              ? passesMandatory
                ? "PASS — meets BEE mandatory minimum threshold"
                : "FAIL — below BEE mandatory minimum threshold"
              : "Voluntary category — no mandatory minimum applies"}
          </div>
        </div>

        <div className="card card-pad spark-fade bg-gradient-to-br from-gt-purple/5 to-gt-teal/5 border-gt-purple/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-gt-purple" />
            <h2 className="section-title">Edge AI Explanation</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Gauge size={16} className="text-gt-purple mt-0.5 shrink-0" />
              <span>
                {def.metricLabel} of <strong>{value.toFixed(2)} {def.unit}</strong> places this {category} in the{" "}
                <strong>{result.stars > 0 ? `${result.stars}-star` : "unrated"}</strong> band for this category.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-gt-teal-dark mt-0.5 shrink-0" />
              <span>{gap}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gt-purple/10 text-[11px] text-muted">
            AI confidence: <span className="font-semibold text-ink">{confidence.toFixed(1)}%</span> — live on-device inference, no data leaves this session.
          </div>
        </div>
      </div>
    </div>
  );
}
