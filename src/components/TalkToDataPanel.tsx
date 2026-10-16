import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, Send, TableProperties } from "lucide-react";
import { runTalkToData, SAMPLE_QUESTIONS, type T2DTable } from "../lib/talkToData";

interface T2DMsg {
  id: string;
  sender: "user" | "assistant";
  text: string;
  table?: T2DTable;
  suggestions?: string[];
  timestamp: string;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function welcomeMsg(): T2DMsg {
  return {
    id: `t2d-welcome-${Date.now()}`,
    sender: "assistant",
    text:
      "**Talk to Data** — ask me real analytical questions about the BEE registry (1000+ live records) and I'll compute the answer on the spot. Try a sample question below, or type your own.",
    timestamp: nowLabel(),
  };
}

function TableView({ table }: { table: T2DTable }) {
  return (
    <div className="mt-2 overflow-x-auto bg-white border border-gt-purple/20 rounded-lg">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gt-purple/5">
            {table.columns.map((c) => (
              <th key={c} className="text-left font-semibold text-gt-purple px-2.5 py-1.5 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-surface/60" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="px-2.5 py-1.5 text-ink whitespace-nowrap border-t border-border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TalkToDataPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<T2DMsg[]>([welcomeMsg()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, sender: "user", text: trimmed, timestamp: nowLabel() },
    ]);
    setTyping(true);
    setTimeout(() => {
      const answer = runTalkToData(trimmed);
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: "assistant",
          text: answer.text,
          table: answer.table,
          suggestions: answer.suggestions,
          timestamp: nowLabel(),
        },
      ]);
    }, 500 + Math.random() * 400);
  }

  function handleSend() {
    ask(input);
    setInput("");
  }

  const lastMsg = messages[messages.length - 1];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`flex-1 overflow-y-auto space-y-4 ${compact ? "p-3" : "p-4"}`}>
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            {m.sender === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gt-teal/10 text-gt-teal-dark grid place-items-center shrink-0">
                <TableProperties size={14} />
              </div>
            )}
            <div className={`max-w-[88%] ${m.sender === "user" ? "order-first" : ""}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.sender === "user" ? "bg-gt-purple text-white" : "bg-surface text-ink border border-border"
                }`}
              >
                <div>{m.text}</div>
                {m.table && <TableView table={m.table} />}
              </div>
              <div className={`text-[10px] text-muted mt-1 ${m.sender === "user" ? "text-right" : ""}`}>{m.timestamp}</div>
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="text-xs font-medium rounded-full border border-gt-teal/40 text-gt-teal-dark px-3 py-1.5 hover:bg-gt-teal/5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-gt-teal/10 text-gt-teal-dark grid place-items-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-surface border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gt-teal/50 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gt-teal/50 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gt-teal/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {!typing && lastMsg?.sender === "assistant" && !lastMsg.suggestions && messages.length <= 1 && (
          <div className="pl-9">
            <div className="text-[11px] font-semibold text-muted mb-1.5 flex items-center gap-1">
              <Sparkles size={11} /> Try asking
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_QUESTIONS.slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="text-xs font-medium rounded-full border border-gt-teal/40 text-gt-teal-dark px-3 py-1.5 hover:bg-gt-teal/5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-2.5 shrink-0">
        <details className="mb-2">
          <summary className="text-[11px] font-medium text-gt-teal-dark cursor-pointer select-none">
            Browse all {SAMPLE_QUESTIONS.length} sample questions
          </summary>
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
            {SAMPLE_QUESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="text-[11px] font-medium rounded-full border border-gt-purple/25 text-gt-purple px-2.5 py-1 hover:bg-gt-purple/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </details>
        <div className="flex items-center gap-2">
          <input
            className="input"
            placeholder="Ask about the registry… e.g. top manufacturers by registrations"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="btn-teal shrink-0" onClick={handleSend} aria-label="Ask Talk to Data">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
