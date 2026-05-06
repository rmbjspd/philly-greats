import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzle } = await supabase
  .from('puzzles')
  .select('id')
  .eq('puzzle_date', '2026-05-07')
  .single()

if (!puzzle) { console.error('No puzzle found for 2026-05-07'); process.exit(1) }

const { error } = await supabase
  .from('puzzle_clues')
  .update({ clue_text: 'Front office reunited with Jonesey. (hockey)' })
  .eq('puzzle_id', puzzle.id)
  .eq('answer', 'BRIERE')

if (error) { console.error(error.message); process.exit(1) }
console.log('✓ Updated 5/7 BRIERE clue to: "Front office reunited with Jonesey. (hockey)"')
