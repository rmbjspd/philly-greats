import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client — used for reading puzzle metadata (no answers)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-only client — used in API routes that need to read answers
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SECRET_KEY ?? supabaseAnonKey
)
