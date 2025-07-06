import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const { postId, comment } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: process.env.SYSTEM_PROMPT,
  });

  const result = await model.generateContent(comment);
  const response = result.response;
  const text = response.text();

  await fetch(`${new URL(request.url).origin}/api/post/comment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      comment: text,
      isReplyBot: true,
    }),
  });

  return new Response(JSON.stringify({ reply: text }), {
    headers: { "Content-Type": "application/json" },
  });
}
