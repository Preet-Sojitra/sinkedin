import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { postId, comment, isReplyBot } = await request.json();
    console.log(comment, isReplyBot);

    // Validate input
    if (!postId || !comment || comment.trim() === "") {
      return NextResponse.json(
        { error: "Comment content or Post Id cannot be empty." },
        { status: 400 },
      );
    }

    let supabase;
    let userId;

    if (isReplyBot) {
      // Use service role key for bot comments (bypasses RLS)
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      );
      userId = process.env.SYSTEM_USER_ID;
    } else {
      // Use regular client for user comments
      supabase = await createClient();

      const { data: session, error: sessionError } =
        await supabase.auth.getUser();
      if (sessionError) {
        console.error("Session error:", sessionError);
        return NextResponse.json(
          { error: "Failed to retrieve session." },
          { status: 500 },
        );
      }
      userId = session?.user?.id || null;
      const isAuthenticated = !!userId;
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: "You must be logged in to comment." },
          { status: 403 },
        );
      }
    }

    // Insert comment into the database
    const { data: newComment, error: commentError } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        body: comment.trim(),
      })
      .select(
        `
        id,
        body,
        created_at,
        profiles!comments_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `,
      )
      .single();

    if (commentError || !newComment) {
      console.error("Comment insertion error:", commentError);
      return NextResponse.json(
        { error: "Failed to create comment." },
        { status: 500 },
      );
    }

    const formattedComment = {
      id: newComment.id,
      body: newComment.body,
      created_at: newComment.created_at,
      author: {
        id: newComment.profiles.id,
        username: newComment.profiles.username,
        avatar_url: newComment.profiles.avatar_url,
      },
    };

    // Return the newly created comment
    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to create comment." },
      { status: 500 },
    );
  }
}
