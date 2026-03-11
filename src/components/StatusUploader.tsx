import { useState, useRef, useEffect, useCallback } from "react";
import { ImageIcon, Film, Upload, X, Download, Loader2, Smartphone, ArrowDown, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageLightbox from "@/components/ImageLightbox";

interface StatusUploaderProps {
  lookName: string;
  statusCopyImage: string;
  statusCopyVideo: string;
  reelStructure: string[];
  campaign: string;
  dayNumber: number;
  isAdmin?: boolean;
}

type AssetType = "imagen_1" | "imagen_2" | "video_1" | "video_2";

const MAX_SIZE = 50 * 1024 * 1024;
const BUCKET = "campaign-assets";

interface AssetData {
  url: string;
  fileName: string;
}

const getStoragePath = (campaign: string, day: number, assetType: AssetType, ext: string) =>
  `${campaign}/dia-${day}/${assetType}.${ext}`;

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

const downloadBlob = async (url: string, fileName: string, toast: ReturnType<typeof useToast>["toast"]) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    if (isIOS()) {
      toast({
        title: "📱 Descarga en iPhone",
        description: "Mantén presionado el video y selecciona 'Guardar video'",
        duration: 5000,
      });
    } else {
      window.open(url, "_blank");
    }
  }
};

const shareOrDownload = async (url: string, fileName: string, mimePrefix: string, toast: ReturnType<typeof useToast>["toast"]) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = fileName.split(".").pop()?.toLowerCase() || "bin";
    const mimeType = blob.type || `${mimePrefix}/${ext === "jpg" ? "jpeg" : ext}`;
    const file = new File([blob], fileName, { type: mimeType });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: fileName });
      return;
    }
  } catch (err: any) {
    if (err?.name === "AbortError") return; // user cancelled
  }
  // Fallback to download
  downloadBlob(url, fileName, toast);
};

const ACTION_BTN = "flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors";
const DL_BTN = `${ACTION_BTN} text-primary hover:bg-primary/10`;
const SHARE_BTN = `${ACTION_BTN} text-white`;

/* ── Step Indicator ── */
const StepIndicator = ({ currentStep }: { currentStep?: number }) => (
  <div className="flex items-center justify-center gap-0 py-4">
    {[1, 2, 3].map((step, i) => (
      <div key={step} className="flex items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
        >
          {step}
        </div>
        {i < 2 && (
          <div
            className="w-10 h-0.5 mx-1"
            style={{ background: "linear-gradient(90deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
          />
        )}
      </div>
    ))}
  </div>
);

/* ── Placeholder (no asset) ── */
const PlaceholderSlot = ({ label, lookName, type }: { label: string; lookName: string; type: "image" | "video" }) => (
  <div className="flex-1 min-w-0">
    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
    <div className="w-full aspect-[9/16] max-h-[220px] rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-border flex flex-col items-center justify-center gap-2 p-3">
      {type === "image" ? <ImageIcon className="w-7 h-7 text-muted-foreground/60" /> : <Film className="w-7 h-7 text-muted-foreground/60" />}
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{lookName}</span>
    </div>
  </div>
);

/* ── Image slot ── */
const ImageAssetSlot = ({ label, asset, lookName, isAdmin, uploading, progress: prog, onFile, onRemove, onImageTap }: {
  label: string; asset: AssetData | null; lookName: string; isAdmin?: boolean;
  uploading: boolean; progress: number; onFile: (f: File) => void; onRemove: () => void; onImageTap: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast({ title: "Archivo muy grande", description: "Máximo 50 MB", variant: "destructive", duration: 3000 });
      return;
    }
    onFile(f);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (uploading) {
    return (
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
        <div className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 bg-muted/20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Progress value={prog} className="w-3/4 h-2" />
          <span className="text-[10px] text-muted-foreground">{Math.round(prog)}%</span>
        </div>
      </div>
    );
  }

  if (!asset) {
    if (!isAdmin) return <PlaceholderSlot label={label} lookName={lookName} type="image" />;
    return (
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
        <button onClick={() => inputRef.current?.click()} className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Subir imagen</span>
        </button>
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
      <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden cursor-pointer" onClick={() => onImageTap(asset.url)}>
        <img src={asset.url} alt={label} className="w-full h-full object-cover" />
        {isAdmin && (
          <>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="absolute bottom-1.5 left-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <a href={asset.url} download={asset.fileName} target="_blank" rel="noopener noreferrer" className={DL_BTN}>
          <Download className="w-3.5 h-3.5" /> Descargar
        </a>
        <button
          onClick={(e) => { e.stopPropagation(); shareOrDownload(asset.url, asset.fileName, "image", toast); }}
          className={SHARE_BTN}
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
        >
          <Share2 className="w-3.5 h-3.5" /> Compartir 📤
        </button>
      </div>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
    </div>
  );
};

/* ── Video slot ── */
const VideoAssetSlot = ({ label, asset, lookName, isAdmin, uploading, progress: prog, onFile, onRemove }: {
  label: string; asset: AssetData | null; lookName: string; isAdmin?: boolean;
  uploading: boolean; progress: number; onFile: (f: File) => void; onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast({ title: "Archivo muy grande", description: "Máximo 50 MB", variant: "destructive", duration: 3000 });
      return;
    }
    onFile(f);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (asset) downloadBlob(asset.url, asset.fileName, toast);
  };

  if (uploading) {
    return (
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
        <div className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 bg-muted/20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Progress value={prog} className="w-3/4 h-2" />
          <span className="text-[10px] text-muted-foreground">{Math.round(prog)}%</span>
        </div>
      </div>
    );
  }

  if (!asset) {
    if (!isAdmin) return <PlaceholderSlot label={label} lookName={lookName} type="video" />;
    return (
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
        <button onClick={() => inputRef.current?.click()} className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Subir video</span>
        </button>
        <input ref={inputRef} type="file" accept=".mp4,.mov" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
      <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden bg-black">
        <video src={asset.url} controls className="w-full h-full object-cover" />
        {isAdmin && (
          <>
            <button onClick={() => inputRef.current?.click()} className="absolute bottom-1.5 left-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
      <button onClick={handleDownload} className="mt-1.5 w-full flex items-center justify-center gap-1 text-[10px] text-primary hover:underline">
        <Download className="w-3 h-3" /> Descargar
      </button>
      {isIOS() && (
        <p className="text-[9px] text-muted-foreground text-center mt-1 flex items-center justify-center gap-1">
          <Smartphone className="w-3 h-3" /> En iPhone: mantén presionado y selecciona 'Guardar video'
        </p>
      )}
      <input ref={inputRef} type="file" accept=".mp4,.mov" className="hidden" onChange={handleChange} />
    </div>
  );
};

/* ── Main component ── */
const StatusUploader = ({ lookName, statusCopyImage, statusCopyVideo, reelStructure, campaign, dayNumber, isAdmin }: StatusUploaderProps) => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Record<AssetType, AssetData | null>>({
    imagen_1: null, imagen_2: null, video_1: null, video_2: null,
  });
  const [uploading, setUploading] = useState<Record<AssetType, boolean>>({
    imagen_1: false, imagen_2: false, video_1: false, video_2: false,
  });
  const [progress, setProgress] = useState<Record<AssetType, number>>({
    imagen_1: 0, imagen_2: 0, video_1: 0, video_2: 0,
  });
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Load existing assets
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name")
        .eq("campaign", campaign)
        .eq("day_number", dayNumber);
      if (data) {
        const loaded: Record<string, AssetData> = {};
        data.forEach((r) => { loaded[r.asset_type] = { url: r.storage_url, fileName: r.file_name }; });
        setAssets((prev) => ({ ...prev, ...loaded }));
      }
    };
    load();
  }, [campaign, dayNumber]);

  const uploadFile = useCallback(async (file: File, assetType: AssetType) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = getStoragePath(campaign, dayNumber, assetType, ext);

    setUploading((p) => ({ ...p, [assetType]: true }));
    setProgress((p) => ({ ...p, [assetType]: 0 }));

    const interval = setInterval(() => {
      setProgress((p) => ({ ...p, [assetType]: Math.min((p[assetType] || 0) + 12, 90) }));
    }, 200);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    clearInterval(interval);

    if (uploadError) {
      setUploading((p) => ({ ...p, [assetType]: false }));
      toast({ title: "Error al subir", description: uploadError.message, variant: "destructive", duration: 3000 });
      return;
    }

    setProgress((p) => ({ ...p, [assetType]: 100 }));

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await supabase.from("day_assets").upsert(
      { campaign, day_number: dayNumber, asset_type: assetType, storage_url: publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );

    setAssets((p) => ({ ...p, [assetType]: { url: publicUrl, fileName: file.name } }));
    setUploading((p) => ({ ...p, [assetType]: false }));
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaign, dayNumber, toast]);

  const removeFile = useCallback(async (assetType: AssetType) => {
    const asset = assets[assetType];
    if (asset) {
      const urlParts = asset.url.split(`/storage/v1/object/public/${BUCKET}/`);
      if (urlParts[1]) {
        await supabase.storage.from(BUCKET).remove([urlParts[1]]);
      }
    }
    await supabase.from("day_assets").delete().eq("campaign", campaign).eq("day_number", dayNumber).eq("asset_type", assetType);
    setAssets((p) => ({ ...p, [assetType]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaign, dayNumber, assets, toast]);

  return (
    <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="font-display font-bold text-sm text-foreground">📱 Tu Estado de Hoy</h2>
      </div>

      {/* Step indicator */}
      <StepIndicator />

      <div className="px-4 pb-5 space-y-6">
        {/* PASO 1 — Images */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-foreground">📸 Paso 1 — Elige una imagen para tu historia</h3>
          <div className="flex gap-3">
            <ImageAssetSlot label="Imagen 1" asset={assets.imagen_1} lookName={lookName} isAdmin={isAdmin} uploading={uploading.imagen_1} progress={progress.imagen_1} onFile={(f) => uploadFile(f, "imagen_1")} onRemove={() => removeFile("imagen_1")} onImageTap={(url) => setLightboxSrc(url)} />
            <ImageAssetSlot label="Imagen 2" asset={assets.imagen_2} lookName={lookName} isAdmin={isAdmin} uploading={uploading.imagen_2} progress={progress.imagen_2} onFile={(f) => uploadFile(f, "imagen_2")} onRemove={() => removeFile("imagen_2")} onImageTap={(url) => setLightboxSrc(url)} />
          </div>
          <p className="text-xs text-muted-foreground text-center">Descarga la que más te guste y súbela como historia en WhatsApp</p>
        </div>

        {/* Divider */}
        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-primary/40" />
        </div>

        {/* PASO 2 — Videos */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-foreground">🎬 Paso 2 — Agrega un video después de tu imagen</h3>
          <div className="flex gap-3">
            <VideoAssetSlot label="Video 1" asset={assets.video_1} lookName={lookName} isAdmin={isAdmin} uploading={uploading.video_1} progress={progress.video_1} onFile={(f) => uploadFile(f, "video_1")} onRemove={() => removeFile("video_1")} />
            <VideoAssetSlot label="Video 2" asset={assets.video_2} lookName={lookName} isAdmin={isAdmin} uploading={uploading.video_2} progress={progress.video_2} onFile={(f) => uploadFile(f, "video_2")} onRemove={() => removeFile("video_2")} />
          </div>
          <p className="text-xs text-muted-foreground text-center">Sube este video justo después de la imagen — el movimiento engancha más</p>
        </div>

        {/* Divider */}
        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-primary/40" />
        </div>

        {/* PASO 3 — Direct send */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-foreground">💬 Paso 3 — Envía lo que te sobró a 5-10 personas</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            La imagen o video que no subiste a tu historia mándalo directo en conversación a tus clientas. Usa los mensajes de la sección <strong>'¿Cómo arrancar según tu clienta?'</strong> para acompañarlo.
          </p>
          <div className="flex justify-center pt-1">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55% / 0.7), hsl(275 65% 50% / 0.7))" }}
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              Baja a la siguiente sección
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </section>
  );
};

export default StatusUploader;
