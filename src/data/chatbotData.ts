// All data below is mocked/simulated for demo purposes only — no real backend/API calls.

export interface QuickReply {
  label: string;
  value: string;
}

export interface InfoCardField {
  k: string;
  v: string;
}

export interface BotInfoCard {
  kind: "info" | "status" | "thresholds";
  title: string;
  fields?: InfoCardField[];
  tone?: "good" | "warn" | "bad" | "neutral";
}

export interface BotReply {
  text: string;
  bullets?: string[];
  card?: BotInfoCard;
  quickReplies?: QuickReply[];
}

export interface ChatMsg {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  bullets?: string[];
  card?: BotInfoCard;
  quickReplies?: QuickReply[];
  timestamp: string;
  typing?: boolean;
}

// -------------------- Mock ticket / application directory --------------------

export interface MockTicket {
  id: string;
  applicant: string;
  product: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  submitted: string;
  eta: string;
  nextStep: string;
}

export const MOCK_TICKETS: MockTicket[] = [
  {
    id: "GRV-1245",
    applicant: "LG Electronics India Pvt. Ltd.",
    product: "Split AC 1.5 Ton Inverter",
    status: "Under Review",
    submitted: "02-Oct-2026",
    eta: "20-Oct-2026",
    nextStep: "Technical scrutiny of test lab report by BEE reviewing officer.",
  },
  {
    id: "GRV-1198",
    applicant: "Voltas Beko India",
    product: "Frost-Free Refrigerator 320L",
    status: "Pending",
    submitted: "10-Oct-2026",
    eta: "24-Oct-2026",
    nextStep: "Awaiting assignment to a reviewing officer. Queue position: 14.",
  },
  {
    id: "GRV-1301",
    applicant: "Haier Appliances India",
    product: "Front Load Washing Machine 7kg",
    status: "Approved",
    submitted: "18-Sep-2026",
    eta: "Completed 05-Oct-2026",
    nextStep: "Certificate and QR label issued. No further action required.",
  },
  {
    id: "GRV-1150",
    applicant: "Crompton Greaves Consumer Electricals",
    product: "Ceiling Fan 1200mm BLDC",
    status: "Rejected",
    submitted: "25-Aug-2026",
    eta: "Closed 09-Sep-2026",
    nextStep: "Resubmit with revised NABL test report — ISEER data did not match declared rating.",
  },
];

export function findTicket(id: string): MockTicket | undefined {
  const norm = id.trim().toUpperCase().replace(/\s+/g, "");
  return MOCK_TICKETS.find((t) => t.id.toUpperCase() === norm || t.id.toUpperCase().endsWith(norm));
}

const STATUS_TONE: Record<MockTicket["status"], BotInfoCard["tone"]> = {
  Pending: "warn",
  "Under Review": "neutral",
  Approved: "good",
  Rejected: "bad",
};

export function ticketToCard(t: MockTicket): BotInfoCard {
  return {
    kind: "status",
    title: `Ticket #${t.id} — ${t.status}`,
    tone: STATUS_TONE[t.status],
    fields: [
      { k: "Applicant", v: t.applicant },
      { k: "Product", v: t.product },
      { k: "Submitted", v: t.submitted },
      { k: "Expected / Closed", v: t.eta },
      { k: "Next Step", v: t.nextStep },
    ],
  };
}

// -------------------- Star rating threshold reference (reused from mockData categories) --------------------

export const CATEGORY_THRESHOLDS: Record<string, { stars: number; range: string }[]> = {
  "Room Air Conditioner (1.5 Ton Inverter)": [
    { stars: 5, range: "ISEER ≥ 4.0 (≤ 900 kWh/yr)" },
    { stars: 4, range: "ISEER 3.7 – 3.99 (901–1000 kWh/yr)" },
    { stars: 3, range: "ISEER 3.4 – 3.69 (1001–1100 kWh/yr)" },
    { stars: 2, range: "ISEER 3.1 – 3.39 (1101–1250 kWh/yr)" },
    { stars: 1, range: "ISEER 2.8 – 3.09 (1251–1450 kWh/yr)" },
  ],
  "Frost-Free Refrigerator (300–350L)": [
    { stars: 5, range: "≤ 300 kWh/yr annual energy consumption" },
    { stars: 4, range: "301 – 360 kWh/yr" },
    { stars: 3, range: "361 – 430 kWh/yr" },
    { stars: 2, range: "431 – 500 kWh/yr" },
    { stars: 1, range: "501 – 580 kWh/yr" },
  ],
  "Front-Load Washing Machine": [
    { stars: 5, range: "Energy factor ≥ 1.20 units/kg" },
    { stars: 4, range: "1.00 – 1.19 units/kg" },
    { stars: 3, range: "0.85 – 0.99 units/kg" },
    { stars: 2, range: "0.70 – 0.84 units/kg" },
    { stars: 1, range: "0.55 – 0.69 units/kg" },
  ],
  "Ceiling Fan (BLDC, 1200mm)": [
    { stars: 5, range: "Service value ≥ 7.0 cmm/W" },
    { stars: 4, range: "6.0 – 6.99 cmm/W" },
    { stars: 3, range: "5.0 – 5.99 cmm/W" },
    { stars: 2, range: "4.0 – 4.99 cmm/W" },
    { stars: 1, range: "3.0 – 3.99 cmm/W" },
  ],
  "Storage Water Heater (Geyser)": [
    { stars: 5, range: "Standing loss ≤ 1.2 kWh/24h" },
    { stars: 4, range: "1.21 – 1.5 kWh/24h" },
    { stars: 3, range: "1.51 – 1.9 kWh/24h" },
    { stars: 2, range: "1.91 – 2.4 kWh/24h" },
    { stars: 1, range: "2.41 – 3.0 kWh/24h" },
  ],
};

// -------------------- Intent knowledge base --------------------

interface Intent {
  id: string;
  keywords: string[];
  reply: BotReply;
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { label: "Check my application status", value: "Check my application status" },
  { label: "Star rating criteria", value: "What are the star rating thresholds?" },
  { label: "Renewal process", value: "How do I renew my label?" },
  { label: "Talk to a human", value: "I want to talk to a human agent" },
];

const INTENTS: Intent[] = [
  {
    id: "registration-process",
    keywords: ["how to register", "registration process", "how do i register", "new registration", "register my product", "register a product"],
    reply: {
      text: "Registering a product under BEE S&L is a 4-step digital process:",
      bullets: [
        "**Manufacturer login/onboarding** — verify company CIN, GST and contact details.",
        "**Product details entry** — brand, model, category, capacity and declared parameters.",
        "**Test lab report upload** — NABL-accredited lab report (PDF) with ISEER/energy data.",
        "**BEE review & approval** — typically 10–15 working days, after which the certificate and QR label are issued.",
      ],
      quickReplies: [
        { label: "Required documents", value: "What documents are required for registration?" },
        { label: "Registration fees", value: "What are the registration fees?" },
        { label: "Check my application status", value: "Check my application status" },
      ],
    },
  },
  {
    id: "required-documents",
    keywords: ["document", "documents required", "what documents", "upload", "test report", "paperwork"],
    reply: {
      text: "For product registration you'll need the following documents:",
      bullets: [
        "**NABL-accredited Test Lab Report** (PDF) with full energy performance parameters.",
        "**Company incorporation certificate / CIN** and GST registration.",
        "**Authorized signatory ID proof** (PAN/Aadhaar of signatory).",
        "**Product technical datasheet** (capacity, refrigerant type where applicable).",
        "**Previous BEE registration certificate**, if this is a renewal or variant.",
      ],
      quickReplies: [
        { label: "Registration fees", value: "What are the registration fees?" },
        { label: "Registration process", value: "How do I register a product?" },
      ],
    },
  },
  {
    id: "fees",
    keywords: ["fee", "fees", "cost", "charges", "payment", "how much"],
    reply: {
      text: "**Registration fees** are charged per model, per category, and vary by manufacturer scale:",
      bullets: [
        "Air Conditioners & Refrigerators: ₹10,000 per model/year (large manufacturers), ₹2,000 (MSME).",
        "Washing Machines & Water Heaters: ₹7,500 per model/year (large), ₹1,500 (MSME).",
        "Ceiling Fans: ₹5,000 per model/year (large), ₹1,000 (MSME).",
        "Label renewal fee is 50% of the original registration fee.",
      ],
      quickReplies: [
        { label: "Renewal process", value: "How do I renew my label?" },
        { label: "Registration timelines", value: "How long does registration take?" },
      ],
    },
  },
  {
    id: "timelines",
    keywords: ["timeline", "how long", "how many days", "processing time", "turnaround"],
    reply: {
      text: "Typical BEE S&L processing timelines:",
      bullets: [
        "Document scrutiny: 2–3 working days.",
        "Technical review of test report: 5–8 working days.",
        "Certificate & QR label issuance after approval: 1–2 working days.",
        "**Total average: 10–15 working days** from submission to certificate issuance.",
      ],
      quickReplies: [
        { label: "Check my application status", value: "Check my application status" },
        { label: "Renewal process", value: "How do I renew my label?" },
      ],
    },
  },
  {
    id: "status-lookup",
    keywords: ["check my application", "application status", "ticket status", "track my application", "where is my application", "pending", "under review", "my status"],
    reply: {
      text: "Sure — I can look that up. Please share your **Application / Ticket ID** (e.g. GRV-1245), or pick one of these sample tickets:",
      quickReplies: [
        { label: "GRV-1245 (Under Review)", value: "GRV-1245" },
        { label: "GRV-1198 (Pending)", value: "GRV-1198" },
        { label: "GRV-1301 (Approved)", value: "GRV-1301" },
        { label: "GRV-1150 (Rejected)", value: "GRV-1150" },
      ],
    },
  },
  {
    id: "star-thresholds",
    keywords: ["star rating", "star criteria", "iseer", "threshold", "rating methodology", "how are stars calculated", "energy efficiency rating"],
    reply: {
      text: "BEE star ratings are computed by comparing a product's tested energy performance (ISEER, annual energy consumption, or service value depending on category) against published category-specific thresholds. Pick a category to see its bands:",
      quickReplies: [
        { label: "Air Conditioner", value: "AC star rating thresholds" },
        { label: "Refrigerator", value: "Refrigerator star rating thresholds" },
        { label: "Washing Machine", value: "Washing machine star rating thresholds" },
        { label: "Ceiling Fan", value: "Fan star rating thresholds" },
      ],
    },
  },
  {
    id: "star-ac",
    keywords: ["ac star", "ac threshold", "air conditioner star", "air conditioner threshold"],
    reply: {
      text: "Star rating thresholds for Room Air Conditioner (1.5 Ton Inverter):",
      card: { kind: "thresholds", title: "Room Air Conditioner (1.5 Ton Inverter)" },
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "star-fridge",
    keywords: ["refrigerator star", "fridge star", "refrigerator threshold"],
    reply: {
      text: "Star rating thresholds for Frost-Free Refrigerator (300–350L):",
      card: { kind: "thresholds", title: "Frost-Free Refrigerator (300–350L)" },
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "star-wm",
    keywords: ["washing machine star", "washing machine threshold"],
    reply: {
      text: "Star rating thresholds for Front-Load Washing Machine:",
      card: { kind: "thresholds", title: "Front-Load Washing Machine" },
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "star-fan",
    keywords: ["fan star", "fan threshold", "ceiling fan rating"],
    reply: {
      text: "Star rating thresholds for Ceiling Fan (BLDC, 1200mm):",
      card: { kind: "thresholds", title: "Ceiling Fan (BLDC, 1200mm)" },
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "renewal",
    keywords: ["renew", "renewal", "validity", "expire", "expiry", "label expired"],
    reply: {
      text: "**Label renewal process:**",
      bullets: [
        "BEE certificates/labels are typically **valid for 1–2 years** depending on category.",
        "Apply for renewal **60 days before expiry** via the Manufacturer Registration module.",
        "If the product design/test parameters are unchanged, a simplified renewal (no fresh lab test) usually applies.",
        "Renewal fee is 50% of the original registration fee.",
        "A new QR label and blockchain-anchored certificate are re-issued on approval.",
      ],
      quickReplies: [
        { label: "Check label validity", value: "How do I check my label validity?" },
        { label: "Registration fees", value: "What are the registration fees?" },
      ],
    },
  },
  {
    id: "check-validity",
    keywords: ["check label validity", "label validity", "validity date", "is my certificate valid"],
    reply: {
      text: "You can check certificate validity instantly in the **QR Verification Portal** (scan or enter the certificate number) or the **Blockchain Certificate** module (search by certificate hash/number). Both show the issue date and valid-till date pulled from the BEE registry.",
      quickReplies: [
        { label: "Renewal process", value: "How do I renew my label?" },
        { label: "Talk to a human", value: "I want to talk to a human agent" },
      ],
    },
  },
  {
    id: "qr-verify",
    keywords: ["qr code", "qr label", "scan", "verify certificate", "authentic", "fake label"],
    reply: {
      text: "Every approved model carries a **BEE QR label**. Scanning it (or entering the certificate number manually) shows brand, model, star rating, certificate number and validity — instantly confirming authenticity. Try it live in the **QR Verification Portal** module from the sidebar.",
      quickReplies: [
        { label: "Blockchain certificate", value: "How does blockchain certificate verification work?" },
        { label: "Check my application status", value: "Check my application status" },
      ],
    },
  },
  {
    id: "blockchain",
    keywords: ["blockchain", "ledger", "certificate hash", "tamper", "chain of custody"],
    reply: {
      text: "Every issued certificate is anchored on a **permissioned blockchain ledger** shared between BEE, GT and NIC validator nodes. Each lifecycle event — issuance, manufacturer signature, QR linkage, verification queries — is recorded as an immutable block, making certificates tamper-proof and independently auditable. Explore it in the **Blockchain Certificate** module.",
      quickReplies: [
        { label: "QR verification", value: "How does QR verification work?" },
        { label: "Compliance monitoring", value: "What is compliance monitoring?" },
      ],
    },
  },
  {
    id: "compliance",
    keywords: ["compliance", "penalty", "penalties", "non-compliance", "monitoring", "fine", "violation"],
    reply: {
      text: "**Compliance monitoring & penalties under BEE S&L:**",
      bullets: [
        "BEE and state agencies conduct **market surveillance** and random sample testing of labelled products.",
        "First-time labelling violations attract a **fine up to ₹1,00,000** per model under the Energy Conservation Act.",
        "Repeat or willful mislabelling can lead to **de-registration** and referral for prosecution.",
        "The AI-Powered Dashboard flags high-risk manufacturers and categories using a compliance score, visible to BEE reviewing officers.",
      ],
      quickReplies: [
        { label: "View dashboard", value: "Show me the compliance dashboard" },
        { label: "Grievance process", value: "How do I raise a grievance?" },
      ],
    },
  },
  {
    id: "update-company-details",
    keywords: ["update company", "change address", "update details", "change contact", "update profile", "change company name"],
    reply: {
      text: "To update company details (address, contact person, GST, authorized signatory), go to **Manufacturer Registration → Company Registration** and edit the relevant fields, then resubmit for BEE verification. Material changes (e.g. company name change due to merger) require a supporting document upload and typically take 5–7 working days to reflect.",
      quickReplies: [
        { label: "Registration process", value: "How do I register a product?" },
        { label: "Talk to a human", value: "I want to talk to a human agent" },
      ],
    },
  },
  {
    id: "contact-support",
    keywords: ["contact support", "helpline", "customer care", "support number", "email support", "reach bee"],
    reply: {
      text: "**BEE S&L Support Desk:**",
      bullets: [
        "Helpline: **1800-11-3333** (Mon–Sat, 9:30 AM – 6:00 PM)",
        "Email: **sl-support@beestarlabel.gov.in**",
        "Grievance ticket SLA: first response within **48 hours**.",
        "For urgent escalations, use \"Talk to a human\" below to raise a priority ticket.",
      ],
      quickReplies: [
        { label: "Talk to a human", value: "I want to talk to a human agent" },
        { label: "Check my application status", value: "Check my application status" },
      ],
    },
  },
  {
    id: "human-handoff",
    keywords: ["talk to a human", "human agent", "real person", "speak to someone", "escalate", "agent please"],
    reply: {
      text: "I've raised a **priority support ticket** and routed it to the BEE S&L helpdesk team. A support officer will reach out on your registered email within **24 hours**. In the meantime, is there anything I can help clarify?",
      card: {
        kind: "info",
        title: "Priority Ticket Raised",
        tone: "good",
        fields: [
          { k: "Ticket Type", v: "Human Escalation" },
          { k: "SLA", v: "Response within 24 hours" },
          { k: "Channel", v: "Registered email + helpline callback" },
        ],
      },
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "grievance-raise",
    keywords: ["raise a grievance", "file a complaint", "lodge complaint", "grievance process", "raise grievance"],
    reply: {
      text: "To raise a grievance: describe your issue here in chat (e.g. delay, rejection reason, label mismatch) and I'll auto-create a ticket, or use the full **AI Grievance Assistant** page for ticket history and analytics. Most grievances are triaged within 48 hours and resolved within 7–10 working days.",
      quickReplies: [
        { label: "Check my application status", value: "Check my application status" },
        { label: "Contact support", value: "How do I contact support?" },
      ],
    },
  },
  {
    id: "rejected",
    keywords: ["rejected", "why was my application rejected", "disapproved", "denied"],
    reply: {
      text: "Applications are most commonly rejected due to: **(1)** mismatch between declared and tested ISEER/energy values, **(2)** test report not from a NABL-accredited lab, or **(3)** incomplete company documentation. You can view the specific rejection reason on your ticket, and resubmit after corrections — no additional registration fee is charged for a corrected resubmission within 30 days.",
      quickReplies: [
        { label: "Check my application status", value: "Check my application status" },
        { label: "Required documents", value: "What documents are required for registration?" },
      ],
    },
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "great", "awesome", "perfect", "cool"],
    reply: {
      text: "You're welcome! Is there anything else I can help you with regarding BEE registration, star ratings, or certificates?",
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "namaste", "good morning", "good afternoon"],
    reply: {
      text: "Hello! I'm the **BEE S&L Virtual Assistant**. I can help with registration, star ratings, certificates, renewals and grievance status. What would you like to know?",
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  },
];

const FALLBACK_QUICK_REPLIES: QuickReply[] = [
  { label: "Registration process", value: "How do I register a product?" },
  { label: "Star rating criteria", value: "What are the star rating thresholds?" },
  { label: "Talk to a human", value: "I want to talk to a human agent" },
];

export function matchIntent(userText: string): BotReply {
  const t = userText.toLowerCase();

  // Direct ticket-ID style match (e.g. "GRV-1245")
  const ticketLike = /grv-?\s?\d{3,5}/i.exec(t);
  if (ticketLike) {
    const ticket = findTicket(ticketLike[0]);
    if (ticket) {
      return {
        text: `Here's the latest status for ticket **#${ticket.id}**:`,
        card: ticketToCard(ticket),
        quickReplies: DEFAULT_QUICK_REPLIES,
      };
    }
    return {
      text: `I couldn't find a ticket matching "${ticketLike[0].toUpperCase()}". Try one of these sample tickets, or contact support for a manual lookup.`,
      quickReplies: [
        { label: "GRV-1245", value: "GRV-1245" },
        { label: "GRV-1198", value: "GRV-1198" },
        { label: "Contact support", value: "How do I contact support?" },
      ],
    };
  }

  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (t.includes(kw)) score += kw.split(" ").length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (best) return best.reply;

  return {
    text: "I didn't quite catch that. I can help with registration, star ratings, certificates, renewals, or application status — here are some things you can ask:",
    quickReplies: FALLBACK_QUICK_REPLIES,
  };
}
