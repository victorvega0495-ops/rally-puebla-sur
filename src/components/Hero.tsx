import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToContent = () => {
    document.getElementById("tienda-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in-up">
        <h1 className="text-5xl sm:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
          Secretos de Ventas
        </h1>
        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-10 leading-relaxed text-balance">
          Todas saben cómo funciona una tienda física. Hoy van a descubrir que WhatsApp es exactamente
          lo mismo — con una ventaja: está abierta 24 horas y cabe en el bolsillo de tus clientes.
        </p>
        <Button variant="hero" size="lg" onClick={scrollToContent} className="text-lg px-10 py-6">
          Comenzar <ChevronDown className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
