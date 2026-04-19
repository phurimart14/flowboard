'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, ColumnId } from '@/types'
import { ColumnHeader } from './ColumnHeader'
import { KanbanCard } from '@/components/card/KanbanCard'
import { AddCardButton } from '@/components/card/AddCardButton'

interface ColumnProps {
  columnId: ColumnId
  cards: Card[]
  onCardClick: (card: Card) => void
  onAddCard: (columnId: ColumnId) => void
}

export const Column = ({ columnId, cards, onCardClick, onAddCard }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div className="flex flex-col w-[280px] flex-shrink-0 rounded-[10px] bg-[var(--bg-column)]">
      <ColumnHeader columnId={columnId} cardCount={cards.length} />

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-2 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] min-h-[60px] rounded-b-[4px] transition-colors duration-150 ${
          isOver ? 'bg-[var(--accent-soft)]' : ''
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>

      <div className="px-1 pb-1">
        <AddCardButton onClick={() => onAddCard(columnId)} />
      </div>
    </div>
  )
}
