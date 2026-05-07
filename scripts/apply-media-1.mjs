import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

async function update(date, slot, fields) {
  const { data } = await supabase.from('puzzles').select('id').eq('puzzle_date', date).single()
  if (!data) { console.error(`no puzzle for ${date}`); return }
  const { error } = await supabase
    .from('puzzle_clues')
    .update(fields)
    .eq('puzzle_id', data.id)
    .eq('acrostic_letter', slot)
  if (error) { console.error(`${date} ${slot}:`, error.message); return }
  console.log(`✓ ${date} ${slot}: ${fields.answer}[${fields.letter_index}] — "${fields.clue_text}"`)
}

// 5/20 G: SCHILLING[8] → GARGANO[3]  (width 14→9)
await update('2026-05-20', 'G', {
  answer: 'GARGANO',
  letter_index: 3,
  clue_text: 'Produced the Immaculata championship film. (media)',
})

// 5/25 R: HOWARD[4] → MORGANTI[2]  (width 11→9, kills HOWARD dup)
await update('2026-05-25', 'R', {
  answer: 'MORGANTI',
  letter_index: 2,
  clue_text: 'WIP hockey voice since the Spectrum. (radio)',
})

// 5/28 A: STACKHOUSE[2] → SKALICKY[2]  (width 11→9)
await update('2026-05-28', 'A', {
  answer: 'SKALICKY',
  letter_index: 2,
  clue_text: 'NBC Sports Philly rinkside bottle rocket. (media)',
})
