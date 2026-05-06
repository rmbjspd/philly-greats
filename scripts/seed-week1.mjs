import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const puzzles = [
  {
    puzzle_date: '2026-05-11', // Monday — easy
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BURRELL',    letter_index: 0, clue_text: '2008 NLCS walk. WIP went nuts. (baseball)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'HAMELS',     letter_index: 1, clue_text: 'Admitted beaning Harper. WIP thought: relatable. (baseball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'IVERSON',    letter_index: 3, clue_text: "Eskin swore he'd had Coronas beforehand. (basketball)" },
      { clue_order: 4, acrostic_letter: 'G', answer: 'GRAHAM',     letter_index: 0, clue_text: 'Broke down crying on WIP postgame. (football)' },
    ],
  },
  {
    puzzle_date: '2026-05-12', // Tuesday — easy-medium
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'SCHWARBER',  letter_index: 6, clue_text: "Cataldi called him the Phillies' Kelce. (baseball)" },
      { clue_order: 2, acrostic_letter: 'A', answer: 'DAWKINS',    letter_index: 1, clue_text: 'Banner let him go. WIP raged. (football)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'ROLLINS',    letter_index: 0, clue_text: 'Called Philly fans frontrunners. Then delivered. (baseball)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'LIDGE',      letter_index: 3, clue_text: '41-for-41. Fell to his knees. (baseball)' },
    ],
  },
  {
    puzzle_date: '2026-05-13', // Wednesday — medium
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'MCNABB',     letter_index: 4, clue_text: "Cataldi's Dirty 30 booed the pick. (football)" },
      { clue_order: 2, acrostic_letter: 'A', answer: 'HALLADAY',   letter_index: 1, clue_text: 'Perfect game. Then playoff no-hitter. (baseball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'ABREU',      letter_index: 2, clue_text: 'Refused to hit walls. Callers fumed. (baseball)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'IGUODALA',   letter_index: 1, clue_text: 'Booed every touch on his return. (basketball)' },
    ],
  },
  {
    puzzle_date: '2026-05-14', // Thursday — medium-hard
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRINDAMOUR', letter_index: 0, clue_text: 'WIP barely noticed when he left. (hockey)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'IBANEZ',     letter_index: 2, clue_text: 'Offered his stool to the callers. (baseball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'WATTERS',    letter_index: 5, clue_text: "For who, for what. WIP's anthem. (football)" },
      { clue_order: 4, acrostic_letter: 'G', answer: 'GAGNE',      letter_index: 0, clue_text: 'Eight concussions. WIP debated every one. (hockey)' },
    ],
  },
  {
    puzzle_date: '2026-05-15', // Friday — hard
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BOTTALICO',  letter_index: 0, clue_text: "1996 All-Star. WIP's last Vet closer. (baseball)" },
      { clue_order: 2, acrostic_letter: 'A', answer: 'THOMASSON',  letter_index: 4, clue_text: 'WIP never once dialed him up. (baseball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'PERSON',     letter_index: 2, clue_text: "Person's People showed up every night. (baseball)" },
      { clue_order: 4, acrostic_letter: 'G', answer: 'COVINGTON',  letter_index: 5, clue_text: 'Process-era 3-and-D. WIP took for granted. (basketball)' },
    ],
  },
  {
    puzzle_date: '2026-05-16', // Saturday — harder
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BARNETT',    letter_index: 0, clue_text: '1992 Pro Bowler. WIP forgot him. (football)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'PADILLA',    letter_index: 1, clue_text: "Padilla's Flotilla was an actual thing. (baseball)" },
      { clue_order: 3, acrostic_letter: 'R', answer: 'STOCKER',    letter_index: 6, clue_text: "'93 World Series shortstop. Gone by '97. (baseball)" },
      { clue_order: 4, acrostic_letter: 'G', answer: 'RENBERG',    letter_index: 6, clue_text: "Legion of Doom's forgotten third wheel. (hockey)" },
    ],
  },
  {
    puzzle_date: '2026-05-17', // Sunday — hardest
    clues: [
      { clue_order: 1, acrostic_letter: 'B', answer: 'BATISTE',    letter_index: 0, clue_text: 'Error then walk-off double. Same game. (baseball)' },
      { clue_order: 2, acrostic_letter: 'A', answer: 'VANHORN',    letter_index: 1, clue_text: 'One Sixers season. WIP barely noticed. (basketball)' },
      { clue_order: 3, acrostic_letter: 'R', answer: 'MARSH',      letter_index: 2, clue_text: 'Career: twenty MLB games. WIP: zero calls. (baseball)' },
      { clue_order: 4, acrostic_letter: 'G', answer: 'DAIGLE',     letter_index: 3, clue_text: 'Said nobody remembers who went second. (hockey)' },
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
