import { useState, useRef, useEffect, useCallback } from "react";
import { ImageIcon, Film, Upload, X, Download, Loader2, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
const ImageAssetSlot = ({ label, asset, lookName, isAdmin, uploading, progress: prog, onFile, onRemove }: {
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
      <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden">
        <img src={asset.url} alt={label} className="w-full h-full object-cover" />
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
      <a href={asset.url} download={asset.fileName} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-primary hover:underline">
        <Download className="w-3 h-3" /> Descargar
      </a>
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
      <a href={asset.url} download={asset.fileName} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-primary hover:underline">
        <Download className="w-3 h-3" /> Descargar
      </a>
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
    // Find and delete from storage
    const asset = assets[assetType];
    if (asset) {
      // Extract path from URL
      const urlParts = asset.url.split(`/storage/v1/object/public/${BUCKET}/`);
      if (urlParts[1]) {
        await supabase.storage.from(BUCKET).remove([urlParts[1]]);
      }
    }
    await supabase.from("day_assets").delete().eq("campaign", campaign).eq("day_number", dayNumber).eq("asset_type", assetType);
    setAssets((p) => ({ ...p, [assetType]: null }));
    toast({ title: "Eliminado ✓", duration: 2000 });
  }, [campaign, dayNumber, assets, toast]);

  const [copied, setCopied] = useState(false);

  const copyUniversal = () => {
    const text = statusCopyImage || statusCopyVideo;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="font-display font-bold text-sm text-foreground">📱 Tu Estado de Hoy</h2>
      </div>
      <Tabs defaultValue="imagen" className="p-4">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="imagen" className="text-xs gap-1"><ImageIcon className="w-3.5 h-3.5" /> Imagen</TabsTrigger>
          <TabsTrigger value="video" className="text-xs gap-1"><Film className="w-3.5 h-3.5" /> Video</TabsTrigger>
        </TabsList>

        <TabsContent value="imagen" className="space-y-3">
          <div className="flex gap-3">
            <ImageAssetSlot label="Imagen 1" asset={assets.imagen_1} lookName={lookName} isAdmin={isAdmin} uploading={uploading.imagen_1} progress={progress.imagen_1} onFile={(f) => uploadFile(f, "imagen_1")} onRemove={() => removeFile("imagen_1")} />
            <ImageAssetSlot label="Imagen 2" asset={assets.imagen_2} lookName={lookName} isAdmin={isAdmin} uploading={uploading.imagen_2} progress={progress.imagen_2} onFile={(f) => uploadFile(f, "imagen_2")} onRemove={() => removeFile("imagen_2")} />
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-3">
          <div className="flex gap-3">
            <VideoAssetSlot label="Video 1" asset={assets.video_1} lookName={lookName} isAdmin={isAdmin} uploading={uploading.video_1} progress={progress.video_1} onFile={(f) => uploadFile(f, "video_1")} onRemove={() => removeFile("video_1")} />
            <VideoAssetSlot label="Video 2" asset={assets.video_2} lookName={lookName} isAdmin={isAdmin} uploading={uploading.video_2} progress={progress.video_2} onFile={(f) => uploadFile(f, "video_2")} onRemove={() => removeFile("video_2")} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Universal copy button */}
      <div className="px-4 pb-4">
        <div className="rounded-lg bg-muted/50 p-3 mb-3">
          <p className="text-sm text-foreground font-medium text-center">"{statusCopyImage}"</p>
        </div>
        <button
          onClick={copyUniversal}
          className="w-full py-3 rounded-xl font-display font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> ¡Copiado! Úsalo en tu imagen o video 🚀
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Copiar texto para cualquier imagen o video
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default StatusUploader;
