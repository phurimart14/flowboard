'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, ChevronDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { CreateBoardModal } from '@/components/board/CreateBoardModal'
import { useBoards } from '@/hooks/useBoards'
import { useBoardStore } from '@/stores/boardStore'
import { Board, Profile } from '@/types'

interface BoardHeaderProps {
  profile: Profile
  currentBoardId?: string
}

export const BoardHeader = ({ profile, currentBoardId }: BoardHeaderProps) => {
  const router = useRouter()
  const { boards } = useBoards()
  const { activeBoard } = useBoardStore()
  const [createOpen, setCreateOpen] = useState(false)

  const handleBoardSelect = (board: Board) => {
    router.push(`/board/${board.id}`)
  }

  const handleCreated = (board: Board) => {
    router.push(`/board/${board.id}`)
  }

  const displayName = activeBoard?.name ?? boards.find((b) => b.id === currentBoardId)?.name ?? 'Select board'

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 bg-[var(--bg-surface)] border-b border-[var(--kb-border)] shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-[var(--kb-accent)]" />
          <span className="text-lg font-bold text-[var(--text-primary)]">FlowBoard</span>
        </div>

        {/* Board Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-column)] transition-colors duration-150 outline-none">
            <span className="max-w-[180px] truncate">{displayName}</span>
            <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 rounded-[10px]">
            {boards.length === 0 && (
              <div className="px-3 py-2 text-xs text-[var(--text-secondary)]">No boards yet</div>
            )}
            {boards.map((board) => (
              <DropdownMenuItem
                key={board.id}
                onClick={() => handleBoardSelect(board)}
                className={`cursor-pointer text-sm ${board.id === currentBoardId ? 'font-semibold text-[var(--kb-accent)]' : ''}`}
              >
                {board.name}
              </DropdownMenuItem>
            ))}
            {boards.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => setCreateOpen(true)}
              className="cursor-pointer text-sm text-[var(--kb-accent)] font-semibold"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Theme + User */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserAvatar profile={profile} />
        </div>
      </header>

      <CreateBoardModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
    </>
  )
}
