import { createClient } from '@supabase/supabase-js'

// Admin client uses service_role key — bypasses RLS
// ONLY use in server-side code (server actions, route handlers)
// Never expose this client to the browser
export const createAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
