--
-- RLS POLICIES FOR 'chats' TABLE
--

-- 1. Enable RLS on the chats table
alter table public.chat enable ROW LEVEL SECURITY;

-- 2. Create policy for INSERT (creating posts)
-- This policy allows authenticated users to create posts
create policy "allow chat to authenticated users only"
on "public"."chat"
as PERMISSIVE
for INSERT
to authenticated
with check (auth.uid() = user_id);