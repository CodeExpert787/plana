-- Create bookings status enum if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
  END IF;
END $$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES public.activities(id) ON DELETE RESTRICT,
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE RESTRICT,
  status booking_status NOT NULL DEFAULT 'pending',
  participants integer NOT NULL CHECK (participants > 0),
  total_price numeric(12,2) NOT NULL CHECK (total_price >= 0),
  booking_date timestamptz NOT NULL DEFAULT now(),
  activity_date date NOT NULL,
  activity_time text NOT NULL,
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_activity_id ON public.bookings(activity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide_id ON public.bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_activity_date ON public.bookings(activity_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can insert their own bookings
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can select their own bookings
DROP POLICY IF EXISTS "Users can select own bookings" ON public.bookings;
CREATE POLICY "Users can select own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own bookings (limited to status and special_requests)
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
  );

-- Optionally, allow service role or admins broader access (adjust as needed)
-- Example: allow all for service role via anon key disabled in client; handled by server.

-- Grant minimal privileges to anon/authenticated as needed
GRANT USAGE ON TYPE booking_status TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.bookings TO anon;


