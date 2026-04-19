'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, ColumnId } from '@/types'
import { ColumnHeader } from './ColumnHeader'
import { KanbanCard } from '@/components/card/KanbanCard'
import { CardSkeleton } from '@/components/card/CardSkeleton'
import { AddCardButton } from '@/components/card/AddCardButton'

interface ColumnProps {
  columnId: ColumnId
  cards: Card[]
  loading?: boolean
  onCardClick: (card: Card) => void
  onAddCard: (columnId: ColumnId) => void
}

export const Column = ({ columnId, cards, loading = false, onCardClick, onAddCard }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div className="flex flex-col w-[280px] flex-shrink-0 rounded-[10px] bg-[var(--bg-column)]">
      <ColumnHeader columnId={columnId} cardCount={cards.length} />

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] min-h-[60px] rounded-b-[4px] transition-colors duration-150 column-scroll ${
          isOver ? 'bg-[var(--kb-accent-soft)]' : ''
        }`}
      >
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onClick={onCardClick} />
            ))}
            {cards.length === 0 && (
              <p className="text-[12px] text-[var(--text-secondary)] text-center py-4 select-none">
                No cards yet
              </p>
            )}
          </SortableContext>
        )}
      </div>

      <div className="px-1 pb-1">
        <AddCardButton onClick={() => onAddCard(columnId)} />
      </div>
    </div>
  )
}
