import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzle } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-06-13').single()

// BOLARIS: B(0)O(1)L(2)A(3)R(4)I(5)S(6) → B at 0
const { error } = await supabase
  .from('puzzle_clues')
  .update({
    answer: 'BOLARIS',
    letter_index: 0,
    acrostic_letter: 'B',
    clue_text: 'NBC10 weatherman. Atlantic City models. Three nights of WIP and a maxed-out credit card. (sports media)',
  })
  .eq('puzzle_id', puzzle.id)
  .eq('clue_order', 1)

if (error) { console.error('Failed:', error.message) }
else { console.log('✓ June 13 #1 → BOLARIS') }

// Verify full June 13 puzzle
const { data: check } = await supabase
  .from('puzzle_clues')
  .select('clue_order, answer, letter_index, clue_text')
  .eq('puzzle_id', puzzle.id)
  .order('clue_order')

for (const r of check) {
  console.log(`  ${r.clue_order}. [${r.answer}/${r.letter_index}] ${r.clue_text}`)
}
