import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const { generateComment } = await import('./commentGenerator.js')

console.log(process.env.SUPABASE_URL)
import { createClient } from './lib/supabase/client.js'

const supabase = createClient()

export async function processBotQueue() {
  try {
    const { data: queueItems, error } = await supabase
      .from('bot_queue')
      .select('*')
      .eq('processed', false)

    for (const item of queueItems) {
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', item.post_id)
        .single()
      const comment = await generateComment(post.body)
      console.log('post', post, item)
      const { data: cData, error: errData } = await supabase
        .from('comments')
        .insert({ body: comment, post_id: item.post_id, user_id: post.user_id })
        .select()
      console.log(cData, errData)
      await supabase
        .from('bot_queue')
        .update({ processed: true })
        .eq('id', item.id)
    }
  } catch (err) {
    console.log('Erorr processing', err)
  }
}

setInterval(processBotQueue, 10000)

console.log('Bot worker started, polling every', 'seconds.')
