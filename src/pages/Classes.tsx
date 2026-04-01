import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, Search, Filter, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkLocalAccess, saveLocalAccess } from "@/lib/accessCode";
import { useToast } from "@/hooks/use-toast";

interface ClassRow {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  category: string;
  week_number: number | null;
  duration_minutes: number;
  is_published: boolean;
}

const getYouTubeThumbnail = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return "";
};

const CATEGORIES = ["Todas", "Prospección", "Cierre", "Redes Sociales", "Seguimiento", "Técnicas de Venta"];

const Classes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Clases | Rally Puebla Sur";
    if (checkLocalAccess("classes") || checkLocalAccess("both")) {
      setHasAccess(true);
    }
  }, []);

  useEffect(() => {
    if (!hasAccess) { setLoading(false); return; }
    supabase
      .from("classes")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setClasses(data as ClassRow[]);
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

    if (data && (data.section === "classes" || data.section === "both")) {
      saveLocalAccess(accessCode.trim(), data.section);
      setHasAccess(true);
      toast({ title: "¡Acceso concedido!", duration: 2000 });
    } else {
      toast({ title: "Código inválido", variant: "destructive", duration: 2000 });
    }
    setAccessCode("");
  };

  const filtered = classes.filter((c) => {
    if (selectedCategory !== "Todas" && c.category !== selectedCategory) return false;
    if (selectedWeek !== null && c.week_number !== selectedWeek) return false;
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
          <h1 className="font-display text-xl font-bold mt-2">Clases</h1>
          <p className="text-xs text-white/80 mt-1">Repositorio de clases</p>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-sm w-full space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Play className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold">Ingresa tu código</h2>
            <p className="text-sm text-muted-foreground">Necesitas un código de acceso para ver las clases</p>
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
        <h1 className="font-display text-xl font-bold mt-2">Clases</h1>
        <p className="text-xs text-white/80 mt-1">Aprende las mejores técnicas de venta</p>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              style={selectedCategory === cat ? { background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Week filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedWeek(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              selectedWeek === null ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}
          >
            Todas
          </button>
          {[1, 2, 3, 4, 5, 6].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                selectedWeek === w ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}
            >
              Semana {w}
            </button>
          ))}
        </div>
      </div>

      {/* Classes grid */}
      <div className="px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay clases disponibles con estos filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((cls) => {
              const thumb = cls.thumbnail_url || getYouTubeThumbnail(cls.youtube_url);
              return (
                <a
                  key={cls.id}
                  href={cls.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-all"
                >
                  <div className="relative w-36 h-24 flex-shrink-0">
                    {thumb ? (
                      <img src={thumb} alt={cls.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Play className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-2 pr-3 space-y-1">
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-2">{cls.title}</h3>
                    <div className="flex items-center gap-2">
                      {cls.category && (
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{cls.category}</Badge>
                      )}
                      {cls.duration_minutes && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {cls.duration_minutes} min
                        </span>
                      )}
                    </div>
                    {cls.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{cls.description}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
