import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types'
import { BoardHeader } from '@/components/board/BoardHeader'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // ดึง profile — ถ้าไม่มีให้ upsert จากข้อมูล auth (กรณี trigger ทำงานช้า)
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? null,
    })
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <BoardHeader profile={profile as Profile} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
