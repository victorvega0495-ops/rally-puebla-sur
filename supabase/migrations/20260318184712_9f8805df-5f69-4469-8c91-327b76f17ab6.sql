CREATE TABLE public.day_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign text NOT NULL,
  day_number integer NOT NULL,
  section text NOT NULL,
  slot_index integer NOT NULL DEFAULT 0,
  message text NOT NULL DEFAULT '',
  label text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign, day_number, section, slot_index)
);

ALTER TABLE public.day_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read day_messages" ON public.day_messages FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert day_messages" ON public.day_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update day_messages" ON public.day_messages FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete day_messages" ON public.day_messages FOR DELETE TO public USING (true);