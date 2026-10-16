import { useState } from "react";
import { Ticket, Clock, CheckCircle2, XCircle, Search, MessageCircle } from "lucide-react";
import { MOCK_TICKETS, type MockTicket } from "../data/chatbotData";
import { ChatPanelBody } from "../components/ChatPanelBody";

const STATUS_STYLES: Record<MockTicket["status"], { bg: string; text: string; Icon: typeof Clock }> = {
  Pending: { bg: "bg-warn/10", text: "text-warn", Icon: Clock },
  "Under Review": { bg: "bg-gt-teal/10", text: "text-gt-teal-dark", Icon: Search },
  Approved: { bg: "bg-good/10", text: "text-good", Icon: CheckCircle2 },
  Rejected: { bg: "bg-bad/10", text: "text-bad", Icon: XCircle },
};

const FILTERS: Array<MockTicket["status"] | "All"> = ["All", "Pending", "Under Review", "Approved", "Rejected"];

export default function Grievance() {
  const [filter, setFilter] = useState<MockTicket["status"] | "All">("All");
  const [selected, setSelected] = useState<MockTicket | null>(null);

  const filtered = filter === "All" ? MOCK_TICKETS : MOCK_TICKETS.filter((t) => t.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">AI Grievance Assistant</h1>
        <p className="subtle">Ticket history &amp; analytics, plus the same AI assistant available from the floating widget everywhere in the portal. Talk to Buzzy for any question.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ticket history & analytics */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["Pending", "Under Review", "Approved", "Rejected"] as const).map((s) => {
              const count = MOCK_TICKETS.filter((t) => t.status === s).length;
              const style = STATUS_STYLES[s];
              return (
                <div key={s} className="card card-pad">
                  <div className={`w-8 h-8 rounded-lg grid place-items-center mb-2 ${style.bg} ${style.text}`}>
                    <style.Icon size={16} />
                  </div>
                  <div className="text-xl font-bold text-ink">{count}</div>
                  <div className="text-[11px] text-muted">{s}</div>
                </div>
              );
            })}
          </div>

          <div className="card card-pad">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Grievance Ticket History</h2>
              <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[11px] font-medium rounded-full px-2.5 py-1 border transition-colors ${
                      filter === f ? "bg-gt-purple text-white border-gt-purple" : "border-border text-muted hover:border-gt-purple-light"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((t) => {
                const style = STATUS_STYLES[t.status];
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-center gap-3 transition-colors ${
                      selected?.id === t.id ? "border-gt-purple bg-gt-purple/5" : "border-border hover:border-gt-purple-light"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${style.bg} ${style.text}`}>
                      <Ticket size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink">#{t.id}</span>
                        <span className={`pill ${style.bg} ${style.text}`}>{t.status}</span>
                      </div>
                      <div className="text-xs text-muted truncate">{t.applicant} &middot; {t.product}</div>
                    </div>
                    <div className="text-[11px] text-muted shrink-0">{t.submitted}</div>
                  </button>
                );
              })}
              {filtered.length === 0 && <div className="text-sm text-muted text-center py-6">No tickets in this status.</div>}
            </div>
          </div>

          {selected && (
            <div className="card card-pad spark-fade">
              <h2 className="section-title mb-3">Ticket Detail — #{selected.id}</h2>
              <div className="space-y-1.5 text-sm">
                <Row k="Applicant" v={selected.applicant} />
                <Row k="Product" v={selected.product} />
                <Row k="Status" v={selected.status} />
                <Row k="Submitted" v={selected.submitted} />
                <Row k="Expected / Closed" v={selected.eta} />
                <Row k="Next Step" v={selected.nextStep} />
              </div>
            </div>
          )}
        </div>

        {/* Embedded full-page assistant (shares state with the floating widget) */}
        <div className="lg:col-span-2">
          <div className="card flex flex-col h-[640px]">
            <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-2">
              <MessageCircle size={16} className="text-gt-purple" />
              <div className="text-sm font-semibold text-ink">AI Assistant</div>
              <span className="text-[11px] text-muted ml-2">Talk to Buzzy for any question</span>
              <span className="pill bg-gt-teal/10 text-gt-teal-dark ml-auto">Same chat as the floating widget</span>
            </div>
            <div className="flex-1 min-h-0">
              <ChatPanelBody />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 pb-1.5">
      <span className="text-muted shrink-0">{k}</span>
      <span className="font-medium text-ink text-right">{v}</span>
    </div>
  );
}
