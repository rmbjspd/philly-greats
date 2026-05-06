import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// Find the 5/15 puzzle and update the PERSON clue (clue_order 3)
const { data: puzzle } = await supabase
  .from('puzzles')
  .select('id')
  .eq('puzzle_date', '2026-05-15')
  .single()

if (!puzzle) { console.error('No puzzle found for 2026-05-15'); process.exit(1) }

const { error } = await supabase
  .from('puzzle_clues')
  .update({ clue_text: "Person's People showed up every night. (baseball)" })
  .eq('puzzle_id', puzzle.id)
  .eq('clue_order', 3)

if (error) { console.error(error.message); process.exit(1) }
console.log('✓ Updated 5/15 PERSON clue to: "Person\'s People showed up every night. (baseball)"')
