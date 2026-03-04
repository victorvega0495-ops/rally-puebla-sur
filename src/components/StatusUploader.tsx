import { useState, useRef } from "react";
import { Copy, ImageIcon, Film, Play, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface StatusUploaderProps {
  lookName: string;
  statusCopyImage: string;
  statusCopyVideo: string;
  reelStructure: string[];
}

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const UploadSlot = ({
  label,
  accept,
  type,
  file,
  onFile,
  onRemove,
}: {
  label: string;
  accept: string;
  type: "image" | "video";
  file: string | null;
  onFile: (url: string) => void;
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
    const url = URL.createObjectURL(f);
    onFile(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
      {!file ? (
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
          <button
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
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
          <button
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
};

const StatusUploader = ({ lookName, statusCopyImage, statusCopyVideo, reelStructure }: StatusUploaderProps) => {
  const { toast } = useToast();
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [videos, setVideos] = useState<(string | null)[]>([null, null]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copiado ✓`, duration: 2000 });
    });
  };

  const setSlot = (arr: (string | null)[], setArr: React.Dispatch<React.SetStateAction<(string | null)[]>>, idx: number, val: string | null) => {
    const next = [...arr];
    next[idx] = val;
    setArr(next);
  };

  return (
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
          <div className="flex gap-3">
            <UploadSlot
              label="Imagen 1"
              accept=".jpg,.jpeg,.png"
              type="image"
              file={images[0]}
              onFile={(url) => setSlot(images, setImages, 0, url)}
              onRemove={() => setSlot(images, setImages, 0, null)}
            />
            <UploadSlot
              label="Imagen 2"
              accept=".jpg,.jpeg,.png"
              type="image"
              file={images[1]}
              onFile={(url) => setSlot(images, setImages, 1, url)}
              onRemove={() => setSlot(images, setImages, 1, null)}
            />
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
            <UploadSlot
              label="Video 1"
              accept=".mp4,.mov"
              type="video"
              file={videos[0]}
              onFile={(url) => setSlot(videos, setVideos, 0, url)}
              onRemove={() => setSlot(videos, setVideos, 0, null)}
            />
            <UploadSlot
              label="Video 2"
              accept=".mp4,.mov"
              type="video"
              file={videos[1]}
              onFile={(url) => setSlot(videos, setVideos, 1, url)}
              onRemove={() => setSlot(videos, setVideos, 1, null)}
            />
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
