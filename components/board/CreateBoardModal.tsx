'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBoards } from '@/hooks/useBoards'
import { Board } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Board name is required').max(50, 'Max 50 characters'),
})
type FormValues = z.infer<typeof schema>

interface CreateBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean, ...args: unknown[]) => void
  onCreated: (board: Board) => void
}

export const CreateBoardModal = ({ open, onOpenChange, onCreated }: CreateBoardModalProps) => {
  const { createBoard } = useBoards()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      const board = await createBoard(values.name.trim())
      reset()
      onCreated(board)
      onOpenChange(false)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create board')
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setServerError(null)
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[480px] rounded-[12px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">
            New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="boardName" className="text-sm font-semibold text-[var(--text-primary)]">
              Board name
            </Label>
            <Input
              id="boardName"
              placeholder="e.g. Product Roadmap"
              autoFocus
              className="rounded-[8px] border-[var(--kb-border)]"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {serverError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="rounded-[8px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[8px] bg-[var(--kb-accent)] hover:bg-[var(--kb-accent-hover)] text-white transition-all duration-150 active:scale-[0.97]"
            >
              {isSubmitting ? 'Creating…' : 'Create Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
