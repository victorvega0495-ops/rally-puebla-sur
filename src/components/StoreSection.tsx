import { Store, Eye, ShoppingBag, Megaphone, User, BookOpen, Sparkles, ArrowDown } from "lucide-react";
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
    wa: "Tu catálogo de WhatsApp: tus 20-30 productos favoritos siempre disponibles",
    color: "from-secondary to-accent",
  },
  {
    icon: ShoppingBag,
    name: "Racks con mercancía",
    wa: "Catálogo Interactivo Price Shoes: tu tienda completa con pedido integrado",
    color: "from-accent to-primary",
  },
  {
    icon: Megaphone,
    name: "Cartelones afuera de la tienda",
    wa: "Estados de WhatsApp: tu publicidad que trabaja mientras duermes",
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
    wa: "Tu sistema de administración y control: etiquetas para organizar a tus clientas",
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
  return (
    <section id="tienda-section" className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-3">
          La Tienda de <span className="gradient-text">Lupita</span>
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Imagina tu tienda física de calzado, bolsas y accesorios. Cada parte de esa tienda tiene un equivalente en WhatsApp que ya tienes disponible:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {storeElements.map((el, i) => (
            <div
              key={i}
              className={cn(
                "group relative rounded-2xl bg-card p-6 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 flex flex-col items-center text-center",
                i === 4 && "lg:col-start-1",
              )}
            >
              <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow", el.color)}>
                <el.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="font-display font-semibold text-sm text-foreground mb-3">{el.name}</p>
              <ArrowDown className="w-4 h-4 text-primary mb-3 opacity-60" />
              <p className="text-xs text-primary font-medium leading-relaxed">{el.wa}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
