import { X } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { ChatPanelBody } from "./ChatPanelBody";
import { BeeMascot } from "./BeeMascot";

export function ChatWidget() {
  const { isOpen, unread, toggleChat, closeChat } = useChat();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)]">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] lg:w-[400px] h-[70vh] sm:h-[560px] max-h-[75vh] card flex flex-col overflow-hidden shadow-cardhover spark-fade">
          <div className="shrink-0 bg-gradient-to-r from-gt-purple to-gt-teal-dark text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-white grid place-items-center shadow shrink-0">
                <BeeMascot size={34} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Buzzy &middot; BEE S&amp;L Assistant</div>
                <div className="text-[11px] text-white/75">Online &middot; Mock AI Demo</div>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="w-7 h-7 rounded-full grid place-items-center text-white/80 hover:bg-white/15 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ChatPanelBody compact />
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        className={`relative w-20 h-20 rounded-full shadow-cardhover grid place-items-center hover:scale-105 active:scale-95 transition-transform ${
          isOpen ? "bg-gradient-to-br from-gt-purple to-gt-teal text-white" : "bg-white border-2 border-gt-teal-light/60"
        }`}
      >
        {!isOpen && <span className="absolute inset-0 rounded-full bg-gt-teal/50 animate-ping" />}
        <span className="relative">
          {isOpen ? <X size={28} /> : <BeeMascot size={58} />}
        </span>
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-bad text-white text-[11px] font-bold grid place-items-center shadow">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
