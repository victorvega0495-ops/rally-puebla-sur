import { useState, useCallback } from "react";
import OpenerSlider from "@/components/OpenerSlider";
import PromoSlider from "@/components/PromoSlider";
import { ArrowLeft, Copy, Check, Play, Image as ImageIcon, Film, Sparkles, User, Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import WhatsAppChat, { WAMessage } from "@/components/WhatsAppChat";
import CommunityDrawer from "@/components/CommunityDrawer";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { DayData, celebrationMessages } from "@/data/campaignData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DayDetailProps {
  day: DayData;
  totalDays: number;
  completed: boolean;
  campaignId: string;
  campaignTitle: string;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

const typeBadgeColors: Record<string, string> = {
  activacion: "bg-orange-500/90 text-white border-0",
  prospeccion: "bg-blue-500/90 text-white border-0",
  seguimiento: "bg-amber-500/90 text-white border-0",
  cierre: "bg-emerald-500/90 text-white border-0",
};

const getMotivationalMessage = (responsePct: number) => {
  if (responsePct === 0) return "Normal para el primer intento 💪 El músculo se entrena — mañana responden más";
  if (responsePct <= 20) return "Buen arranque 🔥 Con cada día que pasa tu tasa va a subir";
  if (responsePct <= 50) return "Vas muy bien 🚀 Estás por encima del promedio";
  return "Eres una máquina 🏆 Eso es lo que pasa cuando el mensaje es personal";
};

const DayDetail = ({ day, totalDays, completed, campaignId, campaignTitle, onBack, onComplete, onNavigateNext }: DayDetailProps) => {
  const { toast } = useToast();
  const [justCompleted, setJustCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [contacted, setContacted] = useState("");
  const [responded, setResponded] = useState("");
  const [sales, setSales] = useState("");

  const contactedN = parseInt(contacted) || 0;
  const respondedN = parseInt(responded) || 0;
  const salesN = parseInt(sales) || 0;
  const responsePct = contactedN > 0 ? Math.round((respondedN / contactedN) * 100) : 0;
  const salesPct = contactedN > 0 ? Math.round((salesN / contactedN) * 100) : 0;

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copiado ✓`, duration: 2000 });
    });
  };

  const handleComplete = () => {
    onComplete();
    setShowCelebration(true);
  };

  const handleCelebrationDone = useCallback(() => {
    setShowCelebration(false);
    setJustCompleted(true);
    onNavigateNext();
  }, [onNavigateNext]);

  return (
    <div className="pt-16 pb-24">
      {showCelebration && (
        <CelebrationOverlay
          message={celebrationMessages[day.day - 1] || "¡Día completado! 🎉"}
          onDone={handleCelebrationDone}
        />
      )}

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
        {/* 1 — Tu Misión de Hoy */}
        <section
          className="rounded-2xl overflow-hidden shadow-sm p-5"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.12), hsl(275 65% 50% / 0.12))" }}
        >
          <p className="text-2xl mb-2">🎯</p>
          <h2 className="font-display font-bold text-sm text-foreground mb-2">Tu Misión de Hoy</h2>
          <p className="text-sm text-foreground/90 leading-relaxed">{day.mission}</p>
        </section>

        {/* 2 — Tus Pasos de Hoy */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">📋 Tus Pasos de Hoy</h2>
          </div>
          <div className="p-4 space-y-3">
            {day.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 — El Look del Día (enhanced) */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">👗 El Look del Día</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Visual placeholder — NO price, NO brand on image */}
            <div
              className="rounded-xl aspect-[3/4] max-h-[280px] w-full flex flex-col items-center justify-center text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.7), hsl(275 65% 50% / 0.7))" }}
            >
              <ImageIcon className="w-10 h-10 mb-2 opacity-60" />
              <p className="font-display font-bold text-sm text-center px-4">{day.lookName}</p>
            </div>
            <div>
              <p className="font-display font-bold text-foreground">{day.lookName}</p>
              <p className="text-xs text-muted-foreground mt-1">{day.lookProductIds}</p>
            </div>

            {/* Atributos del producto */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Atributos del Producto</p>
              <ul className="space-y-1.5">
                {day.lookAttributes.map((attr, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* La clienta ideal */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.06), hsl(275 65% 50% / 0.06))" }}
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">La Clienta Ideal</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Quién es</p>
                    <p className="text-sm text-foreground">{day.idealClient.quien}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Qué busca</p>
                    <p className="text-sm text-foreground">{day.idealClient.queBusca}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Dónde la encuentras</p>
                    <p className="text-sm text-foreground">{day.idealClient.donde}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hacks de venta */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">🧠 Hacks de Venta</p>
              {day.salesHacks.map((hack, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-foreground leading-relaxed">{hack}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground italic">
              📌 Familiarízate con este look antes de empezar
            </p>
          </div>
        </section>

        {/* 4 — Estado de Hoy */}
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
              <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(day.statusCopyImage, "Copy del estado")}>
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
              <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(day.statusCopyVideo, "Copy del video")}>
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar copy ✓
              </Button>
            </TabsContent>
          </Tabs>
        </section>


        {/* 6 — Promo (días que aplica) */}
        {day.promo && (
          <section className="rounded-2xl border-2 border-amber-400/50 overflow-hidden shadow-md">
            <div
              className="p-4 border-b border-amber-400/30"
              style={{ background: "linear-gradient(135deg, hsl(45 90% 55% / 0.15), hsl(35 90% 50% / 0.15))" }}
            >
              <h2 className="font-display font-bold text-sm text-foreground">🎁 Tu Promo de Hoy</h2>
            </div>
            <div
              className="p-5 space-y-4"
              style={{ background: "linear-gradient(135deg, hsl(45 90% 55% / 0.08), hsl(35 90% 50% / 0.08))" }}
            >
              <p className="font-display font-bold text-lg text-foreground text-center">{day.promo}</p>
              <Button variant="outline" size="sm" className="w-full border-amber-400/50" onClick={() => copyText(day.promo!, "Promo")}>
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar promo ✓
              </Button>
              <PromoSlider dayNumber={day.day} />
            </div>
          </section>
        )}

        {/* Outfit Colaborativo (día 4) */}
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
                  <div key={cc.number} className="rounded-lg border border-border p-3 flex items-start gap-3">
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
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                const all = day.collabCopies!.map((c) => `Estado ${c.number}: ${c.text}`).join("\n\n");
                copyText(all, "Todos los copies");
              }}>
                <Copy className="w-3.5 h-3.5 mr-1" /> Copiar todos los copies ✓
              </Button>
            </div>
          </section>
        )}

        {/* 7 — ¿Cómo arrancar según tu clienta? — animated slider */}
        <OpenerSlider />

        {/* 8 — Manejo de Objeciones */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">💬 ¿Qué hago si me dice...?</h2>
          </div>
          <div className="p-4">
            <Accordion type="single" collapsible className="space-y-2">
              {day.objections.map((obj, i) => (
                <AccordionItem key={i} value={`obj-${i}`} className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-medium text-foreground py-3 hover:no-underline">
                    "{obj.objection}"
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 space-y-3">
                    <WhatsAppChat
                      contactName="[Nombre]"
                      messages={[{ text: obj.response, sent: true, time: "10:30 a.m." }]}
                      compact
                    />
                    <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(obj.response, "Respuesta")}>
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copiar ✓
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Mini Tracker */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">📊 Tu Resultado de Hoy</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-bold uppercase">Contactadas</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={contacted}
                  onChange={(e) => setContacted(e.target.value)}
                  className="text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-bold uppercase">Respondieron</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={responded}
                  onChange={(e) => setResponded(e.target.value)}
                  className="text-center text-lg font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-bold uppercase">Ventas</label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  className="text-center text-lg font-bold"
                />
              </div>
            </div>

            {contactedN > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tasa de respuesta: <strong className="text-foreground">{responsePct}%</strong></span>
                  <span>Tasa de cierre: <strong className="text-foreground">{salesPct}%</strong></span>
                </div>
                <div
                  className="rounded-lg p-3 text-sm text-foreground font-medium text-center"
                  style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.08), hsl(275 65% 50% / 0.08))" }}
                >
                  {getMotivationalMessage(responsePct)}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Complete button */}
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

      {/* Floating community drawer */}
      <CommunityDrawer dayNumber={day.day} campaign={campaignTitle} />
    </div>
  );
};

export default DayDetail;
