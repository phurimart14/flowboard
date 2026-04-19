'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, ColumnId, Priority } from '@/types'

const getVerifiedUser = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const fetchCardsAction = async (
  boardId: string
): Promise<{ data?: Card[]; error?: string }> => {
  const user = await getVerifiedUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('cards')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true })

  if (error) return { error: error.message }
  return { data: (data as Card[]) ?? [] }
}

export const createCardAction = async (
  boardId: string,
  columnId: ColumnId,
  title: string,
  description?: string,
  dueDate?: string,
  priority?: Priority
): Promise<{ data?: Card; error?: string }> => {
  const user = await getVerifiedUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()

  const { count } = await admin
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', boardId)
    .eq('column_id', columnId)

  const position = count ?? 0

  const { data, error } = await admin
    .from('cards')
    .insert({
      board_id: boardId,
      column_id: columnId,
      title: title.trim(),
      description: description?.trim() || null,
      due_date: dueDate || null,
      priority: priority || null,
      position,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as Card }
}

export const updateCardAction = async (
  cardId: string,
  updates: Partial<Pick<Card, 'title' | 'description' | 'due_date' | 'priority' | 'column_id' | 'position'>>
): Promise<{ data?: Card; error?: string }> => {
  const user = await getVerifiedUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single()

  if (error) return { error: error.message }
  return { data: data as Card }
}

export const deleteCardAction = async (
  cardId: string
): Promise<{ error?: string }> => {
  const user = await getVerifiedUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { error } = await admin.from('cards').delete().eq('id', cardId)
  if (error) return { error: error.message }
  return {}
}

export const updateCardPositionsAction = async (
  updates: Array<{ id: string; column_id: ColumnId; position: number }>
): Promise<{ error?: string }> => {
  const user = await getVerifiedUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const results = await Promise.all(
    updates.map(({ id, column_id, position }) =>
      admin.from('cards').update({ column_id, position }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return { error: failed.error.message }
  return {}
}
