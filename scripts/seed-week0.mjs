import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const puzzles = [
  {
    puzzle_date: '2026-05-07',
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BYNUM',     letter_index: 0, clue_text: 'Traded Iguodala for him. Never played. (basketball)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'WATKINS',   letter_index: 1, clue_text: 'Firefighter drafted 23rd. WIP baffled. (football)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'BRIERE',    letter_index: 1, clue_text: 'Signed eight years. Cup never came. (hockey)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'GIROUX',    letter_index: 0, clue_text: 'Captain a decade. WIP never settled. (hockey)' },
    ],
  },
  {
    puzzle_date: '2026-05-08',
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BOUCHER',   letter_index: 0, clue_text: 'NHL shutout record. WIP barely noticed. (hockey)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'MAMULA',    letter_index: 1, clue_text: 'Combine freak. Never justified it. (football)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'MORANDINI', letter_index: 2, clue_text: 'Choked up so far his hands left the handle. (baseball)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'GLANVILLE', letter_index: 0, clue_text: 'Penn engineer turned Phillies center fielder. (baseball)' },
    ],
  },
  {
    puzzle_date: '2026-05-09',
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRASHEAR',  letter_index: 0, clue_text: 'Flyers enforcer. WIP defended every fight. (hockey)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'HAYES',     letter_index: 1, clue_text: "'93 World Series third base. Gone. (baseball)" },
      { clue_order: 3, acrostic_letter: 'R', answer: 'FORSBERG',  letter_index: 2, clue_text: 'Greatest player alive. One Flyers season. (hockey)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'INGE',      letter_index: 2, clue_text: 'Spring 2013. Cut before opening day. (baseball)' },
    ],
  },
  {
    puzzle_date: '2026-05-10',
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRUNTLETT', letter_index: 0, clue_text: 'Backup shortstop. Unassisted triple play. 2009. (baseball)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'RATLIFF',   letter_index: 1, clue_text: 'Sixers traded him to get Mutombo. (basketball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'DURBIN',    letter_index: 2, clue_text: 'Middle reliever. 2008 World Series champion. (baseball)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'MAGEE',     letter_index: 2, clue_text: '1994 first-round pick. Never cracked lineup. (baseball)' },
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
