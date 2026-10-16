// Talk to Data — a lightweight, dependency-free natural-language query engine
// that answers analytics questions by actually filtering/aggregating the live
// REGISTRY (and GLOBAL_MIS) mock dataset at query time. No external NLP lib,
// no backend/LLM call — pure keyword/pattern matching + real computation.

import {
  REGISTRY,
  type RegistryRecord,
  type ApplianceCategory,
  type RecordStatus,
} from "../data/registryData";

export interface T2DTable {
  columns: string[];
  rows: (string | number)[][];
}

export interface T2DAnswer {
  text: string;
  table?: T2DTable;
  suggestions?: string[];
}

// -------------------- small utilities --------------------

function round(n: number, dp = 2) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function pct(part: number, whole: number): number {
  if (whole === 0) return 0;
  return round((part / whole) * 100, 1);
}

// Parse "DD-Mon-YYYY" (e.g. "05-Oct-2026") into a Date.
function parseRegistryDate(s: string): Date | null {
  const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const mon = months[m[2]];
  if (mon === undefined) return null;
  return new Date(Number(m[3]), mon, Number(m[1]));
}

// "Today" inside this mocked dataset for registration-year semantics ("this year").
// All registrations in the dataset are dated 2026.
const T2D_TODAY = new Date(2026, 9, 17); // 17-Oct-2026

// All expiryDate values in the dataset fall in 2027 (labels are valid ~1 year from
// registration), so expiry-window questions are anchored to an early-2027 reference
// point that actually overlaps the dataset's expiry range.
const T2D_EXPIRY_ANCHOR = new Date(2027, 0, 15); // 15-Jan-2027

// -------------------- category / state / manufacturer dictionaries --------------------

const STATES = [
  "Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Delhi",
  "Telangana", "West Bengal", "Haryana", "Rajasthan", "Punjab", "Madhya Pradesh",
];

// States recognizable in free text but not present in this mock dataset's coverage —
// used to answer gracefully ("0 records, not covered by this demo dataset") instead
// of silently ignoring the filter.
const OTHER_INDIAN_STATES = [
  "Kerala", "Bihar", "Odisha", "Assam", "Jharkhand", "Chhattisgarh", "Goa",
  "Uttarakhand", "Himachal Pradesh", "Jammu and Kashmir", "Andhra Pradesh",
  "Chandigarh", "Puducherry",
];

function matchUncoveredState(q: string): string | undefined {
  return OTHER_INDIAN_STATES.find((s) => q.includes(s.toLowerCase()));
}

const MANUFACTURER_BRANDS: { key: string; full: string }[] = [
  { key: "lg", full: "LG Electronics India Pvt. Ltd." },
  { key: "samsung", full: "Samsung India Electronics" },
  { key: "voltas beko", full: "Voltas Beko India" },
  { key: "voltas", full: "Voltas Ltd." },
  { key: "blue star", full: "Blue Star Ltd." },
  { key: "whirlpool", full: "Whirlpool of India Ltd." },
  { key: "godrej", full: "Godrej Appliances" },
  { key: "haier", full: "Haier Appliances India" },
  { key: "daikin", full: "Daikin Airconditioning India" },
  { key: "havells", full: "Havells India Ltd." },
  { key: "crompton", full: "Crompton Greaves Consumer Electricals" },
  { key: "bajaj", full: "Bajaj Electricals Ltd." },
  { key: "orient", full: "Orient Electric Ltd." },
  { key: "panasonic", full: "Panasonic India Pvt. Ltd." },
  { key: "hitachi", full: "Hitachi Cooling & Heating India" },
  { key: "v-guard", full: "V-Guard Industries Ltd." },
  { key: "vguard", full: "V-Guard Industries Ltd." },
  { key: "ifb", full: "IFB Industries Ltd." },
  { key: "lloyd", full: "Lloyd Electric & Engineering" },
  { key: "usha", full: "Usha International Ltd." },
  { key: "symphony", full: "Symphony Ltd." },
];

// Ordered longest-key-first so "ceiling fan" matches before "fan", etc.
const CATEGORY_ALIASES: { keys: string[]; cats: ApplianceCategory[] }[] = [
  { keys: ["inverter ac", "variable speed ac", "inverter a.c"], cats: ["Room AC (Variable Speed/Inverter)"] },
  { keys: ["fixed speed ac"], cats: ["Room AC (Fixed Speed)"] },
  { keys: ["room ac", "air conditioner", " ac ", " acs", "ac models", "ac "], cats: ["Room AC (Fixed Speed)", "Room AC (Variable Speed/Inverter)"] },
  { keys: ["frost free refrigerator", "frost-free refrigerator"], cats: ["Frost Free Refrigerator"] },
  { keys: ["direct cool refrigerator"], cats: ["Direct Cool Refrigerator"] },
  { keys: ["refrigerator", "fridge"], cats: ["Frost Free Refrigerator", "Direct Cool Refrigerator"] },
  { keys: ["ceiling fan"], cats: ["Ceiling Fan"] },
  { keys: ["table fan"], cats: ["Table Fan"] },
  { keys: ["fan"], cats: ["Ceiling Fan", "Table Fan"] },
  { keys: ["washing machine", "washer"], cats: ["Washing Machine"] },
  { keys: ["television", " tv", "tv "], cats: ["Colour Television"] },
  { keys: ["led lamp", "led lamps", "led bulb", " led "], cats: ["LED Lamps"] },
  { keys: ["tubular", "fluorescent"], cats: ["Tubular Fluorescent Lamps"] },
  { keys: ["water heater", "geyser"], cats: ["Stationary Storage Water Heater", "Geyser/Solar Water Heater"] },
  { keys: ["transformer"], cats: ["Distribution Transformer"] },
  { keys: ["microwave"], cats: ["Microwave Oven"] },
  { keys: ["deep freezer"], cats: ["Deep Freezer"] },
  { keys: ["computer", "laptop"], cats: ["Computer/Laptop"] },
];

function matchCategories(q: string): ApplianceCategory[] | undefined {
  const padded = ` ${q} `;
  for (const alias of CATEGORY_ALIASES) {
    if (alias.keys.some((k) => padded.includes(k))) return alias.cats;
  }
  return undefined;
}

function matchStates(q: string): string[] {
  return STATES.filter((s) => q.includes(s.toLowerCase()));
}

function matchManufacturer(q: string): string | undefined {
  for (const b of MANUFACTURER_BRANDS) {
    if (q.includes(b.key)) return b.full;
  }
  return undefined;
}

function matchStatus(q: string): RecordStatus | undefined {
  if (/\bapproved\b/.test(q)) return "Approved";
  if (/\bpending\b/.test(q)) return "Pending";
  if (/\brejected\b/.test(q)) return "Rejected";
  if (/\bflagged\b/.test(q)) return "Flagged";
  return undefined;
}

function matchSeverity(q: string): "High" | "Medium" | "Low" | undefined {
  if (/\bhigh severity|high-severity|severity high|high risk\b/.test(q)) return "High";
  if (/\bmedium severity|medium-severity\b/.test(q)) return "Medium";
  if (/\blow severity|low-severity\b/.test(q)) return "Low";
  return undefined;
}

// Generic "<field> below/under/less than N" / "above/over/greater than N" parser.
function matchThreshold(q: string, fieldPattern: RegExp): { op: "<" | ">" | "="; val: number } | undefined {
  const re = new RegExp(
    fieldPattern.source + String.raw`[^\d]{0,24}?(below|under|less than|<|above|over|greater than|more than|>|of|=|exactly)?\s*(\d+(?:\.\d+)?)`,
    "i"
  );
  const m = re.exec(q);
  if (!m) return undefined;
  const dir = (m[1] || "").toLowerCase();
  const val = Number(m[2]);
  let op: "<" | ">" | "=" = "=";
  if (/below|under|less than|</.test(dir)) op = "<";
  else if (/above|over|greater than|more than|>/.test(dir)) op = ">";
  return { op, val };
}

function matchStarRating(q: string): { op: "<" | ">" | "="; val: number } | undefined {
  // Pattern A: "<dir>? N star" (e.g. "5-star", "below 3 star")
  let m = /(below|under|less than|<|above|over|greater than|more than|>)?\s*(\d)\s*-?\s*star/i.exec(q);
  // Pattern B: "star rating <dir> N" (e.g. "star rating below 3")
  if (!m) {
    m = /star\s*rating[^\d]{0,20}?(below|under|less than|<|above|over|greater than|more than|>)?\s*(\d)/i.exec(q);
  }
  if (!m) return undefined;
  const dir = (m[1] || "").toLowerCase();
  let op: "<" | ">" | "=" = "=";
  if (/below|under|less than|</.test(dir)) op = "<";
  else if (/above|over|greater than|more than|>/.test(dir)) op = ">";
  return { op, val: Number(m[2]) };
}

function matchYear(q: string): number | undefined {
  if (/this year/.test(q)) return T2D_TODAY.getFullYear();
  const m = /\b(20\d{2})\b/.exec(q);
  return m ? Number(m[1]) : undefined;
}

// -------------------- filter model --------------------

interface Filters {
  categories?: ApplianceCategory[];
  states?: string[];
  manufacturer?: string;
  status?: RecordStatus;
  isAnomaly?: boolean;
  severity?: "High" | "Medium" | "Low";
  starOp?: { op: "<" | ">" | "="; val: number };
  iseerOp?: { op: "<" | ">" | "="; val: number };
  complianceOp?: { op: "<" | ">" | "="; val: number };
  year?: number;
}

function parseFilters(q: string): Filters {
  const f: Filters = {};
  const categories = matchCategories(q);
  if (categories) f.categories = categories;
  const states = matchStates(q);
  if (states.length) f.states = states;
  const manufacturer = matchManufacturer(q);
  if (manufacturer) f.manufacturer = manufacturer;

  if (/\banomal(y|ies)|flagged\b/.test(q)) f.isAnomaly = true;
  else {
    const status = matchStatus(q);
    if (status) f.status = status;
  }

  const severity = matchSeverity(q);
  if (severity) f.severity = severity;

  const starOp = matchStarRating(q);
  if (starOp) f.starOp = starOp;

  const iseerOp = matchThreshold(q, /iseer/i);
  if (iseerOp) f.iseerOp = iseerOp;

  const complianceOp = matchThreshold(q, /compliance score/i);
  if (complianceOp) f.complianceOp = complianceOp;

  const year = matchYear(q);
  if (year) f.year = year;

  return f;
}

function applyOp(value: number, op: { op: "<" | ">" | "="; val: number }): boolean {
  if (op.op === "<") return value < op.val;
  if (op.op === ">") return value > op.val;
  return value === op.val;
}

function applyFilters(records: RegistryRecord[], f: Filters): RegistryRecord[] {
  return records.filter((r) => {
    if (f.categories && !f.categories.includes(r.category)) return false;
    if (f.states && f.states.length && !f.states.includes(r.state)) return false;
    if (f.manufacturer && r.manufacturer !== f.manufacturer) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.isAnomaly && !r.isAnomaly) return false;
    if (f.severity && r.anomalySeverity !== f.severity) return false;
    if (f.starOp && !applyOp(r.starRating, f.starOp)) return false;
    if (f.iseerOp && r.metricLabel.toLowerCase() !== "iseer") return false;
    if (f.iseerOp && !applyOp(r.metricValue, f.iseerOp)) return false;
    if (f.complianceOp && !applyOp(r.complianceScore, f.complianceOp)) return false;
    if (f.year) {
      const d = parseRegistryDate(r.registrationDate);
      if (!d || d.getFullYear() !== f.year) return false;
    }
    return true;
  });
}

function describeFilters(f: Filters): string {
  const parts: string[] = [];
  if (f.categories) parts.push(f.categories.length === 1 ? f.categories[0] : f.categories.join(" / "));
  if (f.states?.length) parts.push(`in ${f.states.join(" & ")}`);
  if (f.manufacturer) parts.push(`by ${f.manufacturer}`);
  if (f.status) parts.push(`(${f.status})`);
  if (f.isAnomaly) parts.push("flagged as anomalies");
  if (f.severity) parts.push(`${f.severity} severity`);
  if (f.starOp) parts.push(`star rating ${f.starOp.op === "<" ? "below" : f.starOp.op === ">" ? "above" : "="} ${f.starOp.val}`);
  if (f.iseerOp) parts.push(`ISEER ${f.iseerOp.op === "<" ? "below" : f.iseerOp.op === ">" ? "above" : "="} ${f.iseerOp.val}`);
  if (f.complianceOp) parts.push(`compliance score ${f.complianceOp.op === "<" ? "below" : f.complianceOp.op === ">" ? "above" : "="} ${f.complianceOp.val}`);
  if (f.year) parts.push(`registered in ${f.year}`);
  return parts.length ? parts.join(", ") : "all registered products";
}

// Wraps describeFilters for use after the word "for" — avoids "for in Gujarat"
// by dropping a redundant leading preposition.
function forFilters(f: Filters): string {
  const d = describeFilters(f);
  if (d === "all registered products") return "all registered products";
  return /^(in|by)\s/.test(d) ? d : `products matching ${d}`;
}

// -------------------- sample questions (shown as chips) --------------------

export const SAMPLE_QUESTIONS: string[] = [
  "How many products are currently flagged as anomalies?",
  "Which state has the highest number of registered models?",
  "Show me the top 5 manufacturers by number of registrations",
  "What is the average compliance score in Maharashtra?",
  "How many Room AC models have a star rating below 3?",
  "Which category has the most pending approvals?",
  "List manufacturers with more than 3 flagged models",
  "What is the rejection rate for refrigerators?",
  "Compare registrations between Gujarat and Tamil Nadu",
  "How many certificates are expiring in the next 30 days?",
  "What is the average ISEER for inverter ACs that passed?",
  "Show high severity anomaly cases in Karnataka",
  "Which manufacturer has the best average compliance score?",
  "How many 5-star rated products are registered overall?",
  "What percentage of applications were rejected this year?",
  "How many washing machines are approved in Kerala?",
  "What is the average compliance score for flagged products?",
];

const FALLBACK_SUGGESTIONS = [
  "How many products are currently flagged as anomalies?",
  "Show me the top 5 manufacturers by number of registrations",
  "What is the average compliance score in Maharashtra?",
];

// -------------------- table builders --------------------

function tableFromCounts(label: string, counts: Map<string, number>, limit = 10): T2DTable {
  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, v]) => [k, v] as (string | number)[]);
  return { columns: [label, "Count"], rows };
}

// -------------------- main entry point --------------------

export function runTalkToData(rawQuestion: string): T2DAnswer {
  const q = ` ${rawQuestion.trim().toLowerCase()} `;
  if (!q.trim()) {
    return { text: "Ask me anything about the registry — e.g. flagged products, state/manufacturer rankings, averages, or comparisons.", suggestions: FALLBACK_SUGGESTIONS };
  }

  // ---- 0. State mentioned but not covered by this mock dataset ----
  const uncoveredState = matchUncoveredState(q);
  if (uncoveredState && matchStates(q).length === 0) {
    return {
      text: `This demo registry dataset doesn't include records for **${uncoveredState}** — it currently covers ${STATES.join(", ")}. So the answer is **0** for that state. Try one of the covered states instead:`,
      suggestions: [
        `How many washing machines are approved in Maharashtra?`,
        `What is the average compliance score in Gujarat?`,
        `Which state has the highest number of registered models?`,
      ],
    };
  }

  // ---- 1. Compare two states/categories ----
  if (/\bcompare\b/.test(q)) {
    const states = matchStates(q);
    const categories = matchCategories(q);
    if (states.length >= 2) {
      const rows = states.map((s) => {
        const recs = applyFilters(REGISTRY, { states: [s] });
        return [s, recs.length, pct(recs.filter((r) => r.status === "Approved").length, recs.length), round(avg(recs.map((r) => r.complianceScore)), 1)] as (string | number)[];
      });
      return {
        text: `Comparing registrations across ${states.join(" and ")}:`,
        table: { columns: ["State", "Registrations", "Approval %", "Avg. Compliance Score"], rows },
      };
    }
    if (categories && categories.length >= 1) {
      const rows = categories.map((c) => {
        const recs = applyFilters(REGISTRY, { categories: [c] });
        return [c, recs.length, pct(recs.filter((r) => r.status === "Approved").length, recs.length), round(avg(recs.map((r) => r.complianceScore)), 1)] as (string | number)[];
      });
      return {
        text: `Comparing categories mentioned in your question:`,
        table: { columns: ["Category", "Registrations", "Approval %", "Avg. Compliance Score"], rows },
      };
    }
  }

  // ---- 2. Expiring certificates ----
  const expiringMatch = /expir\w*[^\d]{0,20}?(\d+)\s*days/.exec(q);
  if (expiringMatch || /expiring/.test(q)) {
    const days = expiringMatch ? Number(expiringMatch[1]) : 30;
    const horizon = new Date(T2D_EXPIRY_ANCHOR);
    horizon.setDate(horizon.getDate() + days);
    const recs = REGISTRY.filter((r) => {
      const d = parseRegistryDate(r.expiryDate);
      return d && d >= T2D_EXPIRY_ANCHOR && d <= horizon;
    });
    return {
      text: `**${recs.length} certificates** are expiring in the next **${days} days** (between ${T2D_EXPIRY_ANCHOR.toLocaleDateString("en-GB")} and ${horizon.toLocaleDateString("en-GB")}).`,
      table: recs.length
        ? { columns: ["Certificate", "Manufacturer", "Category", "Expiry"], rows: recs.slice(0, 10).map((r) => [r.certificateId, r.manufacturer, r.category, r.expiryDate]) }
        : undefined,
    };
  }

  // ---- 3. Top N ranking ----
  const topMatch = /top\s*(\d+)/.exec(q);
  if (topMatch) {
    const n = Math.max(1, Math.min(20, Number(topMatch[1])));
    const f = parseFilters(q);
    const filtered = applyFilters(REGISTRY, f);
    const byManufacturer = /manufacturer/.test(q);
    const byState = /state/.test(q) && !byManufacturer;
    const counts = new Map<string, number>();
    for (const r of filtered) {
      const key = byState ? r.state : r.manufacturer;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const table = tableFromCounts(byState ? "State" : "Manufacturer", counts, n);
    return {
      text: `Top ${n} ${byState ? "states" : "manufacturers"} by number of registrations${f.categories || f.states || f.status || f.isAnomaly ? ` (${describeFilters(f)})` : ""}:`,
      table,
    };
  }

  // ---- 4. "which X has the highest/most/lowest/best/worst Y" ----
  const superlative = /which\s+(state|category|manufacturer)\b[\s\S]*?\b(highest|most|lowest|least|best|worst)\b/.exec(q);
  if (superlative) {
    const dim = superlative[1];
    const direction = /highest|most|best/.test(superlative[2]) ? "max" : "min";
    const metricIsCompliance = /compliance/.test(q);
    const metricIsPending = /pending/.test(q);
    const f = parseFilters(q);
    if (metricIsPending) f.status = "Pending";
    const filtered = applyFilters(REGISTRY, f);

    const keyOf = (r: RegistryRecord) => (dim === "state" ? r.state : dim === "manufacturer" ? r.manufacturer : r.category);
    const groups = new Map<string, RegistryRecord[]>();
    for (const r of filtered) {
      const k = keyOf(r);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(r);
    }

    let bestKey = "";
    let bestVal = direction === "max" ? -Infinity : Infinity;
    const rows: (string | number)[][] = [];
    for (const [k, recs] of groups.entries()) {
      const val = metricIsCompliance ? round(avg(recs.map((r) => r.complianceScore)), 1) : recs.length;
      rows.push([k, val]);
      if ((direction === "max" && val > bestVal) || (direction === "min" && val < bestVal)) {
        bestVal = val;
        bestKey = k;
      }
    }
    rows.sort((a, b) => (direction === "max" ? (b[1] as number) - (a[1] as number) : (a[1] as number) - (b[1] as number)));

    const metricLabel = metricIsCompliance ? "average compliance score" : metricIsPending ? "pending approvals" : "number of registrations";
    return {
      text: `**${bestKey}** has the ${superlative[2]} ${metricLabel} — ${bestVal}${metricIsCompliance ? "" : " records"}.`,
      table: { columns: [dim[0].toUpperCase() + dim.slice(1), metricIsCompliance ? "Avg. Compliance Score" : "Count"], rows: rows.slice(0, 10) },
    };
  }

  // ---- 5. "manufacturers with more than N flagged models" (grouped list) ----
  const moreThanGroupMatch = /more than\s*(\d+)[^\n]*?(flagged|anomal\w*)/.exec(q);
  if (moreThanGroupMatch) {
    const n = Number(moreThanGroupMatch[1]);
    const flagged = REGISTRY.filter((r) => r.isAnomaly);
    const counts = new Map<string, number>();
    for (const r of flagged) counts.set(r.manufacturer, (counts.get(r.manufacturer) || 0) + 1);
    const rows = [...counts.entries()].filter(([, c]) => c > n).sort((a, b) => b[1] - a[1]).map(([m, c]) => [m, c] as (string | number)[]);
    return {
      text: rows.length
        ? `**${rows.length} manufacturers** have more than **${n} flagged models**:`
        : `No manufacturers currently have more than ${n} flagged models.`,
      table: rows.length ? { columns: ["Manufacturer", "Flagged Models"], rows } : undefined,
    };
  }

  // ---- 6. Percentage / rate questions ----
  if (/percentage|rate\b|%/.test(q)) {
    const f = parseFilters(q);
    let numeratorStatus: RecordStatus = "Rejected";
    if (/approv/.test(q)) numeratorStatus = "Approved";
    else if (/pending/.test(q)) numeratorStatus = "Pending";
    const base = applyFilters(REGISTRY, f);
    const numerator = base.filter((r) => r.status === numeratorStatus);
    const p = pct(numerator.length, base.length);
    return {
      text: `The **${numeratorStatus.toLowerCase()} rate** for ${forFilters(f)} is **${p}%** (${numerator.length} of ${base.length} applications).`,
    };
  }

  // ---- 7. Average questions ----
  if (/average|avg\b/.test(q)) {
    const f = parseFilters(q);
    if (/\bpass(ed)?\b/.test(q)) f.status = "Approved";
    const filtered = applyFilters(REGISTRY, f);
    const wantsIseer = /iseer/.test(q);
    const value = wantsIseer
      ? round(avg(filtered.filter((r) => r.metricLabel.toLowerCase() === "iseer").map((r) => r.metricValue)), 2)
      : round(avg(filtered.map((r) => r.complianceScore)), 1);
    const n = wantsIseer ? filtered.filter((r) => r.metricLabel.toLowerCase() === "iseer").length : filtered.length;
    if (n === 0) {
      return { text: `I couldn't find any matching records for ${forFilters(f)} to average. Try broadening the question.`, suggestions: FALLBACK_SUGGESTIONS };
    }
    return {
      text: `The **average ${wantsIseer ? "ISEER" : "compliance score"}** for ${forFilters(f)} is **${value}${wantsIseer ? "" : " / 100"}** (across ${n} records).`,
    };
  }

  // ---- 8. "how many 5-star rated products ... overall" and plain counts (incl. compound filters) ----
  if (/how many|count|number of/.test(q)) {
    const f = parseFilters(q);
    if (/5\s*-?\s*star/.test(q) && !f.starOp) f.starOp = { op: "=", val: 5 };
    const filtered = applyFilters(REGISTRY, f);
    return {
      text: `**${filtered.length}** products match: ${describeFilters(f)}.`,
      table: filtered.length >= 3
        ? { columns: ["Certificate", "Manufacturer", "Category", "State", "Status"], rows: filtered.slice(0, 10).map((r) => [r.certificateId, r.manufacturer, r.category, r.state, r.status]) }
        : undefined,
    };
  }

  // ---- 9. "show ... cases" (anomaly listing) ----
  if (/\bshow\b/.test(q) && (/anomaly|anomalies|flagged|cases/.test(q))) {
    const f = parseFilters(q);
    f.isAnomaly = true;
    const filtered = applyFilters(REGISTRY, f);
    return {
      text: `Found **${filtered.length}** anomaly case(s) for ${forFilters(f)}:`,
      table: filtered.length
        ? {
            columns: ["Manufacturer", "Category", "State", "Severity", "Reason"],
            rows: filtered.slice(0, 10).map((r) => [r.manufacturer, r.category, r.state, r.anomalySeverity ?? "-", r.anomalyReason ?? "-"]),
          }
        : undefined,
    };
  }

  // ---- 11. Generic filtered count fallback when question has recognizable filters but no explicit metric keyword ----
  const genericFilters = parseFilters(q);
  const hasAnyFilter = genericFilters.categories || genericFilters.states || genericFilters.manufacturer || genericFilters.status || genericFilters.isAnomaly || genericFilters.severity || genericFilters.starOp || genericFilters.iseerOp || genericFilters.complianceOp;
  if (hasAnyFilter) {
    const filtered = applyFilters(REGISTRY, genericFilters);
    return {
      text: `**${filtered.length}** products match: ${describeFilters(genericFilters)}.`,
      table: filtered.length >= 3
        ? { columns: ["Certificate", "Manufacturer", "Category", "State", "Status"], rows: filtered.slice(0, 10).map((r) => [r.certificateId, r.manufacturer, r.category, r.state, r.status]) }
        : undefined,
    };
  }

  // ---- No confident match ----
  return {
    text: `I couldn't confidently parse that question. I can answer counts, averages, top-N rankings, comparisons and threshold questions over the registry — try one of these:`,
    suggestions: FALLBACK_SUGGESTIONS,
  };
}
