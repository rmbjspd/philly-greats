import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzle } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-05-09').single()

// PRATT: P(0)R(1)A(2)T(3)T(4) → A at 2
const { error } = await supabase
  .from('puzzle_clues')
  .update({
    answer: 'PRATT',
    letter_index: 2,
    acrostic_letter: 'A',
    clue_text: "He backed up Daulton in '93 and Lieberthal in '03, but the Vet's last great night belonged to him. (baseball)",
  })
  .eq('puzzle_id', puzzle.id)
  .eq('clue_order', 2)

if (error) { console.error('Failed:', error.message) }
else { console.log('✓ May 9 #2 → PRATT') }

const { data: check } = await supabase
  .from('puzzle_clues')
  .select('clue_order, answer, letter_index, clue_text')
  .eq('puzzle_id', puzzle.id)
  .order('clue_order')

for (const r of check) {
  console.log(`  ${r.clue_order}. [${r.answer}/${r.letter_index}] ${r.clue_text}`)
}
