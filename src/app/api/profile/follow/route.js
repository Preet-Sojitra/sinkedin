import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const supabase = await createClient()

  const { profileId } = await request.json()
  if (!profileId) {
    return NextResponse.json(
      { error: 'Profile ID is required' },
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
      { error: 'You must be logged in to comment.' },
      { status: 403 },
    )
  }

  try {
    const { data, error } = await supabase
      .from('relationships')
      .insert([{ follower_id: userId, following_id: profileId }])

    if (error) {
      throw error
    }

    return NextResponse.json(
      { message: 'Successfully followed profile', data },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error following profile:', error)
    return NextResponse.json(
      { error: 'Failed to follow profile' },
      { status: 500 },
    )
  }
}
