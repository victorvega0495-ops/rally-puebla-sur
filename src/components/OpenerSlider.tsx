import { useState } from "react";
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WhatsAppChat from "@/components/WhatsAppChat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const defaultMessages = {
  cold: [
    "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
    "Hola [Nombre]! Qué gusto — hace rato no hablamos 😊 Oye, estoy armando unos outfits preciosos y de volada me acordé de ti. ¿Te los mando?",
    "Holaaa [Nombre], ¿todo bien por allá? Te escribo porque acabo de recibir algo que no había visto antes y pensé que a ti te iba a encantar. ¿Te lo mando?",
  ],
  warm: [
    "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Te lo mando?",
    "Hola [Nombre] 😊 Oye te tengo que mostrar algo — acabo de armar unos outfits nuevos y hay uno que es completamente para ti. ¿Te lo mando?",
    "Holaaa [Nombre]! Oye adivina qué — acabo de armar algo que creo que te va a fascinar. ¿Me das chance de mandártelo?",
  ],
  hot: [
    "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    "[Nombre]! Esto que te voy a mostrar no lo he publicado todavía en ningún lado. Eres de las primeras porque sé que lo vas a saber aprovechar. ¿Te lo mando?",
    "Oye [Nombre], acabo de armar algo increíble y fuiste la primera clienta en la que pensé. ¿Te lo mando?",
  ],
};

const tabs = [
  { value: "cold", emoji: "🥶", label: "+60 días", sub: "Más de 60 días sin hablarle", borderColor: "border-blue-300/50" },
  { value: "warm", emoji: "😊", label: "15-60 días", sub: "Entre 15 y 60 días sin hablarle", borderColor: "border-yellow-300/50" },
  { value: "hot", emoji: "🔥", label: "-15 días", sub: "Menos de 15 días sin hablarle", borderColor: "border-red-300/50" },
] as const;

interface OpenerSliderProps {
  dayMessages?: {
    cold: string | string[];
    warm: string | string[];
    hot: string | string[];
  };
}

const OpenerSlider = ({ dayMessages }: OpenerSliderProps) => {
  const { toast } = useToast();
  const [indices, setIndices] = useState({ cold: 0, warm: 0, hot: 0 });

  const getMessages = (temp: "cold" | "warm" | "hot"): string[] => {
    if (dayMessages) {
      const val = dayMessages[temp];
      if (Array.isArray(val)) return val;
      if (val) return [val];
    }
    return defaultMessages[temp];
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Mensaje copiado ✓", duration: 2000 });
    });
  };

  const navigate = (temp: "cold" | "warm" | "hot", dir: -1 | 1) => {
    const msgs = getMessages(temp);
    setIndices((prev) => {
      const next = prev[temp] + dir;
      if (next < 0 || next >= msgs.length) return prev;
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
          ¿Cuántos días llevas sin hablarle?
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
            const msgs = getMessages(t.value);
            const idx = indices[t.value];
            const isLastMsg = msgs.length === 4 && idx === 3;
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
                        {msgs.map((msg, i) => {
                          const isFollowUp = msgs.length === 4 && i === 3;
                          return (
                            <div key={i} className="w-full shrink-0 px-0.5">
                              {isFollowUp && (
                                <p className="text-[11px] text-muted-foreground/70 font-medium mb-1.5 ml-1">
                                  🔄 Si no respondió ayer
                                </p>
                              )}
                              <div className={cn(isFollowUp && "ring-1 ring-muted-foreground/15 rounded-xl")}>
                                <WhatsAppChat
                                  contactName="[Nombre]"
                                  messages={[{ text: msg, sent: true, time: "10:30 a.m." }]}
                                  compact
                                />
                              </div>
                            </div>
                          );
                        })}
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
                    {idx < msgs.length - 1 && (
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
                    {msgs.map((_, dot) => (
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
