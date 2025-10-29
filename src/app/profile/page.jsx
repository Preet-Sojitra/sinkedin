import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// This function now fetches the real user from Supabase
async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data } = await supabase.auth.getUser()

  // console.log("Current user data:", data)

  if (!data?.user) {
    // If no user is logged in, return null
    // console.log("No user is logged in.")
    return null
  }

  const userId = data.user.id

  return userId
}

export default async function MyProfilePage() {
  const userId = await getCurrentUser()

  if (!userId) {
    // If no user is logged in, redirect to the login page
    // console.log("Redirecting to login page...")
    redirect('/login')
  }

  // If the user is logged in, redirect them to their public profile page
  redirect(`/profile/${userId}`) // Assuming the public profile URL is based on user ID
}
