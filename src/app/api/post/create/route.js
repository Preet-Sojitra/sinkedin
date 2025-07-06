import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Filter } from "bad-words";

// Initialize the bad words filter
const filter = new Filter();

const censorWord = (word) => {
  // Replace the word with asterisks, maintaining the original length
  if (word.length <= 2) {
    return "*".repeat(word.length); // For short words, just asterisks
  }
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
};

export async function POST(request) {
  try {
    const { content, isAnonymous } = await request.json();

    // Validate input
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content cannot be empty." },
        { status: 400 },
      );
    }

    // We split the content into words, check each one, and then rejoin them.
    // This is more precise than a simple replace and handles punctuation better.
    const censoredContent = content
      .split(" ")
      .map((word) => (filter.isProfane(word) ? censorWord(word) : word))
      .join(" ");

    const supabase = await createClient();
    const { data: session, error: sessionError } =
      await supabase.auth.getUser();
    // console.log("Session data:", session)

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.json(
        { error: "Failed to retrieve session." },
        { status: 500 },
      );
    }

    const userId = session?.user?.id || null;
    // console.log("User ID:", userId)
    const isAuthenticated = !!userId;
    // console.log("Is authenticated:", isAuthenticated)

    // If the user is not authenticated and tries to post anonymously, return an error
    if (isAnonymous && !isAuthenticated) {
      return NextResponse.json(
        { error: "You must be logged in to post anonymously." },
        { status: 403 },
      );
    }

    // Insert the post into the database
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        body: censoredContent.trim(),
        is_anonymous: isAnonymous,
      })
      .select()
      .single();

    if (postError || !post) {
      console.error("Post insertion error:", postError);
      return NextResponse.json(
        { error: "Failed to create post." },
        { status: 500 },
      );
    }

    // 2. Fetch the newly created post with all the joins and transformations. This is necessary as it will be needed to update the UI immediately after creation.
    const { data: fullPost, error: fetchError } = await supabase
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
          reaction,
          created_at
        )
      `,
      )
      .eq("id", post.id) // Filter to get only the post we just created
      .single(); // We expect only one result

    if (fetchError || !fullPost) {
      console.error("Error fetching newly created post:", fetchError);
      // You might want to handle this case, e.g., by deleting the orphaned post
      return NextResponse.json(
        { error: "Post created, but failed to fetch its details." },
        { status: 500 },
      );
    }

    // 3. Manually transform the single post object just like in your feed API
    const transformedPost = {
      id: fullPost.id,
      user_id: fullPost.user_id,
      body: fullPost.body,
      is_anonymous: fullPost.is_anonymous,
      created_at: fullPost.created_at,
      author: fullPost.is_anonymous
        ? null
        : {
            id: fullPost.profiles?.id,
            username: fullPost.profiles?.username,
            avatar_url: fullPost.profiles?.avatar_url,
          },
      // A new post will have no reactions
      reaction_counts: { F: 0, Clown: 0, Skull: 0, Relatable: 0 },
      reaction: [], // An empty array for reactions
    };

    // 4. Call reply bot to reply to post

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(transformedPost.id);
    console.log(transformedPost.body);
    fetch(`${baseUrl}/api/post/replybot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: transformedPost.id,
        comment: transformedPost.body,
      }),
    }).catch((err) => {
      // Log the error for debugging, but don't fail the original request.
      console.error("Failed to trigger reply bot:", err);
    });

    // 5. Return the fully formed post object
    return NextResponse.json({ post: transformedPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 },
    );
  }
}
