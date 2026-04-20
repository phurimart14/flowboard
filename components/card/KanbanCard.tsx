'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardStatus } from '@/types'
import { PriorityBadge } from './PriorityBadge'
import { useCards } from '@/hooks/useCards'

interface KanbanCardProps {
  card: Card
  onClick: (card: Card) => void
  isDragOverlay?: boolean
}

const STATUS_CYCLE: CardStatus[] = ['todo', 'in_progress', 'done']

const STATUS_STYLE: Record<CardStatus, { bar: string; label: string }> = {
  todo:        { bar: 'bg-red-500',    label: 'ยัง' },
  in_progress: { bar: 'bg-yellow-400', label: 'กำลัง' },
  done:        { bar: 'bg-green-500',  label: 'ทำแล้ว' },
}

const formatDueDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const KanbanCard = ({ card, onClick, isDragOverlay = false }: KanbanCardProps) => {
  const { updateCard } = useCards()
  const isOverdue = card.due_date && new Date(card.due_date) < new Date()
  const currentStatus: CardStatus = card.status ?? 'todo'
  const { bar, label } = STATUS_STYLE[currentStatus]

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

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIndex = (STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length
    updateCard(card.id, { status: STATUS_CYCLE[nextIndex] })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        bg-[var(--bg-surface)] border border-[var(--border)]
        rounded-[10px] pt-3 px-3 pb-0 cursor-grab active:cursor-grabbing
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        transition-shadow duration-150
        select-none overflow-hidden
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

      <div className="mt-2 -mx-3">
        <button
          type="button"
          onClick={handleStatusClick}
          title={label}
          className={`w-full h-[6px] ${bar} hover:brightness-110 active:brightness-90 transition-all duration-150 cursor-pointer`}
        />
      </div>
    </div>
  )
}
