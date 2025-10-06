'use client'

import Header from '@/components/Header'
import ComposePost from '@/components/feed/ComposePost'
import PostCard from '@/components/feed/PostCard'
import PostCardSkeleton from '@/components/feed/PostCardSkeleton'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

const FEED_CACHE_KEY = 'sinkedin_feed_cache'
const SCROLL_POSITION_KEY = 'sinkedin_scroll_position'

const fetchPosts = async (page) => {
  try {
    const response = await axios.get(`/api/post/all?page=${page}`)
    return response.data || { posts: [], hasMore: false }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], hasMore: false }
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isRestoringFromCache, setIsRestoringFromCache] = useState(true)

  const observer = useRef()
  const hasRestoredScroll = useRef(false)

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Reached the end of the list, load more
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, isFetchingMore, hasMore],
  )

  // Effect for fetching the current user
  useEffect(() => {
    const supabase = createClient()
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

  // Effect to restore feed state from cache on mount
  useEffect(() => {
    try {
      const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
      if (cachedData) {
        const {
          posts: cachedPosts,
          page: cachedPage,
          hasMore: cachedHasMore,
        } = JSON.parse(cachedData)
        setPosts(cachedPosts)
        setPage(cachedPage)
        setHasMore(cachedHasMore)
        setIsLoading(false)
        setIsRestoringFromCache(false)
      } else {
        setIsRestoringFromCache(false)
      }
    } catch (error) {
      console.error('Error restoring feed cache:', error)
      setIsRestoringFromCache(false)
    }
  }, [])

  // Effect to restore scroll position after posts are rendered
  useEffect(() => {
    if (!isLoading && posts.length > 0 && !hasRestoredScroll.current) {
      try {
        const savedScrollPosition = sessionStorage.getItem(SCROLL_POSITION_KEY)
        if (savedScrollPosition) {
          // Use setTimeout with requestAnimationFrame to ensure DOM is fully ready
          // This handles both direct navigation and browser back button
          setTimeout(() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, parseInt(savedScrollPosition, 10))
              hasRestoredScroll.current = true
            })
          }, 100)
        }
      } catch (error) {
        console.error('Error restoring scroll position:', error)
      }
    }
  }, [isLoading, posts])

  // Override Next.js scroll restoration on mount
  useEffect(() => {
    // Prevent Next.js from scrolling to top on navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    return () => {
      // Restore default behavior on unmount
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  // Effect to save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString())
      } catch (error) {
        console.error('Error saving scroll position:', error)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect to save feed state when it changes
  useEffect(() => {
    if (posts.length > 0) {
      try {
        const cacheData = {
          posts,
          page,
          hasMore,
          timestamp: Date.now(),
        }
        sessionStorage.setItem(FEED_CACHE_KEY, JSON.stringify(cacheData))
      } catch (error) {
        console.error('Error saving feed cache:', error)
      }
    }
  }, [posts, page, hasMore])

  // Effect for fetching posts when page number changes
  useEffect(() => {
    // Skip fetching if we're restoring from cache
    if (isRestoringFromCache) return

    // Skip if we already have cached posts for page 1
    if (page === 1 && posts.length > 0) return

    // Prevent fetching if there are no more posts
    if (!hasMore && page > 1) return

    const loadPosts = async () => {
      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsFetchingMore(true)
      }

      const { posts: newPosts = [], hasMore: newHasMore = false } =
        (await fetchPosts(page)) || {}

      // Only update if we actually got new posts
      if (newPosts.length > 0) {
        setPosts((prevPosts) => {
          // Prevent duplicates
          const existingIds = new Set(prevPosts.map((p) => p.id))
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id))
          return [...prevPosts, ...uniqueNewPosts]
        })
      }
      setHasMore(newHasMore)

      if (page === 1) {
        setIsLoading(false)
      } else {
        setIsFetchingMore(false)
      }
    }

    loadPosts()
  }, [page, isRestoringFromCache]) // This effect runs whenever 'page' changes

  const handlePostCreated = (newPost) => {
    // This function will be called when a new post is created
    // You can update the posts state here to include the new post
    setPosts((prevPosts) => [newPost, ...prevPosts])

    // Clear cache when new post is created to show it at the top
    try {
      sessionStorage.removeItem(FEED_CACHE_KEY)
      sessionStorage.removeItem(SCROLL_POSITION_KEY)
      hasRestoredScroll.current = false
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto my-6 px-5 md:my-8 md:px-6 flex flex-col gap-6">
        <ComposePost onPostCreated={handlePostCreated} />

        {/* Use the isLoading state to conditionally render skeletons or posts */}
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {/* Render 3 skeletons for a nice loading effect */}
            {[...Array(3)].map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post, index) => {
              // --- NEW: Attach ref to the last element ---
              if (posts.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={post.id}>
                    <PostCard
                      post={post}
                      currentUserId={currentUser?.id}
                      currentUserAvatar={currentUser?.avatar_url}
                    />
                  </div>
                )
              } else {
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUser?.id}
                    currentUserAvatar={currentUser?.avatar_url}
                  />
                )
              }
            })}
          </div>
        )}

        {isFetchingMore && (
          <div className="flex flex-col gap-6 mt-4">
            <PostCardSkeleton />
          </div>
        )}

        {/* --- NEW: Message when all posts are loaded --- */}
        {!hasMore && !isLoading && (
          <p className="text-center text-gray-500 mt-4">
            You've reached the end!
          </p>
        )}
      </main>
    </>
  )
}
