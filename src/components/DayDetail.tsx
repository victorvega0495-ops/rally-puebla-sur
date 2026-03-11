import { useState, useCallback, useRef, useEffect } from "react";
import OpenerSlider from "@/components/OpenerSlider";
import PromoSlider from "@/components/PromoSlider";
import { ArrowLeft, Copy, Check, Image as ImageIcon, Upload, X, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusUploader from "@/components/StatusUploader";
import OutfitColabCarousel from "@/components/OutfitColabCarousel";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import WhatsAppChat, { WAMessage } from "@/components/WhatsAppChat";
import CommunityDrawer from "@/components/CommunityDrawer";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { DayData, celebrationMessages } from "@/data/campaignData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DayDetailProps {
  day: DayData;
  totalDays: number;
  completed: boolean;
  campaignId: string;
  campaignTitle: string;
  isAdmin?: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
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

const DayDetail = ({ day, totalDays, completed, campaignId, campaignTitle, isAdmin, onBack, onComplete, onNavigateNext, onNavigatePrev }: DayDetailProps) => {
  const { toast } = useToast();
  const [justCompleted, setJustCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [contacted, setContacted] = useState("");
  const [responded, setResponded] = useState("");
  const [sales, setSales] = useState("");
  const [lookAsset, setLookAsset] = useState<{ url: string; fileName: string } | null>(null);
  const [lookUploading, setLookUploading] = useState(false);
  const [lookProgress, setLookProgress] = useState(0);
  const lookInputRef = useRef<HTMLInputElement>(null);

  const contactedN = parseInt(contacted) || 0;
  const respondedN = parseInt(responded) || 0;
  const salesN = parseInt(sales) || 0;
  const responsePct = contactedN > 0 ? Math.round((respondedN / contactedN) * 100) : 0;
  const salesPct = contactedN > 0 ? Math.round((salesN / contactedN) * 100) : 0;

  // Load look_principal asset
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("storage_url, file_name")
        .eq("campaign", campaignId)
        .eq("day_number", day.day)
        .eq("asset_type", "look_principal")
        .maybeSingle();
      if (data) setLookAsset({ url: data.storage_url, fileName: data.file_name });
    };
    load();
  }, [campaignId, day.day]);

  const uploadLook = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${campaignId}/dia-${day.day}/look-principal.${ext}`;
    setLookUploading(true);
    setLookProgress(0);
    const interval = setInterval(() => {
      setLookProgress((p) => Math.min(p + 12, 90));
    }, 200);

    const { error } = await supabase.storage.from("campaign-assets").upload(path, file, { upsert: true, contentType: file.type });
    clearInterval(interval);
    if (error) {
      setLookUploading(false);
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      return;
    }
    setLookProgress(100);
    const { data: urlData } = supabase.storage.from("campaign-assets").getPublicUrl(path);
    await supabase.from("day_assets").upsert(
      { campaign: campaignId, day_number: day.day, asset_type: "look_principal", storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );
    setLookAsset({ url: urlData.publicUrl, fileName: file.name });
    setLookUploading(false);
    toast({ title: "¡Look subido! ✓", duration: 2000 });
  }, [campaignId, day.day, toast]);

  const removeLook = useCallback(async () => {
    if (lookAsset) {
      const urlParts = lookAsset.url.split("/storage/v1/object/public/campaign-assets/");
      if (urlParts[1]) await supabase.storage.from("campaign-assets").remove([urlParts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaignId).eq("day_number", day.day).eq("asset_type", "look_principal");
    setLookAsset(null);
    toast({ title: "Look eliminado ✓", duration: 2000 });
  }, [campaignId, day.day, lookAsset, toast]);

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
          <p className="text-lg text-white/70">Día {day.day} de {totalDays}</p>
          <Progress value={(day.day / totalDays) * 100} className="h-1.5 bg-white/20 max-w-[200px] mx-auto" />
          <h1 className="font-display text-[32px] font-bold mt-2 leading-tight">{day.emoji} {day.focus}</h1>
          <Badge className={cn("text-sm px-3 py-1", typeBadgeColors[day.type])}>{day.typeLabel}</Badge>
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
          {day.missionQuote && (
            <p className="text-sm italic mt-2" style={{ color: "hsl(330 85% 55%)" }}>
              "{day.missionQuote}"
            </p>
          )}
        </section>


        {/* 3 — El Look del Día (enhanced) */}
        <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-sm text-foreground">👗 El Look del Día</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Look image with Supabase Storage */}
            {lookUploading ? (
              <div className="rounded-xl aspect-[9/16] w-full border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 bg-muted/20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <Progress value={lookProgress} className="w-3/4 h-2" />
                <span className="text-xs text-muted-foreground">{Math.round(lookProgress)}%</span>
              </div>
            ) : lookAsset ? (
              <div className="relative">
                <div className="rounded-xl aspect-[9/16] w-full overflow-hidden relative">
                  <img src={lookAsset.url} alt={day.lookName} className="w-full h-full object-cover" />
                  {isAdmin && (
                    <>
                      <button onClick={() => lookInputRef.current?.click()} className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                        <Upload className="w-4 h-4" />
                      </button>
                      <button onClick={removeLook} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <a href={lookAsset.url} download={lookAsset.fileName} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-medium">
                  <Download className="w-3.5 h-3.5" /> Descargar look
                </a>
              </div>
            ) : (
              <div className="relative rounded-xl aspect-[9/16] w-full flex flex-col items-center justify-center text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.7), hsl(275 65% 50% / 0.7))" }}
              >
                {isAdmin ? (
                  <button onClick={() => lookInputRef.current?.click()} className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 opacity-70" />
                    <p className="font-display font-bold text-sm text-center px-4">Subir look</p>
                  </button>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 mb-2 opacity-60" />
                    <p className="font-display font-bold text-sm text-center px-4">{day.lookName}</p>
                  </>
                )}
              </div>
            )}
            <input ref={lookInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { uploadLook(f); e.target.value = ""; }
            }} />
            <div>
              <p className="font-display font-bold text-foreground">{day.lookName}</p>
              <p className="text-xs text-muted-foreground mt-1">{day.lookProductIds}</p>
            </div>

            {/* Atributos del producto */}
            <p className="text-sm text-muted-foreground">{day.lookAttributes[0]}</p>

            {/* La clienta ideal */}
            <div
              className="rounded-xl p-3"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.06), hsl(275 65% 50% / 0.06))" }}
            >
              <p className="text-sm text-foreground">
                <span className="font-bold">¿Para quién es?</span> {day.idealClient.quien}
              </p>
            </div>

            {/* Tips de venta */}
            <div className="space-y-1.5">
              {day.salesHacks.map((tip, i) => (
                <p key={i} className="text-sm text-foreground">{tip}</p>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">
              📌 Familiarízate con este look antes de empezar
            </p>
          </div>
        </section>

        {/* 4 — Estado de Hoy / Outfit Colaborativo */}
        {day.day === 4 ? (
          <OutfitColabCarousel
            campaign={campaignId}
            dayNumber={day.day}
            isAdmin={isAdmin}
          />
        ) : (
          <StatusUploader
            lookName={day.lookName}
            statusCopyImage={day.statusCopyImage}
            statusCopyVideo={day.statusCopyVideo}
            reelStructure={day.reelStructure}
            campaign={campaignId}
            dayNumber={day.day}
            isAdmin={isAdmin}
          />
        )}


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
        <OpenerSlider dayMessages={day.openingMessages} />

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

        {/* Navigation row */}
        <div className="flex items-center gap-2">
          {day.day > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-purple-400 text-purple-600 dark:border-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              onClick={() => { window.scrollTo(0, 0); onNavigatePrev(); }}
            >
              ← Día anterior
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-pink-400 text-pink-600 dark:border-pink-500 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30"
            onClick={onBack}
          >
            ⊞ Ver 7 días
          </Button>
          {day.day < totalDays && (
            <Button
              size="sm"
              className="flex-1 text-xs text-white font-semibold shadow-lg animate-[nav-glow_2s_ease-in-out_infinite]"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
              onClick={() => { window.scrollTo(0, 0); onNavigateNext(); }}
            >
              Día siguiente →
            </Button>
          )}
        </div>

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
