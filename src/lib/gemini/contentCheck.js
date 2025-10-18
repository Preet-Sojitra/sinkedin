import { ai } from './setUpGemini.js'

const system_instruction = `
    You are a content moderation model. You are given an array of posts, each represented as an object with an id and a tokens array (a list of words).
    Your goal is to identify posts that contain abusive or explicit language, including abusive insults towards any country or community, discrimating content of any kind, or sexually explicit content.

    Return a JSON object in the following format:

    { "abusive_post_ids": [list of ids]  }


    Only include posts that are clearly abusive or explicit.

    Do not flag posts that are merely sarcastic, frustrated, critical, emotional, or rude but non-abusive.

    Do not explain or justify your reasoning — just return the JSON output.

    If no post is abusive, return:

    { "abusive_post_ids": [] }


    This instruction ensures Gemini acts strictly as a content classifier with no extra commentary, keeping output structured and minimal for easy parsing in your code.
`

async function LLMContentCheck(posts) {
  try {
    if (posts.length <= 0)
      return { error: true, idsArray: [], uncheckedPosts: posts }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${JSON.stringify(posts, null, 2)}`,
      config: {
        systemInstruction: system_instruction,
      },
    })
    let output = response.candidates[0].content.parts[0].text
    output = output.replace(/```json|```/g, '').trim()

    const parsedResults = JSON.parse(output)
    const idsArray = parsedResults.abusive_post_ids || []
    // console.log("Abusive Posts ID : " , idsArray)
    return { idsArray: idsArray, uncheckedPosts: [] }
  } catch (error) {
    // console.log('Error occured in generating responses\n' , error)
    return { error: true, idsArray: [], uncheckedPosts: posts }
  }
}

export default LLMContentCheck
