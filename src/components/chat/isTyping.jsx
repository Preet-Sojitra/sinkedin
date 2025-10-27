'use client'

export default function IsTypingComponent() {
  return (
    <div className="flex items-center gap-1 px-4 mb-2">
      <span className="text-gray-300 text-sm font-medium">Typing</span>
      <div className="flex gap-1 items-center">
        <span
          className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        />
        <span
          className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"
          style={{ animationDelay: '150ms', animationDuration: '1s' }}
        />
        <span
          className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"
          style={{ animationDelay: '300ms', animationDuration: '1s' }}
        />
      </div>
    </div>
  )
}
