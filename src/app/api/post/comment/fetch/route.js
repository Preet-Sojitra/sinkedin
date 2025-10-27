import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || '3', 10)

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('comments')
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
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching more comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments.' },
        { status: 500 },
      )
    }

    const formattedComments = data
      .map((comment) => ({
        id: comment.id,
        body: comment.body,
        created_at: comment.created_at,
        author: {
          id: comment.profiles.id,
          username: comment.profiles.username,
          avatar_url: comment.profiles.avatar_url,
        },
      }))
      .reverse() // Reverse to keep chronological order on the client

    return NextResponse.json({ comments: formattedComments }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error fetching comments:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
