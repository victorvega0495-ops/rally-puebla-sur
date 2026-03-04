import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, ImageIcon, Film, Upload, X, Pencil, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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

type VideoSlot = "video_1" | "video_2";

const MAX_SIZE = 50 * 1024 * 1024;

/* ── helpers ── */
const extractYouTubeId = (url: string): string | null => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

/* ── Image upload slot (local only) ── */
const ImageSlot = ({ label, file, onFile, onRemove }: {
  label: string; file: string | null;
  onFile: (f: File) => void; onRemove: () => void;
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
      {!file ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Toca para subir</span>
        </button>
      ) : (
        <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden">
          <img src={file} alt={label} className="w-full h-full object-cover" />
          <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
    </div>
  );
};

/* ── YouTube embed slot ── */
const YouTubeSlot = ({ label, youtubeUrl, onSave }: {
  label: string; youtubeUrl: string | null; onSave: (url: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const { toast } = useToast();

  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  const handleSave = () => {
    if (!extractYouTubeId(draft)) {
      toast({ title: "URL inválida", description: "Pega un link de YouTube válido", variant: "destructive", duration: 3000 });
      return;
    }
    onSave(draft);
    setEditing(false);
    setDraft("");
  };

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1.5 text-center">{label}</p>
      {videoId ? (
        <div className="relative w-full aspect-[9/16] max-h-[220px] rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
            className="w-full h-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={label}
          />
          <button
            onClick={() => { setDraft(youtubeUrl || ""); setEditing(true); }}
            className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full aspect-[9/16] max-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/20"
        >
          <Youtube className="w-8 h-8 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground text-center px-2">Pega el link de YouTube aquí</span>
        </button>
      )}

      {editing && (
        <div className="mt-2 flex gap-1.5">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="text-xs h-8"
          />
          <Button size="sm" className="h-8 px-2 text-xs" onClick={handleSave}>OK</Button>
          <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => setEditing(false)}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

/* ── Main component ── */
const StatusUploader = ({ lookName, statusCopyImage, statusCopyVideo, reelStructure, campaign, dayNumber }: StatusUploaderProps) => {
  const { toast } = useToast();

  // Local image state
  const [images, setImages] = useState<{ imagen_1: string | null; imagen_2: string | null }>({ imagen_1: null, imagen_2: null });

  // YouTube URLs from DB
  const [videos, setVideos] = useState<Record<VideoSlot, string | null>>({ video_1: null, video_2: null });

  // Load saved YouTube URLs
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("day_videos")
        .select("video_slot, youtube_url")
        .eq("campaign", campaign)
        .eq("day_number", dayNumber);
      if (data) {
        const m: Record<string, string> = {};
        data.forEach((r) => { m[r.video_slot] = r.youtube_url; });
        setVideos((p) => ({ ...p, ...m }));
      }
    };
    load();
  }, [campaign, dayNumber]);

  const saveYouTubeUrl = useCallback(async (slot: VideoSlot, url: string) => {
    await supabase.from("day_videos").upsert(
      { campaign, day_number: dayNumber, video_slot: slot, youtube_url: url, updated_at: new Date().toISOString() },
      { onConflict: "campaign,day_number,video_slot" }
    );
    setVideos((p) => ({ ...p, [slot]: url }));
    toast({ title: "¡Video guardado! ✓", duration: 2000 });
  }, [campaign, dayNumber, toast]);

  const handleImageFile = (slot: "imagen_1" | "imagen_2", file: File) => {
    const url = URL.createObjectURL(file);
    setImages((p) => ({ ...p, [slot]: url }));
  };

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
            <ImageSlot label="Imagen 1" file={images.imagen_1} onFile={(f) => handleImageFile("imagen_1", f)} onRemove={() => setImages((p) => ({ ...p, imagen_1: null }))} />
            <ImageSlot label="Imagen 2" file={images.imagen_2} onFile={(f) => handleImageFile("imagen_2", f)} onRemove={() => setImages((p) => ({ ...p, imagen_2: null }))} />
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
            <YouTubeSlot label="Video 1" youtubeUrl={videos.video_1} onSave={(url) => saveYouTubeUrl("video_1", url)} />
            <YouTubeSlot label="Video 2" youtubeUrl={videos.video_2} onSave={(url) => saveYouTubeUrl("video_2", url)} />
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
