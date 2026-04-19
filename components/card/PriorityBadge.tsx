'use client'

import { Priority } from '@/types'

interface PriorityBadgeProps {
  priority: Priority
}

const PRIORITY_STYLES: Record<Priority, { bg: string; text: string; label: string }> = {
  high: { bg: '#FEE2E2', text: '#DC2626', label: 'High' },
  mid:  { bg: '#FEF3C7', text: '#D97706', label: 'Mid' },
  low:  { bg: '#D1FAE5', text: '#059669', label: 'Low' },
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const { bg, text, label } = PRIORITY_STYLES[priority]

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold leading-none"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}
