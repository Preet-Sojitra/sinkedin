'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import axios from 'axios'

export default function ComposePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
          onPostCreated() // Notify parent component if needed
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
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        rows={3}
      ></textarea>

      {showError && (
        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
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
          onClick={handlePostClick}
          disabled={!isAuthenticated || isLoading}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
