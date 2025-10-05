'use client'

import { useRef, useState, useEffect } from 'react'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { Send, Smile } from 'lucide-react'
import ChatInput from './input'
import ChatMessageBox from './message'
import supabase from '@/utils/supabase/client'

export default function RealtimeChats({ loggedInUser, otherUser }) {
  const [message, setMessage] = useState('')
  const channelRef = useRef(null)
  const [prevMessages, setPrevMessages] = useState([])
  const { containerRef, scrollToBottom } = useChatScroll()

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [prevMessages.length, scrollToBottom])

  const getPreviousChats = async () => {
    // fetch from supabase table chats which has all the chat messages

    const room_id = [loggedInUser.id, otherUser.id].sort().join('_')
    // console.log(room_id)
    const { data: messages, error } = await supabase
      .from('chats')
      .select('*')
      .eq('room_id', room_id)
      .order('created_at')

    if (error) {
      console.log('Error in fetching the messages : ', error)
      return null
    }
    console.log(messages)
    setPrevMessages(messages)
  }

  const realtimeSubscription = () => {
    const room_id = [loggedInUser.id, otherUser.id].sort().join('_')
    const channel = supabase.channel(`chat-${room_id}`)

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          if (payload.eventType == 'INSERT') {
            // insert the new messsage in the payload in the prevMessages
            if (payload.new.user_id != loggedInUser.id) {
              setPrevMessages((prevMessages) => [...prevMessages, payload.new])
            }
          }
        },
      )
      .subscribe((status) => {
        if (status != 'subscribed') {
          return
        }

        console.log(`Real time connection established in ${room_id}`)
      })

    return channel
  }

  useEffect(() => {
    if (!loggedInUser) return

    getPreviousChats()

    channelRef.current = realtimeSubscription()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [loggedInUser?.id])

  const handleSend = async () => {
    if (typeof message == 'string' && message.trim()) {
      const newMessage = {
        // id: crypto.randomUUID,
        username: loggedInUser.username,
        user_id: loggedInUser.id,
        room_id: [loggedInUser.id, otherUser.id].sort().join('_'),
        avatar_url: loggedInUser.avatar_url || '/default_avatar.jpg',
        text: message.trim(),
        time: new Date().toISOString(),
      }

      // console.log(newMessage)
      const { data, error } = await supabase.from('chats').insert(newMessage)
      if (error) {
        console.log(
          `Failed to send message. Received data as ${data}\nError:\n`,
          error,
        )
        return
      }
      setPrevMessages((prevMessages) => [...prevMessages, newMessage])
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-dark-secondary border border-dark-border rounded-lg ">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">
            {otherUser.username}
          </h2>
        </div>

        <div
          ref={containerRef}
          className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {prevMessages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-3">
                <ChatMessageBox msg={msg} />
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-800">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-gray-600 transition-colors">
            <ChatInput message={message} setMessage={setMessage} />

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-300">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={typeof message != 'string' || !message.trim()}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-500 text-white px-5 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                Send
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
