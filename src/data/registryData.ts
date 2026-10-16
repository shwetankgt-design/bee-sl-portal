// All data below is mocked/simulated for demo purposes only — no real backend/API calls.
// Programmatically generated but deterministic (seeded) so values stay stable across renders.

export type ApplianceCategory =
  | "Frost Free Refrigerator"
  | "Direct Cool Refrigerator"
  | "Room AC (Fixed Speed)"
  | "Room AC (Variable Speed/Inverter)"
  | "Ceiling Fan"
  | "Table Fan"
  | "Colour Television"
  | "LED Lamps"
  | "Tubular Fluorescent Lamps"
  | "Stationary Storage Water Heater"
  | "Distribution Transformer"
  | "Washing Machine"
  | "Microwave Oven"
  | "Deep Freezer"
  | "Geyser/Solar Water Heater"
  | "Computer/Laptop";

export const APPLIANCE_CATEGORIES: ApplianceCategory[] = [
  "Frost Free Refrigerator",
  "Direct Cool Refrigerator",
  "Room AC (Fixed Speed)",
  "Room AC (Variable Speed/Inverter)",
  "Ceiling Fan",
  "Table Fan",
  "Colour Television",
  "LED Lamps",
  "Tubular Fluorescent Lamps",
  "Stationary Storage Water Heater",
  "Distribution Transformer",
  "Washing Machine",
  "Microwave Oven",
  "Deep Freezer",
  "Geyser/Solar Water Heater",
  "Computer/Laptop",
];

export const MANDATORY_CATEGORIES: ApplianceCategory[] = [
  "Frost Free Refrigerator",
  "Direct Cool Refrigerator",
  "Room AC (Fixed Speed)",
  "Room AC (Variable Speed/Inverter)",
  "Ceiling Fan",
  "Colour Television",
  "LED Lamps",
  "Tubular Fluorescent Lamps",
  "Stationary Storage Water Heater",
  "Distribution Transformer",
  "Washing Machine",
];

// Thresholds extend chatbotData's CATEGORY_THRESHOLDS idea, keyed by category,
// giving per-category pre-check metrics used by the Star Predictor.
export interface CategoryMetricDef {
  metric: "iseer" | "kwh" | "serviceValue" | "lm_per_watt" | "standingLoss" | "energyFactor";
  metricLabel: string;
  unit: string;
  higherIsBetter: boolean;
  bands: { stars: number; min: number; max: number }[]; // inclusive range for this metric
  min: number;
  max: number;
  step: number;
  defaultCapacity?: string;
}

export const CATEGORY_METRICS: Record<ApplianceCategory, CategoryMetricDef> = {
  "Room AC (Variable Speed/Inverter)": {
    metric: "iseer",
    metricLabel: "ISEER",
    unit: "",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 4.0, max: 99 },
      { stars: 4, min: 3.7, max: 3.99 },
      { stars: 3, min: 3.4, max: 3.69 },
      { stars: 2, min: 3.1, max: 3.39 },
      { stars: 1, min: 2.8, max: 3.09 },
    ],
    min: 2.4,
    max: 5.5,
    step: 0.05,
    defaultCapacity: "1.5 Ton",
  },
  "Room AC (Fixed Speed)": {
    metric: "iseer",
    metricLabel: "ISEER",
    unit: "",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 3.6, max: 99 },
      { stars: 4, min: 3.3, max: 3.59 },
      { stars: 3, min: 3.0, max: 3.29 },
      { stars: 2, min: 2.7, max: 2.99 },
      { stars: 1, min: 2.4, max: 2.69 },
    ],
    min: 2.0,
    max: 5.0,
    step: 0.05,
    defaultCapacity: "1.5 Ton",
  },
  "Frost Free Refrigerator": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 300 },
      { stars: 4, min: 301, max: 360 },
      { stars: 3, min: 361, max: 430 },
      { stars: 2, min: 431, max: 500 },
      { stars: 1, min: 501, max: 580 },
    ],
    min: 180,
    max: 650,
    step: 5,
    defaultCapacity: "300-350L",
  },
  "Direct Cool Refrigerator": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 170 },
      { stars: 4, min: 171, max: 210 },
      { stars: 3, min: 211, max: 260 },
      { stars: 2, min: 261, max: 310 },
      { stars: 1, min: 311, max: 370 },
    ],
    min: 100,
    max: 420,
    step: 5,
    defaultCapacity: "190-220L",
  },
  "Ceiling Fan": {
    metric: "serviceValue",
    metricLabel: "Service Value",
    unit: "cmm/W",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 7.0, max: 99 },
      { stars: 4, min: 6.0, max: 6.99 },
      { stars: 3, min: 5.0, max: 5.99 },
      { stars: 2, min: 4.0, max: 4.99 },
      { stars: 1, min: 3.0, max: 3.99 },
    ],
    min: 2.0,
    max: 8.5,
    step: 0.1,
    defaultCapacity: "1200mm BLDC",
  },
  "Table Fan": {
    metric: "serviceValue",
    metricLabel: "Service Value",
    unit: "cmm/W",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 2.1, max: 99 },
      { stars: 4, min: 1.8, max: 2.09 },
      { stars: 3, min: 1.5, max: 1.79 },
      { stars: 2, min: 1.2, max: 1.49 },
      { stars: 1, min: 0.9, max: 1.19 },
    ],
    min: 0.5,
    max: 2.6,
    step: 0.05,
    defaultCapacity: "400mm",
  },
  "Colour Television": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 45 },
      { stars: 4, min: 46, max: 60 },
      { stars: 3, min: 61, max: 80 },
      { stars: 2, min: 81, max: 100 },
      { stars: 1, min: 101, max: 130 },
    ],
    min: 20,
    max: 160,
    step: 1,
    defaultCapacity: "43-inch LED",
  },
  "LED Lamps": {
    metric: "lm_per_watt",
    metricLabel: "Luminous Efficacy",
    unit: "lm/W",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 120, max: 999 },
      { stars: 4, min: 100, max: 119.9 },
      { stars: 3, min: 90, max: 99.9 },
      { stars: 2, min: 80, max: 89.9 },
      { stars: 1, min: 70, max: 79.9 },
    ],
    min: 50,
    max: 150,
    step: 1,
    defaultCapacity: "9W",
  },
  "Tubular Fluorescent Lamps": {
    metric: "lm_per_watt",
    metricLabel: "Luminous Efficacy",
    unit: "lm/W",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 95, max: 999 },
      { stars: 4, min: 88, max: 94.9 },
      { stars: 3, min: 82, max: 87.9 },
      { stars: 2, min: 76, max: 81.9 },
      { stars: 1, min: 70, max: 75.9 },
    ],
    min: 55,
    max: 105,
    step: 1,
    defaultCapacity: "T5 28W",
  },
  "Stationary Storage Water Heater": {
    metric: "standingLoss",
    metricLabel: "Standing Loss",
    unit: "kWh/24h",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 1.2 },
      { stars: 4, min: 1.21, max: 1.5 },
      { stars: 3, min: 1.51, max: 1.9 },
      { stars: 2, min: 1.91, max: 2.4 },
      { stars: 1, min: 2.41, max: 3.0 },
    ],
    min: 0.6,
    max: 3.5,
    step: 0.05,
    defaultCapacity: "25L",
  },
  "Geyser/Solar Water Heater": {
    metric: "standingLoss",
    metricLabel: "Standing Loss",
    unit: "kWh/24h",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 1.0 },
      { stars: 4, min: 1.01, max: 1.3 },
      { stars: 3, min: 1.31, max: 1.7 },
      { stars: 2, min: 1.71, max: 2.1 },
      { stars: 1, min: 2.11, max: 2.6 },
    ],
    min: 0.4,
    max: 3.0,
    step: 0.05,
    defaultCapacity: "100 LPD Solar",
  },
  "Distribution Transformer": {
    metric: "kwh",
    metricLabel: "Load Loss (at 50%)",
    unit: "kWh/yr equiv.",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 400 },
      { stars: 4, min: 401, max: 550 },
      { stars: 3, min: 551, max: 700 },
      { stars: 2, min: 701, max: 900 },
      { stars: 1, min: 901, max: 1200 },
    ],
    min: 250,
    max: 1400,
    step: 10,
    defaultCapacity: "100 kVA",
  },
  "Washing Machine": {
    metric: "energyFactor",
    metricLabel: "Energy Factor",
    unit: "units/kg",
    higherIsBetter: true,
    bands: [
      { stars: 5, min: 1.2, max: 99 },
      { stars: 4, min: 1.0, max: 1.19 },
      { stars: 3, min: 0.85, max: 0.99 },
      { stars: 2, min: 0.7, max: 0.84 },
      { stars: 1, min: 0.55, max: 0.69 },
    ],
    min: 0.4,
    max: 1.5,
    step: 0.01,
    defaultCapacity: "7 kg Front Load",
  },
  "Microwave Oven": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 55 },
      { stars: 4, min: 56, max: 70 },
      { stars: 3, min: 71, max: 90 },
      { stars: 2, min: 91, max: 110 },
      { stars: 1, min: 111, max: 140 },
    ],
    min: 30,
    max: 160,
    step: 1,
    defaultCapacity: "23L Convection",
  },
  "Deep Freezer": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 280 },
      { stars: 4, min: 281, max: 340 },
      { stars: 3, min: 341, max: 410 },
      { stars: 2, min: 411, max: 480 },
      { stars: 1, min: 481, max: 560 },
    ],
    min: 150,
    max: 620,
    step: 5,
    defaultCapacity: "300L Chest",
  },
  "Computer/Laptop": {
    metric: "kwh",
    metricLabel: "Annual Energy Consumption",
    unit: "kWh/yr",
    higherIsBetter: false,
    bands: [
      { stars: 5, min: 0, max: 40 },
      { stars: 4, min: 41, max: 55 },
      { stars: 3, min: 56, max: 70 },
      { stars: 2, min: 71, max: 90 },
      { stars: 1, min: 91, max: 120 },
    ],
    min: 20,
    max: 140,
    step: 1,
    defaultCapacity: "14-inch Laptop",
  },
};

export function predictStars(category: ApplianceCategory, value: number): { stars: number; band?: { stars: number; min: number; max: number } } {
  const def = CATEGORY_METRICS[category];
  for (const b of def.bands) {
    if (value >= b.min && value <= b.max) return { stars: b.stars, band: b };
  }
  // below lowest band
  if (def.higherIsBetter && value < def.bands[def.bands.length - 1].min) return { stars: 0 };
  if (!def.higherIsBetter && value > def.bands[def.bands.length - 1].max) return { stars: 0 };
  return { stars: 0 };
}

export function gapToFiveStar(category: ApplianceCategory, value: number): string {
  const def = CATEGORY_METRICS[category];
  const fiveStarBand = def.bands.find((b) => b.stars === 5)!;
  if (def.higherIsBetter) {
    const gap = fiveStarBand.min - value;
    if (gap <= 0) return `Already meets the 5-star ${def.metricLabel} threshold.`;
    return `Needs ${gap.toFixed(2)} more ${def.metricLabel} (${def.unit}) to reach the 5-star band (≥ ${fiveStarBand.min}).`;
  } else {
    const gap = value - fiveStarBand.max;
    if (gap <= 0) return `Already meets the 5-star ${def.metricLabel} threshold.`;
    return `Needs to reduce ${def.metricLabel} by ${gap.toFixed(2)} ${def.unit} to reach the 5-star band (≤ ${fiveStarBand.max}).`;
  }
}

// -------------------- Manufacturer / brand pools --------------------

const MANUFACTURERS = [
  "LG Electronics India Pvt. Ltd.",
  "Samsung India Electronics",
  "Voltas Ltd.",
  "Blue Star Ltd.",
  "Whirlpool of India Ltd.",
  "Godrej Appliances",
  "Haier Appliances India",
  "Daikin Airconditioning India",
  "Havells India Ltd.",
  "Crompton Greaves Consumer Electricals",
  "Bajaj Electricals Ltd.",
  "Orient Electric Ltd.",
  "Panasonic India Pvt. Ltd.",
  "Hitachi Cooling & Heating India",
  "V-Guard Industries Ltd.",
  "Voltas Beko India",
  "IFB Industries Ltd.",
  "Lloyd Electric & Engineering",
  "Usha International Ltd.",
  "Symphony Ltd.",
];

const STATES = [
  "Maharashtra",
  "Gujarat",
  "Tamil Nadu",
  "Karnataka",
  "Uttar Pradesh",
  "Delhi",
  "Telangana",
  "West Bengal",
  "Haryana",
  "Rajasthan",
  "Punjab",
  "Madhya Pradesh",
];

const CITY_BY_STATE: Record<string, string> = {
  Maharashtra: "Pune",
  Gujarat: "Ahmedabad",
  "Tamil Nadu": "Chennai",
  Karnataka: "Bengaluru",
  "Uttar Pradesh": "Noida",
  Delhi: "New Delhi",
  Telangana: "Hyderabad",
  "West Bengal": "Kolkata",
  Haryana: "Gurugram",
  Rajasthan: "Jaipur",
  Punjab: "Ludhiana",
  "Madhya Pradesh": "Indore",
};

const TEST_LABS = [
  "NABL-Accredited Lab, Noida",
  "NABL-Accredited Lab, Chennai",
  "NABL-Accredited Lab, Pune",
  "NABL-Accredited Lab, Bengaluru",
  "ERTL (North), New Delhi",
];

// Deterministic pseudo-random generator so the dataset is stable across renders.
function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export type RecordStatus = "Approved" | "Pending" | "Rejected" | "Flagged";

export interface RegistryRecord {
  id: string;
  manufacturer: string;
  brand: string;
  model: string;
  category: ApplianceCategory;
  capacity: string;
  metricLabel: string;
  metricValue: number;
  metricUnit: string;
  starRating: number;
  certificateId: string;
  status: RecordStatus;
  state: string;
  city: string;
  registrationDate: string;
  expiryDate: string;
  complianceScore: number;
  testLab: string;
  isAnomaly: boolean;
  anomalyReason?: string;
  anomalySeverity?: "High" | "Medium" | "Low";
  deviationPct?: number;
}

function pad(n: number, len = 5) {
  return String(n).padStart(len, "0");
}

function brandFromManufacturer(m: string) {
  return m.split(" ")[0];
}

function dateFromOffset(baseYear: number, dayOffset: number) {
  const d = new Date(baseYear, 0, 1);
  d.setDate(d.getDate() + dayOffset);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
}

const ANOMALY_REASONS = [
  { reason: "Declared ISEER value 22% above category 95th percentile", severity: "High" as const },
  { reason: "Energy consumption inconsistent with declared capacity class", severity: "Medium" as const },
  { reason: "Duplicate test report hash detected across 2 applications", severity: "High" as const },
  { reason: "Star rating claimed does not match computed value from declared parameters", severity: "High" as const },
  { reason: "Test lab report date precedes product model launch date", severity: "Medium" as const },
  { reason: "Declared service value deviates >15% from category median for same wattage", severity: "Low" as const },
  { reason: "Standing loss value identical across 3 unrelated SKUs — possible copy-paste report", severity: "Medium" as const },
  { reason: "Capacity label mismatch between application form and lab report", severity: "Low" as const },
  { reason: "Repeat applicant with 2 prior rejected models in same category within 6 months", severity: "Medium" as const },
  { reason: "Energy factor improvement of 40%+ over previous model variant without design change on file", severity: "High" as const },
];

export function buildRegistry(): RegistryRecord[] {
  const rnd = seededRandom(42);
  const records: RegistryRecord[] = [];
  let seq = 1000;

  // ~60 manufacturer/product registry records
  for (let i = 0; i < 62; i++) {
    const category = APPLIANCE_CATEGORIES[Math.floor(rnd() * APPLIANCE_CATEGORIES.length)];
    const def = CATEGORY_METRICS[category];
    const manufacturer = MANUFACTURERS[Math.floor(rnd() * MANUFACTURERS.length)];
    const state = STATES[Math.floor(rnd() * STATES.length)];
    const value = Number((def.min + rnd() * (def.max - def.min)).toFixed(2));
    const { stars } = predictStars(category, value);
    const statusRoll = rnd();
    const status: RecordStatus = statusRoll < 0.68 ? "Approved" : statusRoll < 0.85 ? "Pending" : statusRoll < 0.94 ? "Rejected" : "Flagged";
    const isAnomaly = status === "Flagged" || rnd() < 0.08;
    const anomaly = isAnomaly ? ANOMALY_REASONS[Math.floor(rnd() * ANOMALY_REASONS.length)] : undefined;
    seq += 1;
    const regDay = Math.floor(rnd() * 300);
    records.push({
      id: `BEE-REG-${pad(seq)}`,
      manufacturer,
      brand: brandFromManufacturer(manufacturer),
      model: `${brandFromManufacturer(manufacturer).slice(0, 3).toUpperCase()}-${category.slice(0, 2).toUpperCase()}-${pad(seq, 4)}`,
      category,
      capacity: def.defaultCapacity ?? "Standard",
      metricLabel: def.metricLabel,
      metricValue: value,
      metricUnit: def.unit,
      starRating: Math.max(1, stars),
      certificateId: `BEE-2026-${pad(seq)}`,
      status,
      state,
      city: CITY_BY_STATE[state],
      registrationDate: dateFromOffset(2026, regDay),
      expiryDate: dateFromOffset(2027, regDay),
      complianceScore: isAnomaly ? Math.floor(35 + rnd() * 35) : Math.floor(70 + rnd() * 30),
      testLab: TEST_LABS[Math.floor(rnd() * TEST_LABS.length)],
      isAnomaly,
      anomalyReason: anomaly?.reason,
      anomalySeverity: anomaly?.severity,
      deviationPct: isAnomaly ? Math.floor(8 + rnd() * 30) : undefined,
    });
  }

  // ~20 consumer verification / complaint records
  for (let i = 0; i < 22; i++) {
    const category = APPLIANCE_CATEGORIES[Math.floor(rnd() * APPLIANCE_CATEGORIES.length)];
    const def = CATEGORY_METRICS[category];
    const manufacturer = MANUFACTURERS[Math.floor(rnd() * MANUFACTURERS.length)];
    const state = STATES[Math.floor(rnd() * STATES.length)];
    const value = Number((def.min + rnd() * (def.max - def.min)).toFixed(2));
    const { stars } = predictStars(category, value);
    const isAnomaly = rnd() < 0.35;
    const anomaly = isAnomaly ? ANOMALY_REASONS[Math.floor(rnd() * ANOMALY_REASONS.length)] : undefined;
    seq += 1;
    const regDay = Math.floor(rnd() * 300);
    records.push({
      id: `BEE-CNS-${pad(seq)}`,
      manufacturer,
      brand: brandFromManufacturer(manufacturer),
      model: `${brandFromManufacturer(manufacturer).slice(0, 3).toUpperCase()}-${category.slice(0, 2).toUpperCase()}-${pad(seq, 4)}`,
      category,
      capacity: def.defaultCapacity ?? "Standard",
      metricLabel: def.metricLabel,
      metricValue: value,
      metricUnit: def.unit,
      starRating: Math.max(1, stars),
      certificateId: `BEE-2026-${pad(seq)}`,
      status: isAnomaly ? "Flagged" : "Approved",
      state,
      city: CITY_BY_STATE[state],
      registrationDate: dateFromOffset(2026, regDay),
      expiryDate: dateFromOffset(2027, regDay),
      complianceScore: isAnomaly ? Math.floor(30 + rnd() * 35) : Math.floor(75 + rnd() * 25),
      testLab: TEST_LABS[Math.floor(rnd() * TEST_LABS.length)],
      isAnomaly,
      anomalyReason: anomaly?.reason,
      anomalySeverity: anomaly?.severity,
      deviationPct: isAnomaly ? Math.floor(8 + rnd() * 30) : undefined,
    });
  }

  // ~20 officer compliance/anomaly case records (higher anomaly density)
  for (let i = 0; i < 22; i++) {
    const category = APPLIANCE_CATEGORIES[Math.floor(rnd() * APPLIANCE_CATEGORIES.length)];
    const def = CATEGORY_METRICS[category];
    const manufacturer = MANUFACTURERS[Math.floor(rnd() * MANUFACTURERS.length)];
    const state = STATES[Math.floor(rnd() * STATES.length)];
    const value = Number((def.min + rnd() * (def.max - def.min)).toFixed(2));
    const { stars } = predictStars(category, value);
    const isAnomaly = rnd() < 0.8;
    const anomaly = isAnomaly ? ANOMALY_REASONS[Math.floor(rnd() * ANOMALY_REASONS.length)] : undefined;
    seq += 1;
    const regDay = Math.floor(rnd() * 300);
    records.push({
      id: `BEE-OFC-${pad(seq)}`,
      manufacturer,
      brand: brandFromManufacturer(manufacturer),
      model: `${brandFromManufacturer(manufacturer).slice(0, 3).toUpperCase()}-${category.slice(0, 2).toUpperCase()}-${pad(seq, 4)}`,
      category,
      capacity: def.defaultCapacity ?? "Standard",
      metricLabel: def.metricLabel,
      metricValue: value,
      metricUnit: def.unit,
      starRating: Math.max(1, stars),
      certificateId: `BEE-2026-${pad(seq)}`,
      status: isAnomaly ? "Flagged" : "Approved",
      state,
      city: CITY_BY_STATE[state],
      registrationDate: dateFromOffset(2026, regDay),
      expiryDate: dateFromOffset(2027, regDay),
      complianceScore: isAnomaly ? Math.floor(25 + rnd() * 35) : Math.floor(75 + rnd() * 25),
      testLab: TEST_LABS[Math.floor(rnd() * TEST_LABS.length)],
      isAnomaly,
      anomalyReason: anomaly?.reason,
      anomalySeverity: anomaly?.severity,
      deviationPct: isAnomaly ? Math.floor(8 + rnd() * 30) : undefined,
    });
  }

  return records;
}

export const REGISTRY: RegistryRecord[] = buildRegistry();

export const FLAGGED_CASES = REGISTRY.filter((r) => r.isAnomaly);

// -------------------- OCR sample reports --------------------

export interface OcrSampleReport {
  id: string;
  label: string;
  brand: string;
  model: string;
  category: ApplianceCategory;
  capacity: string;
  annualEnergyConsumption?: number;
  iseer?: number;
  testLab: string;
  reportDate: string;
}

export const OCR_SAMPLE_REPORTS: OcrSampleReport[] = [
  {
    id: "ocr-1",
    label: "Voltas 1.5 Ton Inverter Split AC",
    brand: "Voltas",
    model: "VLT-AC-1.5T-INV-26",
    category: "Room AC (Variable Speed/Inverter)",
    capacity: "1.5 Ton",
    iseer: 4.35,
    testLab: "NABL-Accredited Lab, Noida",
    reportDate: "14-Sep-2026",
  },
  {
    id: "ocr-2",
    label: "Godrej 320L Frost Free Refrigerator",
    brand: "Godrej",
    model: "GDJ-FF-320-26",
    category: "Frost Free Refrigerator",
    capacity: "320L",
    annualEnergyConsumption: 285,
    testLab: "NABL-Accredited Lab, Chennai",
    reportDate: "02-Oct-2026",
  },
  {
    id: "ocr-3",
    label: "Havells 1200mm BLDC Ceiling Fan",
    brand: "Havells",
    model: "HVL-CF-1200-BLDC",
    category: "Ceiling Fan",
    capacity: "1200mm BLDC",
    annualEnergyConsumption: 0,
    testLab: "NABL-Accredited Lab, Bengaluru",
    reportDate: "28-Sep-2026",
  },
];

// -------------------- Snap-to-Verify sample scan scenarios --------------------

export interface ScanScenario {
  id: string;
  label: string;
  productImageLabel: string;
  scannedBrand: string;
  scannedModel: string;
  scannedStars: number;
  outcome: "authentic" | "mismatch" | "not-found";
  reason?: string;
  matchedRecord?: RegistryRecord;
}

function findApproved(category: ApplianceCategory) {
  return REGISTRY.find((r) => r.category === category && r.status === "Approved" && !r.isAnomaly);
}

const acMatch = findApproved("Room AC (Variable Speed/Inverter)");
const fridgeMatch = findApproved("Frost Free Refrigerator");
const fanMatch = findApproved("Ceiling Fan");
const wmMatch = findApproved("Washing Machine");

export const SCAN_SCENARIOS: ScanScenario[] = [
  {
    id: "scan-1",
    label: "LG Split AC — genuine label",
    productImageLabel: "Split AC, wall-mounted, BEE 5★ label visible",
    scannedBrand: acMatch?.brand ?? "LG",
    scannedModel: acMatch?.model ?? "LG-AC-0001",
    scannedStars: acMatch?.starRating ?? 5,
    outcome: "authentic",
    matchedRecord: acMatch,
  },
  {
    id: "scan-2",
    label: "Unbranded Refrigerator — label mismatch",
    productImageLabel: "Double-door refrigerator, 5★ sticker on door",
    scannedBrand: fridgeMatch?.brand ?? "Godrej",
    scannedModel: fridgeMatch?.model ?? "GDJ-0001",
    scannedStars: 5,
    outcome: "mismatch",
    reason: `Star rating on physical label (5★) does not match registry record (${fridgeMatch?.starRating ?? 3}★) for this model.`,
    matchedRecord: fridgeMatch,
  },
  {
    id: "scan-3",
    label: "Ceiling Fan — genuine, verified",
    productImageLabel: "Ceiling fan carton with QR label",
    scannedBrand: fanMatch?.brand ?? "Havells",
    scannedModel: fanMatch?.model ?? "HVL-0001",
    scannedStars: fanMatch?.starRating ?? 5,
    outcome: "authentic",
    matchedRecord: fanMatch,
  },
  {
    id: "scan-4",
    label: "\"PowerMax\" Washing Machine — no registry match",
    productImageLabel: "Front load washing machine, generic label",
    scannedBrand: "PowerMax",
    scannedModel: "PMX-WM-7KG-X9",
    scannedStars: 5,
    outcome: "not-found",
    reason: "No matching registration found for this model number. This model may be unregistered or counterfeit.",
  },
  {
    id: "scan-5",
    label: "Washing Machine — genuine, verified",
    productImageLabel: "Front-load washing machine, BEE label on glass door",
    scannedBrand: wmMatch?.brand ?? "IFB",
    scannedModel: wmMatch?.model ?? "IFB-WA-0001",
    scannedStars: wmMatch?.starRating ?? 5,
    outcome: "authentic",
    matchedRecord: wmMatch,
  },
  {
    id: "scan-6",
    label: "\"CoolBreeze\" AC — serial/model forged",
    productImageLabel: "Split AC indoor unit, tampered QR sticker",
    scannedBrand: "CoolBreeze",
    scannedModel: "CB-AC-99Z",
    scannedStars: 5,
    outcome: "not-found",
    reason: "No matching registration found for this model number. QR payload could not be resolved against the BEE registry.",
  },
];
