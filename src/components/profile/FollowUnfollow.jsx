'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function FollowUnfollowButton({
  currentUserId,
  profileUserId,
  initialIsFollowing,
  initialFollowerCount,
  initialFollowingCount,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followerCount, setFollowerCount] = useState(initialFollowerCount)
  const [loading, setLoading] = useState(true)

  // Effect to set initial state
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
    setFollowerCount(initialFollowerCount)
    setLoading(false) // Initial loading is done once we have props
  }, [initialIsFollowing, initialFollowerCount])

  const handleFollowToggle = async () => {
    if (!currentUserId || !profileUserId) return

    setLoading(true)
    try {
      if (isFollowing) {
        // Unfollow logic
        const response = await axios.delete('/api/profile/unfollow', {
          data: { profileId: profileUserId },
        })

        if (response.status === 200) {
          setIsFollowing(false)
          setFollowerCount((prevCount) => prevCount - 1) // Decrement count optimistically
        } else {
          console.error('Failed to unfollow')
        }
      } else {
        // Follow logic
        const response = await axios.post('/api/profile/follow', {
          profileId: profileUserId,
        })

        if (response.status === 200) {
          setIsFollowing(true)
          setFollowerCount((prevCount) => prevCount + 1) // Increment count optimistically
        } else {
          console.error('Failed to follow')
          // Handle error
        }
      }
    } catch (error) {
      console.error('Error during follow/unfollow:', error)
      // Handle network errors or other exceptions
    } finally {
      setLoading(false)
    }
  }

  if (!currentUserId) {
    return null // Don't show follow button if it's the same user or no user logged in
  }

  return (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <span className="text-light font-semibold">{followerCount}</span>
          <span className="text-light-secondary ml-1">Hecklers</span>
        </div>
        <div>
          <span className="text-light font-semibold">
            {initialFollowingCount}
          </span>
          <span className="text-light-secondary ml-1">Heckling</span>
        </div>
      </div>

      {/* If same user do not show button */}
      {currentUserId !== profileUserId && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`px-4 py-2 rounded font-bold focus:outline-none focus:ring-2 focus:ring-opacity-75
          ${
            isFollowing
              ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              : 'bg-accent text-light hover:bg-accent-hover'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  )
}
