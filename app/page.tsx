import { redirect } from 'next/navigation'

// Middleware handles session-based routing.
// This page is only reached when no session exists (middleware lets it through).
export default function HomePage() {
  redirect('/login')
}
