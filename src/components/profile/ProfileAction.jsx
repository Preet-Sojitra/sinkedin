'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import EditProfileModal from './EditProfileModal'

export default function EditProfileAndLogout({ profile }) {
  const router = useRouter()
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      setIsLoading(false)
      setShowError(true)
      setErrorMessage('Failed to log out. Please try again.')
      console.error('Logout error:', error)
      return
    } else {
      setIsLoading(false)
      setShowError(false)
      setErrorMessage('')
      router.push('/auth/login') // Redirect to login page after logout
      router.refresh() // Refresh the page to ensure state is updated
    }
  }

  const handleProfileUpdate = () => {
    setIsEditModalOpen(false)
    router.refresh() // Refresh the page to show updated profile
  }

  return (
    <>
      <div className="mt-4 flex justify-center sm:justify-start gap-3">
        <button
          className="bg-transparent border border-dark-border text-light-secondary px-4 py-2 rounded-md font-semibold text-sm hover:border-light hover:text-light transition-colors"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Profile
        </button>
        <button
          className="bg-accent text-white border-none px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {showError && (
        <div className="mt-3 text-sm text-red-500">{errorMessage}</div>
      )}

      {isEditModalOpen && (
        <EditProfileModal
          initialProfile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  )
}
