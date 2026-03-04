
-- Create day_videos table
CREATE TABLE public.day_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign text NOT NULL,
  day_number integer NOT NULL,
  video_slot text NOT NULL,
  youtube_url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign, day_number, video_slot)
);

ALTER TABLE public.day_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read day_videos" ON public.day_videos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert day_videos" ON public.day_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update day_videos" ON public.day_videos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete day_videos" ON public.day_videos FOR DELETE USING (true);

-- Drop day_assets table
DROP TABLE IF EXISTS public.day_assets;
