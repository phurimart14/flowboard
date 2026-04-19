import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { EmptyBoards } from '@/components/board/EmptyBoards'

export default async function BoardIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: memberRows } = await admin
    .from('board_members')
    .select('board_id')
    .eq('user_id', user.id)
    .order('board_id', { ascending: true })
    .limit(1)

  if (memberRows && memberRows.length > 0) {
    redirect(`/board/${memberRows[0].board_id}`)
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <EmptyBoards />
    </div>
  )
}
