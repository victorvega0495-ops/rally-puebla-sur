import { useState } from "react";
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WhatsAppChat from "@/components/WhatsAppChat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const openerMessages = {
  cold: [
    "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
    "Hola [Nombre]! Qué gusto — hace rato no hablamos 😊 Oye, estaba acomodando mis piezas nuevas y de volada me acordé de ti. ¿Tienes dos minutos?",
    "Holaaa [Nombre], ¿todo bien por allá? Te escribo porque acabo de recibir algo que no había visto antes y pensé que a ti te iba a encantar. ¿Lo ves?",
  ],
  warm: [
    "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
    "Hola [Nombre] 😊 Oye te tengo que mostrar algo — acabo de recibir piezas nuevas y hay una que es completamente para ti. ¿Te la mando?",
    "Holaaa [Nombre]! Oye adivina qué — acabo de armar algo que creo que te va a fascinar. ¿Me das chance de mandártelo?",
  ],
  hot: [
    "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    "[Nombre]! Esto que te voy a mostrar no lo he publicado todavía en ningún lado. Eres de las primeras porque sé que lo vas a saber aprovechar. ¿Te lo mando?",
    "Oye [Nombre], ¿a poco no? Acabo de armar algo increíble y quedaste en mi mente de volada. ¿Lo ves?",
  ],
};

const tabs = [
  { value: "cold", emoji: "🥶", label: "Fría", sub: "Más de 60 días sin hablar", borderColor: "border-blue-300/50" },
  { value: "warm", emoji: "😊", label: "Tibia", sub: "2-4 semanas sin hablar", borderColor: "border-yellow-300/50" },
  { value: "hot", emoji: "🔥", label: "Caliente", sub: "Habló esta semana", borderColor: "border-red-300/50" },
] as const;

const OpenerSlider = () => {
  const { toast } = useToast();
  const [indices, setIndices] = useState({ cold: 0, warm: 0, hot: 0 });

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Mensaje copiado ✓", duration: 2000 });
    });
  };

  const navigate = (temp: "cold" | "warm" | "hot", dir: -1 | 1) => {
    setIndices((prev) => {
      const next = prev[temp] + dir;
      if (next < 0 || next > 2) return prev;
      return { ...prev, [temp]: next };
    });
  };

  return (
    <section className="rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="font-display font-bold text-sm text-foreground">🚀 ¿Cómo arrancar según tu clienta?</h2>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground">
          Elige según cuánto tiempo llevas sin hablar con ella
        </p>

        <Tabs defaultValue="cold" className="space-y-3">
          <TabsList className="w-full grid grid-cols-3">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs gap-1">
                <span>{t.emoji}</span> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => {
            const msgs = openerMessages[t.value];
            const idx = indices[t.value];
            return (
              <TabsContent key={t.value} value={t.value}>
                <div className={cn("rounded-xl border-2 p-4 space-y-3", t.borderColor)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{t.emoji}</span>
                    <div>
                      <p className="font-display font-bold text-sm text-foreground">Clienta {t.label.toLowerCase()}</p>
                      <p className="text-[10px] text-muted-foreground">{t.sub}</p>
                    </div>
                  </div>

                  {/* Slider area */}
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

                    {/* Arrows */}
                    {idx > 0 && (
                      <button
                        onClick={() => navigate(t.value, -1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-10"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {idx < 2 && (
                      <button
                        onClick={() => navigate(t.value, 1)}
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
                        onClick={() => setIndices((prev) => ({ ...prev, [t.value]: dot }))}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          dot === idx ? "bg-primary scale-125" : "bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>

                  {/* Copy button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => copyText(msgs[idx])}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copiar ✓
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default OpenerSlider;
