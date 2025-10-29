'use client'

export default function ChatMessageBox({ msg }) {
  return (
    <>
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl flex-shrink-0 border border-gray-700">
        <img
          src={msg.avatar_url || '/default_avatar.jpg'}
          alt={'💀'}
          className="w-10 h-10 rounded-full border-1 border-dark-border"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-gray-200 text-sm">
            {msg.username}
          </span>
          <span className="text-xs text-gray-500">{msg.time}</span>
        </div>
        <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-700">
          <p className="text-gray-300 text-sm leading-relaxed">{msg.text}</p>
        </div>
      </div>
    </>
  )
}
