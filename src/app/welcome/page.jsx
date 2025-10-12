'use client'

import { useState, useEffect } from 'react'
import { Camera, RefreshCw, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import axios from 'axios'

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [headline, setHeadline] = useState(null)
  const [bio, setBio] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Generate random usernames for fun
  const randomUsernamesBase = [
    'EpicFailAlchemist',
    'ChiefMishapOfficer',
    'GrandMasterOfGoofs',
    'RejectRonin',
    'InterviewPhantom',
    'CareerComedian',
    'ChaosCoordinator',
    'MisfortuneMaven',
    'SetbackSamurai',
    'BlunderBaron',
    'ReplyAllRegret',
    'CtrlAltDefeated',
    'DeadlineDemon',
    'ZoomMuteVictim',
    'CoffeeSpillPro',
    'ImposterSyndromeIncarnate',
    'BurntOutBard',
    'JustAnotherLayoff',
    'The404Employee',
    'VoidStaringChampion',
    'AbyssLooker',
    'SirFailsALot',
    'MissTakesAllowed',
    'CubicleCthulhu',
    'HRsNightmareFuel',
    'EndOfQuarterEntity',
    'TheGhostOfInterviewsPast',
    'ResumeBlackHole',
    'LinkedInLiarRehab',
    'HopeCrusher',
    'TheOptimismExtinguisher',
  ]

  const generateRandomUsername = () => {
    const baseName =
      randomUsernamesBase[
        Math.floor(Math.random() * randomUsernamesBase.length)
      ]
    // Generate three numbers to append
    const randomDigits = Math.floor(Math.random() * 1000)
    const randomName = `${baseName}${randomDigits.toString().padStart(3, '0')}`
    setUsername(randomName)
  }

  useEffect(() => {
    // Generate a random username when the component mounts
    generateRandomUsername()
  }, [])

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)

      // Create a preview of the uploaded image
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!username) {
      setShowError(true)
      setErrorMessage('Username is required')
      return
    }
    if (username.length < 3 || username.length > 50) {
      setShowError(true)
      setErrorMessage('Username must be between 3 and 50 characters')
      return
    }
    if (headline && headline.length > 100) {
      setShowError(true)
      setErrorMessage('Headline must be less than 100 characters')
      return
    }
    if (bio && bio.length > 200) {
      setShowError(true)
      setErrorMessage('Bio must be less than 200 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setShowError(true)
      setErrorMessage('You must be logged in to create a profile')
      setLoading(false)
      router.replace('/auth/login')
      return
    }

    let avatarUrl = null

    if (avatarFile) {
      // Check if the file is an image and under 5MB
      if (
        !avatarFile.type.startsWith('image/') ||
        avatarFile.size > 5 * 1024 * 1024
      ) {
        setShowError(true)
        setErrorMessage('Please upload a valid image under 5MB')
        setLoading(false)
        return
      }
      // Create a unique filename
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile)
      if (uploadError) {
        setShowError(true)
        setErrorMessage('Failed to upload avatar image')
        console.error('Avatar upload error:', uploadError)
        setLoading(false)
        return
      }
      // Get the public URL of the uploaded image
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path)

      if (!data.publicUrl) {
        setShowError(true)
        setErrorMessage('Failed to get avatar URL.')
        setLoading(false)
        return
      }
      avatarUrl = data.publicUrl
    }

    // Send all data to the server
    try {
      const response = await axios.post('/api/profile/create', {
        id: user.id, // Ensure user ID is sent
        username,
        headline,
        bio,
        avatar: avatarUrl,
      })

      if (response.status === 201) {
        // Redirect to the main app or profile page
        router.replace('/feed')
      } else {
        setShowError(true)
        setErrorMessage('Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      setShowError(true)
      setErrorMessage('An error occurred while creating your profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    // Navigate to main app with default values
    // take default username and send request to create profile
    setLoading(true)
    setShowError(false)
    setErrorMessage('')
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      setShowError(true)
      setErrorMessage('You must be logged in to create a profile')
      setLoading(false)
      router.replace('/auth/login')
      return
    }

    try {
      const response = await axios.post('/api/profile/create', {
        id: user.id,
        username: username
          ? username
          : `User${Math.floor(Math.random() * 1000)}`,
        headline: '',
        bio: '',
        avatar: null, // No avatar for skipped setup
      })
      if (response.status === 201) {
        router.replace('/feed') // Assuming this is the main app route
      } else {
        setShowError(true)
        setErrorMessage('Failed to create profile with default values')
      }
    } catch (error) {
      console.error('Error creating default profile:', error)
      setShowError(true)
      setErrorMessage('An error occurred while creating your default profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-dark">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-light">
            Welcome to S<span className="line-through text-accent">in</span>
            kedIn!
          </h1>
          <p className="text-lg text-light-secondary">
            Let's get your professional disaster profile etched into the
            Sinkedin hall of shame.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border p-8 mb-6 bg-dark-secondary border-dark-border">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-4 overflow-hidden border-dark-border">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/default_avatar.jpg" // Assuming the default image is stored in the public folder
                    alt="Default Avatar"
                    width={96}
                    height={96}
                    className="rounded-full object-cover w-full h-full"
                  />
                )}
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
            <p className="text-sm text-light-secondary mt-2">
              Got a pic that screams 'I've made poor life choices'? Share it
              (optional).
            </p>
          </div>

          {/* Error Message */}
          {showError && (
            <div className="mb-4 text-red-500">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Username Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-light">
              Username{' '}
              <span className="text-xs text-light-secondary">(required)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border outline-none transition-colors bg-dark border-dark-border text-light"
                onFocus={(e) =>
                  (e.target.style.borderColor = 'var(--color-accent)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--color-dark-border)')
                }
              />
              <button
                onClick={generateRandomUsername}
                className="px-4 py-3 rounded-lg border hover:opacity-80 transition-opacity bg-dark border-dark-border"
                title="Generate random username"
              >
                <RefreshCw className="w-5 h-5 text-accent" />
              </button>
            </div>
            <p className="text-xs mt-1 text-light-secondary">
              This is how other losers will know you
            </p>
          </div>
          {/* Headline Section Just like linkedin */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-light">
              Headline
            </label>
            <input
              type="text"
              value={headline ? headline : ''}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors bg-dark border-dark-border text-light"
              onFocus={(e) =>
                (e.target.style.borderColor = 'var(--color-accent)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--color-dark-border)')
              }
              placeholder="The TL;DR of Your Downfall"
              maxLength={100}
            />
            <p className="text-xs mt-1 text-light-secondary">
              {headline ? headline.length : 0}/100 characters
            </p>
          </div>
          {/* Bio Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-light">
              Flaunt Your Failures (Bio)
            </label>
            <textarea
              value={bio ? bio : ''}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none bg-dark border-dark-border text-light"
              onFocus={(e) =>
                (e.target.style.borderColor = 'var(--color-accent)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = 'var(--color-dark-border)')
              }
              placeholder="Detail your descent into career chaos. Give us the gory details. What went spectacularly wrong? e.g., 'That time I accidentally set off the fire alarm during a board meeting..."
              maxLength={200}
            />
            <p className="text-xs mt-1 text-light-secondary">
              {bio ? bio.length : 0}/200 characters
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity bg-accent text-primary-foreground"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loader"></span> Creating Profile...
                </span>
              ) : (
                'Create Profile'
              )}
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity border-dark-border text-light-secondary bg-transparent"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loader"></span> Skipping...
                </span>
              ) : (
                'Skip for Now'
              )}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-light-secondary">
            Don't worry, you can change all of this later in your profile
            settings.
            <br />
            Or not. We're not your boss (yet).
          </p>
        </div>
      </div>
    </div>
  )
}
