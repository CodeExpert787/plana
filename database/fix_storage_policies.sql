-- Fix storage policies for avatar uploads
-- Run this in your Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Create simpler, working policies
CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
    FOR ALL USING (
        bucket_id = 'user-uploads' 
        AND auth.role() = 'authenticated'
    );

-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;
