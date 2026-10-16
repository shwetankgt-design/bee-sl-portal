# BEE S&L Smart Compliance Portal — Demo Prototype

A clickable, visually polished technical-demo prototype built for Grant Thornton Bharat to present to
Bureau of Energy Efficiency (BEE) evaluators, covering the Standards & Labelling (S&L) RFP scope:
Registration, Label Lifecycle, QR Traceability, Grievance Management, MIS/Analytics, Blockchain
Certificates, and AI/BI-driven Compliance Monitoring.

**All data, AI logic, blockchain verification and QR scanning in this app are simulated/mocked on the
client side for demonstration purposes only.** There is no backend, database, real AI model, or real
blockchain network — this is a front-end prototype intended to showcase the envisioned user experience.

## Stack

Vite + React 18 + TypeScript + Tailwind CSS, React Router, Recharts, lucide-react icons, qrcode.react.

## Modules

1. **Manufacturer Registration Portal** (`/registration`) — mock login, company + product registration, file-drop upload, application status timeline.
2. **AI-Based Star Rating Calculator** (`/star-rating`) — extracted test parameters, live interactive star-rating recomputation via an energy-consumption slider, AI validation panel.
3. **QR Verification Portal** (`/qr-verification`) — real scannable QR code (qrcode.react) for an approved model, simulated consumer scan result.
4. **Blockchain Certificate Verification** (`/blockchain`) — simulated verification animation with a mock chain-of-custody explorer.
5. **AI-Powered Dashboard** (`/dashboard`) — KPI tiles with count-up animation, bar/area/donut charts (Recharts), AI insights panel.
6. **AI Grievance Assistant** (`/grievance`) — functional rule-based chat with seeded example and ticket creation.

## Run locally

```bash
npm install
npm run dev
```

Dev server runs on **http://localhost:5190**.

## Build

```bash
npm run build
```

Produces a static build in `dist/` suitable for deployment to Vercel or any static host.
