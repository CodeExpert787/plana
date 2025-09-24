-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  guide_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  participants INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  activity_date DATE NOT NULL,
  activity_time TIME NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own bookings" ON bookings FOR DELETE USING (auth.uid()::text = user_id);

-- Guides can view bookings for their activities
CREATE POLICY "Guides can view bookings for their activities" ON bookings FOR SELECT USING (auth.uid()::text = guide_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide_id ON bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_activity_id ON bookings(activity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_activity_date ON bookings(activity_date);
