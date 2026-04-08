import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Download, Loader2, ImageIcon, Film, Smartphone } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageLightbox from "@/components/ImageLightbox";
import { optimizeImage, videoPoster } from "@/lib/mediaUrl";

const BUCKET = "campaign-assets";
const MAX_SIZE = 50 * 1024 * 1024;

const SLOT_LABELS = [
  "Estado 1 — La Presentación",
  "Estado 2 — La Prenda",
  "Estado 3 — ¿Falda o Pantalón?",
  "Estado 4 — ¿Saco o Chaleco?",
  "Estado 5 — ¿Qué zapatos?",
  "Estado 6 — ¿Qué bolsa?",
  "Estado 7 — El Look Final",
];

interface AssetData { url: string; fileName: string; }

interface OutfitColabCarouselProps {
  campaign: string;
  dayNumber: number;
  isAdmin?: boolean;
}

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
    window.open(url, "_blank");
  }
};

const OutfitColabCarousel = ({ campaign, dayNumber, isAdmin }: OutfitColabCarouselProps) => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<(AssetData | null)[]>(Array(7).fill(null));
  const [uploading, setUploading] = useState<boolean[]>(Array(7).fill(false));
  const [progress, setProgress] = useState<number[]>(Array(7).fill(0));
  const [activeSlot, setActiveSlot] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Video assets
  const [videoAssets, setVideoAssets] = useState<Record<string, AssetData | null>>({ video_1: null, video_2: null });
  const [videoUploading, setVideoUploading] = useState<Record<string, boolean>>({ video_1: false, video_2: false });
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({ video_1: 0, video_2: 0 });

  const getAssetType = (i: number) => `outfit_colab_${i + 1}`;
  const getStoragePath = (i: number, ext: string) => `${campaign}/dia-${dayNumber}/outfit-colab-${i + 1}.${ext}`;

  // Load assets
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url, file_name")
        .eq("campaign", campaign)
        .eq("day_number", dayNumber);
      if (data) {
        const newAssets = [...Array(7).fill(null)] as (AssetData | null)[];
        const newVideos: Record<string, AssetData | null> = { video_1: null, video_2: null };
        data.forEach((r) => {
          if (r.asset_type.startsWith("outfit_colab_")) {
            const idx = parseInt(r.asset_type.replace("outfit_colab_", "")) - 1;
            if (idx >= 0 && idx < 7) newAssets[idx] = { url: r.storage_url, fileName: r.file_name };
          } else if (r.asset_type === "video_1" || r.asset_type === "video_2") {
            newVideos[r.asset_type] = { url: r.storage_url, fileName: r.file_name };
          }
        });
        setAssets(newAssets);
        setVideoAssets(newVideos);
      }
    };
    load();
  }, [campaign, dayNumber]);

  // Scroll to active slot
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const slot = container.children[activeSlot] as HTMLElement;
    if (slot) {
      container.scrollTo({ left: slot.offsetLeft - (container.offsetWidth - slot.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [activeSlot]);

  // Detect scroll position
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - elCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveSlot(closest);
  }, []);

  const uploadImage = useCallback(async (file: File, slotIdx: number) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = getStoragePath(slotIdx, ext);

    setUploading(p => { const n = [...p]; n[slotIdx] = true; return n; });
    setProgress(p => { const n = [...p]; n[slotIdx] = 0; return n; });

    const interval = setInterval(() => {
      setProgress(p => { const n = [...p]; n[slotIdx] = Math.min((n[slotIdx] || 0) + 12, 90); return n; });
    }, 200);

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    clearInterval(interval);

    if (error) {
      setUploading(p => { const n = [...p]; n[slotIdx] = false; return n; });
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      return;
    }

    setProgress(p => { const n = [...p]; n[slotIdx] = 100; return n; });
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    await supabase.from("day_assets").upsert(
      { campaign, day_number: dayNumber, asset_type: getAssetType(slotIdx), storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );

    setAssets(p => { const n = [...p]; n[slotIdx] = { url: urlData.publicUrl, fileName: file.name }; return n; });
    setUploading(p => { const n = [...p]; n[slotIdx] = false; return n; });
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaign, dayNumber, toast]);

  const removeImage = useCallback(async (slotIdx: number) => {
    const asset = assets[slotIdx];
    if (asset) {
      const parts = asset.url.split(`/storage/v1/object/public/${BUCKET}/`);
      if (parts[1]) await supabase.storage.from(BUCKET).remove([parts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaign).eq("day_number", dayNumber).eq("asset_type", getAssetType(slotIdx));
    setAssets(p => { const n = [...p]; n[slotIdx] = null; return n; });
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaign, dayNumber, assets, toast]);

  // Video upload/remove
  const uploadVideo = useCallback(async (file: File, key: "video_1" | "video_2") => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const path = `${campaign}/dia-${dayNumber}/${key}.${ext}`;

    setVideoUploading(p => ({ ...p, [key]: true }));
    setVideoProgress(p => ({ ...p, [key]: 0 }));

    const interval = setInterval(() => {
      setVideoProgress(p => ({ ...p, [key]: Math.min((p[key] || 0) + 12, 90) }));
    }, 200);

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    clearInterval(interval);

    if (error) {
      setVideoUploading(p => ({ ...p, [key]: false }));
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      return;
    }

    setVideoProgress(p => ({ ...p, [key]: 100 }));
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    await supabase.from("day_assets").upsert(
      { campaign, day_number: dayNumber, asset_type: key, storage_url: urlData.publicUrl, file_name: file.name, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );

    setVideoAssets(p => ({ ...p, [key]: { url: urlData.publicUrl, fileName: file.name } }));
    setVideoUploading(p => ({ ...p, [key]: false }));
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaign, dayNumber, toast]);

  const removeVideo = useCallback(async (key: "video_1" | "video_2") => {
    const asset = videoAssets[key];
    if (asset) {
      const parts = asset.url.split(`/storage/v1/object/public/${BUCKET}/`);
      if (parts[1]) await supabase.storage.from(BUCKET).remove([parts[1]]);
    }
    await supabase.from("day_assets").delete().eq("campaign", campaign).eq("day_number", dayNumber).eq("asset_type", key);
    setVideoAssets(p => ({ ...p, [key]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaign, dayNumber, videoAssets, toast]);

  return (
    <>
      {/* Outfit Colaborativo Carousel */}
      <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-sm text-foreground">👗 Tu Outfit Colaborativo de Hoy</h2>
          <p className="text-xs text-muted-foreground mt-1">Sube estas 7 imágenes en secuencia a tus estados — una por una con 1-2 horas entre cada una</p>
        </div>

        <div className="px-2 py-4">
          {/* Horizontal scrollable carousel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {SLOT_LABELS.map((label, i) => (
              <SlotCard
                key={i}
                index={i}
                label={label}
                asset={assets[i]}
                isAdmin={isAdmin}
                uploading={uploading[i]}
                progress={progress[i]}
                onFile={(f) => uploadImage(f, i)}
                onRemove={() => removeImage(i)}
                onImageTap={(url) => setLightboxSrc(url)}
              />
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            {SLOT_LABELS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlot(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeSlot ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Videos section */}
      <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-display font-bold text-sm text-foreground">🎬 Videos complementarios del día</h2>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            {(["video_1", "video_2"] as const).map((key, idx) => (
              <VideoSlot
                key={key}
                label={`Video ${idx + 1}`}
                asset={videoAssets[key]}
                isAdmin={isAdmin}
                uploading={videoUploading[key]}
                progress={videoProgress[key]}
                onFile={(f) => uploadVideo(f, key)}
                onRemove={() => removeVideo(key)}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">Descarga y comparte estos videos como complemento de tu outfit</p>
        </div>
      </section>

      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
};

/* ── Slot Card ── */
const SlotCard = ({ index, label, asset, isAdmin, uploading, progress: prog, onFile, onRemove, onImageTap }: {
  index: number; label: string; asset: AssetData | null; isAdmin?: boolean;
  uploading: boolean; progress: number; onFile: (f: File) => void; onRemove: () => void; onImageTap: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast({ title: "Archivo muy grande", description: "Máximo 50 MB", variant: "destructive" });
      return;
    }
    onFile(f);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-shrink-0 w-[200px] snap-center">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center leading-tight min-h-[28px] flex items-center justify-center">{label}</p>

      {uploading ? (
        <div className="w-full aspect-[9/16] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 bg-muted/20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Progress value={prog} className="w-3/4 h-2" />
          <span className="text-[10px] text-muted-foreground">{Math.round(prog)}%</span>
        </div>
      ) : asset ? (
        <>
          <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden cursor-pointer" onClick={() => onImageTap(asset.url)}>
            <img src={optimizeImage(asset.url, 400)} alt={label} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
          <button
            onClick={() => downloadBlob(asset.url, asset.fileName, toast)}
            className="mt-1.5 w-full flex items-center justify-center gap-1 text-[10px] text-primary hover:underline"
          >
            <Download className="w-3 h-3" /> ⬇️ Descargar
          </button>
        </>
      ) : isAdmin ? (
        <button onClick={() => inputRef.current?.click()} className="w-full aspect-[9/16] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Subir imagen</span>
        </button>
      ) : (
        <div className="w-full aspect-[9/16] rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-border flex flex-col items-center justify-center gap-2 p-3">
          <ImageIcon className="w-7 h-7 text-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground text-center">Próximamente</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
    </div>
  );
};

/* ── Video Slot ── */
const VideoSlot = ({ label, asset, isAdmin, uploading, progress: prog, onFile, onRemove }: {
  label: string; asset: AssetData | null; isAdmin?: boolean;
  uploading: boolean; progress: number; onFile: (f: File) => void; onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast({ title: "Archivo muy grande", description: "Máximo 50 MB", variant: "destructive" });
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
    if (!isAdmin) {
      return (
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
          <div className="w-full aspect-[9/16] max-h-[220px] rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-border flex flex-col items-center justify-center gap-2 p-3">
            <Film className="w-7 h-7 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground text-center">Próximamente</span>
          </div>
        </div>
      );
    }
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
        <video src={videoPoster(asset.url)} controls playsInline preload="metadata" className="w-full h-full object-cover" />
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
      <button
        onClick={(e) => { e.preventDefault(); downloadBlob(asset.url, asset.fileName, toast); }}
        className="mt-1.5 w-full flex items-center justify-center gap-1 text-[10px] text-primary hover:underline"
      >
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

export default OutfitColabCarousel;
