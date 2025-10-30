CREATE TABLE IF NOT EXISTS public.reply_reactions (
  id bigserial PRIMARY KEY,
  reply_id bigint REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamp with time zone default now(),
  UNIQUE (reply_id, user_id)
);

COMMENT ON TABLE public.reply_reactions IS 'Stores emoji reactions for comment replies';
COMMENT ON COLUMN public.reply_reactions.reply_id IS 'References comment table id';
COMMENT ON COLUMN public.reply_reactions.user_id IS 'References profiles table id';
COMMENT ON COLUMN public.reply_reactions.emoji IS 'Reaction emoji used by the user';
