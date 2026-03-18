import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Share2, Upload, X, Loader2, Smartphone, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ProductMetaInputs, ProductMetaOverlay, useProductMeta, useSaveMeta } from "./ProductMetaFields";
import EditableMessages from "./EditableMessages";

interface Day6FlowProps {
  campaignId: string;
  campaignTitle: string;
  isAdmin?: boolean;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

const TOTAL_STEPS = 3;
const BUCKET = "campaign-assets";
const DAY = 6;

const DEFAULT_LABELS = ["Suela de goma", "Plantilla acolchada", "Material importado", "Diseño original"];

const Day6Flow = ({ campaignId, campaignTitle, isAdmin, completed, onBack, onComplete, onNavigateNext }: Day6FlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dayCompleted, setDayCompleted] = useState(completed);

  const [imageAssets, setImageAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [imageUploading, setImageUploading] = useState<number | null>(null);
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [imageIndex, setImageIndex] = useState(0);

  // Labels stored in Supabase via a dedicated "label" field approach using product_id
  const [labels, setLabels] = useState<Record<number, string>>(() => {
    const obj: Record<number, string> = {};
    for (let i = 0; i < 4; i++) obj[i] = DEFAULT_LABELS[i];
    return obj;
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name, product_id, product_description")
        .eq("campaign", campaignId)
        .eq("day_number", DAY);
      if (data) {
        data.forEach((row) => {
          if (row.asset_type.startsWith("image_")) {
            const idx = parseInt(row.asset_type.replace("image_", ""));
            if (row.storage_url) {
              setImageAssets((prev) => ({ ...prev, [idx]: { url: row.storage_url, fileName: row.file_name } }));
            }
          }
          if (row.asset_type.startsWith("label_")) {
            const idx = parseInt(row.asset_type.replace("label_", ""));
            if (row.storage_url) setLabels((prev) => ({ ...prev, [idx]: row.storage_url }));
          }
        });
      }
    };
    load();
  }, [campaignId]);

  const saveLabel = useCallback(async (idx: number, value: string) => {
    setLabels((prev) => ({ ...prev, [idx]: value }));
    await supabase.from("day_assets").upsert(
      { campaign: campaignId, day_number: DAY, asset_type: `label_${idx}`, storage_url: value, file_name: "", updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );
  }, [campaignId]);

  const uploadAsset = useCallback(async (file: File, idx: number) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${campaignId}/dia-${DAY}/image_${idx}.${ext}`;
    setImageUploading(idx);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setImageUploading(null); toast({ title: "Error al subir", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await supabase.from("day_assets").upsert(
      { campaign: campaignId, day_number: DAY, asset_type: `image_${idx}`, storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );
    setImageAssets((prev) => ({ ...prev, [idx]: { url: urlData.publicUrl, fileName: file.name } }));
    setImageUploading(null);
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaignId, toast]);

  const removeAsset = useCallback(async (idx: number) => {
    const asset = imageAssets[idx];
    if (asset) {
      const urlParts = asset.url.split("/storage/v1/object/public/campaign-assets/");
      if (urlParts[1]) await supabase.storage.from(BUCKET).remove([urlParts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaignId).eq("day_number", DAY).eq("asset_type", `image_${idx}`);
    setImageAssets((prev) => ({ ...prev, [idx]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaignId, imageAssets, toast]);

  const shareOrDownload = useCallback(async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const cleanName = `contenido.${ext}`;
      const file = new File([blob], cleanName, { type: blob.type || `image/${ext}` });
      if (navigator.share) { await navigator.share({ files: [file] }); }
      else { const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = cleanName; a.click(); URL.revokeObjectURL(u); }
    } catch { /* cancelled */ }
  }, []);

  const downloadAsset = useCallback(async (url: string, fileName: string) => {
    try { const r = await fetch(url); const b = await r.blob(); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = fileName; a.click(); URL.revokeObjectURL(u); } catch {}
  }, []);

  const goNext = () => { if (step < TOTAL_STEPS - 1) { setDirection("right"); setStep(step + 1); window.scrollTo(0, 0); } };
  const goPrev = () => { if (step > 0) { setDirection("left"); setStep(step - 1); window.scrollTo(0, 0); } };
  const goToStep = (s: number) => { setDirection(s > step ? "right" : "left"); setStep(s); window.scrollTo(0, 0); };
  const handleComplete = () => { onComplete(); setDayCompleted(true); };

  const stepLabels = ["La misión", "El detalle", "Resumen"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <span className="text-xs font-semibold text-muted-foreground">Paso {step + 1} de {TOTAL_STEPS} — {stepLabels[step]}</span>
          <div className="w-5" />
        </div>
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-2 bg-muted" />
      </div>

      <div className="flex-1 pt-20 pb-24 overflow-y-auto">
        <div key={step} className={cn("animate-in duration-300 px-5 max-w-lg mx-auto", direction === "right" ? "slide-in-from-right-8" : "slide-in-from-left-8")}>
          {step === 0 && <Step1Mission />}
          {step === 1 && (
            <DetailSlider
              totalSlots={4}
              assets={imageAssets}
              uploading={imageUploading}
              isAdmin={isAdmin}
              campaignId={campaignId}
              inputRefs={imageInputRefs}
              activeIndex={imageIndex}
              onIndexChange={setImageIndex}
              labels={labels}
              onLabelChange={saveLabel}
              onUpload={uploadAsset}
              onRemove={removeAsset}
              onShare={shareOrDownload}
              onDownload={downloadAsset}
            />
          )}
          {step === 2 && (
            <StepSummary
              completed={dayCompleted}
              onComplete={handleComplete}
              onBackToContent={() => goToStep(1)}
              onNavigateNext={onNavigateNext}
              onBackToMenu={onBack}
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex items-center gap-3">
        {step > 0 ? (
          <Button variant="outline" className="flex-1 border-muted-foreground/30 text-muted-foreground" onClick={goPrev}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>
        ) : <div className="flex-1" />}
        {step < TOTAL_STEPS - 1 ? (
          <Button className="flex-1 text-white font-semibold" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }} onClick={goNext}>
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
      Hoy eres la experta
    </h1>
    <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
      Cualquiera puede mandar una foto del producto. Tú hoy vas a explicar por qué estos tennis valen lo que cuestan — y eso es lo que cierra a las que dudan del precio.
    </p>
    <p className="text-sm italic max-w-xs" style={{ color: "hsl(330, 85%, 55%)" }}>
      "La clienta que entiende el producto no regatea — compra."
    </p>
  </div>
);

/* ========== DETAIL SLIDER (Paso 2) ========== */
interface DetailSliderProps {
  totalSlots: number;
  assets: Record<number, { url: string; fileName: string } | null>;
  uploading: number | null;
  isAdmin?: boolean;
  campaignId: string;
  inputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  activeIndex: number;
  onIndexChange: (i: number) => void;
  labels: Record<number, string>;
  onLabelChange: (idx: number, value: string) => void;
  onUpload: (file: File, idx: number) => void;
  onRemove: (idx: number) => void;
  onShare: (url: string, fileName: string) => void;
  onDownload: (url: string, fileName: string) => void;
}

const PILL_COLORS = [
  "hsl(330 85% 55%)",
  "hsl(275 65% 50%)",
  "hsl(200 80% 50%)",
  "hsl(150 60% 45%)",
];

const DetailSlider = ({
  totalSlots, assets, uploading, isAdmin, campaignId, inputRefs,
  activeIndex, onIndexChange, labels, onLabelChange, onUpload, onRemove, onShare, onDownload
}: DetailSliderProps) => {
  const asset = assets[activeIndex];
  const isUploading = uploading === activeIndex;
  const slotAssetType = `image_${activeIndex}`;
  const label = labels[activeIndex] || "";

  const goPrevSlide = () => { if (activeIndex > 0) onIndexChange(activeIndex - 1); };
  const goNextSlide = () => { if (activeIndex < totalSlots - 1) onIndexChange(activeIndex + 1); };

  const inspirationMessages = [
    "Mira, estos tennis no son como los que encuentras en cualquier lado — fíjate en los detalles 👟",
    "¿Te dijeron que está caro? Déjame enseñarte por qué vale cada peso 💎",
    "Cuando ves la calidad de cerca, el precio se entiende solo — mira esto 🔍"
  ];

  return (
    <div className="flex flex-col items-center min-h-[60vh] py-4 -mx-5">
      <div className="text-center space-y-2 px-5 mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">El detalle que vende</h1>
        <p className="text-sm text-muted-foreground">Manda estas imágenes a quien te diga que está caro — que vean por qué vale lo que vale</p>
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center">
        {/* Numbered badge */}
        <div className="absolute top-3 left-5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
          {activeIndex + 1}
        </div>

        {/* Label pill / editable */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          {isAdmin ? (
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelChange(activeIndex, e.target.value)}
              placeholder="Nombre del componente"
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white text-center min-w-[140px] placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{ background: PILL_COLORS[activeIndex % PILL_COLORS.length] }}
            />
          ) : label ? (
            <span className="text-xs font-bold px-4 py-1.5 rounded-full text-white shadow-md" style={{ background: PILL_COLORS[activeIndex % PILL_COLORS.length] }}>
              {label}
            </span>
          ) : null}
        </div>

        {activeIndex > 0 && (
          <button onClick={goPrevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"><ChevronLeft className="w-5 h-5" /></button>
        )}
        {activeIndex < totalSlots - 1 && (
          <button onClick={goNextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"><ChevronRight className="w-5 h-5" /></button>
        )}
        {isAdmin && (
          <button onClick={() => inputRefs.current[activeIndex]?.click()} className="absolute top-3 right-5 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><Upload className="w-4 h-4" /></button>
        )}
        {isAdmin && asset && (
          <button onClick={() => onRemove(activeIndex)} className="absolute top-3 right-16 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><X className="w-4 h-4" /></button>
        )}

        {isUploading ? (
          <div className="w-full aspect-square max-h-[50vh] flex items-center justify-center rounded-2xl mx-5" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.3), hsl(275 65% 50% / 0.3))" }}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : asset ? (
          <div className="relative w-full">
            <img src={asset.url} alt={label || `Detalle ${activeIndex + 1}`} className="w-full max-h-[50vh] object-contain animate-in fade-in duration-200" />
            {!isAdmin && <ProductMetaOverlay campaignId={campaignId} dayNumber={DAY} assetType={slotAssetType} />}
          </div>
        ) : (
          <div className="w-full aspect-square max-h-[50vh] flex flex-col items-center justify-center gap-2 rounded-2xl mx-5 cursor-pointer" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }} onClick={() => isAdmin && inputRefs.current[activeIndex]?.click()}>
            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">Detalle {activeIndex + 1}</span>
          </div>
        )}

        {Array.from({ length: totalSlots }, (_, i) => (
          <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { onUpload(f, i); e.target.value = ""; } }} />
        ))}
      </div>

      {asset && (
        <div className="flex items-center gap-3 mt-4 px-5 w-full max-w-sm">
          <button onClick={() => onDownload(asset.url, asset.fileName)} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-muted-foreground/30 text-foreground hover:bg-muted/50 transition-colors">
            <Download className="w-4 h-4" /> Descargar
          </button>
          <button onClick={() => onShare(asset.url, asset.fileName)} className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl shadow-lg" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
            <Share2 className="w-4 h-4" /> Compartir
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="px-5 w-full max-w-sm mt-3">
          <ProductMetaInputs campaignId={campaignId} dayNumber={DAY} assetType={slotAssetType} />
        </div>
      )}

      <div className="flex items-center justify-center gap-2.5 mt-5">
        {Array.from({ length: totalSlots }, (_, i) => (
          <button key={i} onClick={() => onIndexChange(i)} className={cn("w-2.5 h-2.5 rounded-full transition-all", i === activeIndex ? "scale-125" : "bg-muted-foreground/30")} style={i === activeIndex ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}} />
        ))}
      </div>

      <EditableMessages
        campaignId={campaignId}
        dayNumber={DAY}
        section="image_ideas"
        isAdmin={isAdmin}
        defaultMessages={inspirationMessages}
      />
    </div>
  );
};

/* ========== STEP 3 — Confirmation ========== */
interface SummaryProps {
  completed: boolean;
  onComplete: () => void;
  onBackToContent: () => void;
  onNavigateNext: () => void;
  onBackToMenu: () => void;
}

const StepSummary = ({ completed, onComplete, onBackToContent, onNavigateNext, onBackToMenu }: SummaryProps) => {
  const [phase, setPhase] = useState<"idle" | "green" | "nav">(completed ? "nav" : "idle");

  const fireConfetti = async () => {
    try {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      script.onload = () => { (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); };
      document.head.appendChild(script);
    } catch {}
  };

  const handleTap = () => {
    onComplete();
    setPhase("green");
    fireConfetti();
    setTimeout(() => setPhase("nav"), 2500);
  };

  const gradientStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #ec4899, #8b5cf6)",
    color: "white", fontWeight: "bold", width: "100%", padding: "16px",
    borderRadius: "12px", fontSize: "16px", border: "none", cursor: "pointer",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-8">
      <Smartphone className="w-16 h-16 text-muted-foreground" />
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
        ¿Ya mandaste los detalles a quien dudó del precio?
      </h1>

      <div className="w-full max-w-xs space-y-3">
        {phase === "idle" && <button style={gradientStyle} onClick={handleTap}>✅ ¡Día completado!</button>}
        {phase === "green" && <button style={{ ...gradientStyle, background: "#22c55e", cursor: "default" }}>¡Listo! ✅</button>}
        {phase === "nav" && (
          <div className="space-y-3 animate-fade-in">
            <button style={gradientStyle} onClick={onNavigateNext}>Ir al Día siguiente →</button>
            <button
              style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", border: "1px solid hsl(var(--muted-foreground) / 0.3)", background: "transparent", color: "hsl(var(--muted-foreground))", cursor: "pointer" }}
              onClick={onBackToMenu}
            >← Volver al menú</button>
          </div>
        )}
      </div>

      {phase === "idle" && (
        <button onClick={onBackToContent} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-4" style={{ background: "none", border: "none", cursor: "pointer" }}>
          ← Volver a las imágenes
        </button>
      )}
    </div>
  );
};

export default Day6Flow;
