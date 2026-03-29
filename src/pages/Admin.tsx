import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload, X, Eye, EyeOff, Save, Film, BookOpen, Key, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PASSWORD = "priceshoes2026";
const BUCKET = "campaign-assets";

type Tab = "campaigns" | "classes" | "videos" | "codes";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");

  const handleAuth = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      toast({ title: "Acceso concedido", duration: 2000 });
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive", duration: 2000 });
    }
    setPassword("");
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <h1 className="font-display text-2xl font-bold mb-6">Panel Admin</h1>
        <div className="w-full max-w-sm space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="Contraseña"
            autoFocus
          />
          <Button className="w-full text-white" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }} onClick={handleAuth}>
            Entrar
          </Button>
          <button onClick={() => navigate("/")} className="w-full text-sm text-muted-foreground hover:text-foreground">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "campaigns", label: "Campañas", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "classes", label: "Clases", icon: <BookOpen className="w-4 h-4" /> },
    { id: "videos", label: "Videos", icon: <Film className="w-4 h-4" /> },
    { id: "codes", label: "Códigos", icon: <Key className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg">Panel Admin</h1>
        <div className="w-5" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {activeTab === "campaigns" && <CampaignsAdmin />}
        {activeTab === "classes" && <ClassesAdmin />}
        {activeTab === "videos" && <VideosAdmin />}
        {activeTab === "codes" && <CodesAdmin />}
      </div>
    </div>
  );
};

/* ============ Campaigns Admin ============ */
const CampaignsAdmin = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("campaigns").select("*").order("sort_order").then(({ data }) => {
      if (data) setCampaigns(data);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "draft" : "active";
    await supabase.from("campaigns").update({ status: next }).eq("id", id);
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: next } : c));
    toast({ title: `Campaña ${next === "active" ? "activada" : "desactivada"}`, duration: 2000 });
  };

  if (loading) return <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Campañas del Rally</h2>
      <p className="text-sm text-muted-foreground">Activa o desactiva semanas del rally. El contenido de cada día se edita entrando a la semana con modo admin.</p>
      {campaigns.map((c) => (
        <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div>
            <p className="font-bold text-sm">{c.title}</p>
            <p className="text-xs text-muted-foreground">{c.slug}</p>
          </div>
          <Button
            size="sm"
            variant={c.status === "active" ? "default" : "outline"}
            onClick={() => toggleStatus(c.id, c.status)}
          >
            {c.status === "active" ? <><Eye className="w-3.5 h-3.5 mr-1" /> Activa</> : <><EyeOff className="w-3.5 h-3.5 mr-1" /> Inactiva</>}
          </Button>
        </div>
      ))}
    </div>
  );
};

/* ============ Classes Admin ============ */
const ClassesAdmin = () => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", youtube_url: "", category: "", description: "", duration_minutes: "", week_number: "" });

  useEffect(() => {
    supabase.from("classes").select("*").order("sort_order").then(({ data }) => {
      if (data) setClasses(data);
      setLoading(false);
    });
  }, []);

  const addClass = async () => {
    if (!form.title || !form.youtube_url) { toast({ title: "Título y URL son requeridos", variant: "destructive" }); return; }
    const { data, error } = await supabase.from("classes").insert({
      title: form.title,
      youtube_url: form.youtube_url,
      category: form.category || null,
      description: form.description || null,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      week_number: form.week_number ? parseInt(form.week_number) : null,
      is_published: true,
      sort_order: classes.length,
    }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (data) setClasses((prev) => [...prev, data]);
    setForm({ title: "", youtube_url: "", category: "", description: "", duration_minutes: "", week_number: "" });
    toast({ title: "Clase agregada", duration: 2000 });
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from("classes").update({ is_published: !current }).eq("id", id);
    setClasses((prev) => prev.map((c) => c.id === id ? { ...c, is_published: !current } : c));
  };

  const deleteClass = async (id: string) => {
    await supabase.from("classes").delete().eq("id", id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Clase eliminada", duration: 2000 });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg">Clases (YouTube)</h2>

      {/* Add form */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <p className="font-bold text-sm">Agregar clase</p>
        <Input placeholder="Título de la clase" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="URL de YouTube" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Categoría (ej: Cierre)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Duración (min)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Semana (1-6, vacío=general)" type="number" value={form.week_number} onChange={(e) => setForm({ ...form, week_number: e.target.value })} />
          <Button onClick={addClass} className="text-white" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>
        <Textarea placeholder="Descripción (opcional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      {/* List */}
      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
        <div className="space-y-2">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{cls.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{cls.youtube_url}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <button onClick={() => togglePublished(cls.id, cls.is_published)} className={`px-2 py-1 rounded text-[10px] font-bold ${cls.is_published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {cls.is_published ? "Visible" : "Oculta"}
                </button>
                <button onClick={() => deleteClass(cls.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============ Videos Admin ============ */
const VideosAdmin = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", occasion: "" });

  useEffect(() => {
    supabase.from("video_bank").select("*").order("sort_order").then(({ data }) => {
      if (data) setVideos(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (file: File) => {
    if (!form.title || !form.category) { toast({ title: "Título y categoría son requeridos", variant: "destructive" }); return; }
    setUploading(true);
    const path = `banco-videos/${form.category.toLowerCase()}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) { setUploading(false); toast({ title: "Error al subir", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const { data, error: insertErr } = await supabase.from("video_bank").insert({
      title: form.title,
      storage_url: urlData.publicUrl,
      category: form.category,
      occasion: form.occasion || null,
      is_published: true,
      sort_order: videos.length,
    }).select().single();
    if (insertErr) { toast({ title: "Error", description: insertErr.message, variant: "destructive" }); }
    else if (data) { setVideos((prev) => [...prev, data]); toast({ title: "Video subido", duration: 2000 }); }
    setForm({ title: "", category: "", occasion: "" });
    setUploading(false);
  };

  const deleteVideo = async (id: string, url: string) => {
    const urlParts = url.split("/storage/v1/object/public/campaign-assets/");
    if (urlParts[1]) await supabase.storage.from(BUCKET).remove([urlParts[1]]);
    await supabase.from("video_bank").delete().eq("id", id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast({ title: "Video eliminado", duration: 2000 });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg">Banco de Videos (15s)</h2>

      {/* Upload form */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <p className="font-bold text-sm">Subir video</p>
        <Input placeholder="Título del video" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Categoría (ej: Gym)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Ocasión (ej: Trabajo)" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} />
        </div>
        <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          <span className="text-sm font-semibold">{uploading ? "Subiendo..." : "Seleccionar video"}</span>
          <input type="file" accept=".mp4,.mov,.webm" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        </label>
      </div>

      {/* List */}
      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
        <div className="space-y-2">
          {videos.map((vid) => (
            <div key={vid.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{vid.title}</p>
                <div className="flex gap-2 mt-0.5">
                  {vid.category && <Badge className="text-[9px]">{vid.category}</Badge>}
                  {vid.occasion && <Badge variant="outline" className="text-[9px]">{vid.occasion}</Badge>}
                </div>
              </div>
              <button onClick={() => deleteVideo(vid.id, vid.storage_url)} className="text-destructive hover:text-destructive/80 ml-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============ Access Codes Admin ============ */
const CodesAdmin = () => {
  const { toast } = useToast();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newSection, setNewSection] = useState("both");

  useEffect(() => {
    supabase.from("access_codes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setCodes(data);
      setLoading(false);
    });
  }, []);

  const addCode = async () => {
    if (!newCode.trim()) { toast({ title: "Escribe un código", variant: "destructive" }); return; }
    const { data, error } = await supabase.from("access_codes").insert({
      code: newCode.trim(),
      section: newSection,
      is_active: true,
    }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (data) setCodes((prev) => [data, ...prev]);
    setNewCode("");
    toast({ title: "Código creado", duration: 2000 });
  };

  const toggleCode = async (id: string, current: boolean) => {
    await supabase.from("access_codes").update({ is_active: !current }).eq("id", id);
    setCodes((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
  };

  const deleteCode = async (id: string) => {
    await supabase.from("access_codes").delete().eq("id", id);
    setCodes((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Código eliminado", duration: 2000 });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-lg">Códigos de Acceso</h2>
      <p className="text-sm text-muted-foreground">Códigos para acceder a Clases y Contenido Exclusivo</p>

      {/* Add form */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <Input placeholder="Nuevo código (ej: RALLY2026)" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} />
        <div className="flex gap-2">
          {["both", "classes", "exclusive"].map((s) => (
            <button
              key={s}
              onClick={() => setNewSection(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${newSection === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {s === "both" ? "Ambos" : s === "classes" ? "Clases" : "Exclusivo"}
            </button>
          ))}
        </div>
        <Button onClick={addCode} className="w-full text-white" style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}>
          <Plus className="w-4 h-4 mr-1" /> Crear código
        </Button>
      </div>

      {/* List */}
      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
        <div className="space-y-2">
          {codes.map((code) => (
            <div key={code.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-mono font-bold text-sm">{code.code}</p>
                <div className="flex gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-[9px]">
                    {code.section === "both" ? "Ambos" : code.section === "classes" ? "Clases" : "Exclusivo"}
                  </Badge>
                  <Badge className={`text-[9px] ${code.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {code.is_active ? "Activo" : "Revocado"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleCode(code.id, code.is_active)} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80">
                  {code.is_active ? "Revocar" : "Activar"}
                </button>
                <button onClick={() => deleteCode(code.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
