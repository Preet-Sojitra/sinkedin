const FEED_CACHE_KEY = 'sinkedin_feed_cache'

const updatePostsOnInsert = async (setPosts, newPost, supabase) => {
  try {
    const { data: fullPost, error: fetchError } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        body,
        is_anonymous,
        created_at,
        profiles!posts_user_id_fkey (
          id,
          username,
          avatar_url
        ),
        reactions (
          user_id,
          reaction,
          created_at
        )
      `,
      )
      .eq('id', newPost.id)
      .single()

    if (fetchError || !fullPost) {
      console.error('Error fetching newly created post:', fetchError)
      return
    }

    const updatedPost = {
      id: fullPost.id,
      user_id: fullPost.user_id,
      body: fullPost.body,
      is_anonymous: fullPost.is_anonymous,
      created_at: fullPost.created_at,
      author: fullPost.is_anonymous
        ? null
        : {
            id: fullPost.profiles?.id,
            username: fullPost.profiles?.username,
            avatar_url: fullPost.profiles?.avatar_url,
          },
      reaction_counts: { Laugh: 0, Clown: 0, Skull: 0, Relatable: 0 },
      reaction: [],
    }
    setPosts((prevPosts) => [updatedPost, ...prevPosts])
    // Session Storage is updated in feedPage under a useEffect
  } catch (error) {
    console.error('Error occured while updating posts: ', error)
  }
}

const updatePostsOnDelete = (setPosts, oldPost) => {
  try {
    const cachedData = sessionStorage.getItem(FEED_CACHE_KEY)
    if (cachedData) {
      const parsedCacheData = JSON.parse(cachedData)
      const filteredPosts = parsedCacheData.posts.filter(
        (eachPost) => eachPost.id !== oldPost.id,
      )
      setPosts(filteredPosts)
      // Session Storage is updated in feedPage under a useEffect
    }
  } catch (error) {
    console.error('Error occured while updating posts after delete: ', error)
  }
}

export { updatePostsOnInsert, updatePostsOnDelete }
