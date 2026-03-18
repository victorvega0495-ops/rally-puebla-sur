import { useState } from "react";
import { ArrowLeft, Check, Lock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/data/campaignData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import CommunityTips from "@/components/CommunityTips";
import PremiosSemana from "@/components/semana3/PremiosSemana";

interface CampaignViewProps {
  campaign: Campaign;
  completedDays: number[];
  isAdmin: boolean;
  onAdminToggle: (v: boolean) => void;
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

const getStreak = (completedDays: number[]): number => {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => a - b);
  let streak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (i === sorted.length - 1) {
      streak = 1;
    } else if (sorted[i] === sorted[i + 1] - 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const ADMIN_PASSWORD = "priceshoes2026";

const CampaignView = ({ campaign, completedDays, isAdmin, onAdminToggle, onBack, onDayClick }: CampaignViewProps) => {
  const { toast } = useToast();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [showCommunity, setShowCommunity] = useState(false);
  const done = completedDays.length;
  const total = campaign.days.length;
  const streak = getStreak(completedDays);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      onAdminToggle(true);
      setShowPasswordPrompt(false);
      setPassword("");
      toast({ title: "Modo admin activado ✏️", duration: 2000 });
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive", duration: 2000 });
      setPassword("");
    }
  };

  // Full-screen community view
  if (showCommunity) {
    return (
      <div className="pt-16 pb-16 min-h-screen">
        <div
          className="px-4 py-6 text-center text-white relative"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
        >
          <button onClick={() => setShowCommunity(false)} className="absolute left-4 top-4 text-white/80 hover:text-white flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="font-display text-lg font-bold mt-2">💬 Comunidad</h1>
          <p className="text-xs text-white/80 mt-1">Lo que dicen las socias</p>
        </div>
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <CommunityTips dayNumber={1} campaign={campaign.title} />
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs text-white/70">
              {done} de {total} días completados
            </p>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 rounded-full px-2.5 py-0.5">
                🔥 {streak} día{streak > 1 ? "s" : ""} seguido{streak > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="relative">
            <Progress value={(done / total) * 100} className="h-2 bg-white/20" />
            <button
              onClick={() => {
                if (isAdmin) {
                  onAdminToggle(false);
                  toast({ title: "Modo admin desactivado", duration: 2000 });
                } else {
                  setShowPasswordPrompt((v) => !v);
                }
              }}
              className="absolute -bottom-5 right-0 text-white/40 hover:text-white/70 transition-colors"
              title={isAdmin ? "Desactivar admin" : "Admin"}
            >
              <Lock className={cn("w-3.5 h-3.5", isAdmin && "text-yellow-300")} />
            </button>
          </div>
          {showPasswordPrompt && (
            <div className="flex gap-1.5 mt-3">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Contraseña"
                className="h-7 text-xs bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
              <Button size="sm" className="h-7 px-3 text-xs bg-white/20 hover:bg-white/30 text-white" onClick={handlePasswordSubmit}>OK</Button>
            </div>
          )}
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
                  {d.emoji ? <span className="text-2xl">{d.emoji}</span> : <span className="text-2xl">📋</span>}
                  {completed && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-display font-bold text-sm text-foreground">Día {d.day}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{d.focus}</p>
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

          {/* Community card */}
          <button
            onClick={() => setShowCommunity(true)}
            className="rounded-xl border-0 p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 animate-community-pulse"
            style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💬</span>
            </div>
            <p className="font-display font-bold text-sm text-white">Comunidad</p>
            <p className="text-[11px] text-white/80 mt-0.5 line-clamp-2">Lo que dicen las socias</p>
          </button>
        </div>
      </div>

      {/* Premios section for semana-3 */}
      {campaign.id === "semana-3" && (
        <PremiosSemana campaignId={campaign.id} isAdmin={isAdmin} />
      )}
    </div>
  );
};

export default CampaignView;
