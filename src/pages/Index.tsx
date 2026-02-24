import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoreSection from "@/components/StoreSection";
import ModulesSection from "@/components/ModulesSection";
import ClosingSection from "@/components/ClosingSection";
import SalesAdvisor from "@/components/SalesAdvisor";
import WeeklyPlanner from "@/components/WeeklyPlanner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("clase");

  useEffect(() => {
    document.title = "Secretos de Ventas | Price Shoes";
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "clase" && (
        <>
          <Hero />
          <StoreSection />
          <ModulesSection />
          <ClosingSection />
        </>
      )}
      {activeTab === "asesor" && <SalesAdvisor />}
      {activeTab === "planeador" && <WeeklyPlanner />}
    </div>
  );
};

export default Index;
