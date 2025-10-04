export default function ChatInput({ message, setMessage }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
      className="w-full bg-transparent text-gray-300 placeholder-gray-500 px-4 py-3 resize-none focus:outline-none text-sm"
      rows="3"
    />
  )
}
