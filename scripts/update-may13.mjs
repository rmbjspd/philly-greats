import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const newClues = [
  { clue_order: 1, acrostic_letter: 'B', answer: 'WESTBROOK', letter_index: 4, clue_text: 'Kneeled at one-yard line, 2003 Cowboys. (football)' },
  { clue_order: 2, acrostic_letter: 'A', answer: 'HOWARD',    letter_index: 3, clue_text: 'Torn Achilles, carried off 2011. (baseball)' },
  { clue_order: 3, acrostic_letter: 'R', answer: 'KRUK',      letter_index: 1, clue_text: "Ain't an athlete, lady. 1993 Phillie. (baseball)" },
  { clue_order: 4, acrostic_letter: 'G', answer: 'WAGNER',    letter_index: 2, clue_text: 'Phillies closer. Bolted for Mets. (baseball)' },
]

const { data: puzzle } = await supabase
  .from('puzzles')
  .select('id')
  .eq('puzzle_date', '2026-05-13')
  .single()

if (!puzzle) { console.error('No puzzle found for 2026-05-13'); process.exit(1) }

const { error: delError } = await supabase
  .from('puzzle_clues')
  .delete()
  .eq('puzzle_id', puzzle.id)

if (delError) { console.error(delError.message); process.exit(1) }

const { error: insError } = await supabase
  .from('puzzle_clues')
  .insert(newClues.map((c) => ({ puzzle_id: puzzle.id, ...c })))

if (insError) { console.error(insError.message); process.exit(1) }

console.log('✓ Updated 5/13 puzzle:')
for (const c of newClues) {
  console.log(`  ${c.acrostic_letter}: ${c.answer.padEnd(10)} — "${c.clue_text}"`)
}
