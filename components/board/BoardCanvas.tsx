'use client'

import { useEffect } from 'react'
import { useBoardStore } from '@/stores/boardStore'
import { Board } from '@/types'

interface BoardCanvasProps {
  board: Board
}

export const BoardCanvas = ({ board }: BoardCanvasProps) => {
  const { setActiveBoard } = useBoardStore()

  useEffect(() => {
    setActiveBoard(board)
    return () => setActiveBoard(null)
  }, [board, setActiveBoard])

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-[var(--text-secondary)] text-sm">
        Board: <span className="font-semibold text-[var(--text-primary)]">{board.name}</span> — columns coming Day 4
      </p>
    </div>
  )
}
