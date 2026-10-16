import { useState } from "react";
import { ShieldCheck, Loader2, CheckCircle2, Blocks } from "lucide-react";
import { CERTIFICATE_RECORD, CHAIN_OF_CUSTODY } from "../data/mockData";

export default function Blockchain() {
  const [status, setStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [confirmedCount, setConfirmedCount] = useState(0);

  function verify() {
    setStatus("verifying");
    setConfirmedCount(0);
    let n = 0;
    const interval = setInterval(() => {
      n += 1;
      setConfirmedCount(n);
      if (n >= CHAIN_OF_CUSTODY.length) {
        clearInterval(interval);
        setStatus("verified");
      }
    }, 550);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Blockchain Certificate Verification</h1>
        <p className="subtle">Certificates are anchored on a permissioned ledger for tamper-proof verification.</p>
      </div>

      <div className="card card-pad">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Certificate Issued</h2>
          {status === "verified" && (
            <span className="pill bg-good/10 text-good">
              <CheckCircle2 size={12} /> Verified
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
          <div>
            <div className="text-muted text-xs mb-0.5">Certificate Hash</div>
            <div className="font-mono text-xs bg-surface border border-border rounded-lg px-3 py-2 break-all">
              {CERTIFICATE_RECORD.certificateHash}
            </div>
          </div>
          <div>
            <div className="text-muted text-xs mb-0.5">Certificate No. / Issue Date</div>
            <div className="font-medium">{CERTIFICATE_RECORD.shortHash} &middot; {CERTIFICATE_RECORD.issueDate}</div>
          </div>
        </div>

        <button className="btn-primary" onClick={verify} disabled={status === "verifying"}>
          {status === "verifying" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Verifying on Blockchain...
            </>
          ) : (
            <>
              <ShieldCheck size={16} /> Verify on Blockchain
            </>
          )}
        </button>
      </div>

      {status !== "idle" && (
        <div className="card card-pad spark-fade">
          <div className="flex items-center gap-2 mb-4">
            <Blocks size={18} className="text-gt-purple" />
            <h2 className="section-title">Chain of Custody</h2>
          </div>
          <div className="space-y-3">
            {CHAIN_OF_CUSTODY.map((block, i) => {
              const confirmed = i < confirmedCount;
              return (
                <div
                  key={block.blockNo}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                    confirmed ? "border-good/30 bg-good/5" : "border-border opacity-50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full grid place-items-center shrink-0 ${confirmed ? "bg-good text-white" : "bg-border text-muted"}`}>
                    {confirmed ? <CheckCircle2 size={14} /> : <span className="text-[10px]">{i + 1}</span>}
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="font-medium text-ink">{block.action}</div>
                    <div className="text-[11px] text-muted font-mono">
                      Block #{block.blockNo} &middot; {block.hash} &middot; {block.timestamp} &middot; {block.validator}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
