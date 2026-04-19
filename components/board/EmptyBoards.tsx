'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateBoardModal } from '@/components/board/CreateBoardModal'
import { Board } from '@/types'

interface EmptyBoardsProps {}

export const EmptyBoards = ({}: EmptyBoardsProps) => {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)

  const handleCreated = (board: Board) => {
    router.push(`/board/${board.id}`)
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-[10px] bg-[var(--kb-accent-soft)] flex items-center justify-center">
          <LayoutDashboard className="h-8 w-8 text-[var(--kb-accent)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">No boards yet</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Create your first board to start managing tasks
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-[8px] bg-[var(--kb-accent)] hover:bg-[var(--kb-accent-hover)] text-white transition-all duration-150 active:scale-[0.97]"
        >
          Create Board
        </Button>
      </div>

      <CreateBoardModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
    </>
  )
}
