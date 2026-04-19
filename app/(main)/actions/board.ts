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

  // Fetch all boards the user is a member of (includes owned boards via trigger)
  const { data: memberRows, error: memberError } = await admin
    .from('board_members')
    .select('board_id')
    .eq('user_id', user.id)

  if (memberError) return { error: memberError.message }

  const boardIds = memberRows?.map((m) => m.board_id) ?? []
  if (boardIds.length === 0) return { data: [] }

  const { data, error } = await admin
    .from('boards')
    .select('*')
    .in('id', boardIds)
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data: (data as Board[]) ?? [] }
}
