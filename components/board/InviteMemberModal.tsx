'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchMembersAction, inviteMemberAction, removeMemberAction, MemberWithProfile } from '@/app/(main)/actions/member'
import { Board, Profile } from '@/types'

interface InviteMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  board: Board
  currentProfile: Profile
}

export const InviteMemberModal = ({ open, onOpenChange, board, currentProfile }: InviteMemberModalProps) => {
  const [members, setMembers] = useState<MemberWithProfile[]>([])
  const [email, setEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isOwner = board.owner_id === currentProfile.id

  const loadMembers = useCallback(async () => {
    const result = await fetchMembersAction(board.id)
    if (result.data) setMembers(result.data)
  }, [board.id])

  useEffect(() => {
    if (open) {
      setEmail('')
      setError(null)
      setSuccess(null)
      loadMembers()
    }
  }, [open, loadMembers])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setSuccess(null)
    setIsInviting(true)
    try {
      const result = await inviteMemberAction(board.id, email.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(`Invited ${email.trim()} successfully`)
        setEmail('')
        await loadMembers()
      }
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async (userId: string) => {
    const result = await removeMemberAction(board.id, userId)
    if (result.error) {
      setError(result.error)
    } else {
      setMembers((prev) => prev.filter((m) => m.user_id !== userId))
    }
  }

  const getDisplayName = (m: MemberWithProfile) =>
    m.profile.full_name || m.profile.email

  const getInitials = (m: MemberWithProfile) => {
    const name = m.profile.full_name || m.profile.email
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] rounded-[12px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[var(--text-primary)]">
            Members — {board.name}
          </DialogTitle>
        </DialogHeader>

        {/* Members list */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[11px] font-bold text-[var(--accent)] shrink-0">
                  {getInitials(m)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                    {getDisplayName(m)}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate">{m.profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {m.user_id === board.owner_id && (
                  <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-[6px]">
                    Owner
                  </span>
                )}
                {isOwner && m.user_id !== board.owner_id && (
                  <button
                    onClick={() => handleRemove(m.user_id)}
                    className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Invite form — owner only */}
        {isOwner && (
          <form onSubmit={handleInvite} className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
            <Label className="text-sm font-semibold text-[var(--text-primary)]">
              Invite by email
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-[8px] flex-1"
              />
              <Button
                type="submit"
                disabled={isInviting || !email.trim()}
                className="rounded-[8px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shrink-0 active:scale-[0.97] transition-all duration-150"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                {isInviting ? 'Inviting…' : 'Invite'}
              </Button>
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-[8px] px-3 py-2">
                {success}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
