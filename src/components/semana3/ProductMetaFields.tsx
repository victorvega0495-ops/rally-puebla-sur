import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductMetaFieldsProps {
  campaignId: string;
  dayNumber: number;
  assetType: string;
  isAdmin?: boolean;
  /** Render as overlay on media (non-admin) or input fields (admin) */
  mode: "overlay" | "fields";
}

/** Cached meta per campaign+day+assetType */
const metaCache: Record<string, { product_id: string; product_description: string }> = {};

function cacheKey(campaignId: string, dayNumber: number, assetType: string) {
  return `${campaignId}__${dayNumber}__${assetType}`;
}

export function useProductMeta(campaignId: string, dayNumber: number, assetType: string) {
  const key = cacheKey(campaignId, dayNumber, assetType);
  const [productId, setProductId] = useState(metaCache[key]?.product_id ?? "");
  const [productDesc, setProductDesc] = useState(metaCache[key]?.product_description ?? "");
  const [loaded, setLoaded] = useState(!!metaCache[key]);

  useEffect(() => {
    if (metaCache[key]) {
      setProductId(metaCache[key].product_id);
      setProductDesc(metaCache[key].product_description);
      setLoaded(true);
      return;
    }
    supabase
      .from("day_assets")
      .select("product_id, product_description")
      .eq("campaign", campaignId)
      .eq("day_number", dayNumber)
      .eq("asset_type", assetType)
      .maybeSingle()
      .then(({ data }) => {
        const pid = (data as any)?.product_id ?? "";
        const pdesc = (data as any)?.product_description ?? "";
        metaCache[key] = { product_id: pid, product_description: pdesc };
        setProductId(pid);
        setProductDesc(pdesc);
        setLoaded(true);
      });
  }, [campaignId, dayNumber, assetType, key]);

  return { productId, setProductId, productDesc, setProductDesc, loaded };
}

export function useSaveMeta(campaignId: string, dayNumber: number, assetType: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback((field: "product_id" | "product_description", value: string) => {
    const key = cacheKey(campaignId, dayNumber, assetType);
    if (!metaCache[key]) metaCache[key] = { product_id: "", product_description: "" };
    metaCache[key][field] = value;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      // Preservar storage_url y file_name existentes
      const { data: existing } = await supabase.from("day_assets")
        .select("storage_url, file_name")
        .eq("campaign", campaignId)
        .eq("day_number", dayNumber)
        .eq("asset_type", assetType)
        .maybeSingle();

      await supabase.from("day_assets").upsert(
        {
          campaign: campaignId,
          day_number: dayNumber,
          asset_type: assetType,
          storage_url: (existing as any)?.storage_url ?? "",
          file_name: (existing as any)?.file_name ?? "",
          [field]: value,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: "campaign,day_number,asset_type" }
      );
    }, 800);
  }, [campaignId, dayNumber, assetType]);

  return save;
}

/** Admin editable fields */
export const ProductMetaInputs = ({ campaignId, dayNumber, assetType }: { campaignId: string; dayNumber: number; assetType: string }) => {
  const { productId, setProductId, productDesc, setProductDesc } = useProductMeta(campaignId, dayNumber, assetType);
  const save = useSaveMeta(campaignId, dayNumber, assetType);

  return (
    <div className="flex flex-col gap-1.5 w-full mt-2">
      <input
        type="text"
        placeholder="ID del producto"
        value={productId}
        onChange={(e) => { setProductId(e.target.value); save("product_id", e.target.value); }}
        className="w-full text-xs px-2 py-1.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <input
        type="text"
        placeholder="Descripción corta"
        value={productDesc}
        onChange={(e) => { setProductDesc(e.target.value); save("product_description", e.target.value); }}
        className="w-full text-xs px-2 py-1.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
};

/** Non-admin overlay banner */
export const ProductMetaOverlay = ({ campaignId, dayNumber, assetType }: { campaignId: string; dayNumber: number; assetType: string }) => {
  const { productId, productDesc, loaded } = useProductMeta(campaignId, dayNumber, assetType);

  if (!loaded || (!productId && !productDesc)) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-2 pointer-events-none">
      {productId && <p className="text-white font-bold text-xs leading-tight">{productId}</p>}
      {productDesc && <p className="text-white/80 text-[10px] leading-tight">{productDesc}</p>}
    </div>
  );
};
