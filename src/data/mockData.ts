// All data below is mocked/simulated for demo purposes only.

export const DEMO_CREDENTIALS = { email: "demo@lg.com", password: "demo123" };

export interface StatusStep {
  label: string;
  done: boolean;
  active: boolean;
}

export function buildStatusTimeline(current: "Submitted" | "Under Review" | "Approved"): StatusStep[] {
  const order = ["Submitted", "Under Review", "Approved"];
  const idx = order.indexOf(current);
  return order.map((label, i) => ({
    label,
    done: i < idx,
    active: i === idx,
  }));
}

export function generateApplicationId() {
  const n = Math.floor(10000 + Math.random() * 89999) % 1000;
  return `APP-2026-${String(900 + n % 99).padStart(5, "0")}`;
}

// -------------------- Star Rating module --------------------

export interface SampleReport {
  productCategory: string;
  capacity: string;
  annualEnergyConsumption: number; // kWh
  iseer: number;
  refrigerantType: string;
  testLab: string;
  reportDate: string;
}

export const SAMPLE_REPORT: SampleReport = {
  productCategory: "Room Air Conditioner (Split, Inverter)",
  capacity: "1.5 Ton",
  annualEnergyConsumption: 850,
  iseer: 4.2,
  refrigerantType: "R-32",
  testLab: "NABL-Accredited Lab, Noida",
  reportDate: "28-Sep-2026",
};

// BEE threshold bands for 1.5 Ton split inverter AC (kWh/year) — lower is better.
// Illustrative thresholds for demo purposes.
export const STAR_THRESHOLDS = [
  { stars: 5, maxKwh: 900, label: "5 Star" },
  { stars: 4, maxKwh: 1000, label: "4 Star" },
  { stars: 3, maxKwh: 1100, label: "3 Star" },
  { stars: 2, maxKwh: 1250, label: "2 Star" },
  { stars: 1, maxKwh: 1450, label: "1 Star" },
];

export function computeStarRating(kwh: number): number {
  for (const t of STAR_THRESHOLDS) {
    if (kwh <= t.maxKwh) return t.stars;
  }
  return 0;
}

export function efficiencyMargin(kwh: number): number {
  // % better than the 5-star threshold (positive = better than threshold)
  const base = STAR_THRESHOLDS[0].maxKwh;
  return Math.round(((base - kwh) / base) * 100);
}

// -------------------- QR Verification module --------------------

export const APPROVED_MODEL = {
  brand: "LG",
  model: "LG-AC-1.5T-INV-2026",
  productName: "Split AC 1.5 Ton Inverter (5 Star)",
  starRating: 5,
  certificateNumber: "BEE-2026-001245",
  validTill: "30-Sep-2027",
  manufacturer: "LG Electronics India Pvt. Ltd.",
  issueDate: "01-Oct-2026",
};

export function qrPayload() {
  return JSON.stringify({
    brand: APPROVED_MODEL.brand,
    model: APPROVED_MODEL.model,
    cert: APPROVED_MODEL.certificateNumber,
    stars: APPROVED_MODEL.starRating,
    validTill: APPROVED_MODEL.validTill,
    verifyUrl: `https://verify.beestar.gov.in/cert/${APPROVED_MODEL.certificateNumber}`,
  });
}

// -------------------- Blockchain module --------------------

export const CERTIFICATE_RECORD = {
  certificateHash: "0x8f2a1c9d4e7b3f6a0c5d8e1b2f4a7c9d3e6b1f8a2c5d9e3b6f1a8c2d5e9b3f6a",
  shortHash: "BEE-2026-001245",
  issueDate: "01-Oct-2026",
};

export interface ChainBlock {
  blockNo: number;
  hash: string;
  timestamp: string;
  validator: string;
  action: string;
}

export const CHAIN_OF_CUSTODY: ChainBlock[] = [
  { blockNo: 10452, hash: "0x9a3f...c71e", timestamp: "01-Oct-2026 10:14:02", validator: "BEE-Validator-Node-01", action: "Certificate Issued" },
  { blockNo: 10453, hash: "0x2b7d...e94a", timestamp: "01-Oct-2026 10:14:05", validator: "GT-Validator-Node-02", action: "Manufacturer Signature Confirmed" },
  { blockNo: 10467, hash: "0x6f1c...a38b", timestamp: "04-Oct-2026 09:02:51", validator: "BEE-Validator-Node-01", action: "QR Label Linked" },
  { blockNo: 10589, hash: "0xd4e2...90f7", timestamp: "17-Oct-2026 11:41:19", validator: "NIC-Validator-Node-03", action: "Verification Query Logged" },
];

// -------------------- Dashboard module --------------------

export const STATE_REGISTRATIONS = [
  { state: "Maharashtra", registrations: 1420 },
  { state: "Gujarat", registrations: 1180 },
  { state: "Tamil Nadu", registrations: 1050 },
  { state: "Karnataka", registrations: 940 },
  { state: "Uttar Pradesh", registrations: 860 },
  { state: "Delhi", registrations: 710 },
  { state: "Telangana", registrations: 640 },
  { state: "West Bengal", registrations: 520 },
];

export const QUARTERLY_TREND = [
  { quarter: "Q1 2026", registrations: 2100 },
  { quarter: "Q2 2026", registrations: 2640 },
  { quarter: "Q3 2026", registrations: 3380 },
  { quarter: "Q4 2026", registrations: 3990 },
];

export const CATEGORY_SPLIT = [
  { name: "Air Conditioner", value: 32 },
  { name: "Refrigerator", value: 26 },
  { name: "Washing Machine", value: 18 },
  { name: "Ceiling Fan", value: 14 },
  { name: "Water Heater", value: 10 },
];

export const CATEGORY_COLORS = ["#4E2A84", "#00A9A5", "#7B5AA6", "#4FC7C3", "#D97706"];

export const KPI_TILES = [
  { label: "Total Manufacturers", value: 486, trend: 8.4, up: true },
  { label: "Total Models Registered", value: 7320, trend: 12.1, up: true },
  { label: "Pending Approvals", value: 214, trend: -6.3, up: false },
  { label: "Labels Issued", value: 6840, trend: 9.7, up: true },
  { label: "Renewals Due", value: 158, trend: 3.2, up: true },
  { label: "Expired Certificates", value: 42, trend: -11.5, up: false },
];

export const AI_INSIGHTS = [
  "AC registrations increased by 35% in Q3 2026, driven by pre-summer manufacturer filings.",
  "North India contributed 48% of total energy savings reported across labelled appliances.",
  "Maharashtra shows the highest compliance score (94.2) among all states this quarter.",
  "214 pending approvals are concentrated in the refrigerator category — avg. review time 6.8 days.",
];

// -------------------- Registration tracker --------------------

export interface TrackedApplication {
  id: string;
  product: string;
  category: string;
  submitted: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  reviewer: string;
}

export const TRACKED_APPLICATIONS: TrackedApplication[] = [
  { id: "APP-2026-00891", product: "Split AC 1.5 Ton Inverter", category: "Air Conditioner", submitted: "02-Oct-2026", status: "Under Review", reviewer: "R. Sharma" },
  { id: "APP-2026-00847", product: "Double Door Refrigerator 320L", category: "Refrigerator", submitted: "18-Sep-2026", status: "Approved", reviewer: "A. Nair" },
  { id: "APP-2026-00902", product: "Front Load Washing Machine 7kg", category: "Washing Machine", submitted: "10-Oct-2026", status: "Submitted", reviewer: "Unassigned" },
  { id: "APP-2026-00765", product: "Ceiling Fan 1200mm BLDC", category: "Ceiling Fan", submitted: "25-Aug-2026", status: "Rejected", reviewer: "S. Iyer" },
  { id: "APP-2026-00878", product: "Storage Water Heater 25L", category: "Water Heater", submitted: "29-Sep-2026", status: "Under Review", reviewer: "R. Sharma" },
  { id: "APP-2026-00730", product: "Split AC 1 Ton Inverter", category: "Air Conditioner", submitted: "12-Aug-2026", status: "Approved", reviewer: "A. Nair" },
];

// -------------------- Dashboard filters --------------------

export const DASHBOARD_STATES = [
  "All States",
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

export interface NonCompliantEntry {
  manufacturer: string;
  category: string;
  violations: number;
  complianceScore: number;
  state: string;
}

export const TOP_NON_COMPLIANT: NonCompliantEntry[] = [
  { manufacturer: "Zenova Appliances Pvt. Ltd.", category: "Ceiling Fan", violations: 7, complianceScore: 41, state: "Uttar Pradesh" },
  { manufacturer: "Arctic Breeze Electronics", category: "Air Conditioner", violations: 5, complianceScore: 52, state: "Delhi" },
  { manufacturer: "HomeCool Industries", category: "Refrigerator", violations: 4, complianceScore: 58, state: "Gujarat" },
  { manufacturer: "Suresh Electricals", category: "Water Heater", violations: 3, complianceScore: 63, state: "Tamil Nadu" },
  { manufacturer: "Vortex Home Appliances", category: "Washing Machine", violations: 3, complianceScore: 65, state: "Maharashtra" },
];

// State-wise registration data used by the Dashboard state filter (extends STATE_REGISTRATIONS above with a trend breakdown).
export const STATE_QUARTERLY: Record<string, { quarter: string; registrations: number }[]> = {
  Maharashtra: [
    { quarter: "Q1 2026", registrations: 310 },
    { quarter: "Q2 2026", registrations: 365 },
    { quarter: "Q3 2026", registrations: 398 },
    { quarter: "Q4 2026", registrations: 347 },
  ],
  Gujarat: [
    { quarter: "Q1 2026", registrations: 260 },
    { quarter: "Q2 2026", registrations: 300 },
    { quarter: "Q3 2026", registrations: 340 },
    { quarter: "Q4 2026", registrations: 280 },
  ],
  "Tamil Nadu": [
    { quarter: "Q1 2026", registrations: 230 },
    { quarter: "Q2 2026", registrations: 265 },
    { quarter: "Q3 2026", registrations: 300 },
    { quarter: "Q4 2026", registrations: 255 },
  ],
  Karnataka: [
    { quarter: "Q1 2026", registrations: 205 },
    { quarter: "Q2 2026", registrations: 230 },
    { quarter: "Q3 2026", registrations: 270 },
    { quarter: "Q4 2026", registrations: 235 },
  ],
  "Uttar Pradesh": [
    { quarter: "Q1 2026", registrations: 190 },
    { quarter: "Q2 2026", registrations: 210 },
    { quarter: "Q3 2026", registrations: 245 },
    { quarter: "Q4 2026", registrations: 215 },
  ],
  Delhi: [
    { quarter: "Q1 2026", registrations: 155 },
    { quarter: "Q2 2026", registrations: 175 },
    { quarter: "Q3 2026", registrations: 205 },
    { quarter: "Q4 2026", registrations: 175 },
  ],
  Telangana: [
    { quarter: "Q1 2026", registrations: 140 },
    { quarter: "Q2 2026", registrations: 160 },
    { quarter: "Q3 2026", registrations: 180 },
    { quarter: "Q4 2026", registrations: 160 },
  ],
  "West Bengal": [
    { quarter: "Q1 2026", registrations: 110 },
    { quarter: "Q2 2026", registrations: 130 },
    { quarter: "Q3 2026", registrations: 145 },
    { quarter: "Q4 2026", registrations: 135 },
  ],
};

// -------------------- Grievance chatbot module --------------------

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  ticket?: { id: string; eta: string };
  timestamp: string;
}

export const SEED_CHAT: ChatMessage[] = [
  {
    id: "seed-1",
    sender: "user",
    text: "My registration is pending for 15 days",
    timestamp: "09:12 AM",
  },
  {
    id: "seed-2",
    sender: "assistant",
    text: "Your application is currently under technical scrutiny. Expected resolution date is 20-Oct-2026. Ticket #GRV-1245 created.",
    ticket: { id: "GRV-1245", eta: "20-Oct-2026" },
    timestamp: "09:12 AM",
  },
];

export function mockAssistantReply(userText: string): { text: string; ticket?: { id: string; eta: string } } {
  const t = userText.toLowerCase();
  if (t.includes("pending") || t.includes("delay") || t.includes("status")) {
    const id = `GRV-${1200 + Math.floor(Math.random() * 800)}`;
    return {
      text: `Your application is currently under technical scrutiny. Expected resolution date is 20-Oct-2026. Ticket #${id} created.`,
      ticket: { id, eta: "20-Oct-2026" },
    };
  }
  if (t.includes("star") || t.includes("rating")) {
    return { text: "Star ratings are computed from your test lab's Annual Energy Consumption value against BEE's published thresholds. You can simulate this live in the AI Star Rating Calculator module." };
  }
  if (t.includes("certificate") || t.includes("qr") || t.includes("label")) {
    return { text: "Once your model is approved, a BEE certificate and QR label are issued automatically. You can verify authenticity any time via the QR Verification or Blockchain Certificate modules." };
  }
  if (t.includes("document") || t.includes("upload") || t.includes("report")) {
    return { text: "Please upload your NABL-accredited Test Lab Report in PDF format under Product Registration. Our system auto-extracts the required parameters." };
  }
  if (t.includes("thank")) {
    return { text: "You're welcome! Is there anything else I can help you with regarding your BEE registration?" };
  }
  return {
    text: "I've logged your query for our support team. For registration status, documentation, star-rating, or certificate queries, I can help directly — could you share a few more details?",
  };
}
