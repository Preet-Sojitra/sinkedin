'use client'
import { useEffect } from 'react'
import { updatePostsOnDelete, updatePostsOnInsert } from './realtimeUtils/util'
import { createClient } from './client'

const supabase = createClient()

export function FetchRealtimePost({ setPosts }) {
  useEffect(() => {
    const postsChannel = supabase
      .channel('sinkedin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        async (postsPayload) => {
          if (postsPayload.errors) {
            console.error(
              'Error occurred while fetching posts at realtime: ',
              postsPayload.errors,
            )
            return
          }
          const { eventType, new: newPost, old: oldPost } = postsPayload
          switch (eventType) {
            case 'INSERT':
              await updatePostsOnInsert(setPosts, newPost, supabase)
              break
            case 'DELETE':
              updatePostsOnDelete(setPosts, oldPost)
              break
            case 'UPDATE':
              // Updating post currently is not implemented, can be used for future versions
              console.log('Post got updated')
              break
            default:
              console.log('Strange got some new eventType: ', eventType)
          }
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(postsChannel)
    }
  }, [supabase])
}
