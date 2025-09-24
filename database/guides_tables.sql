-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar TEXT DEFAULT '/placeholder.svg',
  location TEXT NOT NULL,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  certifications TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  completed_activities INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guide_activities table
CREATE TABLE IF NOT EXISTS guide_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 10,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for guides table
CREATE POLICY "Anyone can view active guides" ON guides FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own guide profile" ON guides FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own guide profile" ON guides FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own guide profile" ON guides FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own guide profile" ON guides FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for guide_activities table
CREATE POLICY "Anyone can view available guide activities" ON guide_activities FOR SELECT USING (is_available = true);
CREATE POLICY "Guides can view their own activities" ON guide_activities FOR SELECT USING (
  guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()::text)
);
CREATE POLICY "Guides can insert their own activities" ON guide_activities FOR INSERT WITH CHECK (
  guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()::text)
);
CREATE POLICY "Guides can update their own activities" ON guide_activities FOR UPDATE USING (
  guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()::text)
);
CREATE POLICY "Guides can delete their own activities" ON guide_activities FOR DELETE USING (
  guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()::text)
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_activities_updated_at BEFORE UPDATE ON guide_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guides_user_id ON guides(user_id);
CREATE INDEX IF NOT EXISTS idx_guides_location ON guides(location);
CREATE INDEX IF NOT EXISTS idx_guides_specialties ON guides USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_guides_languages ON guides USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_guides_rating ON guides(rating);
CREATE INDEX IF NOT EXISTS idx_guides_is_active ON guides(is_active);
CREATE INDEX IF NOT EXISTS idx_guide_activities_guide_id ON guide_activities(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_activities_activity_id ON guide_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_guide_activities_is_available ON guide_activities(is_available);

-- Create function to update guide stats when reviews are added/updated
CREATE OR REPLACE FUNCTION update_guide_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update guide rating and total reviews
  UPDATE guides 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE guide_id = COALESCE(NEW.guide_id, OLD.guide_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE guide_id = COALESCE(NEW.guide_id, OLD.guide_id)
    )
  WHERE id = COALESCE(NEW.guide_id, OLD.guide_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update guide stats when reviews change
CREATE TRIGGER update_guide_stats_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_guide_stats();
