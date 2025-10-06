'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import axios from 'axios'

// List of positive words to detect
const positiveWords = [
  'great',
  'awesome',
  'amazing',
  'love',
  'happy',
  'wonderful',
  'fantastic',
  'excellent',
  'perfect',
  'best',
  'good',
  'nice',
  'superb',
  'brilliant',
  'delightful',
  'joyful',
  'cheerful',
  'optimistic',
  'positive',
  'success',
  'win',
  'victory',
  'achieve',
  'proud',
]

// Function to count positive words in content
const countPositiveWords = (content) => {
  const lowerContent = content.toLowerCase()
  let count = 0
  positiveWords.forEach((word) => {
    // Use regex to match whole words (case-insensitive)
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = lowerContent.match(regex)
    if (matches) {
      count += matches.length
    }
  })
  return count
}

export default function ComposePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPositiveWarning, setShowPositiveWarning] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()
    // No need to listen to supabase changes here, it's simple enough
  }, [])

  const handleAnonymousChange = (e) => {
    if (!isAuthenticated) {
      setShowError(true)
      setErrorMessage('You must be logged in to post anonymously.')
      e.preventDefault() // Prevent checkbox from changing
      return
    }
    setIsAnonymous(e.target.checked)
  }

  const handlePostClick = async () => {
    if (!isAuthenticated) {
      setShowError(true)
      setErrorMessage('You must be logged in to create a post.')
      return
    }

    if (content.trim() === '') {
      setShowError(true)
      setErrorMessage('Post content cannot be empty.')
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post('/api/post/create', {
        content: content.trim(),
        isAnonymous: isAnonymous,
      })
      // console.log("Post response:", response.data)
      if (response.status === 201) {
        setShowError(false)
        setErrorMessage('')
        setContent('')
        setIsAnonymous(false)

        if (onPostCreated) {
          onPostCreated(response.data.post) // Notify parent component if needed
        }
      } else {
        setShowError(true)
        setErrorMessage('Failed to create post.')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      showError(true)
      setErrorMessage(
        'Failed to create post. ',
        error.message || 'Please try again later.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark-secondary border border-dark-border rounded-lg p-4 md:p-6">
      <textarea
        className="w-full bg-dark border border-dark-border rounded-lg p-4 text-light text-lg resize-y min-h-[100px] placeholder:text-light-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        placeholder={
          isAuthenticated
            ? 'What went wrong today? Share your latest failure...'
            : 'Please log in to share your thoughts...'
        }
        value={content}
        onChange={(e) => {
          const newContent = e.target.value
          setContent(newContent)
          const positiveCount = countPositiveWords(newContent)
          setShowPositiveWarning(positiveCount >= 3)
        }}
        disabled={isLoading}
        rows={3}
      ></textarea>

      {showError && (
        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
      )}
      {showPositiveWarning && (
        <div className="mt-2 text-sm text-yellow-500">
          Warning: Whoa, too much sunshine here! Even unicorns are jealous.
          Share a flop instead!
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label
            className={`flex items-center gap-2 text-sm text-light-secondary ${
              isAuthenticated
                ? 'cursor-pointer hover:text-light'
                : 'cursor-not-allowed text-light-secondary'
            } transition-colors`}
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-dark border-dark-border text-accent focus:ring-accent"
              checked={isAnonymous}
              onChange={handleAnonymousChange}
              disabled={!isAuthenticated}
            />
            Post anonymously
          </label>
        </div>
        <button
          className={`bg-accent text-white border-none px-6 py-[0.4rem] md:py-[0.7rem] rounded-md font-semibold transition-colors duration-200 hover:bg-accent-hover ${
            isAuthenticated
              ? 'cursor-pointer hover:bg-accent-hover'
              : 'cursor-not-allowed bg-light-secondary '
          } disabled:bg-light-secondary`}
          onClick={(e) => {
            if (showPositiveWarning) {
              e.preventDefault()
              return
            }
            handlePostClick()
          }}
          disabled={!isAuthenticated || isLoading}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
