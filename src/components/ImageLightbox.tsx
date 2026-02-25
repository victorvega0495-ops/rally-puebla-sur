import { useEffect, useCallback } from "react";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

const ImageLightbox = ({ src, alt, onClose }: ImageLightboxProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!src) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [src, handleKeyDown]);

  if (!src) return null;

  const filename = src.split("/").pop() || "image.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <img
        src={src}
        alt={alt || ""}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />

      <a
        href={src}
        download={filename}
        onClick={(e) => e.stopPropagation()}
        className="mt-4 flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors backdrop-blur-sm"
      >
        <Download className="w-4 h-4" /> Descargar
      </a>
    </div>
  );
};

export default ImageLightbox;

/** Clickable image helper */
export const ClickableImage = ({
  src, alt, className, onClick, ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { onClick: () => void }) => (
  <img
    src={src}
    alt={alt}
    className={cn("cursor-pointer hover:brightness-95 transition-all", className)}
    onClick={onClick}
    {...props}
  />
);
