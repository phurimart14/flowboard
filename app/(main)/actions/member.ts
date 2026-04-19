'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Profile } from '@/types'

export interface MemberWithProfile {
  id: string
  board_id: string
  user_id: string
  joined_at: string
  profile: Profile
}

export const fetchMembersAction = async (
  boardId: string
): Promise<{ data?: MemberWithProfile[]; error?: string }> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('board_members')
    .select('id, board_id, user_id, joined_at, profile:profiles(id, email, full_name, avatar_url)')
    .eq('board_id', boardId)
    .order('joined_at', { ascending: true })

  if (error) return { error: error.message }
  return { data: data as unknown as MemberWithProfile[] }
}

export const inviteMemberAction = async (
  boardId: string,
  email: string
): Promise<{ error?: string }> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()

  // Verify current user is board owner
  const { data: board } = await admin
    .from('boards')
    .select('owner_id')
    .eq('id', boardId)
    .single()

  if (!board || board.owner_id !== user.id) return { error: 'Only the board owner can invite members' }

  // Find profile by email
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (!profile) return { error: 'No user found with that email address' }
  if (profile.id === user.id) return { error: 'You are already a member of this board' }

  // Check if already a member
  const { data: existing } = await admin
    .from('board_members')
    .select('id')
    .eq('board_id', boardId)
    .eq('user_id', profile.id)
    .single()

  if (existing) return { error: 'This user is already a member of this board' }

  // Add to board_members
  const { error } = await admin
    .from('board_members')
    .insert({ board_id: boardId, user_id: profile.id })

  if (error) return { error: error.message }
  return {}
}

export const removeMemberAction = async (
  boardId: string,
  userId: string
): Promise<{ error?: string }> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = createAdminClient()

  const { data: board } = await admin
    .from('boards')
    .select('owner_id')
    .eq('id', boardId)
    .single()

  if (!board || board.owner_id !== user.id) return { error: 'Only the board owner can remove members' }
  if (userId === board.owner_id) return { error: 'Cannot remove the board owner' }

  const { error } = await admin
    .from('board_members')
    .delete()
    .eq('board_id', boardId)
    .eq('user_id', userId)

  if (error) return { error: error.message }
  return {}
}
