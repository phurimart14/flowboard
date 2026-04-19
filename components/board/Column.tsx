'use client'

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
  return (
    <div className="flex flex-col w-[280px] flex-shrink-0 rounded-[10px] bg-[var(--bg-column)]">
      <ColumnHeader columnId={columnId} cardCount={cards.length} />

      <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] min-h-[60px]">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>

      <div className="px-1 pb-1">
        <AddCardButton onClick={() => onAddCard(columnId)} />
      </div>
    </div>
  )
}
