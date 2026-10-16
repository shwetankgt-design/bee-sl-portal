import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ScanLine, Star, ShieldCheck, Smartphone, History } from "lucide-react";
import { APPROVED_MODEL, qrPayload } from "../data/mockData";

interface ScanLogEntry {
  id: string;
  time: string;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function QrVerification() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState<ScanLogEntry[]>([]);

  function simulateScan() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setHistory((h) => [{ id: `${Date.now()}`, time: nowLabel() }, ...h].slice(0, 8));
    }, 900);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">QR Verification Portal</h1>
        <p className="subtle">Every approved model carries a scannable QR label for instant consumer verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-pad">
          <h2 className="section-title mb-4">Approved Model</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg border border-border">
              <QRCodeSVG value={qrPayload()} size={140} fgColor="#1A1523" />
            </div>
            <div className="text-sm space-y-1">
              <div className="font-bold text-ink">{APPROVED_MODEL.brand} — {APPROVED_MODEL.productName}</div>
              <div className="text-muted text-xs">Model: {APPROVED_MODEL.model}</div>
              <div className="flex items-center gap-1 text-gt-teal-dark font-medium">
                {Array.from({ length: APPROVED_MODEL.starRating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-gt-teal text-gt-teal-dark" />
                ))}
              </div>
              <div className="text-muted text-xs">Cert. No: {APPROVED_MODEL.certificateNumber}</div>
            </div>
          </div>
          <div className="bg-surface rounded-lg px-3 py-2 text-xs text-muted">
            This QR encodes a signed payload with brand, model, certificate number, star rating and a verification URL.
          </div>

          <button className="btn-teal w-full justify-center mt-5" onClick={simulateScan} disabled={scanning}>
            <ScanLine size={16} /> {scanning ? "Scanning..." : "Simulate Consumer Scan"}
          </button>
        </div>

        <div className="card card-pad flex items-center justify-center">
          {!scanned && !scanning && (
            <div className="text-center text-muted text-sm py-10">
              <Smartphone size={32} className="mx-auto mb-3 opacity-40" />
              Click "Simulate Consumer Scan" to see the consumer-side result.
            </div>
          )}
          {scanning && (
            <div className="text-center py-10">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-gt-teal/20 border-t-gt-teal animate-spin mb-3" />
              <div className="text-sm text-muted">Reading QR code...</div>
            </div>
          )}
          {scanned && !scanning && (
            <div className="w-full max-w-[280px] mx-auto spark-fade">
              <div className="rounded-[28px] border-8 border-ink bg-white shadow-cardhover overflow-hidden">
                <div className="bg-ink h-5 flex items-center justify-center">
                  <div className="w-16 h-1.5 rounded-full bg-white/30" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-good text-xs font-bold mb-3 bg-good/10 rounded-full px-2 py-1 w-fit">
                    <ShieldCheck size={14} /> Authentic
                  </div>
                  <div className="font-bold text-ink text-sm">{APPROVED_MODEL.brand}</div>
                  <div className="text-xs text-muted mb-3">{APPROVED_MODEL.model}</div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: APPROVED_MODEL.starRating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-gt-teal text-gt-teal-dark" />
                    ))}
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <KV k="Certificate No." v={APPROVED_MODEL.certificateNumber} />
                    <KV k="Valid Till" v={APPROVED_MODEL.validTill} />
                    <KV k="Manufacturer" v={APPROVED_MODEL.manufacturer} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card card-pad spark-fade">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} className="text-gt-purple" />
            <h2 className="section-title">Recently Verified Certificates</h2>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={h.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-good/10 text-good grid place-items-center shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink">{APPROVED_MODEL.certificateNumber} &middot; {APPROVED_MODEL.brand} {APPROVED_MODEL.model}</div>
                  <div className="text-[11px] text-muted">Verified authentic at {h.time}</div>
                </div>
                {i === 0 && <span className="pill bg-good/10 text-good shrink-0">Latest</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-1">
      <span className="text-muted">{k}</span>
      <span className="font-medium text-ink text-right">{v}</span>
    </div>
  );
}
