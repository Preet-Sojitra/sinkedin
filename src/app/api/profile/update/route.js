import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request) {
  const supabase = await createClient()

  // 1. Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Parse the request body
  const {
    username,
    headline,
    bio,
    biggestL,
    avatar: newAvatarUrl,
  } = await request.json()

  // 3. Validate input data (same as create)
  if (!username || username.length < 3 || username.length > 50) {
    return NextResponse.json(
      { error: "Username must be between 3 and 50 characters" },
      { status: 400 }
    )
  }
  if (biggestL && biggestL.length > 500) {
    return NextResponse.json(
      { error: "Biggest L must be less than 500 characters" },
      { status: 400 }
    )
  }
  if (headline && headline.length > 100) {
    return NextResponse.json(
      { error: "Headline must be less than 100 characters" },
      { status: 400 }
    )
  }
  if (bio && bio.length > 200) {
    return NextResponse.json(
      { error: "Bio must be less than 200 characters" },
      { status: 400 }
    )
  }

  // 4. Handle avatar deletion if a new one is uploaded
  // Get the current profile to find the old avatar URL
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single()

  if (fetchError) {
    console.error("Error fetching old profile:", fetchError)
    // Non-critical error, so we can continue
  }

  const oldAvatarUrl = currentProfile?.avatar_url

  // If an old avatar exists and it's different from the new one, delete it
  if (oldAvatarUrl && oldAvatarUrl !== newAvatarUrl) {
    try {
      // The path is the part of the URL *after* the bucket name.
      // Example URL: https://<project>.supabase.co/storage/v1/object/public/avatars/user-id/image.png
      // We need to extract: 'user-id/image.png'
      const oldAvatarPath = oldAvatarUrl.split("/avatars/").pop()

      if (oldAvatarPath) {
        console.log("Attempting to delete old avatar at path:", oldAvatarPath)
        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([oldAvatarPath])

        if (removeError) {
          // Log the error but don't block the profile update from proceeding.
          // This can happen if the file was already deleted or permissions are wrong.
          console.error(
            "Failed to delete old avatar from storage:",
            removeError.message
          )
        } else {
          console.log("Successfully deleted old avatar.")
        }
      }
    } catch (e) {
      console.error(
        "Error parsing old avatar URL or during deletion process:",
        e
      )
    }
  }

  // 5. Update the profile in the database
  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      username,
      headline,
      bio,
      biggest_l: biggestL,
      // Only update avatar_url if a new one was provided
      ...(newAvatarUrl && { avatar_url: newAvatarUrl }),
    })
    .eq("id", user.id)
    .select()
    .single()

  if (updateError) {
    console.error("Supabase update error:", updateError)
    // Check for unique constraint violation on username
    // if (updateError.code === "23505") {
    //   return NextResponse.json(
    //     { error: "Username is already taken." },
    //     { status: 409 }
    //   )
    // }
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json(
    { message: "Profile updated successfully", profile: updatedProfile },
    { status: 200 }
  )
}
