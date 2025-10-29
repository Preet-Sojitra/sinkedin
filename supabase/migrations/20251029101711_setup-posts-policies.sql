ALTER TABLE public.posts ALTER COLUMN user_id DROP NOT NULL;
-- Enable RLS if not already
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Remove any conflicting old ones
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Anyone can insert posts (anonymous allowed)" ON public.posts;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;

-- Allow anyone (even not logged in) to insert
CREATE POLICY "Anyone can insert posts (anonymous allowed)"
  ON public.posts
  FOR INSERT
  WITH CHECK (true);

-- Allow everyone to view posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts
  FOR SELECT
  USING (true);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own posts"
ON posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON posts
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read posts"
ON posts
FOR SELECT
USING (true);
