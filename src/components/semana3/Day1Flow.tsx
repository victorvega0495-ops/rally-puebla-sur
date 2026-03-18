import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Copy, Check, Download, Share2, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageLightbox from "@/components/ImageLightbox";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { celebrationMessages } from "@/data/campaignData";
import { cn } from "@/lib/utils";

interface Day1FlowProps {
  campaignId: string;
  campaignTitle: string;
  isAdmin?: boolean;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

const TOTAL_STEPS = 5; // 4 pasos + resumen
const BUCKET = "campaign-assets";
const DAY = 1;

const GENERIC_OPENERS = {
  cold: [
    "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
    "Holaaa [Nombre], ¡cuánto tiempo sin saber de ti! 😊 Mira, me llegó algo nuevo y de volada dije \"esto le va a gustar\". ¿Te lo enseño?",
    "Hola [Nombre], ¿cómo estás? Te escribo porque acabo de recibir algo que se me hizo ideal para ti. ¿Te mando foto? Sin compromiso 😊",
    "Holaaa [Nombre], sé que tiene rato que no nos vemos pero mira lo que acaba de llegar — creo que te va a encantar 😍 ¿Te lo mando?",
  ],
  warm: [
    "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
    "Holaaa [Nombre], mira lo que acabo de armar — creo que te va a encantar. ¿Te lo enseño? 😍",
    "Oye [Nombre], acabo de recibir algo nuevo y dije \"esto es para ella\". ¿Te lo mando? 😊",
    "Holaaa [Nombre], ¿cómo te va? Tengo algo que creo que te va a gustar mucho. ¿Te mando foto?",
  ],
  hot: [
    "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    "Oye [Nombre], ¿ya viste mi estado? Ahí subí algo que sé que te va a gustar. ¿Te lo mando por aquí?",
    "Hola [Nombre], oye acabo de subir algo a mi estado que sé que es tu estilo. ¿Quieres que te lo mande? 😊",
    "Oye [Nombre], mira esto — de volada pensé en ti cuando lo vi. ¿Te interesa? 😍",
  ],
};

const PLACEHOLDER_OBJECTIONS = [
  { objection: "¿Cuánto cuesta?", response: "Con gusto te paso el precio — ¿te lo mando con foto para que lo veas completo? 😊" },
  { objection: "Está caro", response: "Entiendo hermosa — mira, la calidad de este producto es importada y se nota en los acabados. Aparte te dura mucho más que uno comercial. ¿Te lo apartas y te lo pago en 2 partes?" },
  { objection: "Lo voy a pensar", response: "Claro que sí 😊 Solo te comento que estos importados se van rápido porque llegan poquitos. Si decides mañana con gusto te ayudo pero no te garantizo que haya. ¿Qué es lo que te genera duda?" },
];

const Day1Flow = ({ campaignId, campaignTitle, isAdmin, completed, onBack, onComplete, onNavigateNext }: Day1FlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0-4
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [showCelebration, setShowCelebration] = useState(false);

  // Product grid assets (12 slots)
  const [gridAssets, setGridAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [gridUploading, setGridUploading] = useState<number | null>(null);
  const gridInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  // Carousel assets (5 slots)
  const [carouselAssets, setCarouselAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [carouselUploading, setCarouselUploading] = useState<number | null>(null);
  const carouselInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Opener tabs
  const [openerTab, setOpenerTab] = useState<"cold" | "warm" | "hot">("cold");

  // Load assets from supabase
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name")
        .eq("campaign", campaignId)
        .eq("day_number", DAY);
      if (data) {
        data.forEach((row) => {
          if (row.asset_type.startsWith("grid_")) {
            const idx = parseInt(row.asset_type.replace("grid_", ""));
            setGridAssets((prev) => ({ ...prev, [idx]: { url: row.storage_url, fileName: row.file_name } }));
          } else if (row.asset_type.startsWith("carousel_")) {
            const idx = parseInt(row.asset_type.replace("carousel_", ""));
            setCarouselAssets((prev) => ({ ...prev, [idx]: { url: row.storage_url, fileName: row.file_name } }));
          }
        });
      }
    };
    load();
  }, [campaignId]);

  const uploadAsset = useCallback(async (file: File, assetType: string, slotIdx: number, setter: React.Dispatch<React.SetStateAction<Record<number, { url: string; fileName: string } | null>>>, setUploading: React.Dispatch<React.SetStateAction<number | null>>) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${campaignId}/dia-${DAY}/${assetType}.${ext}`;
    setUploading(slotIdx);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(null);
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await supabase.from("day_assets").upsert(
      { campaign: campaignId, day_number: DAY, asset_type: assetType, storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );
    setter((prev) => ({ ...prev, [slotIdx]: { url: urlData.publicUrl, fileName: file.name } }));
    setUploading(null);
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaignId, toast]);

  const removeAsset = useCallback(async (assetType: string, slotIdx: number, setter: React.Dispatch<React.SetStateAction<Record<number, { url: string; fileName: string } | null>>>, assets: Record<number, { url: string; fileName: string } | null>) => {
    const asset = assets[slotIdx];
    if (asset) {
      const urlParts = asset.url.split("/storage/v1/object/public/campaign-assets/");
      if (urlParts[1]) await supabase.storage.from(BUCKET).remove([urlParts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaignId).eq("day_number", DAY).eq("asset_type", assetType);
    setter((prev) => ({ ...prev, [slotIdx]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaignId, toast]);

  const shareOrDownload = useCallback(async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const cleanName = `look.${ext}`;
      const mimeType = blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
      const file = new File([blob], cleanName, { type: mimeType });
      if (navigator.share) {
        await navigator.share({ files: [file] });
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = cleanName;
        a.click();
        URL.revokeObjectURL(blobUrl);
      }
    } catch (e) {
      // user cancelled share
    }
  }, []);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copiado ✓", duration: 2000 });
    });
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection("right");
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection("left");
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
    onComplete();
    setShowCelebration(true);
  };

  const handleCelebrationDone = useCallback(() => {
    setShowCelebration(false);
    onNavigateNext();
  }, [onNavigateNext]);

  const stepLabels = ["La misión", "Los productos", "Tu contenido", "Súbelas", "Resumen"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showCelebration && (
        <CelebrationOverlay
          message={celebrationMessages[0] || "¡Día completado! 🎉"}
          onDone={handleCelebrationDone}
        />
      )}
      <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-muted-foreground">
            Paso {step + 1} de {TOTAL_STEPS} — {stepLabels[step]}
          </span>
          <div className="w-5" />
        </div>
        <Progress
          value={((step + 1) / TOTAL_STEPS) * 100}
          className="h-2 bg-muted"
        />
      </div>

      {/* Content area */}
      <div className="flex-1 pt-20 pb-24 overflow-y-auto">
        <div
          key={step}
          className={cn(
            "animate-in duration-300 px-5 max-w-lg mx-auto",
            direction === "right" ? "slide-in-from-right-8" : "slide-in-from-left-8"
          )}
        >
          {step === 0 && <Step1Mission />}
          {step === 1 && (
            <Step2Products
              assets={gridAssets}
              uploading={gridUploading}
              isAdmin={isAdmin}
              inputRefs={gridInputRefs}
              onUpload={(file, idx) => uploadAsset(file, `grid_${idx}`, idx, setGridAssets, setGridUploading)}
              onRemove={(idx) => removeAsset(`grid_${idx}`, idx, setGridAssets, gridAssets)}
              onImageClick={(url, alt) => { setLightboxSrc(url); setLightboxAlt(alt); }}
            />
          )}
          {step === 2 && (
            <Step3Carousel
              assets={carouselAssets}
              uploading={carouselUploading}
              isAdmin={isAdmin}
              inputRefs={carouselInputRefs}
              activeIndex={carouselIndex}
              onIndexChange={setCarouselIndex}
              onUpload={(file, idx) => uploadAsset(file, `carousel_${idx}`, idx, setCarouselAssets, setCarouselUploading)}
              onRemove={(idx) => removeAsset(`carousel_${idx}`, idx, setCarouselAssets, carouselAssets)}
              onAdvance={goNext}
            />
          )}
          {step === 3 && (
            <Step4Upload
              assets={carouselAssets}
              onShare={shareOrDownload}
            />
          )}
          {step === 4 && (
            <StepSummary
              openerTab={openerTab}
              onOpenerTabChange={setOpenerTab}
              onCopy={copyText}
              completed={completed}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex items-center gap-3">
        {step > 0 ? (
          <Button variant="outline" className="flex-1 border-muted-foreground/30 text-muted-foreground" onClick={goPrev}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
        ) : (
          <div className="flex-1" />
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button
            className="flex-1 text-white font-semibold"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
            onClick={goNext}
          >
            Siguiente <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
};

/* ========== STEP 1 — Mission ========== */
const Step1Mission = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-8">
    <p className="text-5xl">🎯</p>
    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
      Hoy tu estado vende por ti
    </h1>
    <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
      Un carrusel bien armado hace que más gente vea tus productos, reaccione, y te pregunte. Tú subes las imágenes — el estado hace el trabajo.
    </p>
    <p className="text-sm italic max-w-xs" style={{ color: "hsl(330 85% 55%)" }}>
      "No necesitas convencer a nadie — solo necesitas aparecer."
    </p>
  </div>
);

/* ========== STEP 2 — Products grid ========== */
interface Step2Props {
  assets: Record<number, { url: string; fileName: string } | null>;
  uploading: number | null;
  isAdmin?: boolean;
  inputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  onUpload: (file: File, idx: number) => void;
  onRemove: (idx: number) => void;
  onImageClick: (url: string, alt: string) => void;
}

const Step2Products = ({ assets, uploading, isAdmin, inputRefs, onUpload, onRemove, onImageClick }: Step2Props) => (
  <div className="space-y-5 py-6">
    <div className="text-center space-y-2">
      <h1 className="font-display text-2xl font-bold text-foreground">Los looks de hoy</h1>
      <p className="text-sm text-muted-foreground">Toca cualquier imagen para verla completa</p>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 12 }, (_, i) => {
        const asset = assets[i];
        const isUploading = uploading === i;
        return (
          <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.3), hsl(275 65% 50% / 0.3))" }}>
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : asset ? (
              <>
                <img
                  src={asset.url}
                  alt={`Producto ${i + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                  onClick={() => onImageClick(asset.url, `Producto ${i + 1}`)}
                />
                {isAdmin && (
                  <button
                    onClick={() => onRemove(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer"
                style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }}
                onClick={() => isAdmin && inputRefs.current[i]?.click()}
              >
                {isAdmin ? (
                  <Upload className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                )}
                <span className="text-[9px] text-muted-foreground">{i + 1}</span>
              </div>
            )}
            <input
              ref={(el) => { inputRefs.current[i] = el; }}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { onUpload(f, i); e.target.value = ""; }
              }}
            />
          </div>
        );
      })}
    </div>
  </div>
);

/* ========== STEP 3 — Carousel viewer ========== */
interface Step3Props {
  assets: Record<number, { url: string; fileName: string } | null>;
  uploading: number | null;
  isAdmin?: boolean;
  inputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  activeIndex: number;
  onIndexChange: (i: number) => void;
  onUpload: (file: File, idx: number) => void;
  onRemove: (idx: number) => void;
  onAdvance: () => void;
}

const Step3Carousel = ({ assets, uploading, isAdmin, inputRefs, activeIndex, onIndexChange, onUpload, onRemove, onAdvance }: Step3Props) => {
  const total = 5;
  const asset = assets[activeIndex];
  const isUploading = uploading === activeIndex;
  const isLast = activeIndex === total - 1;

  return (
    <div className="space-y-5 py-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">Tus 5 imágenes para el carrusel</h1>
        <p className="text-sm text-muted-foreground">Revísalas una por una — estas son las que vas a subir hoy</p>
      </div>

      {/* Single image viewer */}
      <div className="relative aspect-[9/16] w-full max-w-xs mx-auto rounded-2xl overflow-hidden">
        {isUploading ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.3), hsl(275 65% 50% / 0.3))" }}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : asset ? (
          <>
            <img src={asset.url} alt={`Carrusel ${activeIndex + 1}`} className="w-full h-full object-cover" />
            {isAdmin && (
              <>
                <button onClick={() => inputRefs.current[activeIndex]?.click()} className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                  <Upload className="w-4 h-4" />
                </button>
                <button onClick={() => onRemove(activeIndex)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.25), hsl(275 65% 50% / 0.25))" }}
            onClick={() => isAdmin && inputRefs.current[activeIndex]?.click()}
          >
            {isAdmin ? (
              <>
                <Upload className="w-8 h-8 text-white/70" />
                <span className="text-sm text-white/70 font-medium">Subir imagen {activeIndex + 1}</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-white/40" />
                <span className="text-sm text-white/50">Imagen {activeIndex + 1}</span>
              </>
            )}
          </div>
        )}
        <input
          ref={(el) => { inputRefs.current[activeIndex] = el; }}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { onUpload(f, activeIndex); e.target.value = ""; }
          }}
        />

        {/* Nav arrows */}
        {activeIndex > 0 && (
          <button
            onClick={() => onIndexChange(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {activeIndex < total - 1 && (
          <button
            onClick={() => onIndexChange(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i === activeIndex
                ? "scale-125"
                : "bg-muted-foreground/30"
            )}
            style={i === activeIndex ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}}
          />
        ))}
      </div>

      {/* Advance button on last image */}
      {isLast && (
        <Button
          className="w-full text-white font-semibold"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          onClick={onAdvance}
        >
          Listo — ¿cómo las subo? →
        </Button>
      )}
    </div>
  );
};

/* ========== STEP 4 — Upload instructions ========== */
interface Step4Props {
  assets: Record<number, { url: string; fileName: string } | null>;
  onShare: (url: string, fileName: string) => void;
}

const Step4Upload = ({ assets, onShare }: Step4Props) => (
  <div className="space-y-6 py-6">
    <div className="text-center space-y-2">
      <h1 className="font-display text-2xl font-bold text-foreground">Así se hace en 3 pasos</h1>
    </div>

    <div className="space-y-4">
      {[
        { num: 1, text: 'Toca "Compartir 📤" en cualquier imagen' },
        { num: 2, text: "Elige WhatsApp → Mi Estado" },
        { num: 3, text: "Repite con las 5 — el carrusel se arma solo" },
      ].map((s) => (
        <div key={s.num} className="flex items-start gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          >
            {s.num}
          </span>
          <p className="text-sm text-foreground pt-1.5">{s.text}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 5 }, (_, i) => {
        const asset = assets[i];
        return (
          <div key={i} className="space-y-1.5">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              {asset ? (
                <img src={asset.url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }}
                >
                  <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
            {asset && (
              <div className="flex gap-1">
                <a
                  href={asset.url}
                  download={asset.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted/50 rounded py-1.5 hover:bg-muted"
                >
                  <Download className="w-3 h-3" />
                </a>
                <button
                  onClick={() => onShare(asset.url, asset.fileName)}
                  className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium text-white rounded py-1.5"
                  style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                >
                  <Share2 className="w-3 h-3" /> 📤
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>

    <p className="text-xs text-muted-foreground text-center">
      También puedes descargarlas todas y subirlas desde tu galería
    </p>
  </div>
);

/* ========== STEP 5 — Summary ========== */
interface SummaryProps {
  openerTab: "cold" | "warm" | "hot";
  onOpenerTabChange: (t: "cold" | "warm" | "hot") => void;
  onCopy: (text: string) => void;
  completed: boolean;
  onComplete: () => void;
}

const StepSummary = ({ openerTab, onOpenerTabChange, onCopy, completed, onComplete }: SummaryProps) => {
  const tabs = [
    { key: "cold" as const, label: "🥶 +60 días", color: "bg-blue-500/10 border-blue-400/50 text-blue-700 dark:text-blue-300" },
    { key: "warm" as const, label: "😊 15-60 días", color: "bg-amber-500/10 border-amber-400/50 text-amber-700 dark:text-amber-300" },
    { key: "hot" as const, label: "🔥 -15 días", color: "bg-red-500/10 border-red-400/50 text-red-700 dark:text-red-300" },
  ];

  return (
    <div className="space-y-8 py-6">
      {/* Checklist */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-foreground">Lo que haces hoy</h2>
        {[
          "Sube las 5 imágenes a tu estado",
          "Espera reacciones y preguntas",
          "A quien pregunte mándale el abridor",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3 border border-border bg-card">
            <span className="text-lg">☐</span>
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>

      {/* Openers */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-foreground">Tus abridores</h2>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onOpenerTabChange(t.key)}
              className={cn(
                "flex-1 text-xs font-semibold py-2 rounded-lg border transition-all",
                openerTab === t.key ? t.color : "bg-muted/30 border-border text-muted-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {GENERIC_OPENERS[openerTab].map((msg, i) => (
            <div key={i} className="rounded-xl border border-border p-3 space-y-2">
              <p className="text-sm text-foreground leading-relaxed">"{msg}"</p>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onCopy(msg)}>
                <Copy className="w-3 h-3 mr-1" /> Copiar
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Objections */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-foreground">Si te preguntan el precio</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {PLACEHOLDER_OBJECTIONS.map((obj, i) => (
            <AccordionItem key={i} value={`obj-${i}`} className="border rounded-xl px-3">
              <AccordionTrigger className="text-sm font-medium text-foreground py-3 hover:no-underline">
                "{obj.objection}"
              </AccordionTrigger>
              <AccordionContent className="pb-3 space-y-2">
                <p className="text-sm text-muted-foreground">{obj.response}</p>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onCopy(obj.response)}>
                  <Copy className="w-3 h-3 mr-1" /> Copiar
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Complete button */}
      {!completed ? (
        <Button
          className="w-full text-base py-6 text-white font-bold"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          onClick={onComplete}
        >
          ✅ Marcar día completado
        </Button>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-5 py-3 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
            <Check className="w-5 h-5" /> Día completado
          </div>
        </div>
      )}
    </div>
  );
};

export default Day1Flow;
