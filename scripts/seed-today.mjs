import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const puzzle = {
  puzzle_date: '2026-05-06',
  clues: [
    { clue_order: 1, acrostic_letter: 'B', answer: 'MCNABB',   letter_index: 4, clue_text: "Cataldi's Dirty 30 booed the pick. (football)" },
    { clue_order: 2, acrostic_letter: 'A', answer: 'HALLADAY', letter_index: 1, clue_text: 'Perfect game. Then playoff no-hitter. (baseball)' },
    { clue_order: 3, acrostic_letter: 'R', answer: 'ABREU',    letter_index: 2, clue_text: 'Refused to hit walls. Callers fumed. (baseball)' },
    { clue_order: 4, acrostic_letter: 'G', answer: 'IGUODALA', letter_index: 1, clue_text: 'Booed every touch on his return. (basketball)' },
  ],
}

const { data: row, error: puzzleError } = await supabase
  .from('puzzles')
  .insert({ puzzle_date: puzzle.puzzle_date, published: true })
  .select('id')
  .single()

if (puzzleError) { console.error(puzzleError.message); process.exit(1) }

const { error: clueError } = await supabase.from('puzzle_clues').insert(
  puzzle.clues.map((c) => ({ puzzle_id: row.id, ...c }))
)

if (clueError) { console.error(clueError.message); process.exit(1) }

console.log(`✓ 2026-05-06 test puzzle seeded (id: ${row.id})`)
console.log('  B: MCNABB   — "Cataldi\'s Dirty 30 booed the pick."')
console.log('  A: HALLADAY — "Perfect game. Then playoff no-hitter."')
console.log('  R: ABREU    — "Refused to hit walls. Callers fumed."')
console.log('  G: IGUODALA — "Booed every touch on his return."')
