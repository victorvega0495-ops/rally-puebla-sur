import { useState } from "react";
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppChat from "@/components/WhatsAppChat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const promoMessages: Record<number, string[]> = {
  3: [
    "[Nombre], oye te tengo que contar algo — hoy armé una promo especial para mis clientas de confianza. Si te llevas 2 piezas te hago el 15% de descuento. ¿Te late?",
    "Hermosa, hoy es un buen día para renovar el clóset 😊 Tengo una promo de hoy — si te llevas 2 piezas te ahorras el 15%. ¿Cuáles dos te llamaron la atención?",
    "[Nombre], acuérdate que te mostré esas dos piezas — pues resulta que si te llevas las dos juntas hoy te sale con 15% menos. No te lo iba a decir pero me cayó bien 😄 ¿Le damos?",
  ],
  5: [
    "Oye [Nombre], tengo algo que te va a gustar — si al vestido le agregas un accesorio hoy te hago el 10% en todo. El look completo y tú ahorras. ¿Qué accesorio te llamó la atención?",
    "[Nombre], ¿sabes qué hace que un vestido se vea increíble? El accesorio correcto 😊 Y hoy si los llevas juntos te doy 10% de descuento. ¿Te armo el look completo?",
    "Hermosa, hoy solamente — si al vestido le sumas un accesorio te va a salir con 10% menos. No es publicidad, te lo digo porque de verdad el look completo es otro nivel 🔥 ¿Le damos?",
  ],
  7: [
    "[Nombre], hoy es el último día de mi promo de la semana y es la más fuerte — 3 piezas cualquiera con 20% de descuento. Si esta semana te llamó la atención algo, hoy es el momento. ¿Qué tenías en mente?",
    "Hermosa, cierro la semana con todo 🔥 Hoy si te llevas 3 piezas te hago el 20%. Es la promo más grande que tengo y solo es hoy. ¿Le entramos?",
    "[Nombre], te voy a ser honesta — hoy es literalmente el último día de la promo y el descuento es del 20% en 3 piezas. No te escribo para presionarte, te escribo porque de verdad creo que es para ti. ¿Le damos? 😊",
  ],
};

interface PromoSliderProps {
  dayNumber: number;
}

const PromoSlider = ({ dayNumber }: PromoSliderProps) => {
  const { toast } = useToast();
  const [idx, setIdx] = useState(0);
  const msgs = promoMessages[dayNumber];

  if (!msgs) return null;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Mensaje de promo copiado ✓", duration: 2000 });
    });
  };

  const navigate = (dir: -1 | 1) => {
    const next = idx + dir;
    if (next >= 0 && next <= 2) setIdx(next);
  };

  return (
    <div className="space-y-3 pt-2">
      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">💬 Mensajes para enviar la promo</p>

      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {msgs.map((msg, i) => (
              <div key={i} className="w-full shrink-0 px-0.5">
                <WhatsAppChat
                  contactName="[Nombre]"
                  messages={[{ text: msg, sent: true, time: "10:30 a.m." }]}
                  compact
                />
              </div>
            ))}
          </div>
        </div>

        {idx > 0 && (
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {idx < 2 && (
          <button
            onClick={() => navigate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => setIdx(dot)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              dot === idx ? "bg-primary scale-125" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-amber-400/50"
        onClick={() => copyText(msgs[idx])}
      >
        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar mensaje ✓
      </Button>
    </div>
  );
};

export default PromoSlider;
