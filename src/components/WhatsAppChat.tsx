import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WAMessage {
  text: string;
  sent: boolean;
  time: string;
}

interface WhatsAppChatProps {
  contactName: string;
  messages: WAMessage[];
  className?: string;
  compact?: boolean;
}

const WhatsAppChat = ({ contactName, messages, className, compact }: WhatsAppChatProps) => (
  <div className={cn("rounded-xl overflow-hidden shadow-md border border-border", className)}>
    <div className="bg-wa-header px-4 py-2.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs text-primary-foreground font-bold">
        {contactName.charAt(0)}
      </div>
      <span className="text-primary-foreground font-medium text-sm">{contactName}</span>
    </div>
    <div className={cn("bg-wa-bg p-3 space-y-2", compact ? "max-h-60 overflow-y-auto" : "")}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-lg px-3 py-2 shadow-sm",
            msg.sent ? "ml-auto bg-wa-sent" : "bg-wa-received"
          )}
        >
          <p className="text-sm text-wa-text leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[10px] text-wa-time">{msg.time}</span>
            {msg.sent && <CheckCheck className="w-3.5 h-3.5 text-accent" />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WhatsAppChat;
