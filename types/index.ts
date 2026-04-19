export type Priority = 'high' | 'mid' | 'low'
export type ColumnId = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export interface Board {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export interface Card {
  id: string
  board_id: string
  column_id: ColumnId
  title: string
  description?: string
  due_date?: string
  priority?: Priority
  position: number
  created_by: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface BoardMember {
  id: string
  board_id: string
  user_id: string
  joined_at: string
}

export const COLUMN_IDS: ColumnId[] = ['backlog', 'todo', 'in_progress', 'review', 'done']

export const COLUMN_LABELS: Record<ColumnId, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
}
