import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// June 4: GROSS → GEARY (clue_order 4)
// June 13: AMARO → MAHORN (clue_order 2), BYARS → BEDROSIAN (clue_order 1)

const { data: jun4 } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-06-04').single()

const { data: jun13 } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-06-13').single()

const updates = [
  {
    puzzle_id: jun4.id,
    clue_order: 4,
    answer: 'GEARY',
    letter_index: 0,
    acrostic_letter: 'G',
    clue_text: 'Eighty-one mound appearances in 2006. Set a Phillies franchise record nobody celebrated. (baseball)',
  },
  {
    puzzle_id: jun13.id,
    clue_order: 2,
    answer: 'MAHORN',
    letter_index: 1,
    acrostic_letter: 'A',
    clue_text: "Won a ring with Detroit's Bad Boys, then ended up on Broad Street with Barkley. (basketball)",
  },
  {
    puzzle_id: jun13.id,
    clue_order: 1,
    answer: 'BEDROSIAN',
    letter_index: 0,
    acrostic_letter: 'B',
    clue_text: 'Bedrock. The 1987 NL Cy Young. Dealt to San Francisco before the Phillies were worth watching again. (baseball)',
  },
]

for (const u of updates) {
  const { error } = await supabase
    .from('puzzle_clues')
    .update({
      answer: u.answer,
      letter_index: u.letter_index,
      acrostic_letter: u.acrostic_letter,
      clue_text: u.clue_text,
    })
    .eq('puzzle_id', u.puzzle_id)
    .eq('clue_order', u.clue_order)

  if (error) {
    console.error(`Failed to update ${u.answer}:`, error.message)
  } else {
    console.log(`✓ Updated clue_order ${u.clue_order} in puzzle ${u.puzzle_id} → ${u.answer}`)
  }
}

// Verify
const { data: check } = await supabase
  .from('puzzle_clues')
  .select('clue_order, answer, clue_text, puzzles!inner(puzzle_date)')
  .in('puzzles.puzzle_date', ['2026-06-04', '2026-06-13'])
  .order('clue_order')

for (const row of (check ?? [])) {
  console.log(`${row.puzzles.puzzle_date} #${row.clue_order}: [${row.answer}] ${row.clue_text}`)
}
