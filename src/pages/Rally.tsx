import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface CampaignRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: string;
  week_number: number;
}

const Rally = () => {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Rally Puebla Sur | Price Shoes";
    supabase
      .from("campaigns")
      .select("*")
      .eq("type", "rally")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setWeeks(data as CampaignRow[]);
        setLoading(false);
      });
  }, []);

  const weekEmojis = ["🔥", "🏖️", "✨", "🏃‍♀️", "👟", "🏆", "💎", "🎯"];
  const weekColors = [
    "from-pink-500 to-rose-500",
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-violet-500",
    "from-orange-500 to-amber-500",
    "from-emerald-500 to-green-500",
    "from-yellow-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="px-4 py-8 text-center text-white relative"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
      >
        <button onClick={() => navigate("/")} className="absolute left-4 top-4 text-white/80 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-10 h-10 mx-auto mb-2 text-yellow-300" />
        <h1 className="font-display text-2xl md:text-3xl font-bold">Rally Puebla Sur</h1>
        <p className="text-sm text-white/80 mt-1">Price Shoes 2026</p>
        <p className="text-xs text-white/60 mt-2">8 semanas de contenido</p>
      </div>

      {/* Weeks grid */}
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          weeks.map((week, idx) => {
            const isActive = week.status === "active";
            return (
              <button
                key={week.id}
                onClick={() => isActive && navigate(`/rally/${week.slug}`)}
                className={`w-full rounded-2xl border overflow-hidden shadow-md text-left transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  isActive ? "border-border" : "border-border/50 opacity-60"
                }`}
                style={{
                  background: "linear-gradient(135deg, hsl(330 85% 55% / 0.08), hsl(275 65% 50% / 0.08))",
                }}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${weekColors[idx] || weekColors[0]} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {weekEmojis[idx] || "📋"}
                    </div>
                    <div className="space-y-1">
                      <Badge
                        className={
                          isActive
                            ? "bg-emerald-500/90 text-white border-0 text-[10px]"
                            : "bg-muted text-muted-foreground border-0 text-[10px]"
                        }
                      >
                        {isActive ? `SEMANA ${week.week_number}` : "PRÓXIMAMENTE"}
                      </Badge>
                      <h2 className="font-display font-bold text-base text-foreground">{week.title}</h2>
                      <p className="text-xs text-muted-foreground">7 días de contenido</p>
                    </div>
                  </div>
                  {isActive ? (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Rally;
