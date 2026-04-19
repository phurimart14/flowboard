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

  // ถ้าไม่มี session จริงๆ → middleware ควรจัดการก่อนถึงตรงนี้แล้ว
  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // ถ้าไม่มี profile → build จาก auth user โดยตรง ไม่ redirect (เพื่อกัน loop)
  const profile: Profile = profileData ?? {
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: null,
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <BoardHeader profile={profile} />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  )
}
