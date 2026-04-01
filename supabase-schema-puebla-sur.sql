-- ============================================
-- Rally Puebla Sur — Schema SQL completo
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Tabla de campañas
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  type TEXT DEFAULT 'weekly' CHECK (type IN ('weekly', 'rally')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'locked')),
  week_number INTEGER,
  total_days INTEGER DEFAULT 7,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de días por campaña
CREATE TABLE IF NOT EXISTS campaign_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT,
  mission TEXT,
  mission_quote TEXT,
  format TEXT DEFAULT 'video_imagen' CHECK (format IN ('solo_imagenes', 'video_imagen', 'solo_video', 'imagenes_detalle', 'referidos')),
  segment TEXT,
  channel TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(campaign_id, day_number)
);

-- 3. Tabla de clases (YouTube)
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  week_number INTEGER,
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Banco de videos (15 segundos)
CREATE TABLE IF NOT EXISTS video_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  storage_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  occasion TEXT,
  duration_seconds INTEGER,
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Códigos de acceso (clases + exclusivo)
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  section TEXT DEFAULT 'exclusive' CHECK (section IN ('exclusive', 'classes', 'both')),
  description TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de premios
CREATE TABLE IF NOT EXISTS prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  product_image_url TEXT,
  product_id TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public read campaign_days" ON campaign_days FOR SELECT USING (true);
CREATE POLICY "Public read classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Public read video_bank" ON video_bank FOR SELECT USING (true);
CREATE POLICY "Public read access_codes" ON access_codes FOR SELECT USING (true);
CREATE POLICY "Public read prizes" ON prizes FOR SELECT USING (true);

-- Políticas de escritura pública (admin usa anon key con password en frontend)
CREATE POLICY "Public write campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write campaign_days" ON campaign_days FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write video_bank" ON video_bank FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write access_codes" ON access_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write prizes" ON prizes FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Datos iniciales: 8 semanas Rally Puebla Sur
-- ============================================

INSERT INTO campaigns (slug, title, subtitle, type, status, week_number, total_days, sort_order) VALUES
  ('rally-semana-1', 'Semana 1', 'Rally Puebla Sur', 'rally', 'active', 1, 7, 1),
  ('rally-semana-2', 'Semana 2', 'Rally Puebla Sur', 'rally', 'draft', 2, 7, 2),
  ('rally-semana-3', 'Semana 3', 'Rally Puebla Sur', 'rally', 'draft', 3, 7, 3),
  ('rally-semana-4', 'Semana 4', 'Rally Puebla Sur', 'rally', 'draft', 4, 7, 4),
  ('rally-semana-5', 'Semana 5', 'Rally Puebla Sur', 'rally', 'draft', 5, 7, 5),
  ('rally-semana-6', 'Semana 6', 'Rally Puebla Sur', 'rally', 'draft', 6, 7, 6),
  ('rally-semana-7', 'Semana 7', 'Rally Puebla Sur', 'rally', 'draft', 7, 7, 7),
  ('rally-semana-8', 'Semana 8', 'Rally Puebla Sur', 'rally', 'draft', 8, 7, 8);

-- Insertar 7 días por cada semana (56 días total)
DO $$
DECLARE
  camp RECORD;
  day_formats TEXT[] := ARRAY['solo_imagenes','video_imagen','solo_video','video_imagen','video_imagen','solo_imagenes','video_imagen'];
  day_titles TEXT[] := ARRAY['Carrusel','Ataque 1 a 1','1 calzado 3 estilos','Calzado para el finde','Confort','Calzado a detalle','Mis favoritos de la semana'];
  day_missions TEXT[] := ARRAY[
    'Sube 5 imágenes para armar tu carrusel de WhatsApp y compártelo en tus estados',
    '2 videos y 2 imágenes para enviar directo a tus clientas por WhatsApp',
    '2 videos mostrando cómo combinar un mismo calzado en 3 looks diferentes',
    '2 videos y 2 imágenes con opciones de calzado ideales para el fin de semana',
    '2 videos y 2 imágenes destacando el confort de tus modelos favoritos',
    '5 imágenes con acercamientos y detalles del calzado de la semana',
    '2 imágenes y 2 videos con tus picks favoritos de la semana para cerrar fuerte'
  ];
BEGIN
  FOR camp IN SELECT id FROM campaigns WHERE type = 'rally' LOOP
    FOR i IN 1..7 LOOP
      INSERT INTO campaign_days (campaign_id, day_number, title, format, mission, sort_order)
      VALUES (camp.id, i, day_titles[i], day_formats[i], day_missions[i], i);
    END LOOP;
  END LOOP;
END $$;

-- Código de acceso
INSERT INTO access_codes (code, section, description) VALUES
  ('RALLY2026', 'both', 'Código general de acceso a clases y contenido exclusivo');
