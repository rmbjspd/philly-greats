import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// Week 3+. Saturday June 13 — hard day, deep cuts.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const puzzles = [
  {
    puzzle_date: '2026-06-13', // Saturday — hard
    clues: [
      // BYARS: B(0)Y(1)A(2)R(3)S(4) → B at 0
      { clue_order: 1, acrostic_letter: 'B', answer: 'BYARS',   letter_index: 0, clue_text: "Cunningham's security blanket. Seventy-two catches, no one noticed. (football)" },
      // AMARO: A(0)M(1)A(2)R(3)O(4) → A at 0
      { clue_order: 2, acrostic_letter: 'A', answer: 'AMARO',   letter_index: 0, clue_text: 'Traded Lee twice. Callers never forgave. (baseball)' },
      // MERLINO: M(0)E(1)R(2)L(3)I(4)N(5)O(6) → R at 2
      { clue_order: 3, acrostic_letter: 'R', answer: 'MERLINO', letter_index: 2, clue_text: 'Eskin called him live. Lindros tickets. (sports media)' },
      // GROSS: G(0)R(1)O(2)S(3)S(4) → G at 0
      { clue_order: 4, acrostic_letter: 'G', answer: 'GROSS',   letter_index: 0, clue_text: 'Thumbtack in glove. Ten-game suspension. (baseball)' },
    ],
  },
]

for (const puzzle of puzzles) {
  const { data: puzzleRow, error: puzzleError } = await supabase
    .from('puzzles')
    .insert({ puzzle_date: puzzle.puzzle_date, published: true })
    .select('id')
    .single()

  if (puzzleError) {
    console.error(`Failed to insert puzzle ${puzzle.puzzle_date}:`, puzzleError.message)
    continue
  }

  const clueRows = puzzle.clues.map((c) => ({
    puzzle_id: puzzleRow.id,
    clue_order: c.clue_order,
    acrostic_letter: c.acrostic_letter,
    answer: c.answer,
    letter_index: c.letter_index,
    clue_text: c.clue_text,
  }))

  const { error: clueError } = await supabase.from('puzzle_clues').insert(clueRows)

  if (clueError) {
    console.error(`Failed to insert clues for ${puzzle.puzzle_date}:`, clueError.message)
  } else {
    console.log(`✓ ${puzzle.puzzle_date} seeded (id: ${puzzleRow.id})`)
  }
}
