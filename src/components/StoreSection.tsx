import { useState } from "react";
import { Store, Eye, ShoppingBag, Tablet, User, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const storeElements = [
  {
    icon: Store,
    name: "Letrero de la tienda",
    wa: "WhatsApp Business: tu nombre, descripción y horario profesional",
    color: "from-primary to-secondary",
  },
  {
    icon: Eye,
    name: "Aparador con zapatos",
    wa: "Estados de WhatsApp: tu vitrina que trabaja mientras duermes",
    color: "from-secondary to-accent",
  },
  {
    icon: ShoppingBag,
    name: "Racks con mercancía",
    wa: "Tu catálogo personal: tus 20-30 productos favoritos",
    color: "from-accent to-primary",
  },
  {
    icon: Tablet,
    name: "Tablet / Catálogo digital",
    wa: "Catálogo Interactivo Price Shoes: tu tienda completa con pedido integrado",
    color: "from-primary to-accent",
  },
  {
    icon: User,
    name: "Lupita atendiendo",
    wa: "Tu mensaje de ventas: la vendedora que nunca descansa",
    color: "from-secondary to-primary",
  },
  {
    icon: BookOpen,
    name: "Libreta en el mostrador",
    wa: "Tus etiquetas: la base de clientas que regresan solas",
    color: "from-accent to-secondary",
  },
  {
    icon: Sparkles,
    name: "Consultora de imagen",
    wa: "IA Personal Shopper: próximamente en la siguiente sesión",
    color: "from-primary to-secondary",
  },
];

const StoreSection = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="tienda-section" className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-3">
          La Tienda de <span className="gradient-text">Lupita</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Haz click en cada elemento para descubrir su equivalente en WhatsApp
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {storeElements.map((el, i) => (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className={cn(
                "relative rounded-2xl p-5 text-left transition-all duration-300 border-2 group",
                active === i
                  ? "bg-card shadow-xl border-primary scale-105"
                  : "bg-card border-transparent hover:border-primary/30 hover:shadow-lg"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", el.color)}>
                <el.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="font-semibold text-sm mb-1">{el.name}</p>
              {active === i && (
                <div className="mt-3 p-3 rounded-lg bg-muted border border-primary/20 animate-fade-in-up">
                  <p className="text-xs font-medium text-primary mb-1">En WhatsApp:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{el.wa}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
