export type Lang = "en" | "hi";

export const TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // Header / chrome
  "app.title": { en: "BEE Standards & Labelling — Smart Compliance Portal", hi: "बीईई मानक एवं लेबलिंग — स्मार्ट अनुपालन पोर्टल" },
  "viewingAs": { en: "Viewing as", hi: "भूमिका" },
  "role.manufacturer": { en: "Manufacturer", hi: "निर्माता" },
  "role.consumer": { en: "Consumer", hi: "उपभोक्ता" },
  "role.officer": { en: "BEE Officer", hi: "बीईई अधिकारी" },

  // Nav
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.home": { en: "Home", hi: "होम" },
  "nav.registration": { en: "Manufacturer Registration", hi: "निर्माता पंजीकरण" },
  "nav.ocr": { en: "OCR Auto-fill", hi: "ओसीआर ऑटो-फिल" },
  "nav.starRating": { en: "AI Star Rating Calculator", hi: "एआई स्टार रेटिंग कैलकुलेटर" },
  "nav.starPredictor": { en: "Pre-Check Star Predictor", hi: "स्टार पूर्वानुमान जांच" },
  "nav.qr": { en: "QR Verification Portal", hi: "क्यूआर सत्यापन पोर्टल" },
  "nav.snapVerify": { en: "Snap-to-Verify", hi: "स्नैप-टू-वेरिफाई" },
  "nav.blockchain": { en: "Blockchain Certificate", hi: "ब्लॉकचेन प्रमाणपत्र" },
  "nav.grievance": { en: "AI Grievance Assistant", hi: "एआई शिकायत सहायक" },
  "nav.anomaly": { en: "Anomaly Detection Dashboard", hi: "विसंगति जांच डैशबोर्ड" },
  "nav.registry": { en: "Registry Search", hi: "रजिस्ट्री खोज" },
  "nav.compliance": { en: "Compliance Dashboard", hi: "अनुपालन डैशबोर्ड" },
  "nav.globalMis": { en: "International MIS Dashboard", hi: "अंतरराष्ट्रीय एमआईएस डैशबोर्ड" },
  "nav.explore": { en: "Explore All Modules", hi: "सभी मॉड्यूल देखें" },

  // Dashboard KPI labels (generic)
  "kpi.totalManufacturers": { en: "Total Manufacturers", hi: "कुल निर्माता" },
  "kpi.totalModels": { en: "Total Models Registered", hi: "कुल पंजीकृत मॉडल" },
  "kpi.pendingApprovals": { en: "Pending Approvals", hi: "लंबित स्वीकृतियाँ" },
  "kpi.labelsIssued": { en: "Labels Issued", hi: "जारी किए गए लेबल" },
  "kpi.renewalsDue": { en: "Renewals Due", hi: "नवीनीकरण शेष" },
  "kpi.expiredCertificates": { en: "Expired Certificates", hi: "समाप्त प्रमाणपत्र" },
  "kpi.totalFlagged": { en: "Total Flagged Cases", hi: "कुल चिह्नित मामले" },
  "kpi.highSeverity": { en: "High Severity Cases", hi: "उच्च गंभीरता मामले" },
  "kpi.avgDeviation": { en: "Avg. Deviation %", hi: "औसत विचलन %" },
  "kpi.resolvedThisMonth": { en: "Cases Resolved This Month", hi: "इस माह निपटाए गए मामले" },
  "kpi.myApplications": { en: "My Applications", hi: "मेरे आवेदन" },
  "kpi.approvedModels": { en: "Approved Models", hi: "स्वीकृत मॉडल" },
  "kpi.pendingRenewals": { en: "Pending Renewals", hi: "लंबित नवीनीकरण" },
  "kpi.productsScanned": { en: "Products Scanned", hi: "जाँचे गए उत्पाद" },
  "kpi.verifiedAuthentic": { en: "Verified Authentic", hi: "सत्यापित प्रामाणिक" },
  "kpi.reportsFiled": { en: "Reports Filed", hi: "दर्ज की गई रिपोर्ट" },

  // Common
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.confirm": { en: "Confirm", hi: "पुष्टि करें" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.continue": { en: "Continue", hi: "जारी रखें" },
  "common.exploreModules": { en: "More Modules", hi: "अधिक मॉड्यूल" },

  // Chatbot quick replies
  "qr.checkStatus": { en: "Check my application status", hi: "मेरे आवेदन की स्थिति जाँचें" },
  "qr.starCriteria": { en: "Star rating criteria", hi: "स्टार रेटिंग मानदंड" },
  "qr.howOcr": { en: "How do I use OCR auto-fill?", hi: "ओसीआर ऑटो-फिल का उपयोग कैसे करें?" },
  "qr.verifyProduct": { en: "Verify a product", hi: "उत्पाद सत्यापित करें" },
  "qr.howSnap": { en: "How does Snap-to-Verify work?", hi: "स्नैप-टू-वेरिफाई कैसे काम करता है?" },
  "qr.reportCounterfeit": { en: "Report a counterfeit", hi: "नकली उत्पाद की रिपोर्ट करें" },
  "qr.showFlagged": { en: "Show flagged cases", hi: "चिह्नित मामले दिखाएँ" },
  "qr.howAnomaly": { en: "How does anomaly detection work?", hi: "विसंगति जांच कैसे काम करती है?" },
  "qr.registrySearchHelp": { en: "Registry search help", hi: "रजिस्ट्री खोज सहायता" },
};

export function t(key: string, lang: Lang): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang];
}
