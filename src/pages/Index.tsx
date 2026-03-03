import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoreSection from "@/components/StoreSection";
import ModulesSection from "@/components/ModulesSection";
import ClosingSection from "@/components/ClosingSection";
import SalesAdvisor from "@/components/SalesAdvisor";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import CampaignSection from "@/components/CampaignSection";

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

          {/* Principio Rector */}
          <section className="py-16 md:py-24 px-4">
            <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 px-8 py-12 md:px-14 md:py-16 text-center relative">
              <span className="text-5xl md:text-6xl leading-none block mb-6">💡</span>
              <blockquote className="font-display text-xl md:text-2xl lg:text-3xl font-bold leading-snug text-foreground">
                <span className="text-primary text-4xl md:text-5xl font-serif align-top mr-1">"</span>
                Los clientes de hoy están más informados que el vendedor. Quien no invierte en la relación genuina no pasa de la primera venta.
                <span className="text-primary text-4xl md:text-5xl font-serif align-bottom ml-1">"</span>
              </blockquote>
              <p className="mt-6 text-sm text-muted-foreground font-body tracking-wide uppercase">Principio Rector</p>
            </div>
          </section>

          <ModulesSection />
          <ClosingSection />
        </>
      )}
      {activeTab === "asesor" && <SalesAdvisor />}
      {activeTab === "planeador" && <WeeklyPlanner />}
      {activeTab === "plan7" && <CampaignSection />}
    </div>
  );
};

export default Index;
