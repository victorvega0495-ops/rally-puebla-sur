import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, BookOpen, Star, Settings, ChevronRight } from "lucide-react";
import CampaignSection from "@/components/CampaignSection";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Secretos de Ventas | Price Shoes";
  }, []);

  const sections = [
    {
      id: "rally",
      title: "Rally de Ventas",
      subtitle: "6 semanas de contenido para vender más",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      gradient: "from-pink-500 to-purple-500",
      path: "/rally",
    },
    {
      id: "clases",
      title: "Clases",
      subtitle: "Aprende las mejores técnicas de venta",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      gradient: "from-blue-500 to-cyan-500",
      path: "/clases",
    },
    {
      id: "exclusivo",
      title: "Contenido Exclusivo",
      subtitle: "Videos de 15 segundos listos para compartir",
      icon: <Star className="w-6 h-6 text-amber-500" />,
      gradient: "from-amber-500 to-orange-500",
      path: "/exclusivo",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div
        className="px-4 py-10 text-center text-white"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          Secretos de Ventas
        </h1>
        <p className="text-sm text-white/80 mt-1">Price Shoes Pri-Ver 2026</p>
        <p className="text-xs text-white/60 mt-2">Tu motor de ventas semanal</p>
      </div>

      {/* Navigation sections */}
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => navigate(section.path)}
            className="w-full rounded-2xl border border-border overflow-hidden shadow-md text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, hsl(330 85% 55% / 0.06), hsl(275 65% 50% / 0.06))",
            }}
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-lg`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-foreground">{section.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{section.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Existing campaigns (Mi Contenido) */}
      <div className="border-t border-border">
        <CampaignSection />
      </div>

      {/* Admin link */}
      <div className="px-4 pb-8 max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-3.5 h-3.5" /> Panel Admin
        </button>
      </div>
    </div>
  );
};

export default Index;
