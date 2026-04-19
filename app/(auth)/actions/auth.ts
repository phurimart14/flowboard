'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const signUp = async (
  email: string,
  password: string,
  fullName: string
): Promise<{ error?: string }> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) return { error: error.message }
  return {}
}

export const signIn = async (
  email: string,
  password: string
): Promise<{ error?: string }> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }
  return {}
}

export const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
