import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const fixes = [
  {
    date: '2026-05-18',
    clue_order: 2,
    answer: 'DAULTON',
    // "NL MVP" is wrong — Daulton was never NL MVP (that was Barry Bonds in '93)
    // He was an NL All-Star and finished 2nd in MVP voting in 1992
    old: "'93 Phillies catcher and soul. Mullet, eye black, NL MVP. (baseball)",
    new: "'93 Phillies catcher and soul. Mullet, eye black, finished second in MVP voting. (baseball)",
  },
  {
    date: '2026-05-27',
    clue_order: 4,
    answer: 'GREENE',
    // Tommy Greene's no-hitter was May 23, 1991, not 1990
    old: 'Threw a no-hitter in 1990. Anchor of the \'93 pennant rotation. (baseball)',
    new: "Threw a no-hitter in 1991. Anchor of the '93 pennant rotation. (baseball)",
  },
  {
    date: '2026-06-05',
    clue_order: 3,
    answer: 'RUNYAN',
    // Runyan was right tackle — for a right-handed QB the blind side is LEFT
    // McNabb was right-handed, so his blind side was protected by the LT, not Runyan
    old: "Eagles right tackle. McNabb's blind side. (football)",
    new: "Eagles right tackle. The wall on McNabb's right for six seasons. (football)",
  },
]

for (const fix of fixes) {
  const { data: puzzle } = await supabase
    .from('puzzles').select('id').eq('puzzle_date', fix.date).single()

  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text: fix.new })
    .eq('puzzle_id', puzzle.id)
    .eq('clue_order', fix.clue_order)

  if (error) { console.error(`Failed ${fix.date} ${fix.answer}:`, error.message) }
  else { console.log(`✓ ${fix.date} [${fix.answer}] fixed`) }
}
