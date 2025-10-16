'use client'

import Link from 'next/link'
import Image from 'next/image'
import NotificationBell from './notifications/NotificationBell'
import { useUser } from '@/contexts/UserContext'

export default function Header() {
  const { user, profile, isLoading } = useUser()

  return (
    <header className="bg-dark-secondary border-b border-dark-border px-0 py-3 sticky top-0 z-50">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-[1.8rem] font-bold text-light no-underline"
          scroll={false}
        >
          S<strike className="text-accent no-underline">in</strike>kedIn
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-[40px] h-[40px] bg-dark-border rounded-full animate-pulse" />
          ) : user && !profile ? (
            // Logged in but no profile → Complete Profile button
            <Link href="/welcome" scroll={false}>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-yellow-400 transition-colors">
                Complete Profile
              </button>
            </Link>
          ) : profile ? (
            // Logged in and profile exists → Avatar + Notifications
            <>
              <NotificationBell />
              <Link
                href="/profile"
                className="w-[40px] h-[40px] relative"
                scroll={false}
              >
                <Image
                  src={profile.avatar_url || '/default_avatar.jpg'}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              </Link>
            </>
          ) : (
            // Not logged in → Login button
            <Link href="/auth/login" scroll={false}>
              <button className="bg-accent text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
