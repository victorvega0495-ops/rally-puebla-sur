import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ClosingSection = () => (
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
      <p className="text-sm text-primary-foreground/80 mb-8 italic">
        Las tiendas de lujo tienen personal shopper. Sus clientas merecen lo mismo — y ahora ustedes pueden dárselo.
      </p>
      <Button variant="hero" size="lg">
        Quiero aprender más <ArrowRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  </section>
);

export default ClosingSection;
