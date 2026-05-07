import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// Add city and country columns to visits table
const { error } = await supabase.rpc('exec_sql', {
  sql: `
    ALTER TABLE visits
      ADD COLUMN IF NOT EXISTS city text,
      ADD COLUMN IF NOT EXISTS country text;
  `
})

if (error) {
  console.error('Migration failed:', error.message)
  // Try direct insert approach to test if columns exist
  console.log('Trying to check if columns already exist...')
  const { data, error: e2 } = await supabase
    .from('visits')
    .select('city, country')
    .limit(1)
  if (e2) {
    console.error('Columns do not exist and migration failed. Run this SQL manually in Supabase:')
    console.log('ALTER TABLE visits ADD COLUMN IF NOT EXISTS city text, ADD COLUMN IF NOT EXISTS country text;')
  } else {
    console.log('Columns already exist.')
  }
} else {
  console.log('Migration successful: city and country columns added to visits table.')
}
