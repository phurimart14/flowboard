'use client'

import { useEffect, useCallback } from 'react'
import { useBoardStore } from '@/stores/boardStore'
import { useCardStore } from '@/stores/cardStore'
import { Board, Card, ColumnId, COLUMN_IDS } from '@/types'
import { Column } from './Column'

interface BoardCanvasProps {
  board: Board
}

export const BoardCanvas = ({ board }: BoardCanvasProps) => {
  const { setActiveBoard } = useBoardStore()
  const cards = useCardStore((s) => s.cards)

  useEffect(() => {
    setActiveBoard(board)
    return () => setActiveBoard(null)
  }, [board, setActiveBoard])

  const getColumnCards = useCallback(
    (columnId: ColumnId): Card[] =>
      cards
        .filter((c) => c.board_id === board.id && c.column_id === columnId)
        .sort((a, b) => a.position - b.position),
    [cards, board.id]
  )

  const handleCardClick = (card: Card) => {
    // Day 5: open CardModal
    console.error('TODO: open card modal', card.id)
  }

  const handleAddCard = (columnId: ColumnId) => {
    // Day 5: open AddCard flow
    console.error('TODO: add card to', columnId)
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-4 p-4 h-full items-start min-w-max">
        {COLUMN_IDS.map((columnId) => (
          <Column
            key={columnId}
            columnId={columnId}
            cards={getColumnCards(columnId)}
            onCardClick={handleCardClick}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
    </div>
  )
}
