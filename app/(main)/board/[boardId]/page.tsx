import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BoardCanvas } from '@/components/board/BoardCanvas'
import { Board } from '@/types'

interface BoardPageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params
  const supabase = await createClient()

  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single()

  if (!board) notFound()

  return <BoardCanvas board={board as Board} />
}
