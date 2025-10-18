import { createClient } from '../supabase/service.js'

export default async function DeletePosts(params) {
  try {
    const supabase = await createClient()

    const { idsArray } = params

    const { error } = await supabase.from('posts').delete().in('id', idsArray)

    if (error) throw error
    // console.log("Deleted data info : ", error)
    // console.log("Posts Deleted")
    return true
  } catch (error) {
    console.log('Error in deleting the posts : ', error)
    return false
  }
}
