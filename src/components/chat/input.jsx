'use client'

import { useRef } from 'react'

export default function ChatInput({
  message,
  setMessage,
  trackTyping,
  handleKeyDown,
}) {
  const istypingRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  async function handleInput(e) {
    setMessage(e.target.value)

    if (!istypingRef.current) {
      await trackTyping(true)
      istypingRef.current = true
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(async () => {
      if (!istypingRef.current) return
      istypingRef.current = false
      await trackTyping(false)
    }, 2000)
  }

  return (
    <textarea
      value={message}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
      className="w-full bg-transparent text-gray-300 placeholder-gray-500 px-4 py-3 resize-none focus:outline-none text-sm"
      rows="3"
    />
  )
}
