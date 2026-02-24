import { useState } from "react";
import { ChevronDown } from "lucide-react";
import WhatsAppChat, { type WAMessage } from "./WhatsAppChat";
import TipCard from "./TipCard";
import { cn } from "@/lib/utils";

interface ModuleProps {
  number: number;
  title: string;
  concept: string;
  error?: string;
  tip: string;
  children: React.ReactNode;
}

const Module = ({ number, title, concept, error, tip, children }: ModuleProps) => (
  <section className="py-16 border-b border-border last:border-0">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-start gap-4 mb-6">
        <span className="gradient-bg text-primary-foreground w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 font-display">
          {number}
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold leading-tight">{title}</h2>
      </div>
      <blockquote className="text-lg border-l-4 border-primary pl-4 italic mb-8 text-muted-foreground">
        "{concept}"
      </blockquote>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-8">
          <p className="font-semibold text-destructive text-sm mb-1">❌ Error común:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="space-y-6">{children}</div>
      <div className="mt-8">
        <TipCard>{tip}</TipCard>
      </div>
    </div>
  </section>
);

/* MODULE 1 */
const Module1 = () => (
  <Module
    number={1}
    title="Tu tienda ya existe, solo falta abrirla"
    concept="Tienes algo que ninguna tienda física puede comprar: la confianza de tus contactos."
    tip="Tu perfil es lo primero que ve tu clienta antes de responderte. Si está vacío, es como llegar a una tienda con las luces apagadas."
  >
    <h3 className="font-semibold text-lg mb-3">🛠 Herramienta: WhatsApp Business</h3>

    <p className="text-sm text-muted-foreground mb-2">Configura tu perfil profesional:</p>
    <ul className="list-disc list-inside text-sm space-y-1 mb-6 text-foreground">
      <li>Nombre del negocio</li>
      <li>Descripción del perfil</li>
      <li>Horario de atención</li>
      <li>Mensaje de bienvenida automático</li>
      <li>Mensaje de ausencia automático</li>
    </ul>

    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Descripción del perfil:</p>
        <WhatsAppChat
          contactName="Tu Perfil"
          messages={[
            { text: "Hola, soy Lupita 👋 Te ayudo a verte increíble con calzado, bolsas y accesorios Price Shoes. Escríbeme y con gusto te asesoro.", sent: true, time: "Bio" },
          ]}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Mensaje de bienvenida:</p>
        <WhatsAppChat
          contactName="Clienta Nueva"
          messages={[
            { text: "Hola hermosa, qué gusto que me escribas 😊 Ahorita te atiendo con todo el gusto. Mientras dime, ¿qué estás buscando?", sent: true, time: "10:30 AM" },
          ]}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Mensaje de ausencia:</p>
        <WhatsAppChat
          contactName="Clienta"
          messages={[
            { text: "Hola! Ahorita no estoy disponible pero en cuanto pueda te respondo 🙌 Déjame tu pregunta y con gusto te ayudo.", sent: true, time: "11:45 PM" },
          ]}
        />
      </div>
    </div>
  </Module>
);

/* MODULE 2 */
const Module2 = () => {
  const [path, setPath] = useState<"positive" | "negative">("positive");

  return (
    <Module
      number={2}
      title="La relación primero, la venta después"
      concept="La mejor vendedora no es la que más productos conoce. Es la que sus clientas sienten que las conoce a ellas."
      error="Escribirle a alguien solo cuando quieres venderle. Eso se nota. Y duele."
      tip="Anota los eventos importantes de tus clientas. Esos momentos son tu puerta de entrada más poderosa."
    >
      <h3 className="font-semibold text-lg mb-3">💡 Técnica: Memoria + Filtro + Gancho</h3>
      <WhatsAppChat
        contactName="María"
        messages={[
          { text: "Hola Hermosa, cómo estás? Oye cómo te fue en la graduación de Rubén? Mi sobrino se gradúa la otra semana y me acordé que tenías el evento 🥹", sent: true, time: "9:15 AM" },
        ]}
        className="mb-4"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setPath("positive")}
          className={cn("flex-1 py-2 rounded-lg text-sm font-semibold transition-all", path === "positive" ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground")}
        >
          ✅ Respuesta positiva
        </button>
        <button
          onClick={() => setPath("negative")}
          className={cn("flex-1 py-2 rounded-lg text-sm font-semibold transition-all", path === "negative" ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground")}
        >
          😕 Respuesta negativa
        </button>
      </div>

      <WhatsAppChat
        contactName="María"
        messages={
          path === "positive"
            ? [{ text: "Oye y, no me vas a creer — ayer le hice un cambio de imagen a una clienta y de volada pensé en ti. ¿Te mando el antes y después?", sent: true, time: "9:20 AM" }]
            : [{ text: "Qué mala onda hermosa, el jueves voy a andar por tu zona, ¿nos tomamos un café?", sent: true, time: "9:20 AM" }]
        }
      />
    </Module>
  );
};

/* MODULE 3 */
const templates3 = [
  "Holaaa, viste el outfit que usó Kenia Os en su último concierto? Hice una versión accesible y de volada pensé en ti. ¿Te la mando?",
  "No me vas a creer, ayer le hice un cambio de imagen a una clienta y quedó que no te cuento. Me acordé de ti hermosa. ¿Te mando el antes y después?",
  "Adivina qué, vi un outfit en Pinterest que estaba increíble pero carísimo. Lo recreé completo con lo que tengo y quedó brutal. ¿Lo ves?",
  "Ey, encontré la combinación perfecta para verse bien cualquier día sin pensarle mucho. Sé que eso te va a servir. ¿Te la mando?",
  "Oye tú que tienes buen gusto — tienes algo especial próximamente? Boda, bautizo, reunión... Porque acabo de armar algo que está para esas ocasiones. ¿Lo ves?",
  "A poco no — hay una pieza que toda mujer debería tener y que combina con absolutamente todo. ¿Adivinas cuál es? Te la mando y me dices.",
  "Para ti que siempre andas bien guapa — armé un outfit completo de pies a cabeza hoy y quedó tan bonito que lo fotografié. ¿Te lo mando?",
  "Te tengo que contar algo, una amiga me preguntó cómo verse bien sin gastar mucho y le armé algo increíble. Me acordé de ti de volada. ¿Te mando lo que le sugerí?",
  "[Nombre]! Encontré una combinación de colores que no había probado antes y quedó brutal. Y tú con tu estilo y seguridad se va a ver mucho mejor. ¿Te mando foto?",
  "Hola holaaa, esto que te voy a mostrar no lo he publicado todavía en ningún lado. Eres de las primeras porque sé que lo vas a saber aprovechar. ¿Te lo mando?",
];

const Module3 = () => (
  <Module
    number={3}
    title="Clientas activas: el mensaje que despierta el deseo"
    concept="Un mensaje tiene 3 trabajos: despertar curiosidad, conectar con ella, y una sola pregunta que solo se responde con sí."
    error="Mandar la foto, el precio y las medidas. La clienta no vio el producto — vio un catálogo. Y los catálogos no generan deseo, solo informan."
    tip='Antes de mandar el mensaje pregúntate: ¿Suena a vendedora o suena a amiga que encontró algo perfecto para mí?'
  >
    <h3 className="font-semibold text-lg mb-3">📝 10 Templates que despiertan el deseo</h3>
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
      {templates3.map((t, i) => (
        <div key={i} className="min-w-[280px] snap-start">
          <WhatsAppChat
            contactName={`Clienta ${i + 1}`}
            messages={[{ text: t, sent: true, time: "10:00 AM" }]}
            compact
          />
        </div>
      ))}
    </div>
  </Module>
);

/* MODULE 4 */
const Module4 = () => (
  <Module
    number={4}
    title="El seguimiento: la vendedora que no deja ir al cliente"
    concept="El 80% de las ventas se pierden porque nadie hizo seguimiento. El silencio no es un no — casi siempre es un 'me distraje.'"
    error="Pensar que si no respondió es porque no le interesa. El seguimiento no es perseguir."
    tip="Anota en tus etiquetas de WhatsApp Business en qué momento del seguimiento está cada clienta."
  >
    <h3 className="font-semibold text-lg mb-1">🏆 Regla de oro</h3>
    <p className="text-muted-foreground mb-6 text-sm">El seguimiento no es perseguir. Es recordarle a alguien que existe algo que le puede hacer la vida mejor.</p>

    <div className="space-y-4">
      {[
        { label: "Día siguiente", badge: "Momento 1", msg: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
        { label: "3 días después", badge: "Momento 2", msg: "Oye [Nombre], no quiero ser molesta pero esto que te mostré ya casi se acaba, me queda 1 de tu talla y de verdad creo que es para ti. ¿Le damos?" },
        { label: "1 semana después", badge: "Momento 3 ⭐", msg: "Oye [Nombre], te acuerdas de los botines que te enseñé? Mira cómo los lució una clienta 😍 Cuando gustes nos ponemos a encontrar tu estilo ideal." },
      ].map((m, i) => (
        <div key={i}>
          <div className="flex items-center gap-2 mb-2">
            <span className="gradient-bg text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">{m.badge}</span>
            <span className="text-xs text-muted-foreground">{m.label}</span>
          </div>
          <WhatsAppChat contactName="[Nombre]" messages={[{ text: m.msg, sent: true, time: "10:00 AM" }]} />
        </div>
      ))}
    </div>
    <p className="mt-4 text-sm text-secondary font-semibold">💎 El Momento 3 es el más poderoso — reabre la conversación con evidencia real y sin presión.</p>
  </Module>
);

/* MODULE 5 */
const outfitSteps = [
  { num: 1, text: "Tú armas el look, yo consigo las piezas 😊 Vamos...", label: "Intro — el gancho" },
  { num: 2, text: "Botas Price Shoes + \"¿Con qué las combinarías? 👀\"", label: "Pieza base" },
  { num: 3, text: "Dos opciones de jeans + \"¿Opción A o B?\"", label: "Segunda pieza" },
  { num: 4, text: "Dos blusas + \"¿Cuál le va mejor?\"", label: "Tercera pieza" },
  { num: 5, text: "Dos bolsas + \"¿Con cuál la rematas?\"", label: "Accesorio" },
  { num: 6, text: "Outfit completo + \"Así quedó el look que armaron 🔥\"", label: "El reveal final" },
];

const Module5 = () => {
  const [outfitOpen, setOutfitOpen] = useState(false);

  return (
    <Module
      number={5}
      title="Tu Vitrina Digital: la tienda que nunca cierra"
      concept="Tienes una tienda abierta 24 horas que la mayoría ni sabe que tiene."
      tip="Pon mínimo 1 Estado al día. La venta es más fácil cuando no eres una extraña."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { title: "WhatsApp Business", desc: "El letrero en la puerta", icon: "🏪" },
          { title: "Tu Catálogo Personal", desc: "Los racks con tus favoritos", icon: "👗" },
          { title: "Catálogo Interactivo Price Shoes", desc: "La tienda completa con caja incluida", icon: "🛒" },
          { title: "Estados de WhatsApp", desc: "El cartelón de ofertas que trabaja mientras duermes", icon: "📱" },
        ].map((tool, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
            <span className="text-3xl mb-3 block">{tool.icon}</span>
            <h4 className="font-bold text-sm mb-1">{tool.title}</h4>
            <p className="text-xs text-muted-foreground">{tool.desc}</p>
          </div>
        ))}
      </div>

      <h4 className="font-semibold mb-3">Chat template — Catálogo Personal:</h4>
      <WhatsAppChat
        contactName="Clienta"
        messages={[{ text: "Hermosa aquí te mando mis favoritos de la temporada 😊 Si ves algo que te late me dices — [link catálogo]", sent: true, time: "11:00 AM" }]}
        className="mb-4"
      />
      <h4 className="font-semibold mb-3">Chat template — Catálogo Interactivo:</h4>
      <WhatsAppChat
        contactName="Clienta VIP"
        messages={[{ text: "Oye hermosa, ya que eres de mis clientas de confianza 😊 te mando el catálogo completo de Price Shoes — ahí puedes ver todo a tu ritmo y si encuentras algo me avisas para levantamos el pedido juntas — [link catálogo]", sent: true, time: "11:15 AM" }]}
        className="mb-6"
      />

      <h4 className="font-semibold mb-3">📱 4 tipos de Estados:</h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { title: "Prueba social", desc: "Foto de clienta feliz con su compra" },
          { title: "Outfit completo", desc: "Combinación de pies a cabeza" },
          { title: "Gancho de curiosidad", desc: '"¿Adivinen qué llegó?" sin mostrar todo' },
          { title: "El reveal", desc: "Mostrar producto estrella del día" },
        ].map((s, i) => (
          <div key={i} className="bg-muted rounded-lg p-3 border border-border">
            <p className="font-bold text-xs mb-1">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Outfit Colaborativo expandible */}
      <div className="border border-primary/30 rounded-xl overflow-hidden">
        <button
          onClick={() => setOutfitOpen(!outfitOpen)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 hover:from-primary/15 hover:via-accent/15 hover:to-secondary/15 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👗</span>
            <div className="text-left">
              <p className="font-display font-bold text-sm">Outfit Colaborativo — Secuencia de 6 Estados</p>
              <p className="text-xs text-muted-foreground">Tu clienta arma el look contigo, paso a paso</p>
            </div>
          </div>
          <ChevronDown className={cn("w-5 h-5 text-primary transition-transform duration-300", outfitOpen && "rotate-180")} />
        </button>

        {outfitOpen && (
          <div className="px-5 py-6 space-y-0">
            {outfitSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {step.num}
                  </div>
                  {i < outfitSteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-secondary/40 my-1" />
                  )}
                </div>
                {/* Card */}
                <div className={cn("flex-1 rounded-xl border border-border p-4 mb-3", i === outfitSteps.length - 1 ? "bg-primary/10 border-primary/30" : "bg-card")}>
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">{step.label}</p>
                  <p className="text-sm text-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Module>
  );
};

/* MODULE 6 */
const labels = [
  { emoji: "🟣", name: "Clienta nueva", desc: "Acaba de comprarte. Trátala con atención extra.", color: "bg-secondary/20 text-secondary" },
  { emoji: "🟢", name: "Clienta activa", desc: "Tu base más valiosa. Las primeras en enterarse de todo.", color: "bg-green-100 text-green-700" },
  { emoji: "🟡", name: "Clienta tibia", desc: "Mostró interés pero no ha comprado. Está en seguimiento.", color: "bg-yellow-100 text-yellow-700" },
  { emoji: "🔵", name: "Clienta dormida", desc: "Más de 60 días sin comprar. Necesita reconexión.", color: "bg-accent/20 text-accent" },
  { emoji: "🔴", name: "Clienta VIP", desc: "Compra seguido y manda referidos. Atención preferencial.", color: "bg-primary/20 text-primary" },
  { emoji: "⚪", name: "Referida", desc: "Alguien te la recomendó. Necesita más calidez antes del gancho.", color: "bg-muted text-muted-foreground" },
];

const Module6 = () => (
  <Module
    number={6}
    title="Tu base de clientes: las que regresan solas"
    concept="Conseguir una clienta nueva cuesta 5 veces más que retener una que ya te compró."
    tip="15 minutos a la semana revisando tus etiquetas valen más que cualquier anuncio."
  >
    <h3 className="font-semibold text-lg mb-3">🏷 Etiquetas de WhatsApp Business</h3>
    <div className="grid sm:grid-cols-2 gap-3 mb-6">
      {labels.map((l, i) => (
        <div key={i} className={cn("rounded-xl p-4 border border-border", l.color)}>
          <p className="font-bold text-sm mb-1">{l.emoji} {l.name}</p>
          <p className="text-xs opacity-80">{l.desc}</p>
        </div>
      ))}
    </div>

    <h4 className="font-semibold mb-3">🔗 Conexión con los módulos:</h4>
    <div className="flex flex-col sm:flex-row gap-3">
      {[
        { label: "Dormida", arrow: "→", module: "Módulo 2 (Reconexión)", color: "bg-accent/20" },
        { label: "Tibia", arrow: "→", module: "Módulo 4 (Seguimiento)", color: "bg-yellow-100" },
        { label: "Activa", arrow: "→", module: "Módulo 3 (Deseo)", color: "bg-green-100" },
      ].map((c, i) => (
        <div key={i} className={cn("flex items-center gap-2 rounded-lg p-3 flex-1", c.color)}>
          <span className="font-bold text-sm">{c.label}</span>
          <span>{c.arrow}</span>
          <span className="text-xs text-muted-foreground">{c.module}</span>
        </div>
      ))}
    </div>
  </Module>
);

const ModulesSection = () => (
  <div>
    <Module1 />
    <Module2 />
    <Module3 />
    <Module4 />
    <Module5 />
    <Module6 />
  </div>
);

export default ModulesSection;
