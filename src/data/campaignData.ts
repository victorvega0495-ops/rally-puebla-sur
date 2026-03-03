export interface FollowUp {
  label: string;
  timing: string;
  message: string;
}

export interface CollabCopy {
  number: number;
  text: string;
}

export interface DayData {
  day: number;
  emoji: string;
  type: "activacion" | "prospeccion" | "seguimiento" | "cierre";
  typeLabel: string;
  focus: string;
  lookName: string;
  lookPrice: string;
  brand: string;
  statusCopyImage: string;
  statusCopyVideo: string;
  reelStructure: string[];
  messageTemplate: string;
  promo?: string;
  collabCopies?: CollabCopy[];
  followUps: FollowUp[];
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
  days: DayData[];
}

const semana1Days: DayData[] = [
  {
    day: 1,
    emoji: "🔥",
    type: "activacion",
    typeLabel: "Activación",
    focus: "Clientas Activas",
    lookName: "Vestido Midi/Largo",
    lookPrice: "$499",
    brand: "Holly Land",
    statusCopyImage: "Oye, ¿ya viste lo nuevo que llegó? 👀",
    statusCopyVideo: "Oye, ¿ya viste lo nuevo que llegó? 👀",
    reelStructure: [
      "0-3 seg: look completo de frente",
      "3-6 seg: detalle tela",
      "6-9 seg: $499 en pantalla",
      "9-12 seg: \"Te lo mando\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "Holaaa, no me vas a creer — acabo de recibir un vestido que de volada pensé en ti. ¿Te mando foto?",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "Holaaa, no me vas a creer — acabo de recibir un vestido que de volada pensé en ti. ¿Te mando foto?" },
      { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
      { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas del vestido que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
    ],
  },
  {
    day: 2,
    emoji: "🔥",
    type: "activacion",
    typeLabel: "Activación",
    focus: "Clientas Activas",
    lookName: "Pantalón Tiro Alto + Saco Con Solapa",
    lookPrice: "$529 + $699",
    brand: "Holly Land",
    statusCopyImage: "¿Cuál se llevan? 👀",
    statusCopyVideo: "¿Cuál se llevan? 👀",
    reelStructure: [
      "0-3 seg: look de oficina completo",
      "3-6 seg: detalle saco",
      "6-9 seg: combo precio en pantalla",
      "9-12 seg: \"Escríbeme\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "Oye tú que siempre andas bien guapa — armé un look de oficina que quedó brutal. ¿Lo ves?",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "Oye tú que siempre andas bien guapa — armé un look de oficina que quedó brutal. ¿Lo ves?" },
      { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
      { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas del look de oficina que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
    ],
  },
  {
    day: 3,
    emoji: "🔥",
    type: "activacion",
    typeLabel: "Activación + Promo",
    focus: "Primera Promo",
    lookName: "Blusa Dama + Pantalón Cintura Regular",
    lookPrice: "$419 + $499",
    brand: "Holly Land",
    statusCopyImage: "Llévate las 2 piezas y ahorra 15% 🎁",
    statusCopyVideo: "Llévate las 2 piezas y ahorra 15% 🎁",
    reelStructure: [
      "0-3 seg: look casual completo",
      "3-6 seg: detalle blusa",
      "6-9 seg: promo en pantalla",
      "9-12 seg: \"Últimas piezas\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "[Nombre], me queda muy poco de esta combinación y tengo una promo armada para ti. ¿Te la cuento?",
    promo: "Llévate 2 piezas y ahorra 15%",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "[Nombre], me queda muy poco de esta combinación y tengo una promo armada para ti. ¿Te la cuento?" },
      { label: "Toque 2", timing: "3 días", message: "Oye [Nombre], no quiero ser molesta pero esta promo ya casi se va. ¿Le damos?" },
      { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas de la promo que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
    ],
  },
  {
    day: 4,
    emoji: "👥",
    type: "prospeccion",
    typeLabel: "Prospección",
    focus: "Nuevas Clientas",
    lookName: "Chaleco Efecto Piel + Falda Short",
    lookPrice: "$559 + $449",
    brand: "Holly Land",
    statusCopyImage: "Tú armas el look, yo consigo las piezas 😊 Vamos...",
    statusCopyVideo: "Tú armas el look, yo consigo las piezas 😊 Vamos...",
    reelStructure: [
      "0-3 seg: look final del outfit colaborativo",
      "3-6 seg: detalle piezas",
      "6-9 seg: precio en pantalla",
      "9-12 seg: \"Escríbeme\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "Tú armas el look, yo consigo las piezas 😊 Mira mi Estado de hoy y dime qué combinarías",
    collabCopies: [
      { number: 1, text: "Tú armas el look, yo consigo las piezas 😊 Vamos..." },
      { number: 2, text: "¿Con qué las combinarías? 👀" },
      { number: 3, text: "¿Opción A o B?" },
      { number: 4, text: "¿Cuál le va mejor?" },
      { number: 5, text: "¿Con cuál la rematas?" },
      { number: 6, text: "Así quedó el look que armaron 🔥" },
    ],
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "Tú armas el look, yo consigo las piezas 😊 Mira mi Estado de hoy y dime qué combinarías" },
      { label: "Toque 2", timing: "Día siguiente", message: "Holaaa, ¿viste el juego de looks que puse en mi Estado? Quedó brutal el resultado 🔥 ¿Te cuento?" },
      { label: "Toque 3", timing: "1 semana", message: "Oye, te mando cómo quedó el look final que armamos — ¿te late algo? 😍" },
    ],
  },
  {
    day: 5,
    emoji: "👥",
    type: "prospeccion",
    typeLabel: "Prospección",
    focus: "Nuevas Clientas",
    lookName: "Vestido Corto",
    lookPrice: "$589",
    brand: "Holly Land",
    statusCopyImage: "Kenia Os vs tú con $589 👀",
    statusCopyVideo: "Kenia Os vs tú con $589 👀",
    reelStructure: [
      "0-3 seg: foto celebridad",
      "3-6 seg: look Holly Land",
      "6-9 seg: $589 en pantalla",
      "9-12 seg: \"Escríbeme\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "Holaaa, viste el look que traía Kenia Os? Hice una versión accesible con lo que tengo. ¿Te la mando?",
    promo: "Vestido + accesorio = 10% descuento",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "Holaaa, viste el look que traía Kenia Os? Hice una versión accesible con lo que tengo. ¿Te la mando?" },
      { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
      { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas del vestido que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
    ],
  },
  {
    day: 6,
    emoji: "🔄",
    type: "seguimiento",
    typeLabel: "Seguimiento",
    focus: "Seguimiento",
    lookName: "Chaleco Dama + Pantalón Pierna Ancha",
    lookPrice: "$629 + $539",
    brand: "Holly Land",
    statusCopyImage: "Así lució hoy 😍",
    statusCopyVideo: "Así lució hoy 😍",
    reelStructure: [
      "0-3 seg: testimonial clienta",
      "3-6 seg: detalle look",
      "6-9 seg: \"Tú puedes ser la siguiente\"",
      "9-12 seg: precio en pantalla",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "[Nombre], te acuerdas del chaleco que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos a encontrar tu estilo ideal.",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "[Nombre], te acuerdas del chaleco que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos a encontrar tu estilo ideal." },
      { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
      { label: "Toque 3", timing: "1 semana", message: "Hermosa, voy a cerrar este tema porque no quiero molestarte 😊 Si en algún momento te late algo me avisas — aquí voy a estar." },
    ],
  },
  {
    day: 7,
    emoji: "🏆",
    type: "cierre",
    typeLabel: "Cierre",
    focus: "Cierre de Semana",
    lookName: "Saco Largo Str + Vestido Corto",
    lookPrice: "$609 + $799",
    brand: "Holly Land",
    statusCopyImage: "Últimas piezas de la semana 🔥",
    statusCopyVideo: "Últimas piezas de la semana 🔥",
    reelStructure: [
      "0-3 seg: look power completo",
      "3-6 seg: todas las piezas de la semana",
      "6-9 seg: promo final en pantalla",
      "9-12 seg: \"Hoy es el último día\"",
      "12-15 seg: cierre con nombre de socia",
    ],
    messageTemplate:
      "Hermosa, hoy es el último día de mi promo de la semana. Si te late algo de lo que te mostré, hoy es el momento. ¿Le damos?",
    promo: "3 piezas cualquiera = 20% descuento — ¡hoy es el último día!",
    followUps: [
      { label: "Toque 1", timing: "Hoy", message: "Hermosa, hoy es el último día de mi promo de la semana. Si te late algo de lo que te mostré, hoy es el momento. ¿Le damos?" },
      { label: "Toque 2", timing: "Mismo día", message: "Oye [Nombre], literalmente hoy es el último día de la promo. ¿Le damos? 🔥" },
      { label: "Toque 3", timing: "Cierre", message: "Hermosa, cerramos la semana. Cuando gustes me dices y armamos algo bonito para ti 😊" },
    ],
  },
];

export const campaigns: Campaign[] = [
  {
    id: "semana-1-vestir",
    title: "Semana 1 — Vestir",
    subtitle: "Holly Land Pri-Ver 2026",
    active: true,
    days: semana1Days,
  },
  {
    id: "semana-2",
    title: "Semana 2",
    subtitle: "Próximamente",
    active: false,
    days: [],
  },
];

export const motivationalMessages: string[] = [
  "¡Arrancaste con todo! 🔥 El primer paso es el más importante.",
  "¡Día 2 listo! 💪 Ya llevas el ritmo, sigue así.",
  "¡Mitad de semana superada! 🎯 Tu constancia es tu superpoder.",
  "¡Día 4 completado! 👥 Estás construyendo relaciones reales.",
  "¡Ya casi llegas! 🚀 Solo faltan 2 días más.",
  "¡Penúltimo día! 🔄 Tu seguimiento marca la diferencia.",
  "🏆 ¡SEMANA COMPLETADA! Eres una máquina de ventas. ¡A por la siguiente!",
];
