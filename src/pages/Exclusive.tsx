import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Play, Download, Share2, Search, X, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkLocalAccess, saveLocalAccess } from "@/lib/accessCode";
import { shareOrDownload } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";

interface VideoRow {
  id: string;
  title: string;
  description: string;
  storage_url: string;
  thumbnail_url: string;
  category: string;
  occasion: string;
  duration_seconds: number;
  is_published: boolean;
}

const CATEGORIES = ["Todas", "Gym", "Casual", "Familia", "Oficina", "Playa"];
const OCCASIONS = ["Todas", "Fin de semana", "Trabajo", "Salida", "Evento", "Diario"];

const Exclusive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedOccasion, setSelectedOccasion] = useState("Todas");
  const [playingVideo, setPlayingVideo] = useState<VideoRow | null>(null);

  useEffect(() => {
    document.title = "Exclusivo | Rally Puebla Sur";
    if (checkLocalAccess("exclusive") || checkLocalAccess("both")) {
      setHasAccess(true);
    }
  }, []);

  useEffect(() => {
    if (!hasAccess) { setLoading(false); return; }
    supabase
      .from("video_bank")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setVideos(data as VideoRow[]);
        setLoading(false);
      });
  }, [hasAccess]);

  const handleAccessSubmit = async () => {
    const { data } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", accessCode.trim())
      .eq("is_active", true)
      .single();

    if (data && (data.section === "exclusive" || data.section === "both")) {
      saveLocalAccess(accessCode.trim(), data.section);
      setHasAccess(true);
      toast({ title: "¡Acceso concedido!", duration: 2000 });
    } else {
      toast({ title: "Código inválido", variant: "destructive", duration: 2000 });
    }
    setAccessCode("");
  };

  const filtered = videos.filter((v) => {
    if (selectedCategory !== "Todas" && v.category !== selectedCategory) return false;
    if (selectedOccasion !== "Todas" && v.occasion !== selectedOccasion) return false;
    return true;
  });

  // Access gate
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-4 py-6 text-center text-white relative" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}>
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <button onClick={() => navigate("/")}
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigate("/")}
              className="text-xs text-white/70 hover:text-white transition-colors">
              Inicio
            </button>
          </div>
          <h1 className="font-display text-xl font-bold mt-2">Contenido Exclusivo</h1>
          <p className="text-xs text-white/80 mt-1">Videos listos para compartir</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-sm w-full space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold">Contenido Exclusivo</h2>
            <p className="text-sm text-muted-foreground">Ingresa tu código de acceso para ver los videos exclusivos</p>
            <div className="flex gap-2">
              <Input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAccessSubmit()}
                placeholder="Código de acceso"
                className="text-center"
                autoFocus
              />
              <Button
                onClick={handleAccessSubmit}
                style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
                className="text-white"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="px-4 py-6 text-center text-white relative" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%), hsl(220 85% 55%))" }}>
        <button onClick={() => navigate("/")} className="absolute left-4 top-4 text-white/80 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold mt-2">Contenido Exclusivo</h1>
        <p className="text-xs text-white/80 mt-1">Videos de 15 segundos listos para compartir</p>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat ? "text-white" : "bg-muted text-muted-foreground"
              }`}
              style={selectedCategory === cat ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                selectedOccasion === occ ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div className="px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No hay videos con estos filtros</p>
            <p className="text-xs text-muted-foreground mt-1">El admin puede subir videos desde el panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((vid) => (
              <button
                key={vid.id}
                onClick={() => setPlayingVideo(vid)}
                className="rounded-xl overflow-hidden border border-border bg-card text-left transition-all hover:shadow-lg"
              >
                <div className="relative aspect-[9/16]">
                  {vid.thumbnail_url ? (
                    <img src={vid.thumbnail_url} alt={vid.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Film className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="w-5 h-5 text-foreground ml-0.5" />
                    </div>
                  </div>
                  {vid.category && (
                    <Badge className="absolute top-2 left-2 bg-black/60 text-white border-0 text-[9px]">
                      {vid.category}
                    </Badge>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-bold text-xs text-foreground line-clamp-1">{vid.title}</p>
                  {vid.occasion && <p className="text-[10px] text-muted-foreground">{vid.occasion}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen video player */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center" onClick={() => setPlayingVideo(null)}>
          <button onClick={() => setPlayingVideo(null)} className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 rounded-full p-2">
            <X className="w-6 h-6" />
          </button>
          <video
            src={playingVideo.storage_url}
            controls
            autoPlay
            className="max-h-[80vh] max-w-[95vw] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => shareOrDownload(playingVideo.storage_url, `${playingVideo.title}.mp4`)}
              className="flex items-center gap-2 text-sm font-semibold py-3 px-6 rounded-xl border border-white/30 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" /> Descargar
            </button>
            <button
              onClick={() => shareOrDownload(playingVideo.storage_url, `${playingVideo.title}.mp4`)}
              className="flex items-center gap-2 text-sm font-bold text-white py-3 px-6 rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
            >
              <Share2 className="w-4 h-4" /> Compartir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exclusive;
