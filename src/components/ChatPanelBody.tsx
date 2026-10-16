import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, MessageSquareText, TableProperties } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { ChatBubbleContent } from "./ChatMessageView";
import { TalkToDataPanel } from "./TalkToDataPanel";
import { useRole } from "../context/RoleContext";

type PanelMode = "assistant" | "talk-to-data";

export function ChatPanelBody({ compact = false }: { compact?: boolean }) {
  const { role } = useRole();
  const { messages, typing, sendMessage, sendQuickReply } = useChat();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<PanelMode>(role === "officer" ? "talk-to-data" : "assistant");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  }

  const lastMsg = messages[messages.length - 1];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 flex items-center gap-1 p-2 border-b border-border bg-surface/60">
        <button
          onClick={() => setMode("assistant")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 transition-colors ${
            mode === "assistant" ? "bg-gt-purple text-white shadow-card" : "text-muted hover:bg-gt-purple/5"
          }`}
        >
          <MessageSquareText size={13} /> Assistant
        </button>
        <button
          onClick={() => setMode("talk-to-data")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 transition-colors ${
            mode === "talk-to-data" ? "bg-gt-teal-dark text-white shadow-card" : "text-muted hover:bg-gt-teal/5"
          }`}
        >
          <TableProperties size={13} /> Talk to Data
        </button>
      </div>

      {mode === "talk-to-data" ? (
        <TalkToDataPanel compact={compact} />
      ) : (
        <>
      <div className={`flex-1 overflow-y-auto space-y-4 ${compact ? "p-3" : "p-4"}`}>
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            {m.sender === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gt-purple/10 text-gt-purple grid place-items-center shrink-0">
                <Bot size={14} />
              </div>
            )}
            <div className={`max-w-[80%] ${m.sender === "user" ? "order-first" : ""}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.sender === "user" ? "bg-gt-purple text-white" : "bg-surface text-ink border border-border"
                }`}
              >
                <ChatBubbleContent text={m.text} bullets={m.bullets} card={m.card} />
              </div>
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
            <div className="bg-surface border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gt-purple/50 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gt-purple/50 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gt-purple/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {!typing && lastMsg?.sender === "assistant" && lastMsg.quickReplies && lastMsg.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-9">
            {lastMsg.quickReplies.map((qr) => (
              <button
                key={qr.label}
                onClick={() => sendQuickReply(qr)}
                className="text-xs font-medium rounded-full border border-gt-purple/30 text-gt-purple px-3 py-1.5 hover:bg-gt-purple/5 transition-colors"
              >
                {qr.label}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-3 flex items-center gap-2 shrink-0">
        <input
          className="input"
          placeholder="Type your query... (try a ticket ID like GRV-1245)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn-teal shrink-0" onClick={handleSend}>
          <Send size={16} />
        </button>
      </div>
      </>
      )}
    </div>
  );
}
