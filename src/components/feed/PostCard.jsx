'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Share2, Trash2 } from 'lucide-react'

// --- Main PostCard Component ---
export default function PostCard({
  post,
  currentUserId,
  currentUserAvatar,
  setPosts,
}) {
  const {
    id,
    author,
    created_at,
    body,
    is_anonymous,
    reaction_counts,
    reaction,
    comments: initialComments,
  } = post

  const FEED_CACHE_KEY = 'sinkedin_feed_cache'
  const supabase = createClient()

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsUserAuthenticated(!!session)
    }

    checkAuth()
    // No need to listen to supabase changes here, it's simple enough
  }, [])

  // State for managing comments
  const [comments, setComments] = useState(initialComments || [])

  const [reactedEmoji, setReactedEmoji] = useState(null)
  const [counts, setCounts] = useState(reaction_counts)
  const [isPostDeleting, setIsPostDeleting] = useState(false)

  const [copyStatus, setCopyStatus] = useState('Copy link')

  const reactionToEmojiMap = {
    Laugh: '😆',
    Clown: '🤡',
    Skull: '💀',
    Relatable: '🤝',
  }

  const findUserReaction = () => {
    if (!currentUserId || !reaction) return null
    const userReaction = reaction.find((r) => r.user_id === currentUserId)
    return userReaction ? userReaction.reaction : null
  }

  useEffect(() => {
    setReactedEmoji(findUserReaction())
    setCounts(reaction_counts)
    setComments(initialComments || [])
  }, [currentUserId, post])

  const handleReactionClick = async (emojiName) => {
    if (!currentUserId) return

    const originalReactedEmoji = reactedEmoji
    const originalCounts = { ...counts }
    const newReactedEmoji =
      originalReactedEmoji === emojiName ? null : emojiName
    const newCounts = { ...counts }

    if (originalReactedEmoji === emojiName) {
      newCounts[emojiName]--
    } else if (originalReactedEmoji) {
      newCounts[originalReactedEmoji]--
      newCounts[emojiName]++
    } else {
      newCounts[emojiName]++
    }

    setReactedEmoji(newReactedEmoji)
    setCounts(newCounts)

    try {
      const response = await axios.post('/api/post/react', {
        emojiName,
        postId: id,
      })
      if (response.status !== 201) {
        setReactedEmoji(originalReactedEmoji)
        setCounts(originalCounts)
      }
    } catch (error) {
      setReactedEmoji(originalReactedEmoji)
      setCounts(originalCounts)
      console.error('Error reacting to post:', error)
    }
  }

  // --- New function to handle optimistic UI update for new comments ---
  const handleCommentPosted = (newComment) => {
    // Add the new comment to the top of the list
    setComments((prevComments) => [newComment, ...prevComments])
  }

  const handleShareClick = () => {
    // Construct the full URL for the post
    const postUrl = `${window.location.origin}/post/${id}`

    // Use the modern navigator.clipboard API to copy the text
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        // Provide feedback to the user
        setCopyStatus('Copied!')
        // Reset the text after 2 seconds
        setTimeout(() => {
          setCopyStatus('Copy link')
        }, 2000)
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
        setCopyStatus('Failed to copy')
      })
  }

  const handlePostDelete = async () => {
    setIsPostDeleting(true)
    try {
      if (author?.id !== currentUserId) return
      const deleteResponse = await axios.delete('/api/post/delete', {
        data: {
          postId: id,
        },
      })
      if (deleteResponse.status === 200) {
        try {
          const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
          if (cachedData) {
            const parsedCacheData = JSON.parse(cachedData)
            const filteredPosts = parsedCacheData.posts.filter(
              (eachPost) => eachPost.id !== id,
            )
            const updateCacheData = {
              ...parsedCacheData,
              posts: filteredPosts,
            }
            sessionStorage.setItem(
              FEED_CACHE_KEY,
              JSON.stringify(updateCacheData),
            )
            setPosts(filteredPosts)
          }
        } catch (error) {
          console.error(
            'Error occured while clearing deleted posts from session storage: ',
            error,
          )
        }
      }
    } catch (error) {
      console.error('Error while deleting the post: ', error)
    } finally {
      setIsPostDeleting(false)
    }
  }

  const username = author?.username || 'AnonymousPanda'
  const avatar_url = author?.avatar_url || '/default_avatar.jpg'

  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true })

  const reactionToGifMap = {
    Laugh: '/laugh.gif',
    Clown: '/clown.gif',
    Skull: '/skull.gif',
    Relatable: '/relatable.gif',
  }

  // ReactionEmojiButton: shows emoji normally, GIF on hover or on click (for touch)
  function ReactionEmojiButton({
    emojiName,
    emojiChar,
    gifUrl,
    count,
    selected,
    onClick,
  }) {
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    const clickTimerRef = useRef(null)

    useEffect(() => {
      return () => {
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      }
    }, [])

    const handleMouseEnter = () => setHovered(true)
    const handleMouseLeave = () => setHovered(false)

    const handlePress = (e) => {
      // keep original onClick behavior (which will call your API)
      onClick && onClick(e)

      // show animation briefly after click — good for mobile
      setClicked(true)
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => {
        setClicked(false)
      }, 1500) // show gif for 1.5s after click
    }

    const showGif = hovered || clicked

    return (
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handlePress}
        aria-pressed={selected}
        title={emojiName}
        className={`flex items-center gap-2 text-light-secondary text-sm duration-200 ${
          selected ? 'bg-white/10 text-light p-1 rounded-md' : ''
        }`}
        // keep appearance identical to previous buttons
      >
        <span className="flex items-center justify-center w-[1.375rem] h-[1.375rem]">
          {showGif && gifUrl ? (
            // plain <img> — avoid next/image for external GIFs
            <img
              src={gifUrl}
              alt={`${emojiName} animation`}
              className="w-[1.5rem] h-[1.5rem] object-contain pointer-events-none"
              draggable={false}
            />
          ) : (
            <span className="text-xl select-none">{emojiChar}</span>
          )}
        </span>
        <span className="font-medium">{count}</span>
      </button>
    )
  }

  return (
    <article className="bg-dark-secondary border border-dark-border rounded-lg px-5 py-6 md:p-6">
      {/* Post Header: Avatar and Author Info */}
      <div className="flex items-start justify-between">
        <div className="flex flex-row gap-4">
          <Link
            href={is_anonymous ? '#' : `/profile/${author.id}`}
            className="flex-shrink-0"
          >
            <div className="w-10 h-10 bg-dark-border rounded-full overflow-hidden">
              <Image
                src={is_anonymous ? '/anon_panda.jpg' : avatar_url}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div className="">
            <div className="flex-1">
              <Link
                href={is_anonymous ? '#' : `/profile/${author?.id}`}
                className="font-semibold text-light hover:underline"
              >
                {is_anonymous ? 'Anonymous Panda' : username}
              </Link>
              <div className="text-light-secondary text-xs">{timeAgo}</div>
            </div>

            {/* Post Body: Content */}
            <div className="hidden md:block mt-4 text-base text-light whitespace-pre-wrap">
              {body}
            </div>
          </div>
        </div>
        <div>
          {author?.id === currentUserId ? (
            !isPostDeleting ? (
              <Trash2
                className="size-5 text-accent cursor-pointer"
                onClick={handlePostDelete}
              />
            ) : (
              <svg
                className="size-5 animate-spin text-accent"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M2 12a10 10 0 0110-10v5a5 5 0 00-5 5H2z"
                ></path>
              </svg>
            )
          ) : (
            ''
          )}
        </div>
      </div>

      {/* Post Body: Content */}
      <div className="md:hidden ml-3 mt-4 text-base text-light whitespace-pre-wrap">
        {body}
      </div>

      <div>
        <div className="flex gap-4 pt-5 pl-3 flex-wrap">
          {Object.entries(counts).map(([emojiName, count]) => {
            const emoji = reactionToEmojiMap[emojiName] || emojiName
            const gif = reactionToGifMap[emojiName]
            const hasReacted = reactedEmoji === emojiName
            return (
              <ReactionEmojiButton
                key={emojiName}
                emojiName={emojiName}
                emojiChar={emoji}
                gifUrl={gif}
                count={count}
                selected={hasReacted}
                onClick={() => handleReactionClick(emojiName)}
              />
            )
          })}

          <div className="flex-grow" />
          {/* This pushes the share button to the right */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 text-light-secondary text-sm hover:text-light transition-colors duration-200 group"
            title="Share post"
          >
            <Share2 className="w-4 h-4" />
            {/* Show a helpful tooltip on hover */}
            <span className="hidden group-hover:block transition-opacity text-xs">
              {copyStatus}
            </span>
          </button>
        </div>

        <CommentSection
          postId={id}
          initialComments={comments}
          currentUserAvatar={currentUserAvatar}
          isUserAuthenticated={isUserAuthenticated}
          currentUserId={currentUserId}
        />
      </div>
    </article>
  )
}

// --- Helper Component: Manages the list of comments and expand/collapse logic ---
function CommentSection({
  postId,
  initialComments,
  currentUserAvatar,
  isUserAuthenticated = false, // Default to false if not provided
  currentUserId,
}) {
  const [comments, setComments] = useState(initialComments)
  const [isLoading, setIsLoading] = useState(false)
  const [moreCommentsAvailable, setMoreCommentsAvailable] = useState(true)
  const FEED_CACHE_KEY = 'sinkedin_feed_cache'

  // Update local state if the initial comments from props change
  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  const COMMENTS_TO_LOAD_AT_ONCE = 3

  const handleLoadMore = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/post/comment/fetch', {
        params: {
          postId,
          offset: comments.length,
          limit: COMMENTS_TO_LOAD_AT_ONCE,
        },
      })

      if (response.data.comments.length < COMMENTS_TO_LOAD_AT_ONCE) {
        setMoreCommentsAvailable(false) // No more comments to load
      }
      if (response.data.comments.length === 0) {
        setMoreCommentsAvailable(false) // No more comments to load
        return
      }

      if (response.status === 200) {
        try {
          const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
          if (cachedData) {
            let updatedComments
            const parsedCacheData = JSON.parse(cachedData)
            const updatedPosts = parsedCacheData.posts.map((post) => {
              if (post.id === postId) {
                const existingComments = Array.isArray(post.comments)
                  ? post.comments
                  : []
                updatedComments = [
                  ...existingComments,
                  ...response.data.comments,
                ]
                return {
                  ...post,
                  comments: updatedComments,
                }
              }
              return post
            })
            const updateCacheData = {
              ...parsedCacheData,
              posts: updatedPosts,
            }
            sessionStorage.setItem(
              FEED_CACHE_KEY,
              JSON.stringify(updateCacheData),
            )
            setComments(updatedComments ? updatedComments : [])
          }
        } catch (error) {
          console.error(
            'Error occured while clearing adding comments to session storage: ',
            error,
          )
        }
      }
    } catch (error) {
      console.error('Failed to load more comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-dark-border">
        <AddComment
          currentUserAvatar={currentUserAvatar}
          postId={postId}
          isUserAuthenticated={isUserAuthenticated} // Pass authentication status
          setComments={setComments}
        />
      </div>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-dark-border flex flex-col gap-4">
      <AddComment
        currentUserAvatar={currentUserAvatar}
        postId={postId}
        isUserAuthenticated={isUserAuthenticated} // Pass authentication status
        setComments={setComments}
      />

      {/* Reverse the comments array for display to show newest first */}
      {comments
        .slice()
        .reverse()
        .map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            postId={postId}
            setComments={setComments}
          />
        ))}

      {/* Logic for showing "Load More" button */}
      <div className="flex gap-4">
        {moreCommentsAvailable && comments.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading || !moreCommentsAvailable}
            className="text-sm text-light-secondary hover:text-light transition-colors self-start disabled:cursor-wait"
          >
            {isLoading ? 'Loading...' : 'Load more comments'}
          </button>
        )}
      </div>
    </div>
  )
}

// --- Helper Component: A single comment ---
function Comment({ comment, currentUserId, postId, setComments }) {
  const FEED_CACHE_KEY = 'sinkedin_feed_cache'

  const { author, avatar_url, body, created_at, id: commentId } = comment
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true })
  const [isCommentDeleting, setIsCommentDeleting] = useState(false)

  const handleCommentDelete = async () => {
    setIsCommentDeleting(true)
    try {
      if (author?.id !== currentUserId) return
      const deleteCommentResponse = await axios.delete(
        '/api/post/comment/delete',
        {
          data: {
            commentId: commentId,
          },
        },
      )
      if (deleteCommentResponse.status === 200) {
        try {
          const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
          if (cachedData) {
            let updatedComments
            const parsedCacheData = JSON.parse(cachedData)
            const updatedPosts = parsedCacheData.posts.map((post) => {
              if (post.id === postId) {
                updatedComments = post.comments.filter(
                  (comment) => comment.id !== commentId,
                )
                return {
                  ...post,
                  comments: updatedComments,
                }
              }
              return post
            })
            const updateCacheData = {
              ...parsedCacheData,
              posts: updatedPosts,
            }
            sessionStorage.setItem(
              FEED_CACHE_KEY,
              JSON.stringify(updateCacheData),
            )
            setComments(updatedComments ? updatedComments : [])
          }
        } catch (error) {
          console.error(
            'Error occured while clearing deleted comments from session storage: ',
            error,
          )
        }
      }
    } catch (error) {
      console.error('Error occured while deleting a comment: ', error)
    } finally {
      setIsCommentDeleting(false)
    }
  }
  return (
    <div className="flex items-start gap-3">
      <Link href={`/profile/${author.id}`} className="flex-shrink-0 mt-1">
        <Image
          src={avatar_url || '/default_avatar.jpg'}
          alt={`${author.username}'s avatar`}
          width={32}
          height={32}
          className="rounded-full object-cover w-10 h-10"
        />
      </Link>
      <div className="flex-1 bg-dark px-3 py-2 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <Link
              href={`/profile/${author.id}`}
              className="font-semibold text-light text-sm hover:underline"
            >
              {author.username}
            </Link>
            <span className="text-light-secondary text-xs">{timeAgo}</span>
          </div>
          <div>
            {author?.id === currentUserId ? (
              !isCommentDeleting ? (
                <Trash2
                  className="size-4 text-accent cursor-pointer"
                  onClick={handleCommentDelete}
                />
              ) : (
                <svg
                  className="size-4 animate-spin text-accent"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M2 12a10 10 0 0110-10v5a5 5 0 00-5 5H2z"
                  ></path>
                </svg>
              )
            ) : (
              ''
            )}
          </div>
        </div>
        <p className="text-light whitespace-pre-wrap mt-2 sm:mt-1 text-sm">
          {body}
        </p>
      </div>
    </div>
  )
}

// --- Helper Component: The "Add a comment" input field ---
function AddComment({
  currentUserAvatar,
  postId,
  isUserAuthenticated,
  setComments,
}) {
  const FEED_CACHE_KEY = 'sinkedin_feed_cache'
  const [isEditing, setIsEditing] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isCommentPosting, setIsCommentPosting] = useState(false)

  const handlePostComment = async () => {
    if (!isUserAuthenticated) return
    if (!commentText.trim()) return
    try {
      setIsCommentPosting(true)
      const response = await axios.post('/api/post/comment/create', {
        postId: postId,
        comment: commentText,
      })
      console.log(response.data)
      if (response.status === 201) {
        try {
          const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
          if (cachedData) {
            let updatedComments
            const parsedCacheData = JSON.parse(cachedData)
            const updatedPosts = parsedCacheData.posts.map((post) => {
              if (post.id === postId) {
                const existingComments = Array.isArray(post.comments)
                  ? post.comments
                  : []
                updatedComments = [...existingComments, response.data]
                return {
                  ...post,
                  comments: updatedComments,
                }
              }
              return post
            })
            const updateCacheData = {
              ...parsedCacheData,
              posts: updatedPosts,
            }
            sessionStorage.setItem(
              FEED_CACHE_KEY,
              JSON.stringify(updateCacheData),
            )
            setComments(updatedComments ? updatedComments : [])
          }
        } catch (error) {
          console.error(
            'Error occured while clearing adding comments to session storage: ',
            error,
          )
        }
      }
      // Reset the form after posting
      setCommentText('')
      setIsEditing(false)
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsCommentPosting(false)
    }
  }

  if (!isEditing) {
    return (
      // The placeholder view
      <div
        className="flex items-center gap-3"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex-shrink-0">
          <Image
            src={currentUserAvatar || '/default_avatar.jpg'}
            alt="Your Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover w-10 h-10"
          />
        </div>
        <div className="bg-dark w-full px-4 py-2.5 rounded-lg text-light-secondary text-sm cursor-pointer border border-dark-border hover:border-light-secondary transition-colors">
          Add a comment...
        </div>
      </div>
    )
  }

  // The active editing view
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <Image
          src={currentUserAvatar || '/default_avatar.jpg'}
          alt="Your Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-dark border border-dark-border rounded-lg p-2 text-light text-sm resize-y min-h-[60px] focus:outline-none focus:ring-1 focus:ring-accent"
          autoFocus
        />
        <div className="flex justify-end items-center gap-2 mt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-light-secondary hover:text-light transition-colors px-3 py-1"
          >
            Cancel
          </button>
          <button
            onClick={handlePostComment}
            disabled={
              !isUserAuthenticated || isCommentPosting || !commentText.trim()
            }
            className={`border-none px-4 py-1.5 rounded-md font-semibold text-sm text-white transition-colors ${
              isUserAuthenticated
                ? 'bg-accent hover:bg-accent-hover cursor-pointer'
                : 'bg-light-secondary/60 cursor-not-allowed'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isCommentPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
