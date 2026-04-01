import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CommunityTips from "@/components/CommunityTips";
import PremiosSemana from "@/components/semana3/PremiosSemana";
import type { DayFormat } from "@/components/DayFlow/GenericDayFlow";

const ADMIN_PASSWORD = "priceshoes2026";
const STORAGE_KEY = "campaign-progress";
const ADMIN_KEY = "rally-admin";
const ADMIN_EXPIRY_HOURS = 24;

const checkAdminSession = (): boolean => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(ADMIN_KEY);
      return false;
    }
    return true;
  } catch { return false; }
};

const saveAdminSession = () => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify({
    expiresAt: Date.now() + ADMIN_EXPIRY_HOURS * 60 * 60 * 1000
  }));
};

const loadProgress = (): Record<string, number[]> => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const saveProgress = (data: Record<string, number[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

interface CampaignRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  week_number: number;
}

interface DayRow {
  id: string;
  day_number: number;
  title: string;
  mission: string;
  mission_quote: string;
  format: DayFormat;
}

const dayEmojis = ["🎯", "🎬", "🔥", "📸", "💪", "🏷️", "🤝"];
const typeColors: Record<number, string> = {
  1: "from-orange-500 to-red-500",
  2: "from-blue-500 to-cyan-500",
  3: "from-amber-500 to-yellow-500",
  4: "from-emerald-500 to-green-500",
  5: "from-pink-500 to-rose-500",
  6: "from-purple-500 to-violet-500",
  7: "from-indigo-500 to-blue-500",
};

const RallyWeek = () => {
  const { weekSlug } = useParams<{ weekSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [campaign, setCampaign] = useState<CampaignRow | null>(null);
  const [days, setDays] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(checkAdminSession);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [showCommunity, setShowCommunity] = useState(false);
  const [progress, setProgress] = useState<Record<string, number[]>>(loadProgress);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const completedDays = progress[weekSlug || ""] || [];

  useEffect(() => {
    if (!weekSlug) return;
    const load = async () => {
      const { data: campData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("slug", weekSlug)
        .single();
      if (campData) {
        setCampaign(campData as CampaignRow);
        document.title = `${campData.title} | Rally Puebla Sur`;
        const { data: daysData } = await supabase
          .from("campaign_days")
          .select("*")
          .eq("campaign_id", campData.id)
          .order("sort_order", { ascending: true });
        if (daysData) setDays(daysData as DayRow[]);
      }
      setLoading(false);
    };
    load();
  }, [weekSlug]);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      saveAdminSession();
      setShowPasswordPrompt(false);
      setPassword("");
      toast({ title: "Modo admin activado", duration: 2000 });
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive", duration: 2000 });
      setPassword("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Semana no encontrada</p>
      </div>
    );
  }

  if (showCommunity) {
    return (
      <div className="pt-16 pb-16 min-h-screen">
        <div className="px-4 py-6 text-center text-white relative" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}>
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <button onClick={() => setShowCommunity(false)}
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigate("/")}
              className="text-xs text-white/70 hover:text-white transition-colors">
              Inicio
            </button>
          </div>
          <h1 className="font-display text-lg font-bold mt-2">Comunidad</h1>
          <p className="text-xs text-white/80 mt-1">Lo que dicen las socias</p>
        </div>
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <CommunityTips dayNumber={1} campaign={campaign.title} />
        </div>
      </div>
    );
  }

  const done = completedDays.length;
  const total = days.length;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div
        className="px-4 py-8 text-center text-white relative"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
      >
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <button onClick={() => navigate("/rally")}
            className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => navigate("/")}
            className="text-xs text-white/70 hover:text-white transition-colors">
            Inicio
          </button>
        </div>
        <h1 className="font-display text-xl md:text-2xl font-bold">{campaign.title}</h1>
        <p className="text-sm text-white/80 mt-1">{campaign.subtitle}</p>
        <div className="max-w-xs mx-auto mt-4 space-y-2">
          <p className="text-xs text-white/70">{done} de {total} días completados</p>
          <div className="relative">
            <Progress value={total > 0 ? (done / total) * 100 : 0} className="h-2 bg-white/20" />
            <button
              onClick={() => {
                if (isAdmin) { setIsAdmin(false); toast({ title: "Modo admin desactivado", duration: 2000 }); }
                else setShowPasswordPrompt((v) => !v);
              }}
              className="absolute -bottom-5 right-0 text-white/40 hover:text-white/70 transition-colors"
            >
              <Lock className={cn("w-3.5 h-3.5", isAdmin && "text-yellow-300")} />
            </button>
          </div>
          {showPasswordPrompt && (
            <div className="flex gap-1.5 mt-3">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()} placeholder="Contraseña"
                className="h-7 text-xs bg-white/10 border-white/20 text-white placeholder:text-white/40" autoFocus />
              <Button size="sm" className="h-7 px-3 text-xs bg-white/20 hover:bg-white/30 text-white" onClick={handlePasswordSubmit}>OK</Button>
            </div>
          )}
          <Badge className="bg-white/20 text-white border-0 text-xs mt-2">
            {done === 0 ? "¡Hora de arrancar! 💪" : done < total ? "¡Vas con todo! 🔥" : "🏆 ¡Completada!"}
          </Badge>
        </div>
      </div>

      {/* Days grid */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {days.map((d, idx) => {
            const completed = completedDays.includes(d.day_number);
            const inProgress = !completed && (d.day_number === 1 || completedDays.includes(d.day_number - 1));
            return (
              <button
                key={d.id}
                onClick={() => navigate(`/rally/${weekSlug}/day/${d.day_number}`, {
                  state: { campaign, dayConfig: d, isAdmin, completedDays }
                })}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5",
                  completed ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30" : "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{dayEmojis[idx] || "📋"}</span>
                  {completed && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="font-display font-bold text-sm text-foreground">Día {d.day_number}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{d.title}</p>
                <div className="mt-2">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r", typeColors[d.day_number] || "from-pink-500 to-rose-500")}>
                    {completed ? "Completado" : inProgress ? "En progreso" : "Pendiente"}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Community card */}
          <button
            onClick={() => setShowCommunity(true)}
            className="rounded-xl border-0 p-4 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
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

      {/* Premios */}
      <PremiosSemana campaignId={weekSlug || ""} isAdmin={isAdmin} />
    </div>
  );
};

export default RallyWeek;
