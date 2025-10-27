'use client'

import Header from '@/components/Header'
import ComposePost from '@/components/feed/ComposePost'
import PostCard from '@/components/feed/PostCard'
import PostCardSkeleton from '@/components/feed/PostCardSkeleton'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { FetchRealtimePost } from '@/lib/supabase/realtime'

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

  const observer = useRef()
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

  // Effect for fetching posts when page number changes
  useEffect(() => {
    // Prevent fetching if there are no more posts
    if (!hasMore) return

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
        setPosts((prevPosts) => [...prevPosts, ...newPosts])
      }
      setHasMore(newHasMore)

      if (page === 1) {
        setIsLoading(false)
      } else {
        setIsFetchingMore(false)
      }
    }

    loadPosts()
  }, [page]) // This effect runs whenever 'page' changes

  const scrollOnPostCreate = () => {
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
      <FetchRealtimePost setPosts={setPosts} />
      <main className="max-w-[800px] mx-auto my-6 px-5 md:my-8 md:px-6 flex flex-col gap-6">
        <ComposePost onPostCreated={scrollOnPostCreate} />

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
