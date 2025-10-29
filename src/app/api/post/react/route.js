import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { emojiName, postId } = await request.json()

    if (!emojiName) {
      return NextResponse.json(
        { error: 'Emoji name is required.' },
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
    // If the user is not authenticated, they cannot react
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'You must be logged in to react.' },
        { status: 403 },
      )
    }

    const { data: existingReaction, error: fetchError } = await supabase
      .from('reactions')
      .select('reaction')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single() // Use .single() to get one record or null

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error for "No rows found", which is not a server error for us.
      console.error('Error fetching existing reaction:', fetchError)
      return NextResponse.json(
        { error: 'Failed to check reaction.' },
        { status: 500 },
      )
    }

    // 2. If the user clicked the same emoji again, delete the reaction
    if (existingReaction && existingReaction.reaction === emojiName) {
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Error deleting reaction:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove reaction.' },
          { status: 500 },
        )
      }
    } else {
      // 3. Otherwise, upsert the new reaction (adds or changes the reaction)
      const { error: upsertError } = await supabase.from('reactions').upsert({
        post_id: postId,
        user_id: userId,
        reaction: emojiName,
      })

      if (upsertError) {
        console.error('Error upserting reaction:', upsertError)
        return NextResponse.json(
          { error: 'Failed to add reaction.' },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      { message: 'Reaction added successfully.' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    )
  }
}
