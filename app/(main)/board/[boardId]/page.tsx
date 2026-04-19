import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { BoardCanvas } from '@/components/board/BoardCanvas'
import { Board } from '@/types'

interface BoardPageProps {
  params: Promise<{ boardId: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params

  // Verify user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  // Use admin client to fetch board (bypasses RLS auth.uid() issue)
  const admin = createAdminClient()
  const { data: member } = await admin
    .from('board_members')
    .select('board_id')
    .eq('board_id', boardId)
    .eq('user_id', user.id)
    .single()

  if (!member) notFound()

  const { data: board } = await admin
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single()

  if (!board) notFound()

  return <BoardCanvas board={board as Board} />
}
