import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzle } = await supabase
  .from('puzzles')
  .select('id, puzzle_date')
  .eq('puzzle_date', '2026-05-30')
  .single()

const { data: clues } = await supabase
  .from('puzzle_clues')
  .select('clue_order, acrostic_letter, answer, letter_index, clue_text')
  .eq('puzzle_id', puzzle.id)
  .order('clue_order')

for (const c of clues) {
  console.log(`${c.acrostic_letter} (idx ${c.letter_index}): ${c.answer.padEnd(12)} — "${c.clue_text}"`)
}
