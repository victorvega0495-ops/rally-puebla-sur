import { useState, useEffect, useCallback } from "react";
import CampaignList from "./CampaignList";
import CampaignView from "./CampaignView";
import DayDetail from "./DayDetail";
import Day1Flow from "./semana3/Day1Flow";
import Day2Flow from "./semana3/Day2Flow";
import Day3Flow from "./semana3/Day3Flow";
import Day4Flow from "./semana3/Day4Flow";
import Day5Flow from "./semana3/Day5Flow";
import Day6Flow from "./semana3/Day6Flow";
import Day7Flow from "./semana3/Day7Flow";
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
      // Semana 3 Day 1 uses the special full-screen flow
      if (campaign.id === "semana-3" && activeDay === 1) {
        return (
          <Day1Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(1)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 1)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      // Semana 3 Day 2 uses the video/image flow
      if (campaign.id === "semana-3" && activeDay === 2) {
        return (
          <Day2Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(2)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 2)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      // Semana 3 Day 3 uses the gym/deportiva flow
      if (campaign.id === "semana-3" && activeDay === 3) {
        return (
          <Day3Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(3)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 3)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      if (campaign.id === "semana-3" && activeDay === 4) {
        return (
          <Day4Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(4)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 4)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      if (campaign.id === "semana-3" && activeDay === 5) {
        return (
          <Day5Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(5)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 5)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      if (campaign.id === "semana-3" && activeDay === 6) {
        return (
          <Day6Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(6)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 6)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
      if (campaign.id === "semana-3" && activeDay === 7) {
        return (
          <Day7Flow
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            isAdmin={isAdmin}
            completed={getCompleted(campaign.id).includes(7)}
            onBack={() => setView("campaign")}
            onComplete={() => completeDay(campaign.id, 7)}
            onNavigateNext={handleNavigateNext}
          />
        );
      }
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
      isAdmin={isAdmin}
      onAdminUnlock={() => setIsAdmin(true)}
    />
  );
};

export default CampaignSection;
