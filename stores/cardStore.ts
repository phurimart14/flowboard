import { create } from 'zustand'
import { Card, ColumnId } from '@/types'

interface CardState {
  cards: Card[]
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  removeCard: (id: string) => void
  moveCard: (id: string, columnId: ColumnId, position: number) => void
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
  moveCard: (id, columnId, position) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, column_id: columnId, position } : c)),
    })),
}))
