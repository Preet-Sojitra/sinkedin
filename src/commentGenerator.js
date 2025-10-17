import { GoogleGenerativeAI } from '@google/generative-ai'

console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: `You are SinkedinOfficialBot. Sinkedin is a LinkedIn alternative for flaunting failures, job rejections, and embarrassments. Your task is to make fun of or roast the content the user has posted by creating a comment. Keep the comment concise—not too long, not too short.`,
})

export async function generateComment(postBody) {
  try {
    const generationConfig = {
      temperature: 0.8,
      maxOutputTokens: 80,
    }

    const result = await model.generateContent(postBody, generationConfig)

    const response = result.response
    return response.text().trim()
  } catch (error) {
    console.error('Error generating comment with Gemini:', error)
    return "Couldn't generate a comment."
  }
}
