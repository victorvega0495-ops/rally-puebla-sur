import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CommunityTips from "@/components/CommunityTips";
import { cn } from "@/lib/utils";

interface CommunityDrawerProps {
  dayNumber: number;
  campaign: string;
}

const CommunityDrawer = ({ dayNumber, campaign }: CommunityDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [tipCount, setTipCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("community_tips")
        .select("*", { count: "exact", head: true })
        .eq("day_number", dayNumber)
        .eq("campaign", campaign);
      if (count !== null) setTipCount(count);
    };
    fetchCount();
  }, [dayNumber, campaign]);

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
        aria-label="Abrir tips de la comunidad"
      >
        <span className="text-2xl">💬</span>
        {tipCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {tipCount > 99 ? "99+" : tipCount}
          </span>
        )}
      </button>

      {/* Backdrop + Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative z-10 bg-background rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Handle + close */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span className="font-display font-bold text-sm text-foreground">Tips de la Comunidad</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-4">
              <CommunityTips dayNumber={dayNumber} campaign={campaign} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityDrawer;
