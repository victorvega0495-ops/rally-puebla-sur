import { useState } from "react";
import { ArrowLeft, Copy, Check, Play, Image as ImageIcon, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WhatsAppChat, { WAMessage } from "@/components/WhatsAppChat";
import { DayData, motivationalMessages } from "@/data/campaignData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DayDetailProps {
  day: DayData;
  totalDays: number;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
}

const typeBadgeColors: Record<string, string> = {
  activacion: "bg-orange-500/90 text-white border-0",
  prospeccion: "bg-blue-500/90 text-white border-0",
  seguimiento: "bg-amber-500/90 text-white border-0",
  cierre: "bg-emerald-500/90 text-white border-0",
};

const DayDetail = ({ day, totalDays, completed, onBack, onComplete }: DayDetailProps) => {
  const { toast } = useToast();
  const [justCompleted, setJustCompleted] = useState(false);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copiado ✓`, duration: 2000 });
    });
  };

  const handleComplete = () => {
    onComplete();
    setJustCompleted(true);
    toast({
      title: motivationalMessages[day.day - 1] || "¡Día completado! 🎉",
      duration: 4000,
    });
  };

  const followUpMessages = (fu: { label: string; timing: string; message: string }): WAMessage[] => [
    { text: fu.message, sent: true, time: "10:30 a.m." },
  ];

  return (
    <div className="pt-16 pb-24">
      {/* Header */}
      <div
        className="px-4 py-6 text-white relative"
        style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}
      >
        <button onClick={onBack} className="absolute left-4 top-4 text-white/80 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center space-y-1 max-w-md mx-auto">
          <p className="text-xs text-white/70">Día {day.day} de {totalDays}</p>
          <Progress value={(day.day / totalDays) * 100} className="h-1.5 bg-white/20 max-w-[200px] mx-auto" />
          <h1 className="font-display text-lg font-bold mt-2">{day.emoji} {day.focus}</h1>
          <Badge className={cn("text-[10px]", typeBadgeColors[day.type])}>{day.typeLabel}</Badge>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto space-y-6 mt-6">
        {/* Sección 1 — Look del Día */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              👗 El Look del Día
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {/* Product placeholder */}
            <div
              className="rounded-xl aspect-[3/4] max-h-[280px] w-full flex flex-col items-center justify-center text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.7), hsl(275 65% 50% / 0.7))" }}
            >
              <ImageIcon className="w-10 h-10 mb-2 opacity-60" />
              <p className="font-display font-bold text-sm text-center px-4">{day.lookName}</p>
              <p className="text-xs opacity-80">{day.brand}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-foreground">{day.lookName}</p>
                <p className="text-sm text-primary font-bold">{day.lookPrice} — {day.brand}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              📌 Familiarízate con este look antes de empezar
            </p>
          </div>
        </section>

        {/* Sección 2 — Estado de Hoy */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">📱 Tu Estado de Hoy</h2>
          </div>
          <Tabs defaultValue="imagen" className="p-4">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="imagen" className="text-xs gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Imagen
              </TabsTrigger>
              <TabsTrigger value="video" className="text-xs gap-1">
                <Film className="w-3.5 h-3.5" /> Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imagen" className="space-y-3">
              <div
                className="rounded-xl aspect-[9/16] max-h-[300px] w-full flex flex-col items-center justify-center text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.6), hsl(275 65% 50% / 0.6))" }}
              >
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs opacity-70 px-4 text-center">{day.lookName}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-foreground font-medium">"{day.statusCopyImage}"</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyText(day.statusCopyImage, "Copy del estado")}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar copy ✓
              </Button>
            </TabsContent>

            <TabsContent value="video" className="space-y-3">
              <div
                className="rounded-xl aspect-[9/16] max-h-[300px] w-full flex flex-col items-center justify-center text-white relative overflow-hidden"
                style={{ background: "linear-gradient(180deg, hsl(250 30% 15%), hsl(250 30% 8%))" }}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <p className="text-xs opacity-70 px-4 text-center mb-3">{day.lookName}</p>
                <div className="w-full px-4 space-y-1">
                  {day.reelStructure.map((line, i) => (
                    <p key={i} className="text-[10px] text-white/60">{line}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-foreground font-medium">"{day.statusCopyVideo}"</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyText(day.statusCopyVideo, "Copy del video")}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar copy ✓
              </Button>
            </TabsContent>
          </Tabs>
        </section>

        {/* Sección 3 — Mensaje del Día */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">💬 Tu Mensaje del Día</h2>
          </div>
          <div className="p-4 space-y-3">
            <WhatsAppChat
              contactName="[Nombre]"
              messages={[{ text: day.messageTemplate, sent: true, time: "10:30 a.m." }]}
              compact
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => copyText(day.messageTemplate, "Mensaje")}
            >
              <Copy className="w-3.5 h-3.5 mr-1" /> Copiar mensaje ✓
            </Button>
          </div>
        </section>

        {/* Sección 4 — Promo (días 3, 5, 7) */}
        {day.promo && (
          <section className="rounded-2xl border-2 border-amber-400/50 overflow-hidden shadow-md">
            <div
              className="p-4 border-b border-amber-400/30"
              style={{ background: "linear-gradient(135deg, hsl(45 90% 55% / 0.15), hsl(35 90% 50% / 0.15))" }}
            >
              <h2 className="font-display font-bold text-sm text-foreground">🎁 Tu Promo de Hoy</h2>
            </div>
            <div
              className="p-5 text-center space-y-3"
              style={{ background: "linear-gradient(135deg, hsl(45 90% 55% / 0.08), hsl(35 90% 50% / 0.08))" }}
            >
              <p className="font-display font-bold text-lg text-foreground">{day.promo}</p>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-400/50"
                onClick={() => copyText(day.promo!, "Promo")}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar promo ✓
              </Button>
            </div>
          </section>
        )}

        {/* Sección 5 — Outfit Colaborativo (día 4) */}
        {day.collabCopies && (
          <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="font-display font-bold text-sm text-foreground">👥 Outfit Colaborativo</h2>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Publica estos 6 estados en orden para crear una experiencia interactiva con tus clientas:
              </p>
              <div className="space-y-2">
                {day.collabCopies.map((cc) => (
                  <div
                    key={cc.number}
                    className="rounded-lg border border-border p-3 flex items-start gap-3"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                    >
                      {cc.number}
                    </span>
                    <p className="text-sm text-foreground flex-1">"{cc.text}"</p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const all = day.collabCopies!.map((c) => `Estado ${c.number}: ${c.text}`).join("\n\n");
                  copyText(all, "Todos los copies");
                }}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar todos los copies ✓
              </Button>
            </div>
          </section>
        )}

        {/* Sección 6 — Secuencia de Seguimiento */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">🔄 Secuencia de Seguimiento</h2>
          </div>
          <div className="p-4 space-y-4">
            {day.followUps.map((fu, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{fu.label}</Badge>
                  <span className="text-[11px] text-muted-foreground">— {fu.timing}</span>
                </div>
                <WhatsAppChat
                  contactName="[Nombre]"
                  messages={followUpMessages(fu)}
                  compact
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => copyText(fu.message, fu.label)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copiar ✓
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Botón completar */}
        {!completed && !justCompleted ? (
          <Button
            variant="gradient"
            size="lg"
            className="w-full text-base py-6"
            onClick={handleComplete}
          >
            ✅ Marcar día como completado
          </Button>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-5 py-3 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
              <Check className="w-5 h-5" /> Día completado
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayDetail;
