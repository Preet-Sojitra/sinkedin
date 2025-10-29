--
-- RLS POLICIES FOR 'posts' TABLE
--

-- 1. Enable RLS on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for SELECT (reading posts)
-- This policy allows anyone to view all posts
CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING (true);

-- 3. Create policy for INSERT (creating posts)
-- This policy allows authenticated users to create posts
CREATE POLICY "Authenticated users can create posts."
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Create policy for UPDATE (editing posts)
-- This policy allows users to update only their own posts
CREATE POLICY "Users can update their own posts."
  ON public.posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Create policy for DELETE (deleting posts)
-- This policy allows users to delete only their own posts
CREATE POLICY "Users can delete their own posts."
  ON public.posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

--
-- RLS POLICIES FOR 'reactions' TABLE
--

-- 1. Enable RLS on the reactions table
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for SELECT (reading reactions)
-- This policy allows anyone to view all reactions
CREATE POLICY "Reactions are viewable by everyone."
  ON public.reactions FOR SELECT
  USING (true);

-- 3. Create policy for INSERT (creating reactions)
-- This policy allows authenticated users to create reactions
CREATE POLICY "Authenticated users can create reactions."
  ON public.reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Create policy for UPDATE (editing reactions)
-- This policy allows users to update only their own reactions
CREATE POLICY "Users can update their own reactions."
  ON public.reactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Create policy for DELETE (deleting reactions)
-- This policy allows users to delete only their own reactions
CREATE POLICY "Users can delete their own reactions."
  ON public.reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- Comments for clarity
COMMENT ON POLICY "Posts are viewable by everyone." ON public.posts IS 'Allows read access to all posts for displaying in feeds.';
COMMENT ON POLICY "Authenticated users can create posts." ON public.posts IS 'Ensures only authenticated users can create posts.';
COMMENT ON POLICY "Users can update their own posts." ON public.posts IS 'Ensures users can only modify their own posts.';
COMMENT ON POLICY "Users can delete their own posts." ON public.posts IS 'Ensures users can only delete their own posts.';

COMMENT ON POLICY "Reactions are viewable by everyone." ON public.reactions IS 'Allows read access to all reactions for displaying post engagement.';
COMMENT ON POLICY "Authenticated users can create reactions." ON public.reactions IS 'Ensures only authenticated users can react to posts.';
COMMENT ON POLICY "Users can update their own reactions." ON public.reactions IS 'Ensures users can only modify their own reactions.';
COMMENT ON POLICY "Users can delete their own reactions." ON public.reactions IS 'Ensures users can only delete their own reactions.';