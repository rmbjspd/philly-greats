import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// Week 2 (May 18–24). Media figures capped at ~20% of total answers across all weeks.
// This week: 5 media out of 28 clues (18%). Sat is the "media/coverage" day by design.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const puzzles = [
  {
    puzzle_date: '2026-05-18', // Monday — easy athletes
    clues: [
      // WESTBROOK: W(0)E(1)S(2)T(3)B(4)R(5)O(6)O(7)K(8) → B at 4
      { clue_order: 1, acrostic_letter: 'B', answer: 'WESTBROOK',  letter_index: 4, clue_text: 'Kneeled at the one-yard line. (football)' },
      // HOWARD: H(0)O(1)W(2)A(3)R(4)D(5) → A at 3
      { clue_order: 2, acrostic_letter: 'A', answer: 'HOWARD',     letter_index: 3, clue_text: '2006 MVP. Strikeouts too. WIP forgave. (baseball)' },
      // ROLEN: R(0)O(1)L(2)E(3)N(4) → R at 0
      { clue_order: 3, acrostic_letter: 'R', answer: 'ROLEN',      letter_index: 0, clue_text: 'Clashed with Bowa. Traded. WIP ranted. (baseball)' },
      // GOEDERT: G(0)O(1)E(2)D(3)E(4)R(5)T(6) → G at 0
      { clue_order: 4, acrostic_letter: 'G', answer: 'GOEDERT',    letter_index: 0, clue_text: 'Took the mantle from Zach Ertz. (football)' },
    ],
  },
  {
    puzzle_date: '2026-05-19', // Tuesday — easy-medium athletes
    clues: [
      // PAPELBON: P(0)A(1)P(2)E(3)L(4)B(5)O(6)N(7) → B at 5
      { clue_order: 1, acrostic_letter: 'B', answer: 'PAPELBON',   letter_index: 5, clue_text: 'Choked Revere in the dugout. (baseball)' },
      // BARKLEY: B(0)A(1)R(2)K(3)L(4)E(5)Y(6) → A at 1
      { clue_order: 2, acrostic_letter: 'A', answer: 'BARKLEY',    letter_index: 1, clue_text: 'Demanded a trade. Sixers obliged. (basketball)' },
      // LINDROS: L(0)I(1)N(2)D(3)R(4)O(5)S(6) → R at 4
      { clue_order: 3, acrostic_letter: 'R', answer: 'LINDROS',    letter_index: 4, clue_text: 'Flyers gave everything. He never won. (hockey)' },
      // AGHOLOR: A(0)G(1)H(2)O(3)L(4)O(5)R(6) → G at 1
      { clue_order: 4, acrostic_letter: 'G', answer: 'AGHOLOR',    letter_index: 1, clue_text: 'Dropped first. Caught the big one. (football)' },
    ],
  },
  {
    puzzle_date: '2026-05-20', // Wednesday — medium, one media figure
    clues: [
      // BRADFORD: B(0)R(1)A(2)D(3)F(4)O(5)R(6)D(7) → B at 0
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRADFORD',   letter_index: 0, clue_text: 'Highest-paid Eagle. Played one season. (football)' },
      // DAULTON: D(0)A(1)U(2)L(3)T(4)O(5)N(6) → A at 1
      { clue_order: 2, acrostic_letter: 'A', answer: 'DAULTON',    letter_index: 1, clue_text: "Led '93 Phillies. WIP's spiritual captain. (baseball)" },
      // CROCE: C(0)R(1)O(2)C(3)E(4) → R at 1 [media]
      { clue_order: 3, acrostic_letter: 'R', answer: 'CROCE',      letter_index: 1, clue_text: 'Sixers president. Dove into the crowd. (sports media)' },
      // GALVIS: G(0)A(1)L(2)V(3)I(4)S(5) → G at 0
      { clue_order: 4, acrostic_letter: 'G', answer: 'GALVIS',     letter_index: 0, clue_text: 'Phillies shortstop. Six quiet years. (baseball)' },
    ],
  },
  {
    puzzle_date: '2026-05-21', // Thursday — medium-hard, all athletes
    clues: [
      // LIEBERTHAL: L(0)I(1)E(2)B(3)E(4)R(5)T(6)H(7)A(8)L(9) → B at 3
      { clue_order: 1, acrostic_letter: 'B', answer: 'LIEBERTHAL', letter_index: 3, clue_text: 'Phillies catcher. Two All-Stars. WIP forgot. (baseball)' },
      // LECLAIR: L(0)E(1)C(2)L(3)A(4)I(5)R(6) → A at 4
      { clue_order: 2, acrostic_letter: 'A', answer: 'LECLAIR',    letter_index: 4, clue_text: 'Legion of Doom. Scored fifty goals. (hockey)' },
      // PRONGER: P(0)R(1)O(2)N(3)G(4)E(5)R(6) → R at 1
      { clue_order: 3, acrostic_letter: 'R', answer: 'PRONGER',    letter_index: 1, clue_text: 'Most dangerous Flyer. Played 27 games. (hockey)' },
      // REAGOR: R(0)E(1)A(2)G(3)O(4)R(5) → G at 3
      { clue_order: 4, acrostic_letter: 'G', answer: 'REAGOR',     letter_index: 3, clue_text: "Eagles' first-round miss. WIP never forgot. (football)" },
    ],
  },
  {
    puzzle_date: '2026-05-22', // Friday — hard, one media figure
    clues: [
      // BRAND: B(0)R(1)A(2)N(3)D(4) → B at 0
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRAND',      letter_index: 0, clue_text: "Sixers' max contract. Achilles ended it. (basketball)" },
      // PRIMEAU: P(0)R(1)I(2)M(3)E(4)A(5)U(6) → A at 5
      { clue_order: 2, acrostic_letter: 'A', answer: 'PRIMEAU',    letter_index: 5, clue_text: 'Concussions ended his career. WIP mourned. (hockey)' },
      // DYKSTRA: D(0)Y(1)K(2)S(3)T(4)R(5)A(6) → R at 5
      { clue_order: 3, acrostic_letter: 'R', answer: 'DYKSTRA',    letter_index: 5, clue_text: 'Nails. Chew. Then a federal indictment. (baseball)' },
      // GARGANO: G(0)A(1)R(2)G(3)A(4)N(5)O(6) → G at 0 [media]
      { clue_order: 4, acrostic_letter: 'G', answer: 'GARGANO',    letter_index: 0, clue_text: 'The Cuz. WIP noon show. Beloved. (sports media)' },
    ],
  },
  {
    puzzle_date: '2026-05-23', // Saturday — harder, three media (the "coverage" day)
    clues: [
      // BOWEN: B(0)O(1)W(2)E(3)N(4) → B at 0 [media]
      { clue_order: 1, acrostic_letter: 'B', answer: 'BOWEN',      letter_index: 0, clue_text: 'Eagles beat. Thirty years. Still going. (sports media)' },
      // STALEY: S(0)T(1)A(2)L(3)E(4)Y(5) → A at 2
      { clue_order: 2, acrostic_letter: 'A', answer: 'STALEY',     letter_index: 2, clue_text: 'Temple legend. Three Olympics. WIP passed. (basketball)' },
      // DIDINGER: D(0)I(1)D(2)I(3)N(4)G(5)E(6)R(7) → R at 7 [media]
      { clue_order: 3, acrostic_letter: 'R', answer: 'DIDINGER',   letter_index: 7, clue_text: "Hall of Fame writer. Eagles' biographer. (sports media)" },
      // MCGINNIS: M(0)C(1)G(2)I(3)N(4)N(5)I(6)S(7) → G at 2 [media]
      { clue_order: 4, acrostic_letter: 'G', answer: 'MCGINNIS',   letter_index: 2, clue_text: 'Sixers radio voice. Three decades. (sports media)' },
    ],
  },
  {
    puzzle_date: '2026-05-24', // Sunday — hardest, all athletes
    clues: [
      // BRIGNAC: B(0)R(1)I(2)G(3)N(4)A(5)C(6) → B at 0
      { clue_order: 1, acrostic_letter: 'B', answer: 'BRIGNAC',    letter_index: 0, clue_text: 'Backup infielder. 2013 Phillies. Career blink. (baseball)' },
      // DAVIS: D(0)A(1)V(2)I(3)S(4) → A at 1
      { clue_order: 2, acrostic_letter: 'A', answer: 'DAVIS',      letter_index: 1, clue_text: 'Sports Illustrated cover. Thirteen years old. (baseball)' },
      // MARZANO: M(0)A(1)R(2)Z(3)A(4)N(5)O(6) → R at 2
      { clue_order: 3, acrostic_letter: 'R', answer: 'MARZANO',    letter_index: 2, clue_text: 'Phillies emergency catcher. Nobody called. (baseball)' },
      // INCAVIGLIA: I(0)N(1)C(2)A(3)V(4)I(5)G(6)L(7)I(8)A(9) → G at 6
      { clue_order: 4, acrostic_letter: 'G', answer: 'INCAVIGLIA', letter_index: 6, clue_text: '1993 World Series Phillie. Nobody recalls. (baseball)' },
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
