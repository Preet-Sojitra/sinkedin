"use client"

import Header from "@/components/Header"
import ComposePost from "@/components/feed/ComposePost"
import PostCard from "@/components/feed/PostCard"
import PostCardSkeleton from "@/components/feed/PostCardSkeleton"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import axios from "axios"

const fetchPosts = async () => {
  try {
    const response = await axios.get("/api/post/all")
    // console.log("Fetched posts:", response.data.posts)
    return response.data.posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // --- NEW: Fetch the current user ---
    const supabase = createClient()
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()

    const loadPosts = async () => {
      setIsLoading(true)
      const fetchedPosts = await fetchPosts()
      setPosts(fetchedPosts)
      setIsLoading(false)
    }
    loadPosts()
  }, [])

  const handlePostCreated = (newPost) => {
    // This function will be called when a new post is created
    // You can update the posts state here to include the new post
    setPosts((prevPosts) => [newPost, ...prevPosts])
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
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUser?.id}
                currentUserAvatar={currentUser?.avatatar_url}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
