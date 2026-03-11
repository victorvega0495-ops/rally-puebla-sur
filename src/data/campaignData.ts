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

export interface IdealClient {
  quien: string;
  queBusca: string;
  donde: string;
}

export interface DayData {
  day: number;
  emoji: string;
  type: "activacion" | "prospeccion" | "seguimiento" | "cierre";
  typeLabel: string;
  focus: string;
  mission: string;
  missionQuote?: string;
  steps: string[];
  lookName: string;
  lookProductIds: string;
  brand: string;
  lookAttributes: string[];
  idealClient: IdealClient;
  salesHacks: string[];
  openingMessages: {
    cold: string;
    warm: string;
    hot: string;
  };
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
    mission: "Hoy vas con tus clientas de confianza — ellas ya te conocen, solo necesitan que aparezcas. A quien compre hoy pídele foto con la prenda.",
    missionQuote: "La venta empieza cuando apareces — hoy apareces.",
    steps: [
      "Sube el Estado de WhatsApp con la imagen del Vestido Midi/Largo antes de las 10am",
      "Haz una lista de 5 clientas activas — las que te compraron en los últimos 60 días",
      "Mándale a cada una el mensaje del día personalizando su nombre",
      "Responde a quien te conteste dentro de las siguientes 2 horas — la velocidad de respuesta cierra ventas",
      "Al final del día anota cuántas respondieron",
    ],
    lookName: "Vestido Estampado Animal Print",
    lookProductIds: "ID: 1267205",
    brand: "Price Shoes",
    lookAttributes: [
      "Estampado animal print, manga larga con cinturón, va de oficina a salida de noche",
    ],
    idealClient: {
      quien: "Mujer 25-45 años que quiere verse atrevida sin perder elegancia — búscala en contactos de trabajo y amigas que siguen tendencias",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 Muéstrale cómo el cinturón cambia todo el look — con y sin él son dos vestidos distintos",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
    statusCopyImage: "Oye, ¿ya viste lo nuevo que llegó? 👀",
    statusCopyVideo: "Oye, ¿ya viste lo nuevo que llegó? 👀",
    reelStructure: [
      "0-3 seg: look completo de frente",
      "3-6 seg: detalle tela",
      "6-9 seg: ID del producto en pantalla",
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
    mission: "Las que no respondieron ayer son tu prioridad — un look diferente, una segunda oportunidad. A quien compre hoy pídele foto con la prenda.",
    missionQuote: "El no de ayer es el sí de hoy con el mensaje correcto.",
    steps: [
      "Sube el Estado con el look de oficina antes de las 10am",
      "Revisa quién no respondió ayer — esas son tus primeras clientas de hoy",
      "Manda el mensaje del día a las que no respondieron ayer más 3 clientas nuevas",
      "Si alguien pregunta precio, no lo des de inmediato — primero manda la foto del look completo",
      "Anota quién mostró interés aunque no haya comprado — las necesitas para el Día 3",
    ],
    lookName: "Pantalón Tiro Alto + Blusa Luna",
    lookProductIds: "Pantalón ID: 1268745 / Blusa ID: 1268737 / Tacones ID: 1286069",
    brand: "Price Shoes",
    lookAttributes: [
      "Tiro alto estiliza la cintura, combo clásico blanco y vino, elegante sin esfuerzo",
    ],
    idealClient: {
      quien: "Profesionista que quiere verse pulida y femenina — búscala en contactos de oficina y eventos de trabajo",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 Muéstrale que el pantalón blanco va con cualquier blusa de color — vende el pantalón primero",
      "💡 Este look se vende más a mitad de semana — las profesionistas planean su ropa con anticipación",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
    statusCopyImage: "¿Cuál se llevan? 👀",
    statusCopyVideo: "¿Cuál se llevan? 👀",
    reelStructure: [
      "0-3 seg: look de oficina completo",
      "3-6 seg: detalle saco",
      "6-9 seg: ID del producto en pantalla",
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
    mission: "Hoy cierras con las interesadas — muestra la promo desde el primer mensaje, es tu gancho más fuerte hoy.",
    missionQuote: "Las mejores vendedoras no esperan — cierran.",
    steps: [
      "Sube el Estado con la promo antes de las 10am",
      "Contacta primero a las que mostraron interés los días 1 y 2 — ellas son las más calientes",
      "Usa el mensaje del día pero no menciones la promo en el primer mensaje — espera a que respondan",
      "Cuando respondan y muestren interés, ahí sueltas la promo: \"Oye y además tengo una promo armada para ti\"",
      "Cierra con fecha límite — \"la promo es solo hoy\"",
    ],
    lookName: "Blusa Tie-Dye + Short Blanco",
    lookProductIds: "Blusa ID: 1271654 / Short ID: 1197279 / Tacones ID: 1264534",
    brand: "Price Shoes",
    lookAttributes: [
      "Blusa tie-dye es la pieza que da vida al outfit, short blanco alarga las piernas, look fresco con actitud",
    ],
    idealClient: {
      quien: "Mujer que quiere un look de impacto para salir — búscala entre amigas que salen seguido y contactos jóvenes",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 La promo ya viene en la imagen — úsala desde el primer mensaje como gancho",
      "💡 Si duda del precio recuérdale que son 2 piezas completas",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
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
    mission: "Hoy saltas a territorio nuevo — el outfit colaborativo es tu gancho. A quien compre hoy pídele foto.",
    missionQuote: "Cada clienta nueva que ganas hoy es una VIP de mañana.",
    steps: [
      "Prepara los 6 estados del outfit colaborativo y súbelos en secuencia con 1-2 horas entre cada uno",
      "Identifica 10 contactos que nunca te han comprado pero que conoces — vecinas, amigas, compañeras",
      "Manda el mensaje del día a esos 10 contactos nuevos",
      "Cuando alguien responda al juego, al final mándale el look completo y pregunta: \"¿Te late algo de lo que usamos?\"",
      "No presiones — hoy es día de sembrar, no de cosechar",
    ],
    lookName: "Chaleco Efecto Piel + Falda Short",
    lookProductIds: "ID: 1160243 / ID: 1157362",
    brand: "Price Shoes",
    lookAttributes: [
      "Pieza statement de temporada, look que destaca en redes, fresco sin perder estilo",
    ],
    idealClient: {
      quien: "Mujer joven que sigue tendencias y vive en redes — búscala en contactos menores de 35",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 Lanza el outfit colaborativo antes del mediodía — hay más actividad",
      "💡 No reveles el resultado hasta las 6pm — genera suspenso",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
    statusCopyImage: "Tú armas el look, yo consigo las piezas 😊 Vamos...",
    statusCopyVideo: "Tú armas el look, yo consigo las piezas 😊 Vamos...",
    reelStructure: [
      "0-3 seg: look final del outfit colaborativo",
      "3-6 seg: detalle piezas",
      "6-9 seg: ID del producto en pantalla",
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
    mission: "Hoy prospectas con deseo — el look de celebridad abre puertas que el catálogo no abre. A quien compre hoy pídele foto.",
    missionQuote: "No estás vendiendo ropa — estás vendiendo cómo se va a sentir.",
    steps: [
      "Sube el Estado con la comparación de celebridad antes de las 10am",
      "Identifica 10 contactos nuevos diferentes a los de ayer",
      "Manda el mensaje del día — el gancho de Kenia Os funciona mejor con gente que sigue tendencias",
      "Si alguien pregunta dónde consigues la ropa, ese es tu momento: \"Trabajo con Price Shoes, tengo acceso a toda la colección\"",
      "Ofrece la promo solo a quien mostró interés real — no la des a todo el mundo",
    ],
    lookName: "Vestido Corto",
    lookProductIds: "ID: 1267538",
    brand: "Price Shoes",
    lookAttributes: [
      "Hombros definidos, una sola pieza hace el outfit, ideal para eventos y reuniones",
    ],
    idealClient: {
      quien: "Admira el estilo de influencers pero busca precios accesibles — búscala en seguidoras de moda",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 La comparación con celebridad funciona mejor con menores de 35",
      "💡 Si pregunta dónde consigues la ropa, ese es tu momento",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
    statusCopyImage: "Kenia Os vs tú — ¿quién lo luce mejor? 👀",
    statusCopyVideo: "Kenia Os vs tú — ¿quién lo luce mejor? 👀",
    reelStructure: [
      "0-3 seg: foto celebridad",
      "3-6 seg: look Price Shoes",
      "6-9 seg: ID del producto en pantalla",
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
    mission: "Hoy reactivas con prueba social — usa las fotos de clientas que juntaste esta semana, ellas venden mejor que tú.",
    missionQuote: "Una clienta feliz vale más que mil palabras tuyas.",
    steps: [
      "Haz una lista de todos los contactos que no respondieron esta semana",
      "Sube el Estado con el testimonial antes de las 10am",
      "Manda el mensaje del día a toda esa lista — hoy es el día de los toques de seguimiento",
      "No menciones que llevas días intentando contactarlas — actúa como si fuera la primera vez",
      "Si alguien responde negativo, no insistas — anótala como clienta tibia para la próxima campaña",
    ],
    lookName: "Vestido Midi Negro — 2 Estilos",
    lookProductIds: "Vestido halter ID: 1267542 / Vestido tirantes ID: 1267366 / Flats ID: 1183904 / Sandalias ID: 1262658",
    brand: "Price Shoes",
    lookAttributes: [
      "Negro que nunca falla, dos siluetas distintas para dos personalidades, del día a la noche sin cambiar nada",
    ],
    idealClient: {
      quien: "Mujer que quiere una pieza de alto impacto que dure años en su clóset — búscala entre clientas que ya te compraron y quieren algo especial",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 Muéstrale los dos vestidos juntos — que ella elija cuál es su estilo. La decisión de cuál la engancha más que el vestido solo",
      "💡 El negro se vende solo con prueba social — si tienes foto de clienta con vestido negro úsala hoy",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
    statusCopyImage: "Así lució hoy 😍",
    statusCopyVideo: "Así lució hoy 😍",
    reelStructure: [
      "0-3 seg: testimonial clienta",
      "3-6 seg: detalle look",
      "6-9 seg: \"Tú puedes ser la siguiente\"",
      "9-12 seg: ID del producto en pantalla",
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
    mission: "Hoy es el último día — las que dudaron esta semana, hoy deciden. A quien compre pídele foto para tu próxima campaña.",
    missionQuote: "Las que terminan lo que empiezan son las que ganan.",
    steps: [
      "Sube el Estado de cierre antes de las 9am — hoy más temprano que nunca",
      "Manda el mensaje de cierre a todos los que mostraron interés esta semana pero no compraron",
      "Usa la urgencia con honestidad — \"hoy termina la promo\" es real, no lo exageres",
      "A quien compre hoy pídele una foto usando la prenda — es tu testimonial para la próxima campaña",
      "Al cerrar el día llena tu resultado en el Planeador Semanal — tasa de conversión real vs esperada",
    ],
    lookName: "Saco Largo Str + Vestido Corto",
    lookProductIds: "ID: 1267530 / ID: 1267540",
    brand: "Price Shoes",
    lookAttributes: [
      "Saco largo más versátil de la colección, capas con personalidad, look de cierre con actitud",
    ],
    idealClient: {
      quien: "La que mostró interés esta semana pero no ha comprado — está en tu lista de seguimiento",
      queBusca: "",
      donde: "",
    },
    salesHacks: [
      "💡 Manda el mensaje de cierre antes de las 11am",
      "💡 A quien compre hoy pídele foto — es tu testimonial para la próxima campaña",
    ],
    openingMessages: {
      cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
      warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look que quedó brutal y me acordé de ti. ¿Lo ves?",
      hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
    },
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
    subtitle: "Price Shoes Pri-Ver 2026",
    active: true,
    days: semana1Days,
  },
  {
    id: "semana-2",
    title: "Semana 2 — Playa y Sandalias",
    subtitle: "Price Shoes Verano 2026",
    active: true,
days: [
      {
        day: 1,
        emoji: "🔥",
        type: "activacion",
        typeLabel: "Activación",
        focus: "Clientas Activas",
        mission: "Hoy vas con tus clientas de confianza — ellas ya te conocen, solo necesitan que aparezcas. A quien compre hoy pídele foto con la prenda.",
        missionQuote: "La venta empieza cuando apareces — hoy apareces.",
        steps: [
          "Sube el Estado de WhatsApp con la imagen del mono player antes de las 10am",
          "Haz una lista de 5 clientas activas — las que te compraron en los últimos 60 días",
          "Mándale a cada una el mensaje del día personalizando su nombre",
          "Responde a quien te conteste dentro de las siguientes 2 horas — la velocidad de respuesta cierra ventas",
          "Al final del día anota cuántas respondieron",
        ],
        lookName: "Mono Playero — 2 Estilos",
        lookProductIds: "Mono negro ID: 1201354 / Mono beige ID: 1268688 / Sandalias joyería ID: 1262280 / Sandalias café ID: 1286076",
        brand: "Price Shoes",
        lookAttributes: [
          "Una sola pieza hace todo el outfit, ideal para playa y paseos, elegante sin esfuerzo",
        ],
        idealClient: {
          quien: "Mujer que viaja o sale seguido y quiere verse increíble sin complicarse — búscala entre clientas que siguen tendencias de verano",
          queBusca: "",
          donde: "",
        },
        salesHacks: [
          "💡 Muéstrale los dos estilos juntos — el negro es más elegante, el beige más casual. Que ella elija su personalidad",
          "💡 El mono se vende mejor cuando muestras lo fácil que es usarlo — una pieza, lista para salir",
        ],
        openingMessages: {
          cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
          warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look de playa que quedó brutal y me acordé de ti. ¿Lo ves?",
          hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
        },
        statusCopyImage: "¿A la playa o al paseo? Este mono lo hace todo 👀",
        statusCopyVideo: "¿A la playa o al paseo? Este mono lo hace todo 👀",
        reelStructure: [
          "0-3 seg: look completo de frente (mono negro)",
          "3-6 seg: cambio a mono beige",
          "6-9 seg: detalle sandalias joyería",
          "9-12 seg: ID del producto en pantalla",
          "12-15 seg: \"Te lo mando\"",
        ],
        messageTemplate:
          "Holaaa, no me vas a creer — acabo de recibir un mono player que de volada pensé en ti. ¿Te mando foto?",
        followUps: [
          { label: "Toque 1", timing: "Hoy", message: "Holaaa, no me vas a creer — acabo de recibir un mono player que de volada pensé en ti. ¿Te mando foto?" },
          { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
          { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas del mono player que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
        ],
        objections: [
          { objection: "Está muy caro", response: "Te entiendo hermosa 😊 Por eso me gusta mostrarte opciones completas — a veces una sola pieza versátil que combines con lo que ya tienes sale más barato que comprar tres cosas baratas que no combinan con nada. ¿Te mando cómo lo combinarías con lo que ya tienes?" },
          { objection: "Ahorita no puedo", response: "No hay problema hermosa, no te quiero presionar 😊 Solo te lo enseño para que lo tengas presente — si en algún momento te late me avisas y vemos cómo le hacemos. ¿Te lo guardo?" },
          { objection: "Ya tengo algo parecido", response: "Jaja seguro sí, pero apuesto que no lo tienes en este corte 😄 La diferencia está en los detalles hermosa. ¿Me mandas foto de lo que tienes y te digo si realmente se parece?" },
        ],
      },
      {
        day: 2,
        emoji: "🔥",
        type: "activacion",
        typeLabel: "Activación",
        focus: "Clientas Activas",
        mission: "Hoy vas con tus clientas de confianza — el vestido floral es tu mejor carta para cerrar. A quien compre hoy pídele foto con la prenda.",
        missionQuote: "El contexto cierra la venta.",
        steps: [
          "Sube el Estado de WhatsApp con la imagen del vestido floral antes de las 10am",
          "Haz una lista de 5 clientas activas — prioriza las que tienen eventos de verano",
          "Mándale a cada una el mensaje del día personalizando su nombre",
          "Responde a quien te conteste dentro de las siguientes 2 horas — la velocidad de respuesta cierra ventas",
          "Al final del día anota cuántas respondieron",
        ],
        lookName: "Vestido Floral Midi — 2 Colores",
        lookProductIds: "Vestido azul ID: 1201334 / Vestido rosa ID: 1269430 / Sandalia rosa ID: 1286078 / Sandalia nude ID: 1286076",
        brand: "Price Shoes",
        lookAttributes: [
          "Floral romántico de temporada, corte midi favorecedor, fresco y femenino para el calor",
        ],
        idealClient: {
          quien: "Mujer que quiere verse especial en la playa o un evento al aire libre — búscala entre clientas que viajan o tienen eventos de verano",
          queBusca: "",
          donde: "",
        },
        salesHacks: [
          "💡 Muéstrale los dos colores juntos — azul es más romántico, rosa es más atrevido. Que ella elija su mood",
          "💡 Este vestido se vende solo con el fondo — manda la imagen en el muelle o la playa, el contexto cierra la venta",
        ],
        openingMessages: {
          cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
          warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un look floral que quedó brutal y me acordé de ti. ¿Lo ves?",
          hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
        },
        statusCopyImage: "¿Azul o rosa? Elige tu mood 🌸🌊",
        statusCopyVideo: "¿Azul o rosa? Elige tu mood 🌸🌊",
        reelStructure: [
          "0-3 seg: look completo de frente (vestido azul)",
          "3-6 seg: cambio a vestido rosa",
          "6-9 seg: detalle sandalias",
          "9-12 seg: ID del producto en pantalla",
          "12-15 seg: \"Te lo mando\"",
        ],
        messageTemplate:
          "Holaaa, no me vas a creer — acabo de recibir un vestido floral que de volada pensé en ti. ¿Te mando foto?",
        followUps: [
          { label: "Toque 1", timing: "Hoy", message: "Holaaa, no me vas a creer — acabo de recibir un vestido floral que de volada pensé en ti. ¿Te mando foto?" },
          { label: "Toque 2", timing: "Día siguiente", message: "Holaaa hermosa, ayer ya no me respondiste — ¿pudiste ver lo que te mandé? 😊" },
          { label: "Toque 3", timing: "1 semana", message: "Oye [Nombre], te acuerdas del vestido floral que te enseñé? Mira cómo lo lució una clienta 😍 Cuando gustes nos ponemos." },
        ],
        objections: [
          { objection: "Está muy caro", response: "Te entiendo hermosa 😊 Por eso me gusta mostrarte opciones completas — a veces una sola pieza versátil que combines con lo que ya tienes sale más barato que comprar tres cosas baratas que no combinan con nada. ¿Te mando cómo lo combinarías con lo que ya tienes?" },
          { objection: "Ahorita no puedo", response: "No hay problema hermosa, no te quiero presionar 😊 Solo te lo enseño para que lo tengas presente — si en algún momento te late me avisas y vemos cómo le hacemos. ¿Te lo guardo?" },
          { objection: "Ya tengo algo parecido", response: "Jaja seguro sí, pero apuesto que no lo tienes en este corte floral 😄 La diferencia está en los detalles hermosa. ¿Me mandas foto de lo que tienes y te digo si realmente se parece?" },
        ],
      },
      {
        day: 3,
        emoji: "🎁",
        type: "activacion",
        typeLabel: "Activación + Promo",
        focus: "Primera Promo",
        mission: "Hoy cierras con las interesadas — el combo crop top + short es tu gancho más fuerte. Muestra la promo desde el primer mensaje.",
        missionQuote: "Las mejores vendedoras no esperan — cierran.",
        steps: [
          "Sube el Estado con la promo antes de las 10am",
          "Contacta primero a las que mostraron interés los días 1 y 2",
          "Usa el mensaje del día y espera a que respondan",
          "Cuando respondan y muestren interés, suelta la promo",
          "Cierra con fecha límite — \"la promo es solo hoy\"",
        ],
        lookName: "Crop Top + Short de Rayas — 2 Combos",
        lookProductIds: "Top blanco ID: 1214267 / Top rosa ID: 1269537 / Short azul ID: 1266281 / Short rosa ID: 1266280 / Sandalias grises ID: 1256321 / Sandalias nude ID: 1310559",
        brand: "Price Shoes",
        lookAttributes: [
          "Combo crop top + short de rayas es el look del verano, ligero y fresco, dos paletas para dos estilos",
        ],
        idealClient: {
          quien: "Mujer joven que quiere un look playero completo sin gastar mucho — búscala entre contactos menores de 35 y clientas que salen seguido en verano",
          queBusca: "",
          donde: "",
        },
        salesHacks: [
          "💡 Véndelo como combo desde el inicio — top + short juntos tienen más valor percibido que cada pieza sola",
          "💡 El azul marino es más versátil, el rosa más femenino — pregúntale cuál es su color favorito para engancharla",
        ],
        openingMessages: {
          cold: "Holaaa [Nombre], ¿cómo has estado? Hace tiempo que no sé nada de ti 😊 Oye, acabo de recibir algo que de volada pensé en ti cuando lo vi. ¿Te mando foto?",
          warm: "Holaaa [Nombre], ¿cómo estás? Oye no me vas a creer — acabo de armar un combo de verano que quedó brutal y me acordé de ti. ¿Lo ves?",
          hot: "Oye [Nombre], mira lo que acaba de llegar — de volada pensé en ti. ¿Te lo mando?",
        },
        statusCopyImage: "Combo de verano — top + short juntos 🌞",
        statusCopyVideo: "Combo de verano — top + short juntos 🌞",
        reelStructure: [
          "0-3 seg: look completo de frente (combo azul)",
          "3-6 seg: cambio a combo rosa",
          "6-9 seg: detalle rayas",
          "9-12 seg: promo en pantalla",
          "12-15 seg: \"Últimas piezas\"",
        ],
        messageTemplate:
          "[Nombre], me queda muy poco de esta combinación y tengo una promo armada para ti. ¿Te la cuento?",
        promo: "Llévate el combo top + short y ahorra 15%",
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
      ...Array.from({ length: 4 }, (_, i) => ({
        day: i + 4,
        emoji: ["👥", "⭐", "🔄", "🏆"][i],
        type: (["prospeccion", "seguimiento", "seguimiento", "cierre"] as const)[i],
        typeLabel: ["Prospección", "Seguimiento", "Seguimiento", "Cierre"][i],
        focus: `Día ${i + 4}`,
        mission: "Contenido próximamente — el admin puede subir los assets mientras tanto.",
        missionQuote: "",
        steps: [],
        lookName: "Por definir",
        lookProductIds: "",
        brand: "Price Shoes",
        lookAttributes: ["Por definir"],
        idealClient: { quien: "Por definir", queBusca: "", donde: "" },
        salesHacks: [],
        openingMessages: { cold: "", warm: "", hot: "" },
        statusCopyImage: "",
        statusCopyVideo: "",
        reelStructure: [],
        messageTemplate: "",
        followUps: [],
        objections: [],
      })),
    ],
  },
  {
    id: "semana-3",
    title: "Semana 3",
    subtitle: "Próximamente",
    active: false,
    days: [],
  },
  {
    id: "semana-4",
    title: "Semana 4",
    subtitle: "Próximamente",
    active: false,
    days: [],
  },
];

export const celebrationMessages: string[] = [
  "¡Arrancaste! 🔥 Sembraste hoy, cosechas mañana.",
  "¡Dos días seguidos! 💪 Las ventas están a punto de llegar.",
  "¡Primera promo activada! 🎁 Hoy cerraste o estás muy cerca.",
  "¡Sembraste en territorio nuevo! 👥 Las clientas nuevas de hoy son las VIP de mañana.",
  "¡5 días! 🚀 Estás en la recta final.",
  "¡Casi! 🔄 Un día más y tienes tu primera semana completa.",
  "¡Semana completa! 🏆 Eres de las que terminan lo que empiezan.",
];

export const motivationalMessages: string[] = celebrationMessages;
