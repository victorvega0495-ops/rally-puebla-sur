import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, ImageIcon, Film, Play, Upload, X, Loader2 } from "lucide-react";
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
}

type AssetType = "imagen_1" | "imagen_2" | "video_1" | "video_2";

const MAX_SIZE = 50 * 1024 * 1024;
const BUCKET = "campaign-assets";

const getStoragePath = (campaign: string, day: number, assetType: AssetType, ext: string) => {
  const type = assetType.startsWith("imagen") ? "imagen" : "video";
  const slot = assetType.endsWith("1") ? "1" : "2";
  return `${campaign}/dia-${day}/${type}-${slot}.${ext}`;
};

const UploadSlot = ({
  label,
  accept,
  type,
  file,
  uploading,
  progress,
  onFile,
  onRemove,
}: {
  label: string;
  accept: string;
  type: "image" | "video";
  file: string | null;
  uploading: boolean;
  progress: number;
  onFile: (f: File) => void;
  onRemove: () => void;
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

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
      {uploading ? (
        <div className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-3 bg-muted/20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Progress value={progress} className="w-3/4 h-2" />
          <span className="text-[10px] text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      ) : !file ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Toca para subir</span>
        </button>
      ) : type === "image" ? (
        <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden">
          <img src={file} alt={label} className="w-full h-full object-cover" />
          <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden bg-black">
          <video src={file} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
          <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
};

const StatusUploader = ({ lookName, statusCopyImage, statusCopyVideo, reelStructure, campaign, dayNumber }: StatusUploaderProps) => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Record<AssetType, string | null>>({
    imagen_1: null, imagen_2: null, video_1: null, video_2: null,
  });
  const [uploading, setUploading] = useState<Record<AssetType, boolean>>({
    imagen_1: false, imagen_2: false, video_1: false, video_2: false,
  });
  const [progress, setProgress] = useState<Record<AssetType, number>>({
    imagen_1: 0, imagen_2: 0, video_1: 0, video_2: 0,
  });

  // Load existing assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      const { data } = await supabase
        .from("day_assets")
        .select("asset_type, storage_url")
        .eq("campaign", campaign)
        .eq("day_number", dayNumber);
      if (data) {
        const loaded: Record<string, string> = {};
        data.forEach((row) => { loaded[row.asset_type] = row.storage_url; });
        setAssets((prev) => ({ ...prev, ...loaded }));
      }
    };
    loadAssets();
  }, [campaign, dayNumber]);

  const uploadFile = useCallback(async (file: File, assetType: AssetType) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = getStoragePath(campaign, dayNumber, assetType, ext);

    setUploading((p) => ({ ...p, [assetType]: true }));
    setProgress((p) => ({ ...p, [assetType]: 0 }));

    // Simulate progress since supabase-js doesn't expose upload progress
    const interval = setInterval(() => {
      setProgress((p) => ({ ...p, [assetType]: Math.min((p[assetType] || 0) + 15, 90) }));
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

    // Upsert in day_assets
    await supabase.from("day_assets").upsert(
      { campaign, day_number: dayNumber, asset_type: assetType, storage_url: publicUrl, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,asset_type" }
    );

    setAssets((p) => ({ ...p, [assetType]: publicUrl }));
    setUploading((p) => ({ ...p, [assetType]: false }));
    toast({ title: "¡Subido! ✓", duration: 2000 });
  }, [campaign, dayNumber, toast]);

  const removeFile = useCallback(async (assetType: AssetType) => {
    setAssets((p) => ({ ...p, [assetType]: null }));
    await supabase.from("day_assets").delete().eq("campaign", campaign).eq("day_number", dayNumber).eq("asset_type", assetType);
  }, [campaign, dayNumber]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copiado ✓`, duration: 2000 });
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
            <UploadSlot label="Imagen 1" accept=".jpg,.jpeg,.png" type="image" file={assets.imagen_1} uploading={uploading.imagen_1} progress={progress.imagen_1} onFile={(f) => uploadFile(f, "imagen_1")} onRemove={() => removeFile("imagen_1")} />
            <UploadSlot label="Imagen 2" accept=".jpg,.jpeg,.png" type="image" file={assets.imagen_2} uploading={uploading.imagen_2} progress={progress.imagen_2} onFile={(f) => uploadFile(f, "imagen_2")} onRemove={() => removeFile("imagen_2")} />
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-foreground font-medium">"{statusCopyImage}"</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(statusCopyImage, "Copy del estado")}>
            <Copy className="w-3.5 h-3.5 mr-1" /> Copiar copy ✓
          </Button>
        </TabsContent>

        <TabsContent value="video" className="space-y-3">
          <div className="flex gap-3">
            <UploadSlot label="Video 1" accept=".mp4,.mov" type="video" file={assets.video_1} uploading={uploading.video_1} progress={progress.video_1} onFile={(f) => uploadFile(f, "video_1")} onRemove={() => removeFile("video_1")} />
            <UploadSlot label="Video 2" accept=".mp4,.mov" type="video" file={assets.video_2} uploading={uploading.video_2} progress={progress.video_2} onFile={(f) => uploadFile(f, "video_2")} onRemove={() => removeFile("video_2")} />
          </div>
          <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
            {reelStructure.map((line, i) => (
              <p key={i} className="text-xs text-muted-foreground">{line}</p>
            ))}
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-foreground font-medium">"{statusCopyVideo}"</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => copyText(statusCopyVideo, "Copy del video")}>
            <Copy className="w-3.5 h-3.5 mr-1" /> Copiar copy ✓
          </Button>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default StatusUploader;
