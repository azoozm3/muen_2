import { Bot, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }) {
  const isBot = message.role === "bot";
  const highUrgency = message.urgency === "high";

  return (
    <div className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[85%] gap-3", isBot ? "flex-row" : "flex-row-reverse")}>
        <div className={cn("mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", isBot ? "bg-primary/10 text-primary" : "bg-slate-900 text-white")}>
          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-line",
            isBot ? "bg-white border" : "bg-primary text-primary-foreground",
            highUrgency && "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {highUrgency ? <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"><AlertTriangle className="h-3.5 w-3.5" /> Urgent</div> : null}
          {message.text}
        </div>
      </div>
    </div>
  );
}
