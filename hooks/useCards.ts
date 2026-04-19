'use client'

import { useEffect, useCallback } from 'react'
import { useCardStore } from '@/stores/cardStore'
import { useBoardStore } from '@/stores/boardStore'
import {
  fetchCardsAction,
  createCardAction,
  updateCardAction,
  deleteCardAction,
} from '@/app/(main)/actions/card'
import { Card, ColumnId, Priority } from '@/types'

export const useCards = () => {
  const { cards, setCards, addCard, updateCard: storeUpdateCard, removeCard } = useCardStore()
  const activeBoard = useBoardStore((s) => s.activeBoard)

  const fetchCards = useCallback(async () => {
    if (!activeBoard) return
    const result = await fetchCardsAction(activeBoard.id)
    if (result.error) throw new Error(result.error)
    setCards(result.data ?? [])
  }, [activeBoard, setCards])

  useEffect(() => {
    if (activeBoard) {
      fetchCards()
    } else {
      setCards([])
    }
  }, [activeBoard, fetchCards, setCards])

  const createCard = async (
    columnId: ColumnId,
    title: string,
    description?: string,
    dueDate?: string,
    priority?: Priority
  ): Promise<Card> => {
    if (!activeBoard) throw new Error('No active board')
    const result = await createCardAction(activeBoard.id, columnId, title, description, dueDate, priority)
    if (result.error) throw new Error(result.error)
    const card = result.data!
    addCard(card)
    return card
  }

  const updateCard = async (
    cardId: string,
    updates: Partial<Pick<Card, 'title' | 'description' | 'due_date' | 'priority' | 'column_id' | 'position'>>
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
      throw new Error(result.error)
    }
  }

  return { cards, createCard, updateCard, deleteCard, refetch: fetchCards }
}
