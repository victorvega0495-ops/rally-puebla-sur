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
  <div
    className={cn(
      "rounded-xl overflow-hidden shadow-lg border border-border",
      className
    )}
    style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
  >
    {/* Header */}
    <div className="bg-[#075E54] px-4 py-2.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm text-white font-bold">
        {contactName.charAt(0)}
      </div>
      <span className="text-white font-medium text-sm tracking-wide">
        {contactName}
      </span>
    </div>

    {/* Chat body */}
    <div
      className={cn(
        "bg-[#ECE5DD] relative p-3 space-y-1.5",
        compact ? "max-h-60 overflow-y-auto" : ""
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='.03'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='40' cy='30' r='1'/%3E%3Ccircle cx='25' cy='50' r='1.2'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-lg px-3 py-1.5 shadow-sm relative",
            msg.sent
              ? "ml-auto bg-[#DCF8C6]"
              : "bg-white"
          )}
        >
          <p className="text-[14px] text-[#111111] leading-relaxed whitespace-pre-wrap">
            {msg.text}
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[10px] text-[#737373]">{msg.time}</span>
            {msg.sent && (
              <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WhatsAppChat;
