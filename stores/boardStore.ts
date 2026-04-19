import { create } from 'zustand'
import { Board } from '@/types'

interface BoardState {
  boards: Board[]
  activeBoard: Board | null
  setBoards: (boards: Board[]) => void
  setActiveBoard: (board: Board | null) => void
  addBoard: (board: Board) => void
  removeBoard: (boardId: string) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (boardId) =>
    set((state) => ({ boards: state.boards.filter((b) => b.id !== boardId) })),
}))
