import { useState } from "react";
import { Lock, ChevronRight, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns } from "@/data/campaignData";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "priceshoes2026";

interface CampaignListProps {
  onEnter: (campaignId: string) => void;
  getProgress: (campaignId: string) => number;
  isAdmin?: boolean;
  onAdminUnlock?: () => void;
}

const CampaignList = ({ onEnter, getProgress, isAdmin, onAdminUnlock }: CampaignListProps) => {
  const { toast } = useToast();
  const [promptCampaignId, setPromptCampaignId] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const handleLockClick = (campaignId: string) => {
    const c = campaigns.find((x) => x.id === campaignId);
    if (!c || c.days.length === 0) return; // no days to edit (semana-3, semana-4)
    setPromptCampaignId(campaignId);
    setPassword("");
  };

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setPromptCampaignId(null);
      setPassword("");
      onAdminUnlock?.();
      toast({ title: "Modo admin activado ✏️", duration: 2000 });
      onEnter(promptCampaignId!);
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive", duration: 2000 });
      setPassword("");
    }
  };

  return (
    <div className="pt-20 pb-16 px-4 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl font-bold gradient-text text-center mb-2">
        Mi Contenido
      </h1>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Tu motor de ventas semanal
      </p>
      <div className="space-y-4">
        {campaigns.map((c) => {
          const done = getProgress(c.id);
          const adminCanEdit = !c.active && isAdmin && c.days.length > 0;
          const hasEditableDays = !c.active && c.days.length > 0;
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
                  {c.subtitle && (
                    <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                  )}
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
                ) : adminCanEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEnter(c.id)}
                    className="shrink-0 border-amber-400 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    <Settings className="w-4 h-4 mr-1" /> Editar
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (hasEditableDays) handleLockClick(c.id);
                    }}
                    className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 ${hasEditableDays ? "cursor-pointer hover:bg-muted/80 active:scale-95 transition-all" : ""}`}
                  >
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Inline password prompt */}
              {promptCampaignId === c.id && (
                <div className="px-5 pb-4 flex gap-1.5">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                    placeholder="Contraseña admin"
                    className="h-8 text-xs"
                    autoFocus
                  />
                  <Button size="sm" className="h-8 px-3 text-xs" onClick={handlePasswordSubmit}>OK</Button>
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => setPromptCampaignId(null)}>✕</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignList;
