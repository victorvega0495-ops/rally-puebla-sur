import { useState, useEffect, useCallback } from "react";
import CampaignList from "./CampaignList";
import CampaignView from "./CampaignView";
import DayDetail from "./DayDetail";
import { campaigns } from "@/data/campaignData";

type View = "list" | "campaign" | "day";

const STORAGE_KEY = "campaign-progress";

const loadProgress = (): Record<string, number[]> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveProgress = (data: Record<string, number[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const CampaignSection = () => {
  const [view, setView] = useState<View>("list");
  const [activeCampaignId, setActiveCampaignId] = useState<string>("");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [progress, setProgress] = useState<Record<string, number[]>>(loadProgress);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const getCompleted = useCallback(
    (id: string) => progress[id] || [],
    [progress]
  );

  const campaign = campaigns.find((c) => c.id === activeCampaignId);

  const completeDay = (campaignId: string, day: number) => {
    setProgress((prev) => {
      const arr = prev[campaignId] || [];
      if (arr.includes(day)) return prev;
      return { ...prev, [campaignId]: [...arr, day] };
    });
  };

  const handleNavigateNext = useCallback(() => {
    if (!campaign) return;
    if (activeDay < campaign.days.length) {
      setActiveDay(activeDay + 1);
    } else {
      setView("campaign");
    }
  }, [campaign, activeDay]);

  const handleNavigatePrev = useCallback(() => {
    if (activeDay > 1) {
      setActiveDay(activeDay - 1);
    }
  }, [activeDay]);

  if (view === "day" && campaign) {
    const dayData = campaign.days.find((d) => d.day === activeDay);
    if (dayData) {
      return (
        <DayDetail
          day={dayData}
          totalDays={campaign.days.length}
          completed={getCompleted(campaign.id).includes(activeDay)}
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          isAdmin={isAdmin}
          onBack={() => setView("campaign")}
          onComplete={() => completeDay(campaign.id, activeDay)}
          onNavigateNext={handleNavigateNext}
          onNavigatePrev={handleNavigatePrev}
        />
      );
    }
  }

  if (view === "campaign" && campaign) {
    return (
      <CampaignView
        campaign={campaign}
        completedDays={getCompleted(campaign.id)}
        isAdmin={isAdmin}
        onAdminToggle={setIsAdmin}
        onBack={() => setView("list")}
        onDayClick={(d) => {
          setActiveDay(d);
          setView("day");
        }}
      />
    );
  }

  return (
    <CampaignList
      onEnter={(id) => {
        setActiveCampaignId(id);
        setView("campaign");
      }}
      getProgress={(id) => getCompleted(id).length}
    />
  );
};

export default CampaignSection;
