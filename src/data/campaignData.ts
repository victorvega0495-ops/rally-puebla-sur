export interface FollowUp {
  label: string;
  timing: string;
  message: string;
}

export interface CollabCopy {
  number: number;
  text: string;
}

export interface Objection {
  objection: string;
  response: string;
}

export interface DayData {
  day: number;
  emoji: string;
  type: "activacion" | "prospeccion" | "seguimiento" | "cierre";
  typeLabel: string;
  focus: string;
  mission: string;
  steps: string[];
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
  objections: Objection[];
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
    mission: "Hoy vas a despertar el deseo en tus clientas que ya te conocen. Son las más fáciles de convertir porque ya confían en ti. Tu trabajo es aparecer con algo que no esperaban y hacerlas querer verlo.",
    steps: [
      "Sube el Estado de WhatsApp con la imagen del Vestido Midi/Largo antes de las 10am",
      "Haz una lista de 5 clientas activas — las que te compraron en los últimos 60 días",
      "Mándale a cada una el mensaje del día personalizando su nombre",
      "Responde a quien te conteste dentro de las siguientes 2 horas — la velocidad de respuesta cierra ventas",
      "Al final del día anota cuántas respondieron",
    ],
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
    objections: [
      { objection: "Está muy caro", response: "Te entiendo hermosa 😊 Por eso me gusta mostrarte opciones completas — a veces una sola pieza versátil que combines con lo que ya tienes sale más barato que comprar tres cosas baratas que no combinan con nada. ¿Te mando cómo lo combinarías con lo que ya tienes?" },
      { objection: "Ahorita no puedo", response: "No hay problema hermosa, no te quiero presionar 😊 Solo te lo enseño para que lo tengas presente — si en algún momento te late me avisas y vemos cómo le hacemos. ¿Te lo guardo?" },
      { objection: "Ya tengo algo parecido", response: "Jaja seguro sí, pero apuesto que no lo tienes en este color/corte 😄 La diferencia está en los detalles hermosa. ¿Me mandas foto de lo que tienes y te digo si realmente se parecen?" },
    ],
  },
  {
    day: 2,
    emoji: "🔥",
    type: "activacion",
    typeLabel: "Activación",
    focus: "Clientas Activas",
    mission: "Segundo día de activación. Las clientas que no respondieron ayer necesitan un segundo estímulo diferente. Hoy atacas con un look distinto y un gancho nuevo — no repitas el mismo mensaje.",
    steps: [
      "Sube el Estado con el look de oficina antes de las 10am",
      "Revisa quién no respondió ayer — esas son tus primeras clientas de hoy",
      "Manda el mensaje del día a las que no respondieron ayer más 3 clientas nuevas",
      "Si alguien pregunta precio, no lo des de inmediato — primero manda la foto del look completo",
      "Anota quién mostró interés aunque no haya comprado — las necesitas para el Día 3",
    ],
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
    objections: [
      { objection: "Está muy caro", response: "Te entiendo hermosa 😊 Por eso me gusta mostrarte opciones completas — a veces una sola pieza versátil que combines con lo que ya tienes sale más barato que comprar tres cosas baratas que no combinan con nada. ¿Te mando cómo lo combinarías con lo que ya tienes?" },
      { objection: "Ahorita no puedo", response: "No hay problema hermosa, no te quiero presionar 😊 Solo te lo enseño para que lo tengas presente — si en algún momento te late me avisas y vemos cómo le hacemos. ¿Te lo guardo?" },
      { objection: "Ya tengo algo parecido", response: "Jaja seguro sí, pero apuesto que no lo tienes en este color/corte 😄 La diferencia está en los detalles hermosa. ¿Me mandas foto de lo que tienes y te digo si realmente se parecen?" },
    ],
  },
  {
    day: 3,
    emoji: "🔥",
    type: "activacion",
    typeLabel: "Activación + Promo",
    focus: "Primera Promo",
    mission: "Hoy cierras las que mostraron interés estos dos días. La promo es tu herramienta — no la menciones al principio, úsala cuando sientas que la clienta quiere pero le falta un empujón.",
    steps: [
      "Sube el Estado con la promo antes de las 10am",
      "Contacta primero a las que mostraron interés los días 1 y 2 — ellas son las más calientes",
      "Usa el mensaje del día pero no menciones la promo en el primer mensaje — espera a que respondan",
      "Cuando respondan y muestren interés, ahí sueltas la promo: \"Oye y además tengo una promo armada para ti\"",
      "Cierra con fecha límite — \"la promo es solo hoy\"",
    ],
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
    objections: [
      { objection: "¿Hasta cuándo es la promo?", response: "Solo por hoy hermosa — mañana ya no puedo garantizarla. Por eso te escribí ahorita 😊" },
      { objection: "¿Y si no me queda?", response: "Dime tu talla y yo te confirmo si tengo disponible — si no hay en la tuya te busco la opción más cercana 😊" },
      { objection: "Lo tengo que pensar", response: "Claro hermosa, tómate tu tiempo 😊 Solo te digo que la promo es de hoy — si decides mañana con gusto te ayudo pero ya sin el descuento. ¿Qué es lo que te genera duda? A lo mejor te puedo ayudar ahorita." },
    ],
  },
  {
    day: 4,
    emoji: "👥",
    type: "prospeccion",
    typeLabel: "Prospección",
    focus: "Nuevas Clientas",
    mission: "Hoy salimos a buscar clientas nuevas. El outfit colaborativo es tu gancho — no estás vendiendo, estás invitando a jugar. Mándalo a contactos que nunca te han comprado pero que conoces.",
    steps: [
      "Prepara los 6 estados del outfit colaborativo y súbelos en secuencia con 1-2 horas entre cada uno",
      "Identifica 10 contactos que nunca te han comprado pero que conoces — vecinas, amigas, compañeras",
      "Manda el mensaje del día a esos 10 contactos nuevos",
      "Cuando alguien responda al juego, al final mándale el look completo y pregunta: \"¿Te late algo de lo que usamos?\"",
      "No presiones — hoy es día de sembrar, no de cosechar",
    ],
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
    objections: [
      { objection: "¿Cómo sé que es de buena calidad?", response: "Excelente pregunta 😊 Trabajo con Price Shoes — llevan más de 30 años en México y la calidad es su sello. Pero mejor que te lo diga una clienta — mira este mensaje que me mandó la semana pasada [foto testimonial]" },
      { objection: "No te conozco mucho", response: "Con más razón me da gusto que me escribas 😊 Así nos conocemos. No te voy a vender nada que no te quede perfecto — primero me cuentas qué buscas y yo te digo si tengo algo para ti. Sin compromiso." },
      { objection: "¿Tienes catálogo?", response: "Sí hermosa, tengo dos opciones — mis favoritas de la temporada que son las que más se están llevando, y el catálogo completo de Price Shoes con todo el inventario. ¿Cuál prefieres ver primero?" },
    ],
  },
  {
    day: 5,
    emoji: "👥",
    type: "prospeccion",
    typeLabel: "Prospección",
    focus: "Nuevas Clientas",
    mission: "Segundo día de prospección. Hoy usas la referencia de celebridad para conectar con clientas nuevas que no conocen tu trabajo. La curiosidad es tu mejor aliada — no reveles todo de una vez.",
    steps: [
      "Sube el Estado con la comparación de celebridad antes de las 10am",
      "Identifica 10 contactos nuevos diferentes a los de ayer",
      "Manda el mensaje del día — el gancho de Kenia Os funciona mejor con gente que sigue tendencias",
      "Si alguien pregunta dónde consigues la ropa, ese es tu momento: \"Trabajo con Price Shoes, tengo acceso a toda la colección\"",
      "Ofrece la promo solo a quien mostró interés real — no la des a todo el mundo",
    ],
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
    objections: [
      { objection: "¿Cómo sé que es de buena calidad?", response: "Excelente pregunta 😊 Trabajo con Price Shoes — llevan más de 30 años en México y la calidad es su sello. Pero mejor que te lo diga una clienta — mira este mensaje que me mandó la semana pasada [foto testimonial]" },
      { objection: "No te conozco mucho", response: "Con más razón me da gusto que me escribas 😊 Así nos conocemos. No te voy a vender nada que no te quede perfecto — primero me cuentas qué buscas y yo te digo si tengo algo para ti. Sin compromiso." },
      { objection: "¿Tienes catálogo?", response: "Sí hermosa, tengo dos opciones — mis favoritas de la temporada que son las que más se están llevando, y el catálogo completo de Price Shoes con todo el inventario. ¿Cuál prefieres ver primero?" },
    ],
  },
  {
    day: 6,
    emoji: "🔄",
    type: "seguimiento",
    typeLabel: "Seguimiento",
    focus: "Seguimiento",
    mission: "Hoy no vendes — hoy reactivás. Todos los contactos que no respondieron esta semana reciben un último toque con prueba social. Ver que alguien como ellas ya lo tiene es más poderoso que cualquier argumento.",
    steps: [
      "Haz una lista de todos los contactos que no respondieron esta semana",
      "Sube el Estado con el testimonial antes de las 10am",
      "Manda el mensaje del día a toda esa lista — hoy es el día de los toques de seguimiento",
      "No menciones que llevas días intentando contactarlas — actúa como si fuera la primera vez",
      "Si alguien responde negativo, no insistas — anótala como clienta tibia para la próxima campaña",
    ],
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
    objections: [
      { objection: "Ya lo vi y no me convenció", response: "Qué bueno que me dices hermosa 😊 Cuéntame qué no te convenció — a lo mejor tengo algo diferente que sí te late. ¿Qué es lo que buscas exactamente?" },
      { objection: "Dame más tiempo", response: "Claro, sin presión 😊 Solo te digo que hay poca disponibilidad de tu talla — si me dices para cuándo crees que decides yo te la aparto mientras tanto." },
      { objection: "No tengo dinero ahorita", response: "Te entiendo perfectamente hermosa 😊 ¿Sabías que puedes pagar con CrediPrice? Es el crédito de Price Shoes — pagas en cómodas quincenas y te llevas la pieza hoy. ¿Te explico cómo funciona?" },
    ],
  },
  {
    day: 7,
    emoji: "🏆",
    type: "cierre",
    typeLabel: "Cierre",
    focus: "Cierre de Semana",
    mission: "Último día. Hoy cierras todo lo que quedó abierto en la semana. La urgencia es real — la promo termina hoy. Sé directa, amable y firme. Las que dijeron 'lo pienso' hoy deciden.",
    steps: [
      "Sube el Estado de cierre antes de las 9am — hoy más temprano que nunca",
      "Manda el mensaje de cierre a todos los que mostraron interés esta semana pero no compraron",
      "Usa la urgencia con honestidad — \"hoy termina la promo\" es real, no lo exageres",
      "A quien compre hoy pídele una foto usando la prenda — es tu testimonial para la próxima campaña",
      "Al cerrar el día llena tu resultado en el Planeador Semanal — tasa de conversión real vs esperada",
    ],
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
    objections: [
      { objection: "Mañana te confirmo", response: "Hermosa te soy honesta — la promo termina hoy y mañana ya no puedo darte el mismo precio 😊 Si te late, hoy es el momento. ¿Qué necesitas para decidirte ahorita?" },
      { objection: "¿No puedes bajarle más?", response: "Quisiera hermosa pero el precio ya está al límite con la promo de hoy 😊 Lo que sí puedo hacer es armarte el outfit completo para que le saques el máximo provecho desde el primer día que te lo pongas." },
      { objection: "Lo pienso y te digo", response: "Claro 😊 Solo recuerda que después de hoy el precio regresa a normal. ¿Qué es lo que te genera duda? A lo mejor en 2 minutos lo resolvemos y ya." },
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
