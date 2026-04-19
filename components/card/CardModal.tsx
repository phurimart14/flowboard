'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, ColumnId, Priority, COLUMN_LABELS } from '@/types'
import { useCards } from '@/hooks/useCards'

interface CardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  columnId?: ColumnId
  card?: Card
}

export const CardModal = ({ open, onOpenChange, mode, columnId, card }: CardModalProps) => {
  const { createCard, updateCard, deleteCard } = useCards()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTitle(card?.title ?? '')
      setDescription(card?.description ?? '')
      setDueDate(card?.due_date ?? '')
      setPriority(card?.priority ?? '')
      setError(null)
    }
  }, [open, card])

  const handleClose = () => {
    if (!isSubmitting && !isDeleting) onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'create' && columnId) {
        await createCard(
          columnId,
          title,
          description || undefined,
          dueDate || undefined,
          priority || undefined
        )
      } else if (mode === 'edit' && card) {
        await updateCard(card.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          priority: priority || undefined,
        })
      }
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!card) return
    setIsDeleting(true)
    try {
      await deleteCard(card.id)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card')
      setIsDeleting(false)
    }
  }

  const columnLabel = columnId ? COLUMN_LABELS[columnId] : card ? COLUMN_LABELS[card.column_id] : ''

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px] rounded-[12px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">
            {mode === 'create' ? `Add card to ${columnLabel}` : 'Edit card'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="cardTitle" className="text-sm font-semibold text-[var(--text-primary)]">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cardTitle"
              placeholder="Card title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-[8px]"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cardDesc" className="text-sm font-semibold text-[var(--text-primary)]">
              Description
            </Label>
            <Textarea
              id="cardDesc"
              placeholder="Add a description…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-[8px] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="cardDue" className="text-sm font-semibold text-[var(--text-primary)]">
                Due date
              </Label>
              <input
                id="cardDue"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-8 rounded-[8px] border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-[var(--text-primary)]"
              />
            </div>

            <div className="flex-1 space-y-1">
              <Label className="text-sm font-semibold text-[var(--text-primary)]">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(val: string | null) => setPriority((val ?? '') as Priority | '')}
              >
                <SelectTrigger className="w-full rounded-[8px]">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
              {error}
            </p>
          )}

          <DialogFooter className="-mx-6 -mb-6 mt-2 rounded-b-[12px] px-6 py-4 bg-transparent border-t border-[var(--border)]">
            {mode === 'edit' && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="mr-auto text-red-500 hover:text-red-600 hover:bg-red-50 rounded-[8px]"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isDeleting}
              className="rounded-[8px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="rounded-[8px] bg-[var(--kb-accent)] hover:bg-[var(--kb-accent-hover)] text-white transition-all duration-150 active:scale-[0.97]"
            >
              {isSubmitting
                ? mode === 'create' ? 'Adding…' : 'Saving…'
                : mode === 'create' ? 'Add card' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
