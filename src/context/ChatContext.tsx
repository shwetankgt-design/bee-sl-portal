import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { matchIntent, type ChatMsg, type QuickReply } from "../data/chatbotData";

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: ChatMsg = {
  id: "welcome-1",
  sender: "assistant",
  text:
    "Hello! I'm the **BEE S&L Virtual Assistant**. Ask me about registration, star ratings, certificates, renewals, or your application status.",
  quickReplies: [
    { label: "Check my application status", value: "Check my application status" },
    { label: "Star rating criteria", value: "What are the star rating thresholds?" },
    { label: "Renewal process", value: "How do I renew my label?" },
    { label: "Talk to a human", value: "I want to talk to a human agent" },
  ],
  timestamp: nowLabel(),
};

interface ChatContextValue {
  messages: ChatMsg[];
  typing: boolean;
  isOpen: boolean;
  unread: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => void;
  sendQuickReply: (qr: QuickReply) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

// Flow state for the multi-turn "check application status" conversation.
type PendingFlow = "await-ticket-id" | null;

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const [typing, setTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const pendingFlow = useRef<PendingFlow>(null);

  const pushBotReply = useCallback((raw: ReturnType<typeof matchIntent>) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: "assistant",
          text: raw.text,
          bullets: raw.bullets,
          card: raw.card,
          quickReplies: raw.quickReplies,
          timestamp: nowLabel(),
        },
      ]);
      setIsOpen((open) => {
        if (!open) setUnread((u) => u + 1);
        return open;
      });
    }, 900 + Math.random() * 500);
  }, []);

  const handleUserText = useCallback(
    (text: string) => {
      setMessages((m) => [
        ...m,
        { id: `u-${Date.now()}`, sender: "user", text, timestamp: nowLabel() },
      ]);

      // Multi-turn flow: user was asked for a ticket ID.
      if (pendingFlow.current === "await-ticket-id") {
        pendingFlow.current = null;
        const reply = matchIntent(text);
        pushBotReply(reply);
        return;
      }

      const reply = matchIntent(text);
      if (/share your \*\*application/i.test(reply.text) || /pick one of these sample tickets/i.test(reply.text)) {
        pendingFlow.current = "await-ticket-id";
      }
      pushBotReply(reply);
    },
    [pushBotReply]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      handleUserText(trimmed);
    },
    [handleUserText]
  );

  const sendQuickReply = useCallback(
    (qr: QuickReply) => {
      handleUserText(qr.value);
    },
    [handleUserText]
  );

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnread(0);
  }, []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => {
    setIsOpen((open) => {
      const next = !open;
      if (next) setUnread(0);
      return next;
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, typing, isOpen, unread, openChat, closeChat, toggleChat, sendMessage, sendQuickReply }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
