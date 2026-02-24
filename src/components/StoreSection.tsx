import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const storeElements = [
  {
    id: "letrero",
    name: "Letrero de la tienda",
    wa: "WhatsApp Business: tu nombre, descripción y horario profesional",
    number: 1,
  },
  {
    id: "aparador",
    name: "Aparador con zapatos",
    wa: "Estados de WhatsApp: tu vitrina que trabaja mientras duermes",
    number: 2,
  },
  {
    id: "racks",
    name: "Racks con mercancía",
    wa: "Tu catálogo personal: tus 20-30 productos favoritos",
    number: 3,
  },
  {
    id: "tablet",
    name: "Tablet / Catálogo digital",
    wa: "Catálogo Interactivo Price Shoes: tu tienda completa con pedido integrado",
    number: 4,
  },
  {
    id: "lupita",
    name: "Lupita atendiendo",
    wa: "Tu mensaje de ventas: la vendedora que nunca descansa",
    number: 5,
  },
  {
    id: "libreta",
    name: "Libreta en el mostrador",
    wa: "Tus etiquetas: la base de clientas que regresan solas",
    number: 6,
  },
  {
    id: "consultora",
    name: "Consultora de imagen",
    wa: "IA Personal Shopper: próximamente en la siguiente sesión",
    number: 7,
  },
];

/* ── Tiny reusable SVG sub-components ── */

const HighHeel = ({ x, y, fill, scale = 1 }: { x: number; y: number; fill: string; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path
      d="M2,22 C2,22 4,10 10,6 C14,3 20,4 24,8 C28,12 30,18 38,18 L40,22 C40,24 38,25 36,25 L4,25 C2,25 1,24 2,22 Z"
      fill={fill}
    />
    <path d="M10,6 C10,6 8,2 10,0 C12,2 11,5 10,6 Z" fill={fill} opacity="0.8" />
    {/* Heel */}
    <rect x="6" y="22" width="4" height="10" rx="1" fill={fill} opacity="0.9" />
    <rect x="4" y="31" width="8" height="2" rx="1" fill={fill} opacity="0.7" />
  </g>
);

const Handbag = ({ x, y, fill, accent, scale = 1 }: { x: number; y: number; fill: string; accent: string; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <rect x="2" y="12" width="30" height="24" rx="5" fill={fill} />
    <rect x="5" y="14" width="24" height="20" rx="3" fill={fill} opacity="0.85" />
    {/* Handle */}
    <path d="M10,12 Q10,2 17,2 Q24,2 24,12" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Clasp */}
    <circle cx="17" cy="24" r="3.5" fill={accent} />
    <circle cx="17" cy="24" r="1.5" fill="white" opacity="0.6" />
  </g>
);

const FemFigure = ({
  x, y, hairColor, dressColor, skinColor = "#FFCBA4", hairStyle = "long", scale = 1, children,
}: {
  x: number; y: number; hairColor: string; dressColor: string; skinColor?: string;
  hairStyle?: "long" | "short" | "updo"; scale?: number; children?: React.ReactNode;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {/* Legs */}
    <line x1="14" y1="72" x2="10" y2="96" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
    <line x1="22" y1="72" x2="26" y2="96" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
    {/* Shoes */}
    <ellipse cx="8" cy="98" rx="6" ry="3" fill={dressColor} opacity="0.8" />
    <ellipse cx="28" cy="98" rx="6" ry="3" fill={dressColor} opacity="0.8" />

    {/* Dress / body */}
    <path
      d={`M6,42 Q4,38 8,34 L12,32 Q18,30 24,32 L28,34 Q32,38 30,42 L32,72 Q18,78 4,72 Z`}
      fill={dressColor}
    />
    {/* Belt / waist detail */}
    <ellipse cx="18" cy="48" rx="13" ry="2" fill={dressColor} opacity="0.6" />

    {/* Neck */}
    <rect x="15" y="22" width="6" height="10" rx="3" fill={skinColor} />

    {/* Head */}
    <ellipse cx="18" cy="16" rx="12" ry="14" fill={skinColor} />

    {/* Hair */}
    {hairStyle === "long" && (
      <>
        <path d="M6,12 Q4,0 18,0 Q32,0 30,12 Q30,18 28,22 L8,22 Q6,18 6,12 Z" fill={hairColor} />
        <path d="M6,16 Q2,18 4,32" stroke={hairColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M30,16 Q34,18 32,32" stroke={hairColor} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    )}
    {hairStyle === "updo" && (
      <>
        <path d="M6,12 Q4,-2 18,-4 Q32,-2 30,12 Q30,16 28,18 L8,18 Q6,16 6,12 Z" fill={hairColor} />
        <ellipse cx="18" cy="-2" rx="8" ry="6" fill={hairColor} opacity="0.85" />
      </>
    )}
    {hairStyle === "short" && (
      <path d="M6,14 Q4,0 18,0 Q32,0 30,14 L30,18 L6,18 Z" fill={hairColor} />
    )}

    {/* Face */}
    <circle cx="13" cy="15" r="1.5" fill="#5D4037" />
    <circle cx="23" cy="15" r="1.5" fill="#5D4037" />
    {/* Blush */}
    <ellipse cx="10" cy="19" rx="3" ry="1.5" fill="#F8BBD0" opacity="0.5" />
    <ellipse cx="26" cy="19" rx="3" ry="1.5" fill="#F8BBD0" opacity="0.5" />
    {/* Smile */}
    <path d="M14,21 Q18,25 22,21" stroke="#E91E63" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Arms */}
    <line x1="8" y1="36" x2="-2" y2="55" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />
    <line x1="28" y1="36" x2="38" y2="55" stroke={skinColor} strokeWidth="4.5" strokeLinecap="round" />

    {children}
  </g>
);

const Badge = ({ cx, cy, n, active }: { cx: number; cy: number; n: number; active: boolean }) => (
  <g className="pointer-events-none">
    {active && <circle cx={cx} cy={cy} r="16" fill="#EC407A" opacity="0.25" />}
    <circle cx={cx} cy={cy} r="12" fill="#EC407A" filter="url(#badgeShadow)" />
    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">{n}</text>
  </g>
);

/* ── Main Component ── */

const StoreSection = () => {
  const [active, setActive] = useState<number | null>(null);
  const toggle = (i: number) => setActive(active === i ? null : i);

  return (
    <section id="tienda-section" className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-3">
          La Tienda de <span className="gradient-text">Lupita</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
          Haz click en cada elemento para descubrir su equivalente en WhatsApp
        </p>

        {/* Info card */}
        {active !== null && (
          <div className="mb-6 mx-auto max-w-md animate-fade-in-up">
            <div className="relative bg-card border-2 border-primary rounded-2xl p-5 shadow-xl">
              <button onClick={() => setActive(null)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {storeElements[active].number}
                </span>
                <div>
                  <p className="font-display font-bold text-sm mb-1">{storeElements[active].name}</p>
                  <p className="text-xs font-medium text-primary mb-1">En WhatsApp:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{storeElements[active].wa}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── SVG Illustration ─── */}
        <div className="relative w-full mx-auto" style={{ maxWidth: 920 }}>
          <svg viewBox="0 0 920 560" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Gradients */}
              <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F48FB1" />
                <stop offset="100%" stopColor="#CE93D8" />
              </linearGradient>
              <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF0F5" />
                <stop offset="100%" stopColor="#FDE4EC" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D7CCC8" />
                <stop offset="40%" stopColor="#BCAAA4" />
                <stop offset="100%" stopColor="#A1887F" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FFC107" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#E3F2FD" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="counterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A1887F" />
                <stop offset="100%" stopColor="#795548" />
              </linearGradient>
              <linearGradient id="shelfWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D7CCC8" />
                <stop offset="100%" stopColor="#BCAAA4" />
              </linearGradient>
              <linearGradient id="tabletScreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8EAF6" />
                <stop offset="100%" stopColor="#C5CAE9" />
              </linearGradient>

              {/* Filters */}
              <filter id="softShadow" x="-10%" y="-10%" width="130%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000022" />
              </filter>
              <filter id="subtleShadow" x="-5%" y="-5%" width="115%" height="120%">
                <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#00000018" />
              </filter>
              <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000030" />
              </filter>
              <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#EC407A" floodOpacity="0.45" />
              </filter>
              <filter id="glassReflect" x="0" y="0" width="100%" height="100%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset dx="0" dy="1" />
                <feComposite in="SourceGraphic" />
              </filter>

              {/* Patterns */}
              <pattern id="floorTile" x="0" y="0" width="46" height="46" patternUnits="userSpaceOnUse">
                <rect width="46" height="46" fill="#BCAAA4" />
                <rect x="1" y="1" width="21" height="21" rx="1" fill="#C8B9AF" opacity="0.5" />
                <rect x="24" y="24" width="21" height="21" rx="1" fill="#C8B9AF" opacity="0.5" />
              </pattern>
            </defs>

            {/* ===== BUILDING SHELL ===== */}

            {/* Outer wall shadow */}
            <rect x="55" y="92" width="810" height="400" rx="6" fill="#00000010" />

            {/* Back wall */}
            <rect x="50" y="88" width="820" height="400" rx="6" fill="url(#wallGrad)" />

            {/* Wainscoting / lower wall accent */}
            <rect x="50" y="350" width="820" height="138" rx="0" fill="#FCE4EC" opacity="0.5" />
            <line x1="50" y1="350" x2="870" y2="350" stroke="#F8BBD0" strokeWidth="2" opacity="0.6" />

            {/* Floor */}
            <rect x="50" y="460" width="820" height="50" fill="url(#floorTile)" />
            <rect x="50" y="460" width="820" height="50" fill="url(#floorGrad)" opacity="0.4" />

            {/* ===== ROOF / AWNING ===== */}
            <path d="M35,88 L460,50 L885,88 Z" fill="url(#roofGrad)" filter="url(#softShadow)" />
            {/* Decorative scallop trim */}
            {Array.from({ length: 17 }).map((_, i) => (
              <ellipse key={`sc-${i}`} cx={60 + i * 50} cy={88} rx="25" ry="10" fill="url(#roofGrad)" opacity="0.7" />
            ))}
            <line x1="35" y1="88" x2="885" y2="88" stroke="#CE93D8" strokeWidth="2" />

            {/* ===== 1 · LETRERO ===== */}
            <g
              className={cn("cursor-pointer", active === 0 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(0)}
              role="button" tabIndex={0}
            >
              {/* Plaque */}
              <rect x="260" y="55" width="400" height="44" rx="10" fill="url(#goldGrad)" filter="url(#subtleShadow)" />
              <rect x="266" y="59" width="388" height="36" rx="8" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
              {/* Decorative dots */}
              <circle cx="280" cy="77" r="3" fill="white" opacity="0.4" />
              <circle cx="640" cy="77" r="3" fill="white" opacity="0.4" />
              <text x="460" y="83" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="20" fill="#5D4037">
                ✦ La Tienda de Lupita ✦
              </text>
              <Badge cx={670} cy={77} n={1} active={active === 0} />
            </g>

            {/* ===== ENTRANCE ===== */}
            <rect x="380" y="310" width="160" height="155" rx="4" fill="#5D4037" opacity="0.12" />
            <rect x="385" y="315" width="150" height="148" rx="3" fill="#EFEBE9" opacity="0.35" />
            {/* Door frame highlights */}
            <line x1="380" y1="310" x2="380" y2="465" stroke="#D7CCC8" strokeWidth="3" />
            <line x1="540" y1="310" x2="540" y2="465" stroke="#D7CCC8" strokeWidth="3" />
            <path d="M380,310 Q460,295 540,310" fill="none" stroke="#D7CCC8" strokeWidth="3" />
            {/* Welcome mat */}
            <rect x="400" y="465" width="120" height="14" rx="4" fill="#F48FB1" opacity="0.45" filter="url(#subtleShadow)" />
            <text x="460" y="476" textAnchor="middle" fontSize="7" fill="#AD1457" fontWeight="bold" fontFamily="sans-serif">BIENVENIDA ♡</text>

            {/* ===== 2 · APARADOR (Vitrina) ===== */}
            <g
              className={cn("cursor-pointer", active === 1 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(1)}
              role="button" tabIndex={0}
            >
              {/* Glass case */}
              <rect x="65" y="200" width="280" height="180" rx="8" fill="url(#glassGrad)" stroke="#E8B4B8" strokeWidth="2" filter="url(#subtleShadow)" />
              {/* Glass reflection streak */}
              <rect x="72" y="206" width="8" height="168" rx="4" fill="white" opacity="0.35" />
              {/* Inner shelf */}
              <rect x="75" y="300" width="260" height="4" rx="2" fill="#D7CCC8" />

              {/* Shoes on display */}
              <HighHeel x={95} y={260} fill="#EC407A" scale={1} />
              <HighHeel x={165} y={265} fill="#CE93D8" scale={0.9} />
              <HighHeel x={235} y={262} fill="#FF8A80" scale={0.95} />

              {/* Bags on top shelf */}
              <Handbag x={90} y={206} fill="#F8BBD0" accent="#AD1457" scale={0.8} />
              <Handbag x={180} y={210} fill="#CE93D8" accent="#7B1FA2" scale={0.75} />
              <Handbag x={260} y={208} fill="#FF8A80" accent="#D32F2F" scale={0.78} />

              {/* "NUEVO" tag */}
              <g transform="translate(68,196)">
                <rect x="0" y="0" width="48" height="20" rx="4" fill="#FF5252" />
                <text x="24" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="sans-serif">NUEVO</text>
              </g>

              <Badge cx={338} cy={210} n={2} active={active === 1} />
            </g>

            {/* ===== 3 · RACKS / ESTANTES ===== */}
            <g
              className={cn("cursor-pointer", active === 2 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(2)}
              role="button" tabIndex={0}
            >
              {/* Shelf unit back panel */}
              <rect x="580" y="120" width="270" height="250" rx="6" fill="#EFEBE9" stroke="#D7CCC8" strokeWidth="2" filter="url(#subtleShadow)" />

              {/* Shelf boards */}
              {[0, 1, 2, 3].map(i => (
                <rect key={`shelf-${i}`} x="584" y={178 + i * 52} width="262" height="6" rx="2" fill="url(#shelfWood)" />
              ))}

              {/* Row 1 — bags */}
              <Handbag x={595} y={128} fill="#F8BBD0" accent="#C2185B" scale={0.7} />
              <Handbag x={645} y={130} fill="#CE93D8" accent="#7B1FA2" scale={0.68} />
              <Handbag x={698} y={129} fill="#FF8A80" accent="#D32F2F" scale={0.7} />
              <Handbag x={750} y={131} fill="#FFD54F" accent="#F57F17" scale={0.66} />
              <Handbag x={800} y={128} fill="#F48FB1" accent="#AD1457" scale={0.7} />

              {/* Row 2 — shoes */}
              <HighHeel x={600} y={148} fill="#EC407A" scale={0.7} />
              <HighHeel x={650} y={150} fill="#CE93D8" scale={0.65} />
              <HighHeel x={700} y={149} fill="#FF8A80" scale={0.68} />
              <HighHeel x={748} y={148} fill="#F8BBD0" scale={0.7} />
              <HighHeel x={798} y={150} fill="#FFD54F" scale={0.66} />

              {/* Row 3 — more bags */}
              <Handbag x={598} y={195} fill="#B39DDB" accent="#4A148C" scale={0.65} />
              <Handbag x={650} y={193} fill="#F48FB1" accent="#880E4F" scale={0.68} />
              <Handbag x={702} y={195} fill="#FFAB91" accent="#BF360C" scale={0.65} />
              <Handbag x={754} y={194} fill="#CE93D8" accent="#6A1B9A" scale={0.67} />
              <Handbag x={804} y={195} fill="#FF8A80" accent="#C62828" scale={0.65} />

              {/* Row 4 — shoe boxes */}
              {[0, 1, 2, 3, 4].map(i => {
                const colors = ["#F48FB1", "#CE93D8", "#FF8A80", "#FFAB91", "#B39DDB"];
                return (
                  <g key={`sbox-${i}`} transform={`translate(${598 + i * 52}, 254)`}>
                    <rect x="0" y="0" width="40" height="20" rx="3" fill={colors[i]} opacity="0.75" />
                    <rect x="0" y="9" width="40" height="1.5" rx="0.5" fill="white" opacity="0.3" />
                    <rect x="14" y="4" width="12" height="5" rx="1.5" fill="white" opacity="0.25" />
                  </g>
                );
              })}

              <Badge cx={842} cy={130} n={3} active={active === 2} />
            </g>

            {/* ===== COUNTER ===== */}
            <rect x="80" y="396" width="280" height="68" rx="6" fill="url(#counterGrad)" filter="url(#softShadow)" />
            {/* Counter top surface */}
            <rect x="78" y="392" width="284" height="10" rx="4" fill="#A1887F" />
            {/* Counter wood grain */}
            <line x1="90" y1="420" x2="350" y2="420" stroke="#8D6E63" strokeWidth="0.5" opacity="0.3" />
            <line x1="90" y1="440" x2="350" y2="440" stroke="#8D6E63" strokeWidth="0.5" opacity="0.3" />

            {/* ===== 4 · TABLET on counter ===== */}
            <g
              className={cn("cursor-pointer", active === 3 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(3)}
              role="button" tabIndex={0}
            >
              {/* Tablet body */}
              <rect x="115" y="345" width="75" height="52" rx="6" fill="#37474F" filter="url(#subtleShadow)" />
              {/* Screen */}
              <rect x="120" y="349" width="65" height="40" rx="3" fill="url(#tabletScreen)" />
              {/* Product grid on screen */}
              {[0, 1, 2].map(r =>
                [0, 1, 2].map(c => (
                  <rect
                    key={`tg-${r}-${c}`}
                    x={124 + c * 20}
                    y={353 + r * 12}
                    width="16" height="9" rx="2"
                    fill={["#F8BBD0", "#CE93D8", "#FF8A80", "#FFD54F", "#B39DDB", "#F48FB1", "#FFAB91", "#EC407A", "#E1BEE7"][(r * 3 + c)]}
                    opacity="0.75"
                  />
                ))
              )}
              {/* Home button */}
              <circle cx="152" cy="394" r="2.5" fill="#546E7A" />
              {/* Stand */}
              <rect x="143" y="397" width="18" height="4" rx="1" fill="#455A64" />

              <Badge cx={198} cy={350} n={4} active={active === 3} />
            </g>

            {/* ===== 6 · LIBRETA on counter ===== */}
            <g
              className={cn("cursor-pointer", active === 5 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(5)}
              role="button" tabIndex={0}
            >
              <g transform="rotate(-5, 290, 376)">
                {/* Notebook */}
                <rect x="265" y="355" width="55" height="42" rx="4" fill="#FFF9C4" stroke="#FDD835" strokeWidth="1" filter="url(#subtleShadow)" />
                {/* Spiral binding */}
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <circle key={`sp-${i}`} cx="265" cy={360 + i * 6} r="2.5" fill="none" stroke="#BDBDBD" strokeWidth="1" />
                ))}
                {/* Lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={`ln-${i}`} x1="273" y1={364 + i * 7} x2="312" y2={364 + i * 7} stroke="#E0E0E0" strokeWidth="0.7" />
                ))}
                {/* Written text simulation */}
                <path d="M275,364 Q285,362 295,365" stroke="#7986CB" strokeWidth="0.8" fill="none" />
                <path d="M275,371 Q290,369 305,372" stroke="#7986CB" strokeWidth="0.8" fill="none" />
                <path d="M275,378 Q282,376 290,378" stroke="#7986CB" strokeWidth="0.8" fill="none" />
                {/* Pen */}
                <g transform="rotate(15, 325, 365)">
                  <rect x="322" y="350" width="4" height="38" rx="2" fill="#1565C0" />
                  <polygon points="322,388 326,388 324,395" fill="#263238" />
                  <rect x="322" y="355" width="4" height="3" rx="0.5" fill="#1976D2" />
                </g>
              </g>
              <Badge cx={332} cy={356} n={6} active={active === 5} />
            </g>

            {/* ===== 5 · LUPITA + CLIENTA ===== */}
            <g
              className={cn("cursor-pointer", active === 4 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(4)}
              role="button" tabIndex={0}
            >
              {/* Lupita */}
              <FemFigure x={435} y={350} hairColor="#4E342E" dressColor="#EC407A" hairStyle="updo" scale={1.05}>
                {/* Apron */}
                <path d="M8,44 L28,44 L30,70 L6,70 Z" fill="white" opacity="0.75" />
                <rect x="12" y="48" width="12" height="8" rx="2" fill="white" opacity="0.4" />
              </FemFigure>

              {/* Client */}
              <FemFigure x={510} y={355} hairColor="#3E2723" dressColor="#7E57C2" hairStyle="long" scale={0.95}>
                {/* Shopping bag in hand */}
                <g transform="translate(-12, 52)">
                  <rect x="0" y="0" width="18" height="20" rx="3" fill="#F48FB1" />
                  <path d="M4,0 Q9,-8 14,0" stroke="#AD1457" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <text x="9" y="13" textAnchor="middle" fontSize="6" fill="#AD1457" fontWeight="bold">♡</text>
                </g>
              </FemFigure>

              <Badge cx={500} cy={342} n={5} active={active === 4} />
            </g>

            {/* ===== 7 · CONSULTORA DE IMAGEN ===== */}
            <g
              className={cn("cursor-pointer", active === 6 && "[filter:url(#glowPink)]")}
              onClick={() => toggle(6)}
              role="button" tabIndex={0}
            >
              {/* Full-length mirror */}
              <g filter="url(#subtleShadow)">
                <rect x="710" y="370" width="60" height="90" rx="28" fill="#E8EAF6" stroke="#B0BEC5" strokeWidth="2" />
                <rect x="716" y="376" width="48" height="78" rx="22" fill="white" opacity="0.45" />
                {/* Reflection shine */}
                <rect x="722" y="382" width="6" height="40" rx="3" fill="white" opacity="0.35" />
              </g>

              {/* Consultora figure */}
              <FemFigure x={640} y={358} hairColor="#F9A825" dressColor="#AB47BC" hairStyle="long" scale={0.92}>
                {/* Clipboard */}
                <g transform="translate(-8, 50)">
                  <rect x="0" y="0" width="16" height="22" rx="2" fill="#FFF9C4" stroke="#FDD835" strokeWidth="1" />
                  <rect x="3" y="4" width="10" height="2" rx="1" fill="#CE93D8" />
                  <rect x="3" y="8" width="8" height="2" rx="1" fill="#CE93D8" />
                  <rect x="3" y="12" width="10" height="2" rx="1" fill="#CE93D8" />
                </g>
              </FemFigure>

              {/* Sparkles */}
              <text x="685" y="358" fontSize="16">✨</text>
              <text x="645" y="370" fontSize="10">✨</text>
              <text x="695" y="390" fontSize="12">✨</text>

              <Badge cx={770} cy={375} n={7} active={active === 6} />
            </g>

            {/* ===== DECORATIVE ELEMENTS ===== */}

            {/* Pendant lights */}
            {[180, 380, 560, 760].map((cx, i) => (
              <g key={`lamp-${i}`}>
                <line x1={cx} y1="88" x2={cx} y2="116" stroke="#E0E0E0" strokeWidth="1.5" />
                <path d={`M${cx - 10},116 Q${cx},130 ${cx + 10},116`} fill="#FFF9C4" stroke="#FFD54F" strokeWidth="1" />
                <circle cx={cx} cy="120" r="3" fill="#FFD54F" opacity="0.6" />
              </g>
            ))}

            {/* Plant pot */}
            <g transform="translate(560, 430)">
              <path d="M0,18 L4,0 L24,0 L28,18 Z" fill="#A1887F" />
              <rect x="2" y="16" width="24" height="4" rx="1" fill="#8D6E63" />
              {/* Leaves */}
              <ellipse cx="14" cy="-2" rx="12" ry="10" fill="#66BB6A" />
              <ellipse cx="8" cy="-8" rx="7" ry="8" fill="#81C784" />
              <ellipse cx="20" cy="-6" rx="6" ry="7" fill="#4CAF50" opacity="0.8" />
            </g>

            {/* Hanging "OPEN" sign on door */}
            <g transform="translate(440, 316)">
              <rect x="0" y="0" width="40" height="22" rx="4" fill="url(#goldGrad)" opacity="0.8" />
              <text x="20" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#5D4037" fontFamily="sans-serif">OPEN</text>
            </g>

            {/* Decorative bunting at top */}
            {Array.from({ length: 12 }).map((_, i) => {
              const colors = ["#F8BBD0", "#CE93D8", "#FF8A80", "#FFD54F"];
              return (
                <polygon
                  key={`bunt-${i}`}
                  points={`${110 + i * 60},95 ${122 + i * 60},115 ${134 + i * 60},95`}
                  fill={colors[i % 4]}
                  opacity="0.5"
                />
              );
            })}

          </svg>
        </div>

        {/* Mobile legend for small screens */}
        <div className="mt-8 grid grid-cols-1 gap-2 sm:hidden">
          {storeElements.map((el, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-left transition-all border",
                active === i ? "bg-card border-primary shadow-md" : "bg-card/50 border-transparent"
              )}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {el.number}
              </span>
              <span className="text-xs font-medium">{el.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;
