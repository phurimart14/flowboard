'use client'

interface AddCardButtonProps {
  onClick: () => void
}

export const AddCardButton = ({ onClick }: AddCardButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-1.5 px-3 py-2 mt-1
        text-[13px] font-medium text-[var(--text-secondary)]
        rounded-[8px] hover:bg-[var(--border)] hover:text-[var(--text-primary)]
        transition-colors duration-150
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      Add card
    </button>
  )
}
