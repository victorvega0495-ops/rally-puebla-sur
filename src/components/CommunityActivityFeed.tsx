import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Tip {
  id: string;
  nickname: string;
  city: string | null;
  message: string;
  likes: number;
  day_number: number;
  created_at: string;
}

interface CommunityActivityFeedProps {
  campaign: string;
  onOpenDrawer: () => void;
}

const timeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
};

const CommunityActivityFeed = ({ campaign, onOpenDrawer }: CommunityActivityFeedProps) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const fetchTips = useCallback(async () => {
    const { data } = await supabase
      .from("community_tips")
      .select("*")
      .eq("campaign", campaign)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setTips(data as Tip[]);
    setLoading(false);
  }, [campaign]);

  useEffect(() => {
    fetchTips();
    const interval = setInterval(fetchTips, 60000);
    return () => clearInterval(interval);
  }, [fetchTips]);

  const handleLike = async (tipId: string, currentLikes: number) => {
    if (likedIds.has(tipId)) return;
    setLikedIds((prev) => new Set(prev).add(tipId));
    setTips((prev) =>
      prev.map((t) => (t.id === tipId ? { ...t, likes: t.likes + 1 } : t))
    );
    await supabase
      .from("community_tips")
      .update({ likes: currentLikes + 1 })
      .eq("id", tipId);
  };

  return (
    <div className="px-4 pb-8 max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-sm text-foreground">
            💬 Lo que están diciendo las socias
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tips en tiempo real de tu comunidad
          </p>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : tips.length === 0 ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-3xl">🌟</p>
              <p className="text-sm text-muted-foreground">
                Sé la primera en compartir un tip
              </p>
              <Button
                variant="gradient"
                size="sm"
                onClick={onOpenDrawer}
              >
                Compartir un tip 💬
              </Button>
            </div>
          ) : (
            <>
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className="rounded-lg border border-border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-sm text-foreground">
                        {tip.nickname}
                      </span>
                      {tip.city && (
                        <span className="text-[10px] text-muted-foreground">
                          🏪 {tip.city}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "hsl(330 85% 55%)" }}
                      >
                        Día {tip.day_number}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {timeAgo(tip.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {tip.message}
                  </p>
                  <button
                    onClick={() => handleLike(tip.id, tip.likes)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      likedIds.has(tip.id)
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {tip.likes > 0 && <span>{tip.likes}</span>}
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={onOpenDrawer}
              >
                Ver todos los tips 💬
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityActivityFeed;
