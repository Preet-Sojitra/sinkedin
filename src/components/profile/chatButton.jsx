'use client'
import { redirect } from 'next/navigation'

async function chatInit(profileUserId) {
  // starts a socket server and redirects to the chat page
  redirect(`/chat/${profileUserId}`)
}

export default function ChatButton({ profileUserId }) {
  // text : the content of the button
  // console.log(currentUserId , profileUserId)
  return (
    <button
      onClick={() => {
        chatInit(profileUserId)
      }}
      className="bg-accent text-light hover:bg-accent-hover font-semibold py-2 px-6 rounded shadow-md my-2"
    >
      Chat
    </button>
  )
}
