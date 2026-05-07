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

// GIROUX dup (5/7 + 5/23): keep 5/7, replace 5/23 G
await update('2026-05-23', 'G', {
  answer: 'GORE',
  letter_index: 0,
  clue_text: "Hall-bound rusher's one Eagles season. (football)",
})

// BRIERE dup (5/7 R + 5/20 B): keep 5/7, replace 5/20 B
await update('2026-05-20', 'B', {
  answer: 'BLANTON',
  letter_index: 0,
  clue_text: 'Pitcher who homered in the World Series. (baseball)',
})

// KRUK dup (5/13 R + 5/18 R): keep 5/18, replace 5/13 R
await update('2026-05-13', 'R', {
  answer: 'RIVERS',
  letter_index: 0,
  clue_text: 'Three seasons, three second-round exits. (basketball)',
})

// BOWA dup (5/30 B + 6/2 B): keep 5/30, replace 6/2 B
await update('2026-06-02', 'B', {
  answer: 'BOYKIN',
  letter_index: 0,
  clue_text: 'Chip Kelly cut him loose despite stardom. (football)',
})

// WATKINS dup (5/7 A + 6/6 A): keep 5/7, replace 6/6 A
await update('2026-06-06', 'A', {
  answer: 'AVANT',
  letter_index: 0,
  clue_text: 'Third-down target in the Reid years. (football)',
})
