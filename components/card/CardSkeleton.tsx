'use client'

interface CardSkeletonProps {}

export const CardSkeleton = ({}: CardSkeletonProps) => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-3 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-10 rounded-[6px] bg-[var(--bg-column)]" />
      </div>
      <div className="h-3.5 w-full rounded bg-[var(--bg-column)] mb-1.5" />
      <div className="h-3.5 w-3/4 rounded bg-[var(--bg-column)]" />
    </div>
  )
}
