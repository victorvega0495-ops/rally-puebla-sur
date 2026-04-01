import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import GenericDayFlow from "@/components/DayFlow/GenericDayFlow";
import type { DayFormat } from "@/components/DayFlow/GenericDayFlow";

const STORAGE_KEY = "campaign-progress";

const loadProgress = (): Record<string, number[]> => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const saveProgress = (data: Record<string, number[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

interface DayRow {
  id: string;
  day_number: number;
  title: string;
  mission: string;
  mission_quote: string;
  format: DayFormat;
}

const RallyDay = () => {
  const { weekSlug, dayNumber } = useParams<{ weekSlug: string; dayNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [dayConfig, setDayConfig] = useState<DayRow | null>(null);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem("rally-admin");
      if (!raw) return false;
      const { expiresAt } = JSON.parse(raw);
      return Date.now() <= expiresAt;
    } catch { return false; }
  });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, number[]>>(loadProgress);

  const dayNum = parseInt(dayNumber || "1");
  const completedDays = progress[weekSlug || ""] || [];

  useEffect(() => {
    // Try to use state passed from RallyWeek, otherwise fetch
    const state = location.state as any;
    if (state?.dayConfig && state?.campaign) {
      setDayConfig(state.dayConfig);
      setCampaignTitle(state.campaign.title);
      document.title = `Día ${dayNum} – ${state.campaign.title} | Rally Puebla Sur`;
      setLoading(false);
      return;
    }

    const load = async () => {
      if (!weekSlug) return;
      const { data: campData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("slug", weekSlug)
        .single();
      if (campData) {
        setCampaignTitle(campData.title);
        document.title = `Día ${dayNum} – ${campData.title} | Rally Puebla Sur`;
        const { data: daysData } = await supabase
          .from("campaign_days")
          .select("*")
          .eq("campaign_id", campData.id)
          .eq("day_number", dayNum)
          .single();
        if (daysData) setDayConfig(daysData as DayRow);
        setTotalDays(campData.total_days || 7);
      }
      setLoading(false);
    };
    load();
  }, [weekSlug, dayNum, location.state]);

  const completeDay = useCallback(() => {
    if (!weekSlug) return;
    setProgress((prev) => {
      const arr = prev[weekSlug] || [];
      if (arr.includes(dayNum)) return prev;
      const next = { ...prev, [weekSlug]: [...arr, dayNum] };
      saveProgress(next);
      return next;
    });
  }, [weekSlug, dayNum]);

  const handleNavigateNext = useCallback(() => {
    if (dayNum < totalDays) {
      navigate(`/rally/${weekSlug}/day/${dayNum + 1}`);
    } else {
      navigate(`/rally/${weekSlug}`);
    }
  }, [navigate, weekSlug, dayNum, totalDays]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dayConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Día no encontrado</p>
      </div>
    );
  }

  return (
    <GenericDayFlow
      campaignSlug={weekSlug || ""}
      campaignTitle={campaignTitle}
      dayConfig={{
        dayNumber: dayConfig.day_number,
        title: dayConfig.title || `Día ${dayConfig.day_number}`,
        mission: dayConfig.mission,
        missionQuote: dayConfig.mission_quote,
        format: dayConfig.format || "video_imagen",
      }}
      totalDays={totalDays}
      isAdmin={isAdmin}
      completed={completedDays.includes(dayNum)}
      onBack={() => navigate(`/rally/${weekSlug}`)}
      onComplete={completeDay}
      onNavigateNext={handleNavigateNext}
    />
  );
};

export default RallyDay;
