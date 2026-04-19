'use client'

import { useEffect, useCallback, useState } from 'react'
import { useBoardStore } from '@/stores/boardStore'
import { useCards } from '@/hooks/useCards'
import { Board, Card, ColumnId, COLUMN_IDS } from '@/types'
import { Column } from './Column'
import { CardModal } from '@/components/card/CardModal'

interface BoardCanvasProps {
  board: Board
}

export const BoardCanvas = ({ board }: BoardCanvasProps) => {
  const { setActiveBoard } = useBoardStore()
  const { cards } = useCards()

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [addCardColumnId, setAddCardColumnId] = useState<ColumnId | null>(null)

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

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 h-full items-start min-w-max">
          {COLUMN_IDS.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              cards={getColumnCards(columnId)}
              onCardClick={setSelectedCard}
              onAddCard={setAddCardColumnId}
            />
          ))}
        </div>
      </div>

      <CardModal
        open={selectedCard !== null}
        onOpenChange={(open) => { if (!open) setSelectedCard(null) }}
        mode="edit"
        card={selectedCard ?? undefined}
      />

      <CardModal
        open={addCardColumnId !== null}
        onOpenChange={(open) => { if (!open) setAddCardColumnId(null) }}
        mode="create"
        columnId={addCardColumnId ?? undefined}
      />
    </>
  )
}
