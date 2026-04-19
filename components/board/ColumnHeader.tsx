'use client'

import { ColumnId, COLUMN_LABELS } from '@/types'

interface ColumnHeaderProps {
  columnId: ColumnId
  cardCount: number
}

export const ColumnHeader = ({ columnId, cardCount }: ColumnHeaderProps) => {
  return (
    <div className="px-3 py-2.5 rounded-t-[10px] bg-[var(--bg-column)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          {COLUMN_LABELS[columnId]}
        </h3>
        <span className="text-[12px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-full px-2 py-0.5 min-w-[22px] text-center">
          {cardCount}
        </span>
      </div>
    </div>
  )
}
