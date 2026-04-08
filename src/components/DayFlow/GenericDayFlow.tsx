import { useState, useCallback, useRef, useEffect } from "react";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Download, Share2, Upload, X,
  Loader2, Smartphone, Film, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { shareOrDownload, downloadFile } from "@/lib/share";
import { optimizeImage, videoPoster } from "@/lib/mediaUrl";
import { fireConfetti } from "@/lib/confetti";
import { ProductMetaInputs, ProductMetaOverlay } from "@/components/semana3/ProductMetaFields";
import EditableMessages from "@/components/semana3/EditableMessages";

export type DayFormat = "solo_imagenes" | "video_imagen" | "solo_video" | "imagenes_detalle" | "referidos";

interface DayConfig {
  dayNumber: number;
  title: string;
  mission?: string;
  missionQuote?: string;
  format: DayFormat;
}

interface GenericDayFlowProps {
  campaignSlug: string;
  campaignTitle: string;
  dayConfig: DayConfig;
  totalDays: number;
  isAdmin: boolean;
  completed: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateNext: () => void;
}

const BUCKET = "campaign-assets";

const getStepsForFormat = (format: DayFormat): string[] => {
  switch (format) {
    case "solo_imagenes":
      return ["La misión", "Tu contenido", "Comparte", "Resumen"];
    case "video_imagen":
      return ["La misión", "Videos", "Imágenes", "Resumen"];
    case "solo_video":
      return ["La misión", "Videos", "Resumen"];
    case "imagenes_detalle":
      return ["La misión", "Producto", "Resumen"];
    case "referidos":
      return ["La misión", "Videos", "Imágenes", "Copys", "Resumen"];
  }
};

const getStepBreakdown = (format: DayFormat): { icon: string; text: string }[] => {
  switch (format) {
    case "solo_imagenes":
      return [
        { icon: "📸", text: "Sube 5 imágenes al carrusel" },
        { icon: "📤", text: "Comparte en tu estado de WhatsApp" },
      ];
    case "video_imagen":
      return [
        { icon: "🎬", text: "Sube 2 videos" },
        { icon: "📸", text: "Sube 2 imágenes" },
        { icon: "📤", text: "Comparte con tus clientas" },
      ];
    case "solo_video":
      return [
        { icon: "🎬", text: "Sube 2 videos" },
        { icon: "📤", text: "Comparte en tu estado" },
      ];
    case "imagenes_detalle":
      return [
        { icon: "🔍", text: "Sube 4 imágenes a detalle" },
        { icon: "📤", text: "Comparte los detalles" },
      ];
    case "referidos":
      return [
        { icon: "🎬", text: "Sube 2 videos" },
        { icon: "📸", text: "Sube 2 imágenes" },
        { icon: "💬", text: "Copia los mensajes de referidos" },
      ];
  }
};

const GenericDayFlow = ({
  campaignSlug, campaignTitle, dayConfig, totalDays, isAdmin,
  completed, onBack, onComplete, onNavigateNext,
}: GenericDayFlowProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dayCompleted, setDayCompleted] = useState(completed);

  const stepLabels = getStepsForFormat(dayConfig.format);
  const TOTAL_STEPS = stepLabels.length;

  // Reset ALL states when navigating between days
  useEffect(() => {
    setStep(0);
    setDirection("right");
    setVideoIndex(0);
    setImageIndex(0);
    setVideoAssets({});
    setImageAssets({});
    setDayCompleted(completed);
  }, [dayConfig.dayNumber]);

  // Video assets
  const [videoAssets, setVideoAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [videoUploading, setVideoUploading] = useState<number | null>(null);
  const videoInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [videoIndex, setVideoIndex] = useState(0);

  // Image assets
  const [imageAssets, setImageAssets] = useState<Record<number, { url: string; fileName: string } | null>>({});
  const [imageUploading, setImageUploading] = useState<number | null>(null);
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [imageIndex, setImageIndex] = useState(0);

  // Labels for imagenes_detalle
  const [labels, setLabels] = useState<Record<number, string>>({
    0: "Suela de goma",
    1: "Plantilla acolchada",
    2: "Material importado",
    3: "Diseño original",
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name")
        .eq("campaign", campaignSlug)
        .eq("day_number", dayConfig.dayNumber);
      if (data) {
        data.forEach((row) => {
          if (row.asset_type.startsWith("video_")) {
            const idx = parseInt(row.asset_type.replace("video_", ""));
            setVideoAssets((prev) => ({ ...prev, [idx]: { url: row.storage_url, fileName: row.file_name } }));
          } else if (row.asset_type.startsWith("image_") || row.asset_type.startsWith("carousel_")) {
            const prefix = row.asset_type.startsWith("image_") ? "image_" : "carousel_";
            const idx = parseInt(row.asset_type.replace(prefix, ""));
            setImageAssets((prev) => ({ ...prev, [idx]: { url: row.storage_url, fileName: row.file_name } }));
          } else if (row.asset_type.startsWith("label_")) {
            const idx = parseInt(row.asset_type.replace("label_", ""));
            if (row.storage_url) setLabels((prev) => ({ ...prev, [idx]: row.storage_url }));
          }
        });
      }
    };
    load();
  }, [campaignSlug, dayConfig.dayNumber]);

  const uploadAsset = useCallback(async (
    file: File, assetType: string, slotIdx: number,
    setter: React.Dispatch<React.SetStateAction<Record<number, { url: string; fileName: string } | null>>>,
    setUploading: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${campaignSlug}/dia-${dayConfig.dayNumber}/${assetType}.${ext}`;
    setUploading(slotIdx);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(null);
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await supabase.from("day_assets").upsert(
      { campaign: campaignSlug, day_number: dayConfig.dayNumber, asset_type: assetType, storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );
    setter((prev) => ({ ...prev, [slotIdx]: { url: urlData.publicUrl, fileName: file.name } }));
    setUploading(null);
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaignSlug, dayConfig.dayNumber, toast]);

  const removeAsset = useCallback(async (
    assetType: string, slotIdx: number,
    setter: React.Dispatch<React.SetStateAction<Record<number, { url: string; fileName: string } | null>>>,
    assets: Record<number, { url: string; fileName: string } | null>
  ) => {
    const asset = assets[slotIdx];
    if (asset) {
      const urlParts = asset.url.split("/storage/v1/object/public/campaign-assets/");
      if (urlParts[1]) await supabase.storage.from(BUCKET).remove([urlParts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaignSlug).eq("day_number", dayConfig.dayNumber).eq("asset_type", assetType);
    setter((prev) => ({ ...prev, [slotIdx]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaignSlug, dayConfig.dayNumber, toast]);

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection("right");
      setStep(step + 1);
      setVideoIndex(0);
      setImageIndex(0);
      window.scrollTo(0, 0);
    }
  };
  const goPrev = () => {
    if (step > 0) {
      setDirection("left");
      setStep(step - 1);
      setVideoIndex(0);
      setImageIndex(0);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
    onComplete();
    setDayCompleted(true);
    fireConfetti();
  };

  // Build content steps based on format
  const renderContent = () => {
    const contentSteps = buildContentSteps();
    return contentSteps[step] || null;
  };

  const buildContentSteps = (): React.ReactNode[] => {
    const missionStep = (
      <MissionStep
        title={dayConfig.title}
        mission={dayConfig.mission}
        missionQuote={dayConfig.missionQuote}
        format={dayConfig.format}
      />
    );

    const summaryStep = (
      <SummaryStep
        completed={dayCompleted}
        onComplete={handleComplete}
        onNavigateNext={onNavigateNext}
        onBackToMenu={onBack}
      />
    );

    switch (dayConfig.format) {
      case "solo_imagenes":
        return [
          missionStep,
          <MediaSlider key="img" assets={imageAssets} uploading={imageUploading} isAdmin={isAdmin}
            inputRefs={imageInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
            activeIndex={imageIndex} onIndexChange={setImageIndex} totalSlots={5} type="image"
            assetPrefix="carousel" onUpload={(f, i) => uploadAsset(f, `carousel_${i}`, i, setImageAssets, setImageUploading)}
            onRemove={(i) => removeAsset(`carousel_${i}`, i, setImageAssets, imageAssets)}
          />,
          <ShareStep key="share" assets={imageAssets} />,
          summaryStep,
        ];

      case "video_imagen":
        return [
          missionStep,
          <div key="vid" className="space-y-4">
            <MediaSlider assets={videoAssets} uploading={videoUploading} isAdmin={isAdmin}
              inputRefs={videoInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={videoIndex} onIndexChange={setVideoIndex} totalSlots={2} type="video"
              assetPrefix="video" onUpload={(f, i) => uploadAsset(f, `video_${i}`, i, setVideoAssets, setVideoUploading)}
              onRemove={(i) => removeAsset(`video_${i}`, i, setVideoAssets, videoAssets)}
            />
            <EditableMessages campaignId={campaignSlug} dayNumber={dayConfig.dayNumber} section="video_ideas"
              isAdmin={isAdmin} defaultMessages={["Mira lo nuevo que llegó 👀", "Esto te va a encantar..."]} />
          </div>,
          <div key="img" className="space-y-4">
            <MediaSlider assets={imageAssets} uploading={imageUploading} isAdmin={isAdmin}
              inputRefs={imageInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={imageIndex} onIndexChange={setImageIndex} totalSlots={2} type="image"
              assetPrefix="image" onUpload={(f, i) => uploadAsset(f, `image_${i}`, i, setImageAssets, setImageUploading)}
              onRemove={(i) => removeAsset(`image_${i}`, i, setImageAssets, imageAssets)}
            />
            <EditableMessages campaignId={campaignSlug} dayNumber={dayConfig.dayNumber} section="image_ideas"
              isAdmin={isAdmin} defaultMessages={["¿Ya viste lo que acaba de llegar?", "Pregúntame por este modelo 💕"]} />
          </div>,
          summaryStep,
        ];

      case "solo_video":
        return [
          missionStep,
          <div key="vid" className="space-y-4">
            <MediaSlider assets={videoAssets} uploading={videoUploading} isAdmin={isAdmin}
              inputRefs={videoInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={videoIndex} onIndexChange={setVideoIndex} totalSlots={2} type="video"
              assetPrefix="video" onUpload={(f, i) => uploadAsset(f, `video_${i}`, i, setVideoAssets, setVideoUploading)}
              onRemove={(i) => removeAsset(`video_${i}`, i, setVideoAssets, videoAssets)}
            />
            <EditableMessages campaignId={campaignSlug} dayNumber={dayConfig.dayNumber} section="video_ideas"
              isAdmin={isAdmin} defaultMessages={["Comparte este video en tu estado", "Mira este look completo 🔥"]} />
          </div>,
          summaryStep,
        ];

      case "imagenes_detalle":
        return [
          missionStep,
          <div key="detail" className="space-y-4">
            <MediaSlider assets={imageAssets} uploading={imageUploading} isAdmin={isAdmin}
              inputRefs={imageInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={imageIndex} onIndexChange={setImageIndex} totalSlots={4} type="image"
              assetPrefix="image" onUpload={(f, i) => uploadAsset(f, `image_${i}`, i, setImageAssets, setImageUploading)}
              onRemove={(i) => removeAsset(`image_${i}`, i, setImageAssets, imageAssets)}
              labels={labels} isAdmin_labels={isAdmin}
              onLabelChange={async (idx, val) => {
                setLabels((prev) => ({ ...prev, [idx]: val }));
                await supabase.from("day_assets").upsert(
                  { campaign: campaignSlug, day_number: dayConfig.dayNumber, asset_type: `label_${idx}`, storage_url: val, file_name: "", updated_at: new Date().toISOString() },
                  { onConflict: "campaign,day_number,asset_type" }
                );
              }}
            />
            <EditableMessages campaignId={campaignSlug} dayNumber={dayConfig.dayNumber} section="referral_copy"
              isAdmin={isAdmin} defaultMessages={["Mira este calzado, tiene suela de goma y plantilla acolchada"]}
              showCopyButton labels={["Detalle"]} labelColors={["hsl(330 85% 55%)"]} />
          </div>,
          summaryStep,
        ];

      case "referidos":
        return [
          missionStep,
          <div key="vid" className="space-y-4">
            <MediaSlider assets={videoAssets} uploading={videoUploading} isAdmin={isAdmin}
              inputRefs={videoInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={videoIndex} onIndexChange={setVideoIndex} totalSlots={2} type="video"
              assetPrefix="video" onUpload={(f, i) => uploadAsset(f, `video_${i}`, i, setVideoAssets, setVideoUploading)}
              onRemove={(i) => removeAsset(`video_${i}`, i, setVideoAssets, videoAssets)}
            />
          </div>,
          <div key="img" className="space-y-4">
            <MediaSlider assets={imageAssets} uploading={imageUploading} isAdmin={isAdmin}
              inputRefs={imageInputRefs} campaignSlug={campaignSlug} dayNumber={dayConfig.dayNumber}
              activeIndex={imageIndex} onIndexChange={setImageIndex} totalSlots={2} type="image"
              assetPrefix="image" onUpload={(f, i) => uploadAsset(f, `image_${i}`, i, setImageAssets, setImageUploading)}
              onRemove={(i) => removeAsset(`image_${i}`, i, setImageAssets, imageAssets)}
            />
          </div>,
          <EditableMessages key="copys" campaignId={campaignSlug} dayNumber={dayConfig.dayNumber} section="referral_copy"
            isAdmin={isAdmin}
            defaultMessages={["Oye, ¿quieres ganar dinero extra vendiendo zapatos?", "Te invito a ser parte de Price Shoes"]}
            showCopyButton labels={["Referido frío", "Referido cálido"]} labelColors={["hsl(220 85% 55%)", "hsl(330 85% 55%)"]} />,
          summaryStep,
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={() => window.location.href = "/"}
              className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
              Inicio
            </button>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            Día {dayConfig.dayNumber} — {stepLabels[step]}
          </span>
          <div className="w-10" />
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
          {renderContent()}
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

/* ========== Mission Step ========== */
const MissionStep = ({ title, mission, missionQuote, format }: { title: string; mission?: string; missionQuote?: string; format?: DayFormat }) => {
  const breakdown = format ? getStepBreakdown(format) : [];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 py-8">
      <p className="text-5xl">🎯</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {title || "Misión del día"}
      </h1>
      {mission && (
        <p className="text-base text-muted-foreground leading-relaxed max-w-sm">{mission}</p>
      )}
      {breakdown.length > 0 && (
        <div className="w-full max-w-sm space-y-2 mt-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hoy harás</p>
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card text-left">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      )}
      {missionQuote && (
        <p className="text-sm italic max-w-xs" style={{ color: "hsl(330, 85%, 55%)" }}>
          "{missionQuote}"
        </p>
      )}
    </div>
  );
};

/* ========== Media Slider ========== */
interface MediaSliderProps {
  assets: Record<number, { url: string; fileName: string } | null>;
  uploading: number | null;
  isAdmin: boolean;
  inputRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  campaignSlug: string;
  dayNumber: number;
  activeIndex: number;
  onIndexChange: (i: number) => void;
  totalSlots: number;
  type: "video" | "image";
  assetPrefix: string;
  onUpload: (file: File, idx: number) => void;
  onRemove: (idx: number) => void;
  labels?: Record<number, string>;
  isAdmin_labels?: boolean;
  onLabelChange?: (idx: number, val: string) => void;
}

const MediaSlider = ({
  assets, uploading, isAdmin, inputRefs, campaignSlug, dayNumber,
  activeIndex, onIndexChange, totalSlots, type, assetPrefix,
  onUpload, onRemove, labels, isAdmin_labels, onLabelChange,
}: MediaSliderProps) => {
  const asset = assets[activeIndex];
  const isUploading = uploading === activeIndex;
  const acceptType = type === "video" ? ".mp4,.mov,.webm" : ".jpg,.jpeg,.png,.webp";
  const Icon = type === "video" ? Film : ImageIcon;

  return (
    <div className="flex flex-col items-center min-h-[50vh] py-4 -mx-5">
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
          <button onClick={() => onIndexChange(activeIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {activeIndex < totalSlots - 1 && (
          <button onClick={() => onIndexChange(activeIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Admin buttons */}
        {isAdmin && (
          <button onClick={() => inputRefs.current[activeIndex]?.click()} className="absolute top-3 right-5 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
            <Upload className="w-4 h-4" />
          </button>
        )}
        {isAdmin && asset && (
          <button onClick={() => onRemove(activeIndex)} className="absolute top-3 right-16 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
            <X className="w-4 h-4" />
          </button>
        )}

        {isUploading ? (
          <div className="w-full aspect-[9/16] max-h-[55vh] flex items-center justify-center rounded-2xl mx-5" style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.3), hsl(275 65% 50% / 0.3))" }}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : asset ? (
          <div className="relative w-full">
            {type === "video" ? (
              <video
                controls
                playsInline
                preload="metadata"
                src={videoPoster(asset.url)}
                className="w-full max-h-[55vh] object-contain animate-in fade-in duration-200"
              />
            ) : (
              <img
                src={optimizeImage(asset.url, 900)}
                alt={`${type} ${activeIndex + 1}`}
                loading="eager"
                decoding="async"
                className="w-full max-h-[55vh] object-contain animate-in fade-in duration-200"
              />
            )}
            {/* Preload prev/next para que el swipe sea instantáneo */}
            {type === "image" && activeIndex > 0 && assets[activeIndex - 1] && (
              <img src={optimizeImage(assets[activeIndex - 1]!.url, 900)} alt="" className="hidden" loading="eager" decoding="async" />
            )}
            {type === "image" && activeIndex < totalSlots - 1 && assets[activeIndex + 1] && (
              <img src={optimizeImage(assets[activeIndex + 1]!.url, 900)} alt="" className="hidden" loading="eager" decoding="async" />
            )}
            {!isAdmin && type === "image" && <ProductMetaOverlay campaignId={campaignSlug} dayNumber={dayNumber} assetType={`${assetPrefix}_${activeIndex}`} />}
            {labels && labels[activeIndex] && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2">
                <p className="text-white text-sm font-bold">{labels[activeIndex]}</p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-full aspect-[9/16] max-h-[55vh] flex flex-col items-center justify-center gap-2 rounded-2xl mx-5 cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.15), hsl(275 65% 50% / 0.15))" }}
            onClick={() => isAdmin && inputRefs.current[activeIndex]?.click()}
          >
            <Icon className="w-8 h-8 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">{type === "video" ? "Video" : "Imagen"} {activeIndex + 1}</span>
          </div>
        )}

        {/* Hidden file inputs */}
        {Array.from({ length: totalSlots }, (_, i) => (
          <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="file" accept={acceptType} className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { onUpload(f, i); e.target.value = ""; } }} />
        ))}
      </div>

      {/* Action buttons */}
      {asset && (
        <div className="flex items-center gap-3 mt-4 px-5 w-full max-w-sm">
          <button
            onClick={() => shareOrDownload(asset.url, asset.fileName)}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-muted-foreground/30 text-foreground hover:bg-muted/50 transition-colors"
          >
            <Download className="w-4 h-4" /> Descargar
          </button>
          <button
            onClick={() => shareOrDownload(asset.url, asset.fileName)}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          >
            <Share2 className="w-4 h-4" /> Compartir
          </button>
        </div>
      )}

      {/* Admin meta */}
      {isAdmin && type === "image" && (
        <div className="px-5 w-full max-w-sm mt-3">
          <ProductMetaInputs campaignId={campaignSlug} dayNumber={dayNumber} assetType={`${assetPrefix}_${activeIndex}`} />
        </div>
      )}

      {/* Admin label edit */}
      {isAdmin_labels && onLabelChange && (
        <div className="px-5 w-full max-w-sm mt-2">
          <input
            type="text"
            value={labels?.[activeIndex] || ""}
            onChange={(e) => onLabelChange(activeIndex, e.target.value)}
            placeholder="Etiqueta del componente"
            className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          />
        </div>
      )}

      {/* Dots */}
      <div className="flex items-center justify-center gap-2.5 mt-5">
        {Array.from({ length: totalSlots }, (_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={cn("w-2.5 h-2.5 rounded-full transition-all", i === activeIndex ? "scale-125" : "bg-muted-foreground/30")}
            style={i === activeIndex ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}}
          />
        ))}
      </div>
    </div>
  );
};

/* ========== Share Step ========== */
const ShareStep = ({ assets }: { assets: Record<number, { url: string; fileName: string } | null> }) => (
  <div className="space-y-6 py-6">
    <div className="text-center space-y-2">
      <h1 className="font-display text-2xl font-bold text-foreground">Comparte en tu estado</h1>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
        Toca cada imagen para compartirla directo a tu estado de WhatsApp
      </p>
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => {
        const asset = assets[i];
        return asset ? (
          <div key={i} className="flex items-center gap-3">
            <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <div className="absolute top-1 left-1 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
                {i + 1}
              </div>
              <img src={optimizeImage(asset.url, 200)} alt={`Imagen ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <button onClick={() => downloadFile(asset.url, asset.fileName)}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl border border-muted-foreground/30 text-foreground hover:bg-muted/50 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => shareOrDownload(asset.url, asset.fileName)}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white py-2.5 rounded-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>
            </div>
          </div>
        ) : null;
      })}
    </div>
  </div>
);

/* ========== Summary Step ========== */
const SummaryStep = ({
  completed, onComplete, onNavigateNext, onBackToMenu,
}: { completed: boolean; onComplete: () => void; onNavigateNext: () => void; onBackToMenu: () => void }) => {
  const [phase, setPhase] = useState<"idle" | "green" | "nav">(completed ? "nav" : "idle");

  const handleTap = () => {
    onComplete();
    setPhase("green");
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
        ¿Ya completaste la misión?
      </h1>
      <div className="w-full max-w-xs space-y-3">
        {phase === "idle" && <button style={gradientStyle} onClick={handleTap}>¡Día completado!</button>}
        {phase === "green" && <button style={{ ...gradientStyle, background: "#22c55e", cursor: "default" }}>¡Listo!</button>}
        {phase === "nav" && (
          <div className="space-y-3 animate-fade-in">
            <button style={gradientStyle} onClick={onNavigateNext}>Ir al Día siguiente →</button>
            <button
              style={{ width: "100%", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", border: "1px solid hsl(var(--muted-foreground) / 0.3)", background: "transparent", color: "hsl(var(--muted-foreground))", cursor: "pointer" }}
              onClick={onBackToMenu}
            >
              ← Volver al menú
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericDayFlow;
