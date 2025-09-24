-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  avatar TEXT DEFAULT '/placeholder.svg',
  location TEXT DEFAULT '',
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT DEFAULT '',
  completed_activities INTEGER DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for user uploads (avatars)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for user uploads
CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-uploads' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-uploads' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-uploads' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-uploads');

-- Alternative simpler policy for testing (remove the above policies first if needed)
-- DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
--     FOR ALL USING (
--         bucket_id = 'user-uploads' 
--         AND auth.role() = 'authenticated'
--     );
