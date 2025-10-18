'use client'

import Link from 'next/link'
import Image from 'next/image'
import NotificationBell from './notifications/NotificationBell'
import { useUser } from '@/contexts/UserContext'

export default function Header() {
  const { profile, isLoading } = useUser()

  return (
    <header className="bg-dark-secondary border-b border-dark-border px-0 py-3 sticky top-0 z-50">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-6">
        <Link
          href="/feed"
          className="text-[1.8rem] font-bold text-light no-underline"
          scroll={false}
        >
          S<strike className="text-accent no-underline">in</strike>kedIn
        </Link>

        <div className="flex items-center gap-4">
          {/* We add the bell here. It will only show for logged-in users once we add logic */}
          {profile && <NotificationBell />}

          {isLoading ? (
            <div className="w-[40px] h-[40px] bg-dark-border rounded-full animate-pulse" />
          ) : profile ? (
            <Link
              href="/profile"
              className="w-[40px] h-[40px] relative"
              scroll={false}
            >
              <Image
                src={profile.avatar_url || '/default_avatar.jpg'}
                alt="Profile Icon"
                fill
                className="rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-light no-underline"
              scroll={false}
            >
              <button className="bg-accent text-white border-none px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
