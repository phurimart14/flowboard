'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Board } from '@/types'

export const createBoardAction = async (name: string): Promise<{ data?: Board; error?: string }> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('boards')
    .insert({ name, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as Board }
}

export const deleteBoardAction = async (boardId: string): Promise<{ error?: string }> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { error } = await admin.from('boards').delete().eq('id', boardId).eq('owner_id', user.id)
  if (error) return { error: error.message }
  return {}
}

export const fetchBoardsAction = async (): Promise<{ data?: Board[]; error?: string }> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('boards')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data: (data as Board[]) ?? [] }
}
