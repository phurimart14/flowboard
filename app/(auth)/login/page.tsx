import Link from 'next/link'
import { LoginForm } from '@/components/shared/LoginForm'

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">FlowBoard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to your workspace</p>
        </div>

        {registered && (
          <div className="mb-4 rounded-[8px] bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            Account created! You can sign in now.
          </div>
        )}

        <div className="bg-[var(--bg-surface)] rounded-[12px] shadow-sm border border-[var(--kb-border)] p-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          No account?{' '}
          <Link href="/register" className="text-[var(--kb-accent)] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
