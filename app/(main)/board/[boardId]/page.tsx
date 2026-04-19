interface BoardPageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params
  return (
    <div className="p-8">
      <p className="text-[var(--text-secondary)]">Board {boardId} — Day 3</p>
    </div>
  )
}
