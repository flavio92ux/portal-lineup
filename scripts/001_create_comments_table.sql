-- Create comments table for posts
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'posts',
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read comments (public)
CREATE POLICY "comments_select_all" ON public.comments 
  FOR SELECT 
  USING (true);

-- Policy: Anyone can insert comments (anonymous allowed)
CREATE POLICY "comments_insert_all" ON public.comments 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Only allow updates within 15 minutes of creation (for typo fixes)
CREATE POLICY "comments_update_recent" ON public.comments 
  FOR UPDATE 
  USING (created_at > NOW() - INTERVAL '15 minutes');

-- Policy: No deletes allowed (admin can delete via service role)
CREATE POLICY "comments_delete_none" ON public.comments 
  FOR DELETE 
  USING (false);
