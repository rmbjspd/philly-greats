import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const fixes = [
  {
    date: '2026-06-13',
    answer: 'GROSS',
    clue_order: 4,
    // Gross used sandpaper, not a thumbtack
    clue_text: 'Sandpaper in the glove. Ten-game suspension. (baseball)',
  },
  {
    date: '2026-05-09',
    answer: 'BRASHEAR',
    clue_order: 1,
    // Hatcher was Dallas Stars — not a Flyer
    clue_text: 'Flyers heavyweight. Put Hatcher flat — Hatcher was Dallas\'s toughest. (hockey)',
  },
  {
    date: '2026-05-09',
    answer: 'HAYES',
    clue_order: 2,
    // Replace entirely — original was ambiguous (Phillies fans assume their own 3B)
    clue_text: "Toronto's third baseman in the '93 Series. WIP hung up. (baseball)",
  },
]

for (const fix of fixes) {
  const { data: puzzle } = await supabase
    .from('puzzles').select('id').eq('puzzle_date', fix.date).single()

  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text: fix.clue_text })
    .eq('puzzle_id', puzzle.id)
    .eq('clue_order', fix.clue_order)

  if (error) { console.error(`Failed ${fix.date} ${fix.answer}:`, error.message) }
  else { console.log(`✓ ${fix.date} [${fix.answer}] → ${fix.clue_text}`) }
}
