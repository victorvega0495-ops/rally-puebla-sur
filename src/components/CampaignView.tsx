import { ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/data/campaignData";
import { cn } from "@/lib/utils";

interface CampaignViewProps {
  campaign: Campaign;
  completedDays: number[];
  onBack: () => void;
  onDayClick: (day: number) => void;
}

const typeColors: Record<string, string> = {
  activacion: "from-orange-500 to-red-500",
  prospeccion: "from-blue-500 to-cyan-500",
  seguimiento: "from-amber-500 to-yellow-500",
  cierre: "from-emerald-500 to-green-500",
};

const getBadgeMessage = (done: number, total: number) => {
  const pct = done / total;
  if (pct === 0) return "¡Hora de arrancar! 💪";
  if (pct < 0.5) return "¡Vas con todo! 🔥";
  if (pct < 1) return "¡Ya casi! 🚀";
  return "🏆 ¡Completada!";
};

const CampaignView = ({ campaign, completedDays, onBack, onDayClick }: CampaignViewProps) => {
  const done = completedDays.length;
  const total = campaign.days.length;

  return (
    <div className="pt-16 pb-16">
      {/* Header */}
      <div
        className="px-4 py-8 text-center text-white relative"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
      >
        <button onClick={onBack} className="absolute left-4 top-4 text-white/80 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl md:text-2xl font-bold">{campaign.title}</h1>
        <p className="text-sm text-white/80 mt-1">{campaign.subtitle}</p>
        <div className="max-w-xs mx-auto mt-4 space-y-2">
          <p className="text-xs text-white/70">
            {done} de {total} días completados
          </p>
          <Progress value={(done / total) * 100} className="h-2 bg-white/20" />
          <Badge className="bg-white/20 text-white border-0 text-xs mt-2">
            {getBadgeMessage(done, total)}
          </Badge>
        </div>
      </div>

      {/* Days grid */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {campaign.days.map((d) => {
            const completed = completedDays.includes(d.day);
            const inProgress = !completed && (d.day === 1 || completedDays.includes(d.day - 1));
            return (
              <button
                key={d.day}
                onClick={() => onDayClick(d.day)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5",
                  completed
                    ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{d.emoji}</span>
                  {completed && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-display font-bold text-sm text-foreground">Día {d.day}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{d.focus}</p>
                <div className="mt-2">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r",
                      typeColors[d.type]
                    )}
                  >
                    {completed ? "Completado ✅" : inProgress ? "En progreso" : "Pendiente"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampaignView;
