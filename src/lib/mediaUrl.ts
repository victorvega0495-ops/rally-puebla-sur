/**
 * Optimización de medios para Supabase Storage.
 * Aprovecha la transformación de imágenes incluida en Supabase Pro.
 */

/**
 * Reescribe una URL de Supabase Storage /object/public/ a /render/image/public/
 * con redimensionamiento + compresión WebP.
 *
 * @param url URL pública del asset
 * @param width Ancho objetivo en px (default 900)
 * @param quality Calidad 1-100 (default 75)
 */
export const optimizeImage = (url: string, width = 900, quality = 75): string => {
  if (!url) return url;
  if (!url.includes("/storage/v1/object/public/")) return url;
  const transformed = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const separator = transformed.includes("?") ? "&" : "?";
  return `${transformed}${separator}width=${width}&quality=${quality}`;
};

/**
 * Agrega #t=0.5 a la URL del video para que iOS/Android Chrome
 * rendericen el frame del segundo 0.5 como portada estática.
 */
export const videoPoster = (url: string): string => {
  if (!url) return url;
  return `${url}#t=0.5`;
};
