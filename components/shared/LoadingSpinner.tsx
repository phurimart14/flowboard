interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size]

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-2 border-[var(--kb-accent-soft)] border-t-[var(--kb-accent)]`}
      role="status"
      aria-label="Loading"
    />
  )
}
