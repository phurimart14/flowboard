'use client'

import { useEffect, useCallback, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useBoardStore } from '@/stores/boardStore'
import { useCards } from '@/hooks/useCards'
import { Board, Card, ColumnId, COLUMN_IDS } from '@/types'
import { Column } from './Column'
import { CardModal } from '@/components/card/CardModal'
import { KanbanCard } from '@/components/card/KanbanCard'

interface BoardCanvasProps {
  board: Board
}

export const BoardCanvas = ({ board }: BoardCanvasProps) => {
  const { setActiveBoard } = useBoardStore()
  const { cards, moveCards } = useCards()

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [addCardColumnId, setAddCardColumnId] = useState<ColumnId | null>(null)
  const [activeDragCard, setActiveDragCard] = useState<Card | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

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

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id)
    setActiveDragCard(card ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragCard(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const activeCard = cards.find((c) => c.id === activeId)
    if (!activeCard) return

    const isOverColumn = (COLUMN_IDS as string[]).includes(overId)
    const targetColumnId: ColumnId = isOverColumn
      ? (overId as ColumnId)
      : (cards.find((c) => c.id === overId)?.column_id ?? activeCard.column_id)

    // Target column cards without the active card, sorted
    const targetCards = cards
      .filter((c) => c.board_id === board.id && c.column_id === targetColumnId && c.id !== activeId)
      .sort((a, b) => a.position - b.position)

    const insertIndex = isOverColumn
      ? targetCards.length
      : Math.max(0, targetCards.findIndex((c) => c.id === overId))

    const reordered = [
      ...targetCards.slice(0, insertIndex),
      { ...activeCard, column_id: targetColumnId },
      ...targetCards.slice(insertIndex),
    ]

    const updates: Array<{ id: string; column_id: ColumnId; position: number }> =
      reordered.map((c, i) => ({ id: c.id, column_id: targetColumnId, position: i }))

    // Reindex source column if cross-column move
    if (activeCard.column_id !== targetColumnId) {
      cards
        .filter((c) => c.board_id === board.id && c.column_id === activeCard.column_id && c.id !== activeId)
        .sort((a, b) => a.position - b.position)
        .forEach((c, i) => updates.push({ id: c.id, column_id: activeCard.column_id, position: i }))
    }

    moveCards(updates).catch(() => {/* rollback handled in hook */})
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

        <DragOverlay>
          {activeDragCard && (
            <KanbanCard card={activeDragCard} onClick={() => {}} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>

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
