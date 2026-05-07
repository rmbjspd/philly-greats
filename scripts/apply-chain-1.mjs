import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

async function getPuzzleId(date) {
  const { data } = await supabase.from('puzzles').select('id').eq('puzzle_date', date).single()
  return data?.id
}

async function update(date, slot, fields) {
  const id = await getPuzzleId(date)
  if (!id) { console.error(`no puzzle for ${date}`); return }
  const { error } = await supabase
    .from('puzzle_clues')
    .update(fields)
    .eq('puzzle_id', id)
    .eq('acrostic_letter', slot)
  if (error) { console.error(`${date} ${slot}:`, error.message); return }
  console.log(`✓ ${date} ${slot}: ${fields.answer}[${fields.letter_index}] — "${fields.clue_text}"`)
}

// 5/23 B: WEBBER → BALBOA
await update('2026-05-23', 'B', {
  answer: 'BALBOA',
  letter_index: 0,
  clue_text: 'Statue at the Art Museum steps. (boxing)',
})

// 6/1 B: BYNUM → WEBBER
await update('2026-06-01', 'B', {
  answer: 'WEBBER',
  letter_index: 2,
  clue_text: "Sixers' 2005 dump. Knees were gone. (basketball)",
})

// 6/1 G: GLANVILLE → HOYING
await update('2026-06-01', 'G', {
  answer: 'HOYING',
  letter_index: 5,
  clue_text: 'Bobby. Eagles QB stopgap, 1997-98. (football)',
})
