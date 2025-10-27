import Header from '@/components/Header'
import RealtimeChats from '@/components/chat/feed'
import { getCurrentUser, getUserProfile } from '@/app/profile/[userId]/page'
import { notFound } from 'next/navigation'

export default async function ChatPage({ params }) {
  const { userId: otherUserId } = await params
  const otherUser = await getUserProfile(otherUserId)
  const loggedInUser_temp = await getCurrentUser()

  if (!loggedInUser_temp) {
    notFound()
  }

  const loggedInUser = await getUserProfile(loggedInUser_temp.id)
  console.log(loggedInUser)

  return (
    <>
      <Header />
      <RealtimeChats loggedInUser={loggedInUser} otherUser={otherUser} />
    </>
  )
}
