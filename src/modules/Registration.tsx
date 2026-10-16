import { useState, type DragEvent } from "react";
import { LogIn, Building2, Package, UploadCloud, CheckCircle2, FileText, ClipboardList, FileSignature, Clock, Search, XCircle } from "lucide-react";
import { DEMO_CREDENTIALS, buildStatusTimeline, generateApplicationId, TRACKED_APPLICATIONS, type TrackedApplication } from "../data/mockData";

type Stage = "login" | "form" | "success";
type Tab = "new" | "tracker";

const TRACKER_STATUS_STYLES: Record<TrackedApplication["status"], { bg: string; text: string; Icon: typeof Clock }> = {
  Submitted: { bg: "bg-muted/10", text: "text-muted", Icon: FileSignature },
  "Under Review": { bg: "bg-gt-teal/10", text: "text-gt-teal-dark", Icon: Search },
  Approved: { bg: "bg-good/10", text: "text-good", Icon: CheckCircle2 },
  Rejected: { bg: "bg-bad/10", text: "text-bad", Icon: XCircle },
};

const TRACKER_FILTERS: Array<TrackedApplication["status"] | "All"> = ["All", "Submitted", "Under Review", "Approved", "Rejected"];

function ApplicationTracker() {
  const [filter, setFilter] = useState<TrackedApplication["status"] | "All">("All");
  const [selected, setSelected] = useState<TrackedApplication | null>(null);

  const filtered = filter === "All" ? TRACKED_APPLICATIONS : TRACKED_APPLICATIONS.filter((a) => a.status === filter);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="section-title">Application Tracker</h2>
          <div className="flex gap-1.5 flex-wrap">
            {TRACKER_FILTERS.map((f) => (
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
          {filtered.map((a) => {
            const style = TRACKER_STATUS_STYLES[a.status];
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-center gap-3 transition-colors ${
                  selected?.id === a.id ? "border-gt-purple bg-gt-purple/5" : "border-border hover:border-gt-purple-light"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${style.bg} ${style.text}`}>
                  <style.Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-ink">{a.id}</span>
                    <span className={`pill ${style.bg} ${style.text}`}>{a.status}</span>
                  </div>
                  <div className="text-xs text-muted truncate">{a.product} &middot; {a.category}</div>
                </div>
                <div className="text-[11px] text-muted shrink-0">{a.submitted}</div>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="text-sm text-muted text-center py-6">No applications in this status.</div>}
        </div>
      </div>

      {selected && (
        <div className="card card-pad spark-fade">
          <h2 className="section-title mb-3">Application Detail — {selected.id}</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted">Product</span>
              <span className="font-medium text-ink">{selected.product}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted">Category</span>
              <span className="font-medium text-ink">{selected.category}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted">Status</span>
              <span className="font-medium text-ink">{selected.status}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-1.5">
              <span className="text-muted">Submitted</span>
              <span className="font-medium text-ink">{selected.submitted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Assigned Reviewer</span>
              <span className="font-medium text-ink">{selected.reviewer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Registration() {
  const [stage, setStage] = useState<Stage>("login");
  const [tab, setTab] = useState<Tab>("new");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appId, setAppId] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [company, setCompany] = useState({ name: "LG Electronics India Pvt. Ltd.", cin: "U32202DL1997PTC091240", address: "Plot 51, Surajpur Kasna Road, Greater Noida, UP", contact: "+91 98100 00000" });
  const [product, setProduct] = useState({ brand: "LG", name: "Split AC 1.5 Ton Inverter", capacity: "1.5 Ton", energy: "850" });

  function handleLogin() {
    setStage("form");
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  }

  function handleSubmit() {
    setAppId(generateApplicationId());
    setStage("success");
  }

  if (stage === "login") {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="card card-pad">
          <div className="w-11 h-11 rounded-lg bg-gt-purple/10 text-gt-purple grid place-items-center mb-4">
            <LogIn size={20} />
          </div>
          <h1 className="text-lg font-bold text-ink mb-1">Manufacturer Login</h1>
          <p className="subtle mb-5">Sign in to register your company and products under BEE S&amp;L.</p>

          <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-muted mb-4">
            Demo credentials: <span className="font-semibold text-ink">{DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</span>
          </div>

          <label className="label">Email</label>
          <input className="input mb-3" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label">Password</label>
          <input className="input mb-5" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button className="btn-primary w-full justify-center" onClick={handleLogin}>
            Login <LogIn size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "success") {
    const timeline = buildStatusTimeline("Submitted");
    return (
      <div className="max-w-xl mx-auto mt-6">
        <div className="card card-pad text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-good/10 text-good grid place-items-center mb-4">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="text-xl font-bold text-ink mb-1">Application Submitted</h1>
          <p className="subtle mb-5">Your product registration has been received.</p>
          <div className="bg-surface border border-border rounded-lg px-4 py-3 mb-6 inline-block">
            <div className="text-[11px] text-muted">Application ID</div>
            <div className="text-lg font-bold text-gt-purple tracking-wide">{appId}</div>
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto">
            {timeline.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center relative">
                {i !== 0 && (
                  <div className={`absolute top-3 -left-1/2 w-full h-0.5 ${step.done || step.active ? "bg-gt-teal" : "bg-border"}`} />
                )}
                <div
                  className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold z-10 ${
                    step.active ? "bg-gt-teal text-white shadow" : step.done ? "bg-gt-teal/80 text-white" : "bg-border text-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <div className={`text-[11px] mt-2 font-medium ${step.active ? "text-gt-teal-dark" : "text-muted"}`}>{step.label}</div>
              </div>
            ))}
          </div>

          <button className="btn-ghost mt-8" onClick={() => setStage("login")}>
            Register Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink">Company &amp; Product Registration</h1>
          <p className="subtle">Logged in as {DEMO_CREDENTIALS.email}</p>
        </div>
        <div className="flex gap-1 bg-surface border border-border rounded-lg p-1">
          <button
            onClick={() => setTab("new")}
            className={`flex items-center gap-1.5 text-xs font-medium rounded-md px-3 py-1.5 transition-colors ${
              tab === "new" ? "bg-white text-gt-purple shadow" : "text-muted hover:text-ink"
            }`}
          >
            <FileSignature size={13} /> New Registration
          </button>
          <button
            onClick={() => setTab("tracker")}
            className={`flex items-center gap-1.5 text-xs font-medium rounded-md px-3 py-1.5 transition-colors ${
              tab === "tracker" ? "bg-white text-gt-purple shadow" : "text-muted hover:text-ink"
            }`}
          >
            <ClipboardList size={13} /> Application Tracker
          </button>
        </div>
      </div>

      {tab === "tracker" ? (
        <ApplicationTracker />
      ) : (
      <>
      <div className="card card-pad">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-gt-purple" />
          <h2 className="font-semibold text-sm text-ink">Company Registration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name</label>
            <input className="input" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
          </div>
          <div>
            <label className="label">CIN</label>
            <input className="input" value={company.cin} onChange={(e) => setCompany({ ...company, cin: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Registered Address</label>
            <input className="input" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
          </div>
          <div>
            <label className="label">Contact Number</label>
            <input className="input" value={company.contact} onChange={(e) => setCompany({ ...company, contact: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-gt-purple" />
          <h2 className="font-semibold text-sm text-ink">Product Registration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Brand Name</label>
            <input className="input" value={product.brand} onChange={(e) => setProduct({ ...product, brand: e.target.value })} />
          </div>
          <div>
            <label className="label">Product Name</label>
            <input className="input" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Capacity</label>
            <input className="input" value={product.capacity} onChange={(e) => setProduct({ ...product, capacity: e.target.value })} />
          </div>
          <div>
            <label className="label">Annual Energy Consumption (kWh)</label>
            <input className="input" value={product.energy} onChange={(e) => setProduct({ ...product, energy: e.target.value })} />
          </div>
        </div>

        <label className="label">Test Lab Report</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg px-4 py-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-gt-teal bg-gt-teal/5" : "border-border hover:border-gt-purple-light"
          }`}
          onClick={() => setFileName(fileName || "BEE_TestLab_Report_SplitAC_1.5T.pdf")}
        >
          {fileName ? (
            <div className="flex items-center justify-center gap-2 text-sm text-ink font-medium">
              <FileText size={18} className="text-gt-teal-dark" /> {fileName}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <UploadCloud size={22} />
              <div className="text-sm">Drag &amp; drop file here, or click to select (PDF)</div>
            </div>
          )}
        </div>
      </div>

      <button className="btn-primary w-full justify-center" onClick={handleSubmit}>
        Submit Application
      </button>
      </>
      )}
    </div>
  );
}
