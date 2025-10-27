import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
  try {
    const supabase = await createClient()
    const { commentId, currentUserId } = await request.json()
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment Id is required.' },
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
        { error: 'You must be logged in to delete a comment.' },
        { status: 403 },
      )
    }

    if (userId !== currentUserId) {
      return NextResponse.json(
        { error: 'Only author of the comment can delete it' },
        { status: 403 },
      )
    }

    // Deleting a specific comment
    const { error: deleteCommentError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (deleteCommentError) {
      console.error('Error deleting the comment:', deleteCommentError)
      return NextResponse.json(
        { error: 'Failed to delete comment.' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully.' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Unexpected error occurred while deleting comment: ', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
