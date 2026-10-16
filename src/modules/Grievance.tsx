import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Ticket } from "lucide-react";
import { SEED_CHAT, mockAssistantReply, type ChatMessage } from "../data/mockData";

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Grievance() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_CHAT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, sender: "user", text, timestamp: nowLabel() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = mockAssistantReply(text);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, sender: "assistant", text: reply.text, ticket: reply.ticket, timestamp: nowLabel() },
      ]);
      setTyping(false);
    }, 1100);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink">AI Grievance Assistant</h1>
        <p className="subtle">Ask about registration status, documents, star ratings or certificates.</p>
      </div>

      <div className="card flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center shrink-0">
                  <Bot size={14} />
                </div>
              )}
              <div className={`max-w-[75%] ${m.sender === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.sender === "user" ? "bg-gt-purple text-white" : "bg-surface text-ink border border-border"
                  }`}
                >
                  {m.text}
                </div>
                {m.ticket && (
                  <div className="mt-2 bg-white border border-gt-teal/30 rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
                    <Ticket size={14} className="text-gt-teal-dark" />
                    <div>
                      <div className="font-semibold text-ink">Ticket #{m.ticket.id}</div>
                      <div className="text-muted">Expected resolution: {m.ticket.eta}</div>
                    </div>
                  </div>
                )}
                <div className={`text-[10px] text-muted mt-1 ${m.sender === "user" ? "text-right" : ""}`}>{m.timestamp}</div>
              </div>
              {m.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-gt-teal/10 text-gt-teal-dark grid place-items-center shrink-0">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-surface border border-border rounded-2xl px-4 py-2.5 text-sm text-muted pulse-soft">
                typing...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3 flex items-center gap-2">
          <input
            className="input"
            placeholder="Type your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn-teal" onClick={send}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
