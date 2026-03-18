-- Fix RLS policies for anonymous public access to comments
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- Create new policies that allow truly public access (without authentication)
-- Allow anyone to read comments (including anonymous users)
CREATE POLICY "Public read access" ON comments
  FOR SELECT
  USING (true);

-- Allow anyone to insert comments (including anonymous users)
CREATE POLICY "Public insert access" ON comments
  FOR INSERT
  WITH CHECK (true);

-- Grant necessary permissions to the anon role (used by Supabase for unauthenticated requests)
GRANT SELECT, INSERT ON comments TO anon;
GRANT SELECT, INSERT ON comments TO authenticated;

-- Ensure the sequence for the id column is accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
