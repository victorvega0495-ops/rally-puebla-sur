import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { optimizeImage } from "@/lib/mediaUrl";

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

const PremiosSemana = ({ campaignId, isAdmin }: PremiosSemanaProps) => {
  const [slots, setSlots] = useState<Record<number, SlotData>>({});
  const [totalSlots, setTotalSlots] = useState(BASE_SLOTS);
  const [uploading, setUploading] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxIdx(null); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [lightboxIdx]);

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

  const shareOrDownload = useCallback(async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const cleanName = `producto.${ext}`;
      const mimeType = blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
      const file = new File([blob], cleanName, { type: mimeType });
      if (navigator.share) {
        await navigator.share({ files: [file] });
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = cleanName;
        a.click();
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      // user cancelled
    }
  }, []);

  const downloadFile = useCallback(async (url: string, fileName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // download failed
    }
  }, []);

  const addSlot = () => setTotalSlots((prev) => prev + 1);

  const lightboxSlot = lightboxIdx !== null ? slots[lightboxIdx] : null;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-foreground text-center">IDs de la semana</h2>

      {/* Product mosaic */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: totalSlots }, (_, i) => {
          const slot = slots[i];
          return (
            <div key={i} className="relative rounded-xl border border-border bg-card overflow-hidden aspect-square flex flex-col">
              {slot?.imageUrl ? (
                <div
                  className="relative flex-1 cursor-pointer"
                  onClick={() => !isAdmin && setLightboxIdx(i)}
                >
                  <img src={optimizeImage(slot.imageUrl, 400)} alt={`Producto ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSlot(i); }}
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

      {/* Lightbox */}
      {lightboxIdx !== null && lightboxSlot?.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={optimizeImage(lightboxSlot.imageUrl, 1200)}
            alt={lightboxSlot.productId || `Producto ${lightboxIdx + 1}`}
            loading="eager"
            decoding="async"
            className="max-h-[65vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxSlot.productId && (
            <p className="text-white font-bold mt-4" style={{ fontSize: "16px" }} onClick={(e) => e.stopPropagation()}>
              {lightboxSlot.productId}
            </p>
          )}

          <div className="flex items-center gap-3 mt-4 w-full max-w-sm px-5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => downloadFile(lightboxSlot.imageUrl, lightboxSlot.productId ? `${lightboxSlot.productId}.jpg` : `producto-${lightboxIdx + 1}.jpg`)}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" /> ⬇️ Descargar
            </button>
            <button
              onClick={() => shareOrDownload(lightboxSlot.imageUrl, lightboxSlot.productId ? `${lightboxSlot.productId}.jpg` : `producto-${lightboxIdx + 1}.jpg`)}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(330 85% 55%), hsl(275 65% 50%))" }}
            >
              <Share2 className="w-4 h-4" /> 📤 Compartir
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PremiosSemana;
