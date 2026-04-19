'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from '@/app/(auth)/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginValues = z.infer<typeof loginSchema>

interface LoginFormProps {}

export const LoginForm = ({}: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    setServerError(null)
    const result = await signIn(values.email, values.password)
    if (result.error) {
      setServerError(result.error)
      return
    }
    // Full page navigation — ensures session cookies are sent with the request
    // router.push() + router.refresh() causes competing navigations → throttle loop
    window.location.href = '/board'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm font-semibold text-[var(--text-primary)]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="rounded-[8px] border-[var(--kb-border)]"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-semibold text-[var(--text-primary)]">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="rounded-[8px] border-[var(--kb-border)]"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {serverError && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-[8px] bg-[var(--kb-accent)] hover:bg-[var(--kb-accent-hover)] text-white transition-all duration-150 active:scale-[0.97]"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
