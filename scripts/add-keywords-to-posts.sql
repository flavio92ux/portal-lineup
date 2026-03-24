-- Add meta_keywords column to posts table for SEO tags
-- This is a text array field that stores keywords for structured data

-- Add column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS meta_keywords text[];

-- Add column to _posts_v table (versions)
ALTER TABLE _posts_v 
ADD COLUMN IF NOT EXISTS version_meta_keywords text[];

-- Create index for better performance when querying by keywords
CREATE INDEX IF NOT EXISTS idx_posts_meta_keywords ON posts USING GIN(meta_keywords);
