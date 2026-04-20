'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { toast } from 'sonner'
import { useCardStore } from '@/stores/cardStore'
import { useBoardStore } from '@/stores/boardStore'
import { createClient } from '@/lib/supabase/client'
import { fetchCardsAction } from '@/app/(main)/actions/card'
import { Card } from '@/types'

export const useCardsSync = () => {
  const { setCards } = useCardStore()
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

  const activeBoardId = activeBoard?.id
  const channelSeqRef = useRef(0)

  useEffect(() => {
    if (!activeBoardId) return

    channelSeqRef.current += 1
    const channelName = `cards-${activeBoardId}-${channelSeqRef.current}`
    const supabase = createClient()
    const channel = supabase.channel(channelName)

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cards', filter: `board_id=eq.${activeBoardId}` },
        (payload) => {
          const incoming = payload.new as Card
          const { cards: current, addCard } = useCardStore.getState()
          if (!current.find((c) => c.id === incoming.id)) addCard(incoming)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cards', filter: `board_id=eq.${activeBoardId}` },
        (payload) => {
          useCardStore.getState().updateCard((payload.new as Card).id, payload.new as Partial<Card>)
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'cards', filter: `board_id=eq.${activeBoardId}` },
        (payload) => {
          useCardStore.getState().removeCard((payload.old as { id: string }).id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeBoardId])

  return { cardsLoading, refetch: fetchCards }
}
