'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useBoardStore } from '@/stores/boardStore'
import { Board } from '@/types'

export const useBoards = () => {
  const { boards, setBoards, addBoard, removeBoard } = useBoardStore()

  const fetchBoards = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    setBoards((data as Board[]) ?? [])
  }, [setBoards])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const createBoard = async (name: string): Promise<Board> => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('boards')
      .insert({ name, owner_id: user.id })
      .select()
      .single()

    if (error) throw new Error(error.message)
    addBoard(data as Board)
    return data as Board
  }

  const deleteBoard = async (boardId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('boards').delete().eq('id', boardId)
    if (error) throw new Error(error.message)
    removeBoard(boardId)
  }

  return { boards, createBoard, deleteBoard, refetch: fetchBoards }
}
