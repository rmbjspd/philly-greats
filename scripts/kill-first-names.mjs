import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// answer → new clue text (first name removed, rephrased)
const rewrites = {
  TURNER:     'Opening Day boos turned to curtain calls. (baseball)',
  BYRD:       'Phillies OF. Came over after PED suspension. (baseball)',
  BYARS:      "Buddy Ryan's do-it-all H-back. (football)",
  HARRINGTON: "McNabb's 2007 backup. Reid's emergency call. (football)",
  THOMAS:     'Sixers wing from Iverson-trade fallout. (basketball)',
  JEFFERIES:  'Phillies 1B mid-90s. Mets cast-off. (baseball)',
  BATTIE:     'Sixers backup C, 2007 Iverson-trade roster. (basketball)',
}

for (const [answer, clue_text] of Object.entries(rewrites)) {
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text })
    .eq('answer', answer)
  if (error) { console.error(answer, error.message); continue }
  console.log(`✓ ${answer.padEnd(11)} — "${clue_text}"`)
}

// HOYING needs special handling — it's now on both 6/1 (we just placed it) and 6/7 (existing).
// 6/1 is the keeper. 6/7's HOYING gets replaced by GREGG (Eric, ump) per user pick.
const { data: jun7 } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-06-07').single()

const { error: gerr } = await supabase
  .from('puzzle_clues')
  .update({
    answer: 'GREGG',
    letter_index: 0,
    clue_text: 'Wide zone, 1997 NLCS Game 5. (baseball)',
  })
  .eq('puzzle_id', jun7.id)
  .eq('acrostic_letter', 'G')

if (gerr) console.error('6/7 G:', gerr.message)
else console.log('✓ 6/7 G: HOYING → GREGG[0] — "Wide zone, 1997 NLCS Game 5. (baseball)"')

// And rewrite 6/1 HOYING to drop "Bobby."
const { data: jun1 } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-06-01').single()
const { error: herr } = await supabase
  .from('puzzle_clues')
  .update({ clue_text: 'Eagles QB stopgap, 1997-98. (football)' })
  .eq('puzzle_id', jun1.id)
  .eq('answer', 'HOYING')

if (herr) console.error('6/1 HOYING:', herr.message)
else console.log('✓ 6/1 HOYING — "Eagles QB stopgap, 1997-98. (football)"')
