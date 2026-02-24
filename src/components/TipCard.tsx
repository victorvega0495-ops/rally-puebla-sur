import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipCardProps {
  children: React.ReactNode;
  className?: string;
}

const TipCard = ({ children, className }: TipCardProps) => (
  <div className={cn("bg-muted border border-primary/20 rounded-xl p-4 flex gap-3 items-start", className)}>
    <div className="gradient-bg w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
      <Lightbulb className="w-5 h-5 text-primary-foreground" />
    </div>
    <div>
      <p className="text-sm font-bold text-primary mb-1">Tip de Lupita</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  </div>
);

export default TipCard;
