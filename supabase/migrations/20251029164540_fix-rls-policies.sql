-- DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
-- DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
-- DROP POLICY IF EXISTS "Authenticated users can create posts." ON posts;
-- DROP POLICY IF EXISTS "Posts are viewable by everyone." ON posts;

-- DROP POLICY IF EXISTS "Users can delete their own reactions." ON reactions;
-- DROP POLICY IF EXISTS "Users can update their own reactions." ON reactions;
-- DROP POLICY IF EXISTS "Authenticated users can create reactions." ON reactions;
-- DROP POLICY IF EXISTS "Reactions are viewable by everyone." ON reactions;

-- --
-- -- RLS POLICIES FOR 'posts' TABLE
-- --

-- -- Enable RLS
-- ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- -- Create policy for SELECT (reading posts)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Posts are viewable by everyone.' AND tablename = 'posts'
--   ) THEN
--     CREATE POLICY "Posts are viewable by everyone."
--       ON public.posts FOR SELECT
--       USING (true);
--   END IF;
-- END $$;

-- -- Create policy for INSERT (creating posts)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create posts.' AND tablename = 'posts'
--   ) THEN
--     CREATE POLICY "Authenticated users can create posts."
--       ON public.posts FOR INSERT
--       TO authenticated
--       WITH CHECK (auth.uid() = user_id);
--   END IF;
-- END $$;

-- -- Create policy for UPDATE (editing posts)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own posts.' AND tablename = 'posts'
--   ) THEN
--     CREATE POLICY "Users can update their own posts."
--       ON public.posts FOR UPDATE
--       TO authenticated
--       USING (auth.uid() = user_id)
--       WITH CHECK (auth.uid() = user_id);
--   END IF;
-- END $$;

-- -- Create policy for DELETE (deleting posts)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own posts.' AND tablename = 'posts'
--   ) THEN
--     CREATE POLICY "Users can delete their own posts."
--       ON public.posts FOR DELETE
--       TO authenticated
--       USING (auth.uid() = user_id);
--   END IF;
-- END $$;


-- --
-- -- RLS POLICIES FOR 'reactions' TABLE
-- --

-- ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Reactions are viewable by everyone.' AND tablename = 'reactions'
--   ) THEN
--     CREATE POLICY "Reactions are viewable by everyone."
--       ON public.reactions FOR SELECT
--       USING (true);
--   END IF;
-- END $$;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create reactions.' AND tablename = 'reactions'
--   ) THEN
--     CREATE POLICY "Authenticated users can create reactions."
--       ON public.reactions FOR INSERT
--       TO authenticated
--       WITH CHECK (auth.uid() = user_id);
--   END IF;
-- END $$;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own reactions.' AND tablename = 'reactions'
--   ) THEN
--     CREATE POLICY "Users can update their own reactions."
--       ON public.reactions FOR UPDATE
--       TO authenticated
--       USING (auth.uid() = user_id)
--       WITH CHECK (auth.uid() = user_id);
--   END IF;
-- END $$;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own reactions.' AND tablename = 'reactions'
--   ) THEN
--     CREATE POLICY "Users can delete their own reactions."
--       ON public.reactions FOR DELETE
--       TO authenticated
--       USING (auth.uid() = user_id);
--   END IF;
-- END $$;

