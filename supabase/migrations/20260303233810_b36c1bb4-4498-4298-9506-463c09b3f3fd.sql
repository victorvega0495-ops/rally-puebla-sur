-- Create community_tips table
CREATE TABLE public.community_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  campaign TEXT NOT NULL,
  nickname TEXT NOT NULL,
  city TEXT,
  message TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_tips ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads
CREATE POLICY "Anyone can read tips"
  ON public.community_tips
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous inserts
CREATE POLICY "Anyone can insert tips"
  ON public.community_tips
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);