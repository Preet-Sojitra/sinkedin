import OpenAI from 'openai'
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateComment(postBody) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a witty, funny, and slightly sarcastic bot.',
        },
        {
          role: 'user',
          content: `Generate a witty or humorous comment for this post: "${postBody}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating comment:', error)
    return "Couldn't generate a comment."
  }
}
