import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
  try {
    const supabase = await createClient()
    const { postId, currentUserId } = await request.json()
    if (!postId) {
      return NextResponse.json(
        { error: 'Post Id is required.' },
        { status: 400 },
      )
    }
    const { data: session, error: sessionError } = await supabase.auth.getUser()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Failed to retrieve session.' },
        { status: 500 },
      )
    }

    const userId = session?.user?.id || null
    const isAuthenticated = !!userId

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a post.' },
        { status: 403 },
      )
    }

    if (userId !== currentUserId) {
      return NextResponse.json(
        { error: 'Only author of the post can delete it' },
        { status: 403 },
      )
    }

    // Deleting the post
    const { error: deletePostError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deletePostError) {
      console.error('Error deleting the post:', deletePostError)
      return NextResponse.json(
        { error: 'Failed to delete post.' },
        { status: 500 },
      )
    }

    // Deleting the comments made on the post
    const { error: deleteCommentsError } = await supabase
      .from('comments')
      .delete()
      .eq('post_id', postId)

    if (deleteCommentsError) {
      console.error(
        'Error deleting the comments on the post:',
        deleteCommentsError,
      )
      return NextResponse.json(
        { error: 'Failed to comments on the post.' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: 'Post deleted successfully.' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Unexpected error occurred while deleting the post: ', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
