'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { signOut } from '@/app/(auth)/actions/auth'
import { Profile } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserAvatarProps {
  profile: Profile
}

export const UserAvatar = ({ profile }: UserAvatarProps) => {
  const initials = (profile.full_name ?? profile.email)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--kb-accent)]">
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="bg-[var(--kb-accent-soft)] text-[var(--kb-accent)] text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-[10px]">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {profile.full_name ?? 'User'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate">{profile.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-600 cursor-pointer focus:text-red-600"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
