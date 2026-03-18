import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiosSemanaProps {
  campaignId: string;
  isAdmin: boolean;
}

interface SlotData {
  imageUrl: string;
  productId: string;
  points: string;
}

const BASE_SLOTS = 12;
const PRIZE_DATA = [
  { place: "🥇 1er lugar", desc: "Cupón de $2,000 válido en tienda o app", gradient: "from-yellow-200 to-amber-300", border: "border-amber-400" },
  { place: "🥈 2do lugar", desc: "2 boletos para Six Flags o cupón de $1,500", gradient: "from-gray-200 to-slate-300", border: "border-slate-400" },
  { place: "🥉 3er lugar", desc: "Cupón de $1,000", gradient: "from-orange-200 to-amber-400", border: "border-orange-400" },
];

const PremiosSemana = ({ campaignId, isAdmin }: PremiosSemanaProps) => {
  const [slots, setSlots] = useState<Record<number, SlotData>>({});
  const [totalSlots, setTotalSlots] = useState(BASE_SLOTS);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("day_assets")
      .select("*")
      .eq("campaign", campaignId)
      .eq("day_number", 0)
      .like("asset_type", "premio_%")
      .then(({ data }) => {
        if (!data) return;
        const map: Record<number, SlotData> = {};
        let maxIdx = BASE_SLOTS - 1;
        data.forEach((r: any) => {
          const idx = parseInt(r.asset_type.replace("premio_", ""), 10);
          if (!isNaN(idx)) {
            map[idx] = {
              imageUrl: r.storage_url || "",
              productId: r.product_id || "",
              points: r.product_description || "",
            };
            if (idx > maxIdx) maxIdx = idx;
          }
        });
        setSlots(map);
        setTotalSlots(Math.max(BASE_SLOTS, maxIdx + 1));
      });
  }, [campaignId]);

  const uploadImage = useCallback(async (idx: number, file: File) => {
    setUploading(idx);
    const path = `${campaignId}/premios/${idx}_${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("campaign-assets").upload(path, file, { upsert: true });
    if (error) { setUploading(null); return; }
    const { data: urlData } = supabase.storage.from("campaign-assets").getPublicUrl(path);
    const url = urlData.publicUrl;
    await supabase.from("day_assets").upsert({
      campaign: campaignId,
      day_number: 0,
      asset_type: `premio_${idx}`,
      storage_url: url,
      file_name: file.name,
      product_id: slots[idx]?.productId || "",
      product_description: slots[idx]?.points || "",
      updated_at: new Date().toISOString(),
    } as any, { onConflict: "campaign,day_number,asset_type" });
    setSlots((prev) => ({ ...prev, [idx]: { imageUrl: url, productId: prev[idx]?.productId || "", points: prev[idx]?.points || "" } }));
    setUploading(null);
  }, [campaignId, slots]);

  const deleteSlot = useCallback(async (idx: number) => {
    await supabase.from("day_assets").delete().eq("campaign", campaignId).eq("day_number", 0).eq("asset_type", `premio_${idx}`);
    setSlots((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  }, [campaignId]);

  const saveMeta = useCallback(async (idx: number, field: "product_id" | "product_description", value: string) => {
    setSlots((prev) => ({
      ...prev,
      [idx]: {
        imageUrl: prev[idx]?.imageUrl || "",
        productId: field === "product_id" ? value : (prev[idx]?.productId || ""),
        points: field === "product_description" ? value : (prev[idx]?.points || ""),
      },
    }));
    await supabase.from("day_assets").upsert({
      campaign: campaignId,
      day_number: 0,
      asset_type: `premio_${idx}`,
      storage_url: slots[idx]?.imageUrl || "",
      file_name: "",
      product_id: field === "product_id" ? value : (slots[idx]?.productId || ""),
      product_description: field === "product_description" ? value : (slots[idx]?.points || ""),
      updated_at: new Date().toISOString(),
    } as any, { onConflict: "campaign,day_number,asset_type" });
  }, [campaignId, slots]);

  const addSlot = () => setTotalSlots((prev) => prev + 1);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-foreground text-center">🏆 Premios de la semana</h2>

      <div className="w-full rounded-2xl px-5 py-4 text-center" style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}>
        <p className="text-white font-bold text-sm leading-snug">
          ⭐ Cada producto que compras acumula puntos — quien sume más puntos, ¡gana!
        </p>
      </div>

      {/* Product mosaic */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: totalSlots }, (_, i) => {
          const slot = slots[i];
          return (
            <div key={i} className="relative rounded-xl border border-border bg-card overflow-hidden aspect-square flex flex-col">
              {slot?.imageUrl ? (
                <div className="relative flex-1">
                  <img src={slot.imageUrl} alt={`Producto ${i + 1}`} className="w-full h-full object-cover" />
                  {isAdmin && (
                    <button
                      onClick={() => deleteSlot(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!isAdmin && slot.productId && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2.5 py-1.5">
                      <p className="text-white text-sm font-bold truncate" style={{ fontSize: "14px" }}>{slot.productId}</p>
                    </div>
                  )}
                  {!isAdmin && slot.points && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {slot.points} pts
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex-1 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  {uploading === i ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isAdmin ? (
                    <>
                      <Upload className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadImage(i, e.target.files[0]); }} />
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </label>
              )}
              {isAdmin && (
                <div className="p-1.5 space-y-1 bg-muted/50">
                  <input
                    type="text"
                    placeholder="ID producto"
                    value={slot?.productId || ""}
                    onChange={(e) => saveMeta(i, "product_id", e.target.value)}
                    className="w-full text-[10px] px-1.5 py-1 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Puntos"
                    value={slot?.points || ""}
                    onChange={(e) => saveMeta(i, "product_description", e.target.value)}
                    className="w-full text-[10px] px-1.5 py-1 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add slot button - admin only */}
      {isAdmin && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addSlot}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar producto
        </Button>
      )}

      {/* Prize structure */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRIZE_DATA.map((p) => (
          <div key={p.place} className={`rounded-xl border ${p.border} bg-gradient-to-br ${p.gradient} p-4 text-center space-y-1`}>
            <p className="text-2xl">{p.place.slice(0, 2)}</p>
            <p className="font-bold text-sm text-foreground">{p.place.slice(2).trim()}</p>
            <p className="text-xs text-foreground/80">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiosSemana;
