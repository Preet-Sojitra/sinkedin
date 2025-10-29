// Post request handler for creating a profile
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const supabase = await createClient()
  const { id, username, headline, bio, avatar } = await request.json()

  // Validate required fields
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  // Check length of username, headline, and bio
  if (username.length < 3 || username.length > 50) {
    return NextResponse.json(
      { error: 'Username must be between 3 and 50 characters' },
      { status: 400 },
    )
  }
  if (headline && headline.length > 100) {
    return NextResponse.json(
      { error: 'Headline must be less than 100 characters' },
      { status: 400 },
    )
  }

  if (bio && bio.length > 200) {
    return NextResponse.json(
      { error: 'Bio must be less than 200 characters' },
      { status: 400 },
    )
  }

  // Insert profile into the database
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: id, // Assuming id is provided and is unique
        username: username,
        headline: headline,
        bio: bio,
        avatar_url: avatar || null,
      },
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { message: 'Profile created successfully', profile: data[0] },
    { status: 201 },
  )
}
