import { useState } from "react";
import WhatsAppChat from "./WhatsAppChat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Rocket, Check } from "lucide-react";

const activeTemplates: Record<string, string[]> = {
  evento: [
    "Oye tú que tienes buen gusto — tienes algo especial próximamente? Boda, bautizo, reunión... Porque acabo de armar algo que está para esas ocasiones. ¿Lo ves?",
    "[Nombre]! Encontré una combinación de colores que no había probado antes y quedó brutal. Y tú con tu estilo y seguridad se va a ver mucho mejor. ¿Te mando foto?",
  ],
  moda: [
    "Holaaa, viste el outfit que usó Kenia Os en su último concierto? Hice una versión accesible y de volada pensé en ti. ¿Te la mando?",
    "Adivina qué, vi un outfit en Pinterest que estaba increíble pero carísimo. Lo recreé completo con lo que tengo y quedó brutal. ¿Lo ves?",
  ],
  diario: [
    "Ey, encontré la combinación perfecta para verse bien cualquier día sin pensarle mucho. Sé que eso te va a servir. ¿Te la mando?",
    "Para ti que siempre andas bien guapa — armé un outfit completo de pies a cabeza hoy y quedó tan bonito que lo fotografié. ¿Te lo mando?",
  ],
  noSe: [
    "A poco no — hay una pieza que toda mujer debería tener y que combina con absolutamente todo. ¿Adivinas cuál es? Te la mando y me dices.",
    "Hola holaaa, esto que te voy a mostrar no lo he publicado todavía en ningún lado. Eres de las primeras porque sé que lo vas a saber aprovechar. ¿Te lo mando?",
  ],
};

const coldOptions = [
  { id: "evento", label: "Tuvo un evento — graduación, boda, bautizo" },
  { id: "cumple", label: "Cumpleaños próximo o reciente" },
  { id: "nuevo", label: "Algo nuevo en su vida" },
  { id: "nada", label: "No recuerdo nada específico" },
];

const SalesAdvisor = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [clientType, setClientType] = useState<"active" | "cold" | null>(null);
  const [activeOption, setActiveOption] = useState("");
  const [coldOption, setColdOption] = useState("");
  const [coldEvent, setColdEvent] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [checks, setChecks] = useState([false, false, false]);

  const toggleCheck = (i: number) => {
    const n = [...checks];
    n[i] = !n[i];
    setChecks(n);
  };

  const allChecked = checks.every(Boolean);

  const reset = () => {
    setStep(0); setName(""); setClientType(null); setActiveOption("");
    setColdOption(""); setColdEvent(""); setEditMsg(""); setChecks([false, false, false]);
  };

  const pickTemplate = (t: string) => {
    setEditMsg(t.replace("[Nombre]", name || "[Nombre]"));
    setStep(4);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-muted/30">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 gradient-text">Mi Asesor de Ventas</h1>
        <p className="text-muted-foreground mb-2">¿Lista para tu primera venta? Vamos paso a paso.</p>
        <p className="text-sm text-muted-foreground mb-8">Esta herramienta te ayuda a construir el mensaje perfecto para cada clienta. Solo responde las preguntas — ella hace el resto.</p>

        {/* STEP 0: Name */}
        {step === 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-fade-in-up">
            <label className="block text-sm font-semibold mb-2">¿Cómo se llama tu clienta?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />
            <Button variant="gradient" onClick={() => name.trim() && setStep(1)} disabled={!name.trim()} className="w-full">
              Siguiente <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 1: Type */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <p className="font-semibold">¿Cuándo fue la última vez que hablaste con {name}?</p>
            <button
              onClick={() => { setClientType("active"); setStep(2); }}
              className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-5 text-left transition-all"
            >
              <p className="font-bold text-sm">Le escribí esta semana o la semana pasada</p>
              <p className="text-xs text-muted-foreground mt-1">→ Clienta activa</p>
            </button>
            <button
              onClick={() => { setClientType("cold"); setStep(2); }}
              className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-5 text-left transition-all"
            >
              <p className="font-bold text-sm">Lleva más de 2 semanas sin saber de mí</p>
              <p className="text-xs text-muted-foreground mt-1">→ Clienta fría</p>
            </button>
            <button onClick={() => setStep(0)} className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Atrás
            </button>
          </div>
        )}

        {/* STEP 2: Options */}
        {step === 2 && clientType === "active" && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-sm text-secondary font-semibold">Perfecto, la puerta ya está abierta. Ahora vamos a despertar el deseo.</p>
            <p className="font-semibold">¿Qué sabes de {name} en este momento?</p>
            {[
              { id: "evento", label: "Tiene un evento próximo" },
              { id: "moda", label: "Le gusta estar a la moda" },
              { id: "diario", label: "Busca verse bien en su día a día" },
              { id: "noSe", label: "No sé mucho de ella ahorita" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => { setActiveOption(o.id); setStep(3); }}
                className="w-full bg-card border-2 border-border hover:border-primary rounded-xl p-4 text-left text-sm font-medium transition-all"
              >
                {o.label}
              </button>
            ))}
            <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Atrás
            </button>
          </div>
        )}

        {step === 2 && clientType === "cold" && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-sm text-secondary font-semibold">Antes de vender, primero reconecta.</p>
            <p className="font-semibold">¿Recuerdas algo importante que haya pasado en la vida de {name}?</p>
            {coldOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => { setColdOption(o.id); setStep(o.id === "nada" ? 3 : 2.5 as any); }}
                className="w-full bg-card border-2 border-border hover:border-primary rounded-xl p-4 text-left text-sm font-medium transition-all"
              >
                {o.label}
              </button>
            ))}
            <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Atrás
            </button>
          </div>
        )}

        {/* STEP 2.5: Cold event input */}
        {step === (2.5 as any) && (
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-fade-in-up">
            <label className="block text-sm font-semibold mb-2">¿Qué momento vas a usar para reconectar con {name}?</label>
            <input
              value={coldEvent}
              onChange={(e) => setColdEvent(e.target.value)}
              placeholder="Ej: la graduación de su hijo"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            />
            <Button variant="gradient" onClick={() => coldEvent.trim() && setStep(3)} disabled={!coldEvent.trim()} className="w-full">
              Ver mi mensaje <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* STEP 3: Templates */}
        {step === 3 && clientType === "active" && (
          <div className="space-y-4 animate-fade-in-up">
            <p className="font-semibold">Elige el mensaje que más te guste para {name}:</p>
            {(activeTemplates[activeOption] || []).map((t, i) => (
              <button key={i} onClick={() => pickTemplate(t)} className="w-full text-left">
                <WhatsAppChat contactName={name} messages={[{ text: t.replace("[Nombre]", name), sent: true, time: "Ahora" }]} />
              </button>
            ))}
            <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Atrás
            </button>
          </div>
        )}

        {step === 3 && clientType === "cold" && (
          <div className="space-y-4 animate-fade-in-up">
            {coldOption === "nada" ? (
              <div className="bg-muted rounded-xl p-4 border border-border">
                <p className="text-sm font-semibold text-primary mb-2">💡 Tip</p>
                <p className="text-sm text-muted-foreground">Abre su WhatsApp y revisa su último estado. Eso te dice todo.</p>
              </div>
            ) : null}
            <p className="font-semibold">Tu mensaje de reconexión para {name}:</p>
            <button onClick={() => pickTemplate(`Hola ${name}, cómo estás? Oye cómo te fue con ${coldEvent || "eso que me contaste"}? Me acordé de ti y quería saber cómo te fue 🥹`)} className="w-full text-left">
              <WhatsAppChat
                contactName={name}
                messages={[{ text: `Hola ${name}, cómo estás? Oye cómo te fue con ${coldEvent || "eso que me contaste"}? Me acordé de ti y quería saber cómo te fue 🥹`, sent: true, time: "Ahora" }]}
              />
            </button>
            <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Atrás
            </button>
          </div>
        )}

        {/* STEP 4: Edit + Checklist */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <label className="block text-sm font-semibold mb-2">Tu mensaje (edítalo a tu estilo):</label>
              <textarea
                value={editMsg}
                onChange={(e) => setEditMsg(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="font-bold text-sm mb-4">Las 3 preguntas antes de mandar:</h3>
              {[
                "¿Suena a amiga o suena a vendedora?",
                "¿Le estoy preguntando por ella o solo estoy pensando en vender?",
                "¿La pregunta final solo se puede responder con sí?",
              ].map((q, i) => (
                <label key={i} className="flex items-start gap-3 mb-3 cursor-pointer">
                  <button
                    onClick={() => toggleCheck(i)}
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all",
                      checks[i] ? "gradient-bg border-transparent" : "border-border"
                    )}
                  >
                    {checks[i] && <Check className="w-4 h-4 text-primary-foreground" />}
                  </button>
                  <span className="text-sm">{q}</span>
                </label>
              ))}
            </div>

            {allChecked && (
              <Button variant="gradient" className="w-full text-lg py-6 animate-fade-in-up" onClick={() => setStep(5)}>
                ¡Está listo! Mándalo 🚀
              </Button>
            )}
          </div>
        )}

        {/* STEP 5: Done */}
        {step === 5 && (
          <div className="text-center animate-fade-in-up">
            <div className="gradient-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">¡Increíble! 🎉</h2>
            <p className="text-muted-foreground mb-2">La primera vez da nervios. Pero el músculo de vender con calidez se entrena —</p>
            <p className="font-bold text-primary mb-8">y acabas de hacer tu primera repetición.</p>
            <Button variant="gradient" onClick={reset}>
              Crear otro mensaje <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAdvisor;
