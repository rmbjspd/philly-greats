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
  .eq('puzzle_date', '2026-05-30')
  .single()

if (!puzzle) { console.error('No puzzle found for 2026-05-30'); process.exit(1) }

const { error } = await supabase
  .from('puzzle_clues')
  .update({
    answer: 'BOWA',
    letter_index: 0,
    clue_text: 'Manager who feuded with Rolen daily. (baseball)',
  })
  .eq('puzzle_id', puzzle.id)
  .eq('clue_order', 1)

if (error) { console.error(error.message); process.exit(1) }
console.log('✓ Updated 5/30 B slot: CHAMBERLAIN → BOWA')
console.log('  Clue: "Manager who feuded with Rolen daily. (baseball)"')
