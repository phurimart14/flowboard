'use server'

import { createClient } from '@/lib/supabase/server'
import { Board } from '@/types'

export const createBoardAction = async (name: string): Promise<{ data?: Board; error?: string }> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('boards')
    .insert({ name, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as Board }
}

export const deleteBoardAction = async (boardId: string): Promise<{ error?: string }> => {
  const supabase = await createClient()

  const { error } = await supabase.from('boards').delete().eq('id', boardId)
  if (error) return { error: error.message }
  return {}
}

export const fetchBoardsAction = async (): Promise<{ data?: Board[]; error?: string }> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data: (data as Board[]) ?? [] }
}
