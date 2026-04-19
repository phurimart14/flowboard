'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/types'
import { PriorityBadge } from './PriorityBadge'

interface KanbanCardProps {
  card: Card
  onClick: (card: Card) => void
  isDragOverlay?: boolean
}

const formatDueDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const KanbanCard = ({ card, onClick, isDragOverlay = false }: KanbanCardProps) => {
  const isOverdue = card.due_date && new Date(card.due_date) < new Date()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: isDragOverlay,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    scale: isDragOverlay ? '1.02' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        bg-[var(--bg-surface)] border border-[var(--border)]
        rounded-[10px] p-3 cursor-grab active:cursor-grabbing
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        transition-shadow duration-150
        select-none
      "
      onClick={() => onClick(card)}
    >
      {(card.priority || card.due_date) && (
        <div className="flex items-center justify-between mb-2 gap-2">
          {card.priority ? (
            <PriorityBadge priority={card.priority} />
          ) : (
            <span />
          )}
          {card.due_date && (
            <span
              className={`text-[11px] font-semibold ${
                isOverdue ? 'text-[#DC2626]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {formatDueDate(card.due_date)}
            </span>
          )}
        </div>
      )}
      <p className="text-[14px] font-medium text-[var(--text-primary)] leading-snug">
        {card.title}
      </p>
      {card.description && (
        <p className="mt-1 text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-snug">
          {card.description}
        </p>
      )}
    </div>
  )
}
