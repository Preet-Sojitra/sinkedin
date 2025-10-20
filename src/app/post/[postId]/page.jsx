import PostCard from "@/components/feed/PostCard";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

const INITIAL_COMMENT_FETCH_COUNT = 10;

const transformPostData = (post) => {
  const reactionCounts = {
    Laugh: 0,
    Clown: 0,
    Skull: 0,
    Relatable: 0,
  };
  post.reactions.forEach((reaction) => {
    if (reactionCounts.hasOwnProperty(reaction.reaction)) {
      reactionCounts[reaction.reaction]++;
    }
  });

  // 2. Transform comments to match expected frontend structure
  const formattedComments = post.comments.map((comment) => ({
    id: comment.id,
    body: comment.body,
    created_at: comment.created_at,
    author: {
      id: comment.profiles.id,
      username: comment.profiles.username,
    },
    avatar_url: comment.profiles.avatar_url,
  }));

  return {
    id: post.id,
    body: post.body,
    is_anonymous: post.is_anonymous,
    created_at: post.created_at,
    // The post's author is anonymous if the flag is set
    author: post.is_anonymous
      ? null
      : {
          id: post.profiles?.id,
          username: post.profiles?.username,
          avatar_url: post.profiles?.avatar_url,
        },
    reaction_counts: reactionCounts,
    reaction: post.reactions, // Pass the raw reactions array for checking user's reaction
    comments: formattedComments,
  };
};

// This is an async Server Component
export default async function PostPage({ params }) {
  const { postId } = await params;
  const supabase = await createClient();

  const { data: rawPost, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        user_id,
        body,
        is_anonymous,
        created_at,
        profiles!posts_user_id_fkey (
          id,
          username,
          avatar_url
        ),
        reactions (
          user_id,
          reaction
        ),
        comments (
          id,
          body,
          created_at,
          profiles!comments_user_id_fkey (
            id,
            username,
            avatar_url
          )
        )
      `
    )
    .eq("id", postId)
    .order("created_at", { referencedTable: "comments", ascending: false })
    .limit(INITIAL_COMMENT_FETCH_COUNT, { foreignTable: "comments" })
    .single();

  if (error || !rawPost) {
    notFound();
  }

  const post = transformPostData(rawPost);

  // Fetch the current user's info to pass to the PostCard
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    profile = profileData;
  }

  return (
    <main className="max-w-[800px] mx-auto my-6 px-5 md:my-8 md:px-6 flex flex-col gap-6">
      <div className="self-start">
        <Link
          href="/feed"
          className="text-sm text-light-secondary hover:text-light transition-colors"
        >
          ← Back to Feed
        </Link>
      </div>

      {/* Render the single PostCard with the *transformed* data */}
      <PostCard
        key={post.id}
        post={post}
        currentUserId={user?.id}
        currentUserAvatar={profile?.avatar_url}
      />
    </main>
  );
}
