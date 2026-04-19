import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <div className="min-h-screen bg-[var(--bg-base)]">{children}</div>
}
