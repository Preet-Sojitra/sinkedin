'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserProfile = async () => {
    const supabase = createClient()

    // Get the current user session
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    setUser(authUser)

    if (authUser) {
      // Fetch their profile from the 'profiles' table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('avatar_url, username, headline, bio, created_at, id')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else {
        setProfile(profileData)
      }
    } else {
      setProfile(null)
    }

    setIsLoading(false)
  }

  const updateProfile = async (updatedData) => {
    if (!user) return

    const supabase = createClient()
    
    // Update the profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return false
    }

    // Update the local state with the new data
    setProfile(prev => ({ ...prev, ...data }))
    return true
  }

  const refreshProfile = () => {
    fetchUserProfile()
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const value = {
    user,
    profile,
    isLoading,
    updateProfile,
    refreshProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}