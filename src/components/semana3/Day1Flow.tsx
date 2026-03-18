import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Share2, Upload, X, Loader2, Image as ImageIcon, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ProductMetaInputs, ProductMetaOverlay } from "./ProductMetaFields";

const TOTAL_STEPS = 4;

interface Day1FlowProps {
  campaignId: string;
  campaignTitle: string;
  isAdmin?: boolean;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

const BUCKET = "campaign-assets";
const DAY = 1;

const Day1Flow = ({ campaignId, campaignTitle, isAdmin, completed, onBack, onComplete, onNavigateNext }: Day1FlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dayCompleted, setDayCompleted] = useState(completed);

  const [carouselAssets, setCarouselAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [carouselUploading, setCarouselUploading] = useState<number | null>(null);
  const carouselInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name")
        .eq("campaign", campaignId)
        .eq("day_number", DAY);
      if (data) {
        data.forEach((row) => {
          if (row.asset_type.startsWith("carousel_")) {
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
    } catch {
      // user cancelled share
    }
  }, []);

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) { setDirection("right"); setStep(step + 1); window.scrollTo(0, 0); }
  };
  const goPrev = () => {
    if (step > 0) { setDirection("left"); setStep(step - 1); window.scrollTo(0, 0); }
  };
  const goToStep = (s: number) => {
    setDirection(s > step ? "right" : "left"); setStep(s); window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    onComplete();
    setDayCompleted(true);
  };

  const stepLabels = ["La misión", "Tu contenido", "Súbelas", "Resumen"];

  return (
    <div className="min-h-screen bg-background flex flex-col">

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
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-2 bg-muted" />
      </div>

      {/* Content */}
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
            <Step3Slider
              assets={carouselAssets} uploading={carouselUploading} isAdmin={isAdmin} inputRefs={carouselInputRefs}
              campaignId={campaignId} activeIndex={carouselIndex} onIndexChange={setCarouselIndex}
              onUpload={(file, idx) => uploadAsset(file, `carousel_${idx}`, idx, setCarouselAssets, setCarouselUploading)}
              onRemove={(idx) => removeAsset(`carousel_${idx}`, idx, setCarouselAssets, carouselAssets)}
              onShare={shareOrDownload}
            />
          )}
          {step === 2 && (
            <Step4Upload assets={carouselAssets} onShare={shareOrDownload} isAdmin={isAdmin} />
          )}
          {step === 3 && (
            <StepSummary
              completed={dayCompleted}
              onComplete={handleComplete}
              onBackToImages={() => goToStep(1)}
              onNavigateNext={onNavigateNext}
              onBackToMenu={onBack}
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
        ) : <div className="flex-1" />}
        {step < TOTAL_STEPS - 1 ? (
          <Button
            className="flex-1 text-white font-semibold"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
            onClick={goNext}
          >
            {step === TOTAL_STEPS - 2 ? "Ver resumen" : "Siguiente"} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : <div className="flex-1" />}
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
    <p className="text-sm italic max-w-xs" style={{ color: "hsl(330, 85%, 55%)" }}>
      "No necesitas convencer a nadie — solo necesitas aparecer."
    </p>
  </div>
);


/* ========== STEP 2 — Full-screen slider ========== */
interface Step3Props {
  assets: Record<number, { url: string; fileName: string } | null>;
  uploading: number | null;
  isAdmin?: boolean;
  inputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  campaignId: string;
  activeIndex: number;
  onIndexChange: (i: number) => void;
  onUpload: (file: File, idx: number) => void;
  onRemove: (idx: number) => void;
  onShare: (url: string, fileName: string) => void;
}

const Step3Slider = ({ assets, uploading, isAdmin, inputRefs, campaignId, activeIndex, onIndexChange, onUpload, onRemove, onShare }: Step3Props) => {
  const total = 5;
  const asset = assets[activeIndex];
  const isUploading = uploading === activeIndex;
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleShare = (url: string, fileName: string) => {
    onShare(url, fileName);
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 3000);
  };

  const goPrev = () => { if (activeIndex > 0) onIndexChange(activeIndex - 1); };
  const goNext = () => { if (activeIndex < total - 1) onIndexChange(activeIndex + 1); };

  return (
    <div className="flex flex-col items-center min-h-[65vh] py-4 -mx-5">
      {/* Full-width image area */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        {/* Numbered badge */}
        <div
          className="absolute top-3 left-5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
        >
          {activeIndex + 1}
        </div>

        {/* Nav arrows */}
        {activeIndex > 0 && (
          <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {activeIndex < total - 1 && (
          <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Admin upload for active slot */}
        {isAdmin && (
          <button
            onClick={() => inputRefs.current[activeIndex]?.click()}
            className="absolute top-3 right-5 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            <Upload className="w-4 h-4" />
          </button>
        )}
        {isAdmin && asset && (
          <button
            onClick={() => onRemove(activeIndex)}
            className="absolute top-3 right-16 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isUploading ? (
          <div className="w-full aspect-[9/16] max-h-[55vh] flex items-center justify-center rounded-2xl mx-5" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.3), hsl(275 65% 50% / 0.3))" }}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : asset ? (
          <div className="relative w-full">
            <img
              src={asset.url}
              alt={`Imagen ${activeIndex + 1}`}
              className="w-full max-h-[55vh] object-contain animate-in fade-in duration-200"
            />
            {!isAdmin && <ProductMetaOverlay campaignId={campaignId} dayNumber={DAY} assetType={`carousel_${activeIndex}`} />}
          </div>
        ) : (
          <div
            className="w-full aspect-[9/16] max-h-[55vh] flex flex-col items-center justify-center gap-2 rounded-2xl mx-5 cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }}
            onClick={() => isAdmin && inputRefs.current[activeIndex]?.click()}
          >
            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">Imagen {activeIndex + 1}</span>
          </div>
        )}

        {/* Hidden file inputs */}
        {Array.from({ length: total }, (_, i) => (
          <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { onUpload(f, i); e.target.value = ""; } }} />
        ))}
      </div>

      {/* Action buttons */}
      {asset && (
        <div className="flex items-center gap-3 mt-4 px-5 w-full max-w-sm">
          <button
            onClick={() => { try { fetch(asset.url).then(r => r.blob()).then(b => { const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = asset.fileName; a.click(); URL.revokeObjectURL(u); }); } catch {} }}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-muted-foreground/30 text-foreground hover:bg-muted/50 transition-colors"
          >
            <Download className="w-4 h-4" /> ⬇️ Descargar
          </button>
          <button
            onClick={() => handleShare(asset.url, asset.fileName)}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          >
            <Share2 className="w-4 h-4" /> 📤 Compartir
          </button>
        </div>
      )}

      {/* Admin meta inputs */}
      {isAdmin && (
        <div className="px-5 w-full max-w-sm mt-3">
          <ProductMetaInputs campaignId={campaignId} dayNumber={DAY} assetType={`carousel_${activeIndex}`} />
        </div>
      )}


      <div className="flex items-center justify-center gap-2.5 mt-5">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={cn("w-2.5 h-2.5 rounded-full transition-all", i === activeIndex ? "scale-125" : "bg-muted-foreground/30")}
            style={i === activeIndex ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}}
          />
        ))}
      </div>

      {/* Share popup overlay */}
      {showSharePopup && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pb-40 bg-black/30 animate-in fade-in duration-200"
          onClick={() => setShowSharePopup(false)}
        >
          <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl animate-in zoom-in-95 fade-in duration-300 space-y-2.5 min-w-[260px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">1</span>
              <p className="text-sm font-medium text-gray-800">Elige WhatsApp</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</span>
              <p className="text-sm font-medium text-gray-800">Toca Mi Estado</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========== STEP 4 — Upload in order ========== */
interface Step4Props {
  assets: Record<number, { url: string; fileName: string } | null>;
  onShare: (url: string, fileName: string) => void;
  isAdmin?: boolean;
}

const Step4Upload = ({ assets, onShare }: Step4Props) => {
  const [fullScreenIdx, setFullScreenIdx] = useState<number | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const fullScreenAsset = fullScreenIdx !== null ? assets[fullScreenIdx] : null;

  const handleShare = (url: string, fileName: string) => {
    onShare(url, fileName);
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 3000);
  };

  useEffect(() => {
    if (fullScreenIdx === null) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullScreenIdx(null); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [fullScreenIdx]);

  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">Súbelas en orden a tu estado</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Sigue el orden del 1 al 5 — toca cada imagen para abrirla y compartirla directo a tu estado de WhatsApp
        </p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => {
          const asset = assets[i];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer" onClick={() => asset && setFullScreenIdx(i)}>
                <div
                  className="absolute top-1 left-1 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow"
                  style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                >
                  {i + 1}
                </div>
                {asset ? (
                  <img src={asset.url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }}>
                    <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              {asset && (
                <div className="flex-1 flex items-center gap-2">
                  <button
                    onClick={() => { try { fetch(asset.url).then(r => r.blob()).then(b => { const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = asset.fileName; a.click(); URL.revokeObjectURL(u); }); } catch {} }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-muted-foreground/30 text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => handleShare(asset.url, asset.fileName)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white py-2.5 rounded-xl shadow-lg"
                    style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                  >
                    <Share2 className="w-3.5 h-3.5" /> 📤 Compartir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>


      {/* Full-screen lightbox with share */}
      {fullScreenIdx !== null && fullScreenAsset && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setFullScreenIdx(null)}>
          <button onClick={() => setFullScreenIdx(null)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10">
            <X className="w-6 h-6" />
          </button>
          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
            {fullScreenIdx + 1}
          </div>

          <img src={fullScreenAsset.url} alt={`Imagen ${fullScreenIdx + 1}`} className="max-h-[70vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />

          <div className="flex items-center gap-3 mt-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { try { fetch(fullScreenAsset.url).then(r => r.blob()).then(b => { const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = fullScreenAsset.fileName; a.click(); URL.revokeObjectURL(u); }); } catch {} }}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" /> ⬇️ Descargar
            </button>
            <button
              onClick={() => handleShare(fullScreenAsset.url, fullScreenAsset.fileName)}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
            >
              <Share2 className="w-4 h-4" /> 📤 Compartir
            </button>
          </div>

          {showSharePopup && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-6 py-4 shadow-2xl animate-in zoom-in-95 fade-in duration-300 space-y-2.5 min-w-[260px]" onClick={(e) => { e.stopPropagation(); setShowSharePopup(false); }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">1</span>
                <p className="text-sm font-medium text-gray-800">Elige WhatsApp</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-sm font-medium text-gray-800">Toca Mi Estado</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ========== STEP 5 — Confirmation ========== */
interface SummaryProps {
  completed: boolean;
  onComplete: () => void;
  onBackToImages: () => void;
  onNavigateNext: () => void;
  onBackToMenu: () => void;
}

const StepSummary = ({ completed, onComplete, onBackToImages, onNavigateNext, onBackToMenu }: SummaryProps) => {
  const [phase, setPhase] = useState<"idle" | "green" | "nav">(completed ? "nav" : "idle");

  const fireConfetti = async () => {
    try {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => {
        (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      };
      document.head.appendChild(script);
    } catch {
      // confetti unavailable
    }
  };

  const handleTap = () => {
    onComplete();
    setPhase("green");
    fireConfetti();
    setTimeout(() => setPhase("nav"), 2500);
  };

  const gradientStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #ec4899, #8b5cf6)",
    color: "white",
    fontWeight: "bold",
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-8">
      <Smartphone className="w-16 h-16 text-muted-foreground" />
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
        ¿Ya subiste todas las imágenes?
      </h1>

      <div className="w-full max-w-xs space-y-3">
        {phase === "idle" && (
          <button
            style={gradientStyle}
            onClick={handleTap}
          >
            ✅ ¡Día completado!
          </button>
        )}

        {phase === "green" && (
          <button
            style={{ ...gradientStyle, background: "#10b981", cursor: "default" }}
          >
            ¡Listo! ✅
          </button>
        )}

        {phase === "nav" && (
          <div className="space-y-3 animate-fade-in">
            <button
              style={gradientStyle}
              onClick={onNavigateNext}
            >
              Ir al Día siguiente →
            </button>
            <button
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "1px solid hsl(var(--muted-foreground) / 0.3)",
                background: "transparent",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
              }}
              onClick={onBackToMenu}
            >
              ← Volver al menú
            </button>
          </div>
        )}
      </div>

      {phase === "idle" && (
        <button
          onClick={onBackToImages}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-4"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          ← Volver a las imágenes
        </button>
      )}
    </div>
  );
};

export default Day1Flow;
