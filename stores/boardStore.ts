import { create } from 'zustand'
import { Board, Profile } from '@/types'

interface BoardState {
  boards: Board[]
  activeBoard: Board | null
  profile: Profile | null
  loading: boolean
  setBoards: (boards: Board[]) => void
  setActiveBoard: (board: Board | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  addBoard: (board: Board) => void
  removeBoard: (boardId: string) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  profile: null,
  loading: true,
  setBoards: (boards) => set({ boards, loading: false }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== boardId),
      activeBoard: state.activeBoard?.id === boardId ? null : state.activeBoard,
    })),
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      activeBoard:
        state.activeBoard?.id === id ? { ...state.activeBoard, ...updates } : state.activeBoard,
    })),
}))
