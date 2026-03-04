
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-assets', 'campaign-assets', true);

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-assets');

-- Allow anonymous upload
CREATE POLICY "Anyone can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'campaign-assets');

-- Allow anonymous update (replace)
CREATE POLICY "Anyone can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'campaign-assets') WITH CHECK (bucket_id = 'campaign-assets');

-- Allow anonymous delete
CREATE POLICY "Anyone can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'campaign-assets');

-- Create day_assets table
CREATE TABLE public.day_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign text NOT NULL,
  day_number integer NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('imagen_1', 'imagen_2', 'video_1', 'video_2')),
  storage_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.day_assets ADD CONSTRAINT unique_day_asset UNIQUE (campaign, day_number, asset_type);

ALTER TABLE public.day_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read day_assets" ON public.day_assets FOR SELECT USING (true);
CREATE POLICY "Anyone can insert day_assets" ON public.day_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update day_assets" ON public.day_assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete day_assets" ON public.day_assets FOR DELETE USING (true);
