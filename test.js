// testPostRoute.js
import fetch from 'node-fetch'

const API_URL = 'http://localhost:3000/api/post/create' // change if your route differs

async function makePost(content, isAnonymous = false) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, isAnonymous }),
  })

  const data = await res.json()
  console.log(`Status: ${res.status}`, data)
}

async function testPosts() {
  const posts = [
    'This is my first test post!',
    'Another quick post for testing.',
    'Final test post to trigger queue.',
  ]

  for (let i = 0; i < posts.length; i++) {
    await makePost(posts[i])
    if (i < posts.length - 1) await new Promise((r) => setTimeout(r, 20)) // 20 ms delay
  }
}

testPosts()
