'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUp } from '@/app/(auth)/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

interface RegisterFormProps {}

export const RegisterForm = ({}: RegisterFormProps) => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null)
    const result = await signUp(values.email, values.password, values.fullName)
    if (result.error) {
      setServerError(result.error)
      return
    }
    router.push('/login?registered=1')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="fullName" className="text-sm font-semibold text-[var(--text-primary)]">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Your name"
          className="rounded-[8px] border-[var(--kb-border)]"
          {...register('fullName')}
        />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
      </div>

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
          placeholder="Min. 6 characters"
          className="rounded-[8px] border-[var(--kb-border)]"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[var(--text-primary)]">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="rounded-[8px] border-[var(--kb-border)]"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
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
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
