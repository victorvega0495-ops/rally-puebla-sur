import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tip {
  id: string;
  nickname: string;
  city: string | null;
  message: string;
  likes: number;
  day_number: number;
  created_at: string;
}

interface CommunityTipsProps {
  dayNumber: number;
  campaign: string;
}

const PAGE_SIZE = 10;

const timeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
};

const CommunityTips = ({ dayNumber, campaign }: CommunityTipsProps) => {
  const { toast } = useToast();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchTips = useCallback(async (offset: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    const { data } = await supabase
      .from("community_tips")
      .select("*")
      .eq("campaign", campaign)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);
    const rows = (data || []) as Tip[];
    if (append) {
      setTips((prev) => [...prev, ...rows]);
    } else {
      setTips(rows);
    }
    setHasMore(rows.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [campaign]);

  useEffect(() => {
    setTips([]);
    setHasMore(true);
    fetchTips(0, false);
  }, [campaign, fetchTips]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchTips(tips.length, true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, tips.length, fetchTips]);

  const handlePost = async () => {
    if (!nickname.trim() || !message.trim()) {
      toast({ title: "Escribe tu nombre y tu tip 😊", duration: 2000 });
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("community_tips").insert({
      day_number: dayNumber,
      campaign,
      nickname: nickname.trim(),
      city: city.trim() || null,
      message: message.trim(),
    });
    if (!error) {
      setMessage("");
      toast({ title: "¡Tip compartido! ✨", duration: 2000 });
      // Reload from start to show new tip at top
      setTips([]);
      setHasMore(true);
      await fetchTips(0, false);
    }
    setPosting(false);
  };

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
    <section className="space-y-4">
      {/* Post form */}
      <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-sm text-foreground">
            💬 ¿Qué está funcionando hoy?
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Comparte un tip con las demás socias
          </p>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="¿Cómo te llamas?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Nombre de tu tienda"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-sm"
            />
          </div>
          <Textarea
            placeholder="¿Qué te está funcionando hoy? Comparte tu tip 💡"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-sm min-h-[60px]"
          />
          <Button
            variant="gradient"
            size="sm"
            className="w-full"
            onClick={handlePost}
            disabled={posting}
          >
            {posting ? "Compartiendo..." : "Compartir con las socias ✨"}
          </Button>
        </div>
      </div>

      {/* Tips list */}
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
        <div className="text-center py-6">
          <p className="text-3xl mb-2">🌟</p>
          <p className="text-sm text-muted-foreground">
            Sé la primera en compartir un tip
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Las socias que comparten venden más.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-2 flex justify-center">
            {loadingMore && (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CommunityTips;
