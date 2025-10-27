create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  username text,
  user_id uuid default gen_random_uuid(),
  room_id text,
  avatar_url text,
  text text,
  time timestamp with time zone

  constraint username_length check (char_length(username) >= 3 AND char_length(username) <= 50)
);

comment on column public.chats.user_id is 'References the profiles table id';
