import { Fragment } from "react";
import { Ticket, Info, CheckCircle2, AlertTriangle, XCircle, Star } from "lucide-react";
import { CATEGORY_THRESHOLDS, type BotInfoCard } from "../data/chatbotData";

function renderBold(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

const TONE_STYLES: Record<NonNullable<BotInfoCard["tone"]>, { border: string; bg: string; text: string; Icon: typeof Info }> = {
  good: { border: "border-good/30", bg: "bg-good/5", text: "text-good", Icon: CheckCircle2 },
  warn: { border: "border-warn/30", bg: "bg-warn/5", text: "text-warn", Icon: AlertTriangle },
  bad: { border: "border-bad/30", bg: "bg-bad/5", text: "text-bad", Icon: XCircle },
  neutral: { border: "border-gt-teal/30", bg: "bg-gt-teal/5", text: "text-gt-teal-dark", Icon: Info },
};

export function BotCard({ card }: { card: BotInfoCard }) {
  if (card.kind === "thresholds") {
    const rows = CATEGORY_THRESHOLDS[card.title] ?? [];
    return (
      <div className="mt-2 bg-white border border-gt-purple/20 rounded-lg px-3 py-2.5 text-xs">
        <div className="font-semibold text-ink mb-2 flex items-center gap-1.5">
          <Star size={13} className="text-gt-purple" /> {card.title}
        </div>
        <div className="space-y-1">
          {rows.map((r) => (
            <div key={r.stars} className="flex items-center gap-2">
              <div className="flex shrink-0">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star key={i} size={10} className="fill-gt-teal text-gt-teal-dark" />
                ))}
              </div>
              <span className="text-muted">{r.range}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tone = TONE_STYLES[card.tone ?? "neutral"];
  const Icon = card.kind === "status" ? Ticket : tone.Icon;

  return (
    <div className={`mt-2 bg-white border rounded-lg px-3 py-2.5 text-xs ${tone.border} ${tone.bg}`}>
      <div className={`font-semibold mb-1.5 flex items-center gap-1.5 ${tone.text}`}>
        <Icon size={13} /> {card.title}
      </div>
      <div className="space-y-1">
        {card.fields?.map((f) => (
          <div key={f.k} className="flex justify-between gap-3">
            <span className="text-muted shrink-0">{f.k}</span>
            <span className="font-medium text-ink text-right">{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatBubbleContent({
  text,
  bullets,
  card,
}: {
  text?: string;
  bullets?: string[];
  card?: BotInfoCard;
}) {
  return (
    <>
      {text && <div>{renderBold(text, "t")}</div>}
      {bullets && bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0 opacity-60" />
              <span>{renderBold(b, `b${i}`)}</span>
            </li>
          ))}
        </ul>
      )}
      {card && <BotCard card={card} />}
    </>
  );
}
