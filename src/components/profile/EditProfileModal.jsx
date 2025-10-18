"use client"

import { useState } from "react"
import { Camera, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/contexts/UserContext"
import axios from "axios"

export default function EditProfileModal({
  initialProfile,
  onClose,
  onProfileUpdate,
}) {
  const { refreshProfile } = useUser()
  const [username, setUsername] = useState(initialProfile.username)
  const [headline, setHeadline] = useState(initialProfile.headline || "")
  const [bio, setBio] = useState(initialProfile.bio || "")
  const [avatarPreview, setAvatarPreview] = useState(initialProfile.avatar_url)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        setErrorMessage("Please upload a valid image under 5MB")
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setErrorMessage("Authentication error. Please log in again.")
      setLoading(false)
      return
    }

    let avatarUrl = initialProfile.avatar_url

    // If a new avatar file was selected, upload it first
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile)

      if (uploadError) {
        setErrorMessage("Failed to upload new avatar.")
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path)
      avatarUrl = urlData.publicUrl
    }

    try {
      const response = await axios.post("/api/profile/update", {
        username,
        headline,
        bio,
        avatar: avatarUrl, // This could be the new URL or the original one
      })

      if (response.status === 200) {
        refreshProfile() // Update the global user context
        onProfileUpdate() // This will trigger a refresh on the parent page
        onClose() // Close the modal
      }
    } catch (error) {
      const apiError =
        error.response?.data?.error || "An unexpected error occurred."
      setErrorMessage(apiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-dark-secondary rounded-lg border border-dark-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-dark-border">
          <h2 className="text-xl font-bold text-light">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-light-secondary hover:text-light"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden border-dark-border">
                <Image
                  src={avatarPreview || "/default_avatar.jpg"}
                  alt="Avatar Preview"
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity bg-accent border-dark-border">
                <Camera className="w-4 h-4 text-light" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {errorMessage && (
            <p className="mb-4 text-sm text-red-500 text-center">
              {errorMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            {/* Inputs are similar to your create profile page */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-light">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors bg-dark border-dark-border text-light"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-light">
                Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors bg-dark border-dark-border text-light"
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-light">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none bg-dark border-dark-border text-light"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg font-semibold border border-dark-border text-light-secondary hover:border-light transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg font-semibold bg-accent text-light hover:opacity-90 transition-opacity"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
