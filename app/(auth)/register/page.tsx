import Link from 'next/link'
import { RegisterForm } from '@/components/shared/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">FlowBoard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Create your account</p>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-[12px] shadow-sm border border-[var(--kb-border)] p-6">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--kb-accent)] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
