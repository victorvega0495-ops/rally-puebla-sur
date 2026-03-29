# CLAUDE.md — Plataforma Rally Price Shoes

## Contexto del proyecto
App de capacitacion y seguimiento para socias Price Shoes. Rally de 86,000 socias, 6 semanas, flujo UX tipo Duolingo.

## Stack
- React + Vite (exportado de Lovable)
- Vercel (hosting)
- Supabase Pro (DB + Auth + RLS + Storage)
- YouTube links (solo URL, sin almacenar video)
- canvas-confetti para animaciones de completado
- Web Share API para compartir assets

## Reglas de desarrollo
1. GenericDayFlow es el componente central — debe ser generico y reutilizable
2. Nunca hardcodear contenido — todo viene de Supabase
3. Admin mode: detectado por password en frontend (priceshoes2026), migracion a Supabase Auth pendiente
4. Confetti: usar canvas-confetti con { particleCount: 150, spread: 80, origin: { y: 0.6 } }
5. Compartir: Web Share API con File object — fallback a descarga en desktop
6. Assets: URLs de Supabase Storage con acceso publico
7. YouTube: solo guardar URL — nunca embed que requiera login
8. Videos banco: reproduccion inline desde Supabase Storage
9. Clases y contenido exclusivo protegidos por codigos de acceso (tabla access_codes)
10. Mobile-first — 86K socias acceden desde celular

## Estructura de rutas
- `/` — Home (Mi Contenido + navegacion a Rally, Clases, Exclusivo)
- `/rally` — Home del rally (6 semanas)
- `/rally/:weekSlug` — Vista de semana (7 dias + premios + comunidad)
- `/rally/:weekSlug/day/:dayNumber` — Dia del rally (GenericDayFlow)
- `/clases` — Repositorio de clases YouTube (protegido por codigo)
- `/exclusivo` — Seccion exclusiva + banco de videos (protegido por codigo)
- `/admin` — Panel admin

## Tablas de Supabase
- `campaigns` — Campanas/semanas del rally
- `campaign_days` — Dias por campana con formato y mision
- `day_assets` — Assets (imagenes, videos) por dia (tabla existente)
- `day_messages` — Mensajes editables por dia (tabla existente)
- `community_tips` — Tips de comunidad (tabla existente)
- `classes` — Clases de YouTube
- `video_bank` — Videos de 15 segundos
- `access_codes` — Codigos de acceso para clases y exclusivo
- `prizes` — Premios por campana

## Comandos
- `npm run dev` — desarrollo local
- `npm run build` — build de produccion
- `npx tsc --noEmit` — type check
