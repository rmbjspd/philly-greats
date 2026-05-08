import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data, error } = await supabase
  .from('puzzle_clues')
  .select('clue_order, acrostic_letter, answer, letter_index, clue_text, puzzles!inner(puzzle_date)')
  .order('puzzle_date', { foreignTable: 'puzzles' })
  .order('clue_order')

if (error) { console.error(error); process.exit(1) }

let cur = ''
for (const r of data) {
  const d = r.puzzles.puzzle_date
  if (d !== cur) { cur = d; console.log('\n## ' + d) }
  console.log(`${r.clue_order}. [${r.answer}] (${r.acrostic_letter} at ${r.letter_index}) ${r.clue_text}`)
}
