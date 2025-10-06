'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Skull, Trash2, Bell, User } from 'lucide-react'

// Mock data for demo
const mockPosts = [
  {
    id: 1,
    author: 'FailureKing',
    content:
      'Deployed to production on a Friday. Server crashed. Weekend ruined. Senior dev said "I thought you tested it?"',
    avatar: '🤡',
    reactions: { laugh: 24, skull: 12, fire: 8 },
    timestamp: '2h ago',
  },
  {
    id: 2,
    author: 'CodeCrusher',
    content:
      'Spent 6 hours debugging. The issue? A missing semicolon. I hate myself.',
    avatar: '💀',
    reactions: { laugh: 45, skull: 31, fire: 5 },
    timestamp: '4h ago',
  },
  {
    id: 3,
    author: 'BugMaster3000',
    content:
      'Client asked for "just a small change". 3 days later, rewrote entire codebase.',
    avatar: '😵',
    reactions: { laugh: 67, skull: 23, fire: 15 },
    timestamp: '6h ago',
  },
]

const ReactionButton = ({ emoji, count, onClick, isFirst }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all hover:scale-110 ${
      isFirst ? 'animate-[shake_0.5s_ease-in-out]' : ''
    }`}
    aria-label={`React with ${emoji}`}
  >
    <span className="text-xl">{emoji}</span>
    <span className="text-sm font-bold text-white">{count}</span>
  </button>
)

const PostCard = ({ post, onDelete, currentUser }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reactions, setReactions] = useState(post.reactions)

  const handleReact = (type) => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 shadow-xl relative hover:border-yellow-500/30 transition-all">
      {/* Separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      <div className="flex items-start gap-4">
        {/* Avatar with jagged border */}
        <div className="relative">
          <div
            className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl border-2 border-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.3)]"
            style={{
              clipPath:
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          >
            {post.avatar}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Username and timestamp */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              {post.author}
            </h3>
            <span className="text-xs text-zinc-500">{post.timestamp}</span>
          </div>

          {/* Post content */}
          <p className="text-base text-zinc-100 mb-4 leading-relaxed">
            {post.content}
          </p>

          {/* Reactions */}
          <div className="flex gap-2 flex-wrap">
            <ReactionButton
              emoji="😂"
              count={reactions.laugh}
              onClick={() => handleReact('laugh')}
              isFirst={true}
            />
            <ReactionButton
              emoji="💀"
              count={reactions.skull}
              onClick={() => handleReact('skull')}
            />
            <ReactionButton
              emoji="🔥"
              count={reactions.fire}
              onClick={() => handleReact('fire')}
            />
          </div>
        </div>

        {/* Delete button */}
        {currentUser && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-zinc-500 hover:text-red-500 transition-colors p-2"
            aria-label="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/90 rounded-lg flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="text-center p-6">
            <p className="text-white font-bold mb-4">
              Sure you wanna erase this mess?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  onDelete(post.id)
                  setShowDeleteConfirm(false)
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all hover:shadow-[0_4px_20px_rgba(255,51,51,0.5)]"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-full transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ComposePost = ({ onPost }) => {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const maxChars = 280

  const handlePost = async () => {
    if (content.trim().length < 10) return

    setIsPosting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    onPost({
      id: Date.now(),
      author: isAnonymous ? 'Anonymous' : 'You',
      content: content.trim(),
      avatar: isAnonymous ? '👤' : '🎭',
      reactions: { laugh: 0, skull: 0, fire: 0 },
      timestamp: 'Just now',
    })

    setContent('')
    setIsPosting(false)
  }

  const charsLeft = maxChars - content.length
  const isTooShort = content.trim().length > 0 && content.trim().length < 10

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 shadow-xl">
      <label className="block mb-4">
        <span
          className="text-white font-black text-xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight"
          style={{ fontFamily: 'Arial Black, sans-serif' }}
        >
          What went wrong today? Share your latest failure...
        </span>
      </label>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
        placeholder="Spill it..."
        className="w-full bg-zinc-800 text-white rounded-lg p-4 border-2 border-zinc-700 focus:border-yellow-400 focus:shadow-[0_0_15px_rgba(255,215,0,0.3)] outline-none transition-all resize-none"
        rows={4}
        maxLength={maxChars}
      />

      {/* Character count and warning */}
      <div className="mt-2 flex items-center justify-between">
        <div>
          {isTooShort && (
            <p className="text-red-500 text-sm font-bold">
              C'mon, give us more shit to judge!
            </p>
          )}
        </div>
        <span
          className={`text-sm font-mono ${charsLeft < 50 ? 'text-red-500' : 'text-zinc-500'}`}
        >
          {charsLeft}
        </span>
      </div>

      {/* Preview */}
      {content.trim().length >= 10 && (
        <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">PREVIEW:</p>
          <p className="text-white">{content}</p>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-12 h-6 rounded-full transition-all ${
                isAnonymous ? 'bg-red-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform flex items-center justify-center ${
                  isAnonymous ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isAnonymous && <Skull size={12} className="text-red-600" />}
              </div>
            </div>
          </div>
          <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
            Post anonymously
          </span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={() => setContent('')}
            className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-full transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            disabled={content.trim().length < 10 || isPosting}
            className="px-8 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all hover:shadow-[0_6px_20px_rgba(255,51,51,0.5)] hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isPosting ? <Skull className="animate-spin" size={20} /> : 'POST'}
          </button>
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="bg-zinc-900 rounded-lg p-5 border border-zinc-800 animate-pulse">
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-zinc-800 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-zinc-800 rounded w-1/4 mb-3" />
        <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
      </div>
    </div>
  </div>
)

export default function SinkEdInFeed() {
  const [posts, setPosts] = useState(mockPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  // Dismiss onboarding after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowOnboarding(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Add custom animations via style injection
  useEffect(() => {
    const styleId = 'sinkedin-animations'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-black border-b border-zinc-800 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[800px] mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(255,51,51,0.5)]">
            SINK<span className="text-yellow-400">ED</span>IN
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="text-zinc-400 hover:text-yellow-400 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
            <button
              className="text-zinc-400 hover:text-yellow-400 transition-colors"
              aria-label="Profile"
            >
              <User size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Onboarding tooltip */}
      {showOnboarding && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-900 border-2 border-yellow-400 rounded-lg p-4 shadow-[0_0_20px_rgba(255,215,0,0.3)] max-w-xs animate-[slideIn_0.3s_ease-out]">
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white font-bold hover:bg-red-700 transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
          <p className="text-white font-bold">
            Spill your failures, get roasted or praised—post now!
          </p>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-[800px] mx-auto my-6 px-5 md:my-8 md:px-6 flex flex-col gap-6">
        <ComposePost onPost={handlePostCreated} />

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                currentUser={true}
              />
            ))}
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-zinc-500 font-bold text-lg my-8">
            You've reached the end! 💀
          </p>
        )}
      </main>
    </div>
  )
}
