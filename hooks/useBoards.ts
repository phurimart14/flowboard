'use client'

import { useEffect, useCallback } from 'react'
import { useBoardStore } from '@/stores/boardStore'
import { fetchBoardsAction, createBoardAction, deleteBoardAction } from '@/app/(main)/actions/board'
import { Board } from '@/types'

export const useBoards = () => {
  const { boards, setBoards, addBoard, removeBoard } = useBoardStore()

  const fetchBoards = useCallback(async () => {
    const result = await fetchBoardsAction()
    if (result.error) throw new Error(result.error)
    setBoards(result.data ?? [])
  }, [setBoards])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const createBoard = async (name: string): Promise<Board> => {
    const result = await createBoardAction(name)
    if (result.error) throw new Error(result.error)
    const board = result.data!
    addBoard(board)
    return board
  }

  const deleteBoard = async (boardId: string) => {
    const result = await deleteBoardAction(boardId)
    if (result.error) throw new Error(result.error)
    removeBoard(boardId)
  }

  return { boards, createBoard, deleteBoard, refetch: fetchBoards }
}
