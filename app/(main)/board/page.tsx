import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmptyBoards } from '@/components/board/EmptyBoards'

export default async function BoardIndexPage() {
  const supabase = await createClient()

  const { data: boards } = await supabase
    .from('boards')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)

  if (boards && boards.length > 0) {
    redirect(`/board/${boards[0].id}`)
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <EmptyBoards />
    </div>
  )
}
