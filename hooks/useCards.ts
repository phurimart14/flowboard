'use client'

import { useEffect, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useCardStore } from '@/stores/cardStore'
import { useBoardStore } from '@/stores/boardStore'
import { createClient } from '@/lib/supabase/client'
import {
  fetchCardsAction,
  createCardAction,
  updateCardAction,
  deleteCardAction,
  updateCardPositionsAction,
} from '@/app/(main)/actions/card'
import { Card, ColumnId, Priority } from '@/types'

export const useCards = () => {
  const { cards, setCards, addCard, updateCard: storeUpdateCard, removeCard } = useCardStore()
  const activeBoard = useBoardStore((s) => s.activeBoard)
  const [cardsLoading, setCardsLoading] = useState(false)

  const fetchCards = useCallback(async () => {
    if (!activeBoard) return
    setCardsLoading(true)
    try {
      const result = await fetchCardsAction(activeBoard.id)
      if (result.error) throw new Error(result.error)
      setCards(result.data ?? [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load cards')
    } finally {
      setCardsLoading(false)
    }
  }, [activeBoard, setCards])

  useEffect(() => {
    if (activeBoard) {
      fetchCards()
    } else {
      setCards([])
    }
  }, [activeBoard, fetchCards, setCards])

  useEffect(() => {
    if (!activeBoard) return

    const supabase = createClient()
    const boardId = activeBoard.id
    const channel = supabase.channel(`cards-${boardId}-${Date.now()}`)

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          const incoming = payload.new as Card
          const { cards: current, addCard: add } = useCardStore.getState()
          if (!current.find((c) => c.id === incoming.id)) add(incoming)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          useCardStore.getState().updateCard((payload.new as Card).id, payload.new as Partial<Card>)
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          useCardStore.getState().removeCard((payload.old as { id: string }).id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeBoard])

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

  return { cards, cardsLoading, createCard, updateCard, deleteCard, moveCards, refetch: fetchCards }
}
