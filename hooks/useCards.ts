'use client'

import { useCardStore } from '@/stores/cardStore'
import { useBoardStore } from '@/stores/boardStore'
import {
  createCardAction,
  updateCardAction,
  deleteCardAction,
  updateCardPositionsAction,
} from '@/app/(main)/actions/card'
import { toast } from 'sonner'
import { Card, CardStatus, ColumnId, Priority } from '@/types'

export const useCards = () => {
  const { cards, setCards, addCard, updateCard: storeUpdateCard, removeCard } = useCardStore()
  const activeBoard = useBoardStore((s) => s.activeBoard)

  const createCard = async (
    columnId: ColumnId,
    title: string,
    description?: string,
    dueDate?: string,
    priority?: Priority,
    status?: CardStatus
  ): Promise<Card> => {
    if (!activeBoard) throw new Error('No active board')
    const result = await createCardAction(activeBoard.id, columnId, title, description, dueDate, priority, status)
    if (result.error) throw new Error(result.error)
    const card = result.data!
    addCard(card)
    return card
  }

  const updateCard = async (
    cardId: string,
    updates: Partial<Pick<Card, 'title' | 'description' | 'due_date' | 'priority' | 'status' | 'column_id' | 'position'>>
  ): Promise<void> => {
    const prev = cards.find((c) => c.id === cardId)
    if (!prev) return

    storeUpdateCard(cardId, updates)

    const result = await updateCardAction(cardId, updates)
    if (result.error) {
      storeUpdateCard(cardId, prev)
      throw new Error(result.error)
    }
  }

  const deleteCard = async (cardId: string): Promise<void> => {
    const prev = cards.find((c) => c.id === cardId)
    if (!prev) return

    removeCard(cardId)

    const result = await deleteCardAction(cardId)
    if (result.error) {
      addCard(prev)
      toast.error(result.error)
      throw new Error(result.error)
    }
  }

  const moveCards = async (
    updates: Array<{ id: string; column_id: ColumnId; position: number }>
  ): Promise<void> => {
    const snapshot = [...cards]
    updates.forEach(({ id, column_id, position }) => storeUpdateCard(id, { column_id, position }))

    const result = await updateCardPositionsAction(updates)
    if (result.error) {
      setCards(snapshot)
      toast.error('Failed to save card position')
      throw new Error(result.error)
    }
  }

  return { cards, createCard, updateCard, deleteCard, moveCards }
}
