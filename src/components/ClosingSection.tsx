import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const iaSlides = [
  "/arte-13-ia-1.jpg",
  "/arte-13-ia-2.jpg",
  "/arte-13-ia-3.jpg",
];

const ClosingSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % iaSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-primary-foreground">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">Lo que viene</h2>
        <p className="text-lg mb-6 text-primary-foreground/90">
          Ya saben vender con calidez. Ya tienen su vitrina digital. Ya tienen su base organizada.
        </p>
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-primary-foreground/20">
          <p className="text-base leading-relaxed">
            Ahora imaginen una consultora de imagen que trabaja para ustedes 24 horas — que toma la foto
            de su clienta, conoce los productos Price Shoes, y les dice exactamente qué outfit armar para
            ella. Eso existe hoy. Se llama <strong>IA</strong>. Y en la próxima sesión les enseño
            exactamente cómo usarla.
          </p>
        </div>

        {/* Carrusel de antes y después */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-full max-w-[260px] mx-auto">
            {iaSlides.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Antes y después con asesoría de imagen ${i + 1}`}
                className={cn(
                  "rounded-2xl shadow-lg object-cover w-full max-h-[450px] aspect-[9/16] transition-opacity duration-700 absolute inset-0",
                  i === active ? "opacity-100 relative" : "opacity-0"
                )}
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {iaSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  i === active ? "bg-primary-foreground scale-125" : "bg-primary-foreground/40"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-primary-foreground/70 mt-2 italic">Ejemplos de antes y después con asesoría de imagen</p>
        </div>

        <p className="text-sm text-primary-foreground/80 mb-8 italic">
          Las tiendas de lujo tienen personal shopper. Sus clientas merecen lo mismo — y ahora ustedes pueden dárselo.
        </p>
        <Button variant="hero" size="lg">
          Quiero aprender más <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default ClosingSection;
