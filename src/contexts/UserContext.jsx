'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch user + profile
  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      // Get current user session
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) console.error('Error fetching auth user:', userError)

      setUser(authUser)

      if (authUser) {
        // Fetch profile safely
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, avatar_url, username, headline, bio, created_at')
          .eq('id', authUser.id)
          .maybeSingle() // <-- safe if no row exists

        if (error) console.error('Error fetching profile:', error)
        setProfile(profileData || null)
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Update profile in DB + local state
  const updateProfile = async (updatedData) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .maybeSingle()

      if (error) {
        console.error('Error updating profile:', error)
        return false
      }

      setProfile((prev) => ({ ...prev, ...data }))
      return true
    } catch (err) {
      console.error('Unexpected error updating profile:', err)
      return false
    }
  }

  const refreshProfile = () => fetchUserProfile()

  useEffect(() => {
    fetchUserProfile()

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null)
          setProfile(null)
        } else {
          fetchUserProfile()
        }
      },
    )

    return () => listener?.subscription?.unsubscribe()
  }, [])

  const value = { user, profile, isLoading, updateProfile, refreshProfile }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
