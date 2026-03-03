import { Lock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { campaigns } from "@/data/campaignData";

interface CampaignListProps {
  onEnter: (campaignId: string) => void;
  getProgress: (campaignId: string) => number;
}

const CampaignList = ({ onEnter, getProgress }: CampaignListProps) => (
  <div className="pt-20 pb-16 px-4 max-w-2xl mx-auto">
    <h1 className="font-display text-2xl md:text-3xl font-bold gradient-text text-center mb-2">
      Mis Campañas
    </h1>
    <p className="text-center text-muted-foreground text-sm mb-8">
      Tu motor de ventas semanal — ejecuta sin pensar
    </p>
    <div className="space-y-4">
      {campaigns.map((c) => {
        const done = getProgress(c.id);
        return (
          <div
            key={c.id}
            className="rounded-2xl border border-border overflow-hidden shadow-md"
            style={{
              background:
                "linear-gradient(135deg, hsl(330 85% 55% / 0.08), hsl(275 65% 50% / 0.08))",
            }}
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <Badge
                  className={
                    c.active
                      ? "bg-emerald-500/90 text-white border-0 text-[10px]"
                      : "bg-muted text-muted-foreground border-0 text-[10px]"
                  }
                >
                  {c.active ? "ACTIVA" : "PRÓXIMAMENTE"}
                </Badge>
                <h2 className="font-display font-bold text-lg text-foreground">
                  {c.title}
                </h2>
                {c.active && (
                  <p className="text-xs text-muted-foreground">
                    {done} de {c.days.length} días completados
                  </p>
                )}
              </div>
              {c.active ? (
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => onEnter(c.id)}
                  className="shrink-0"
                >
                  Entrar <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default CampaignList;
