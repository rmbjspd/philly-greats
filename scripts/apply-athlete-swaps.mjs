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

// ── 6/4 (17→7): swap 3 slots, kills MAMULA + FORSBERG dups ─────────────────
await update('2026-06-04', 'B', {
  answer: 'BOONE',
  letter_index: 0,
  clue_text: 'Caught the 1980 Phillies to a title. (baseball)',
})
await update('2026-06-04', 'A', {
  answer: 'AMARO',
  letter_index: 0,
  clue_text: 'Traded for Halladay and Lee. (baseball)',
})
await update('2026-06-04', 'G', {
  answer: 'GROSS',
  letter_index: 0,
  clue_text: 'Caught doctoring the ball with sandpaper. (baseball)',
})

// ── 5/14 (15→8) ─────────────────────────────────────────────────────────────
await update('2026-05-14', 'B', {
  answer: 'BARBER',
  letter_index: 3,           // B-A-R-[B]-E-R
  clue_text: 'Broad Street Bully. Two Cup rings. (hockey)',
})
await update('2026-05-14', 'R', {
  answer: 'ROSE',
  letter_index: 0,
  clue_text: 'All-time hits leader. Wore Phillies red. (baseball)',
})

// ── 5/15 (14→9) ─────────────────────────────────────────────────────────────
await update('2026-05-15', 'B', {
  answer: 'BLAKE',
  letter_index: 0,
  clue_text: "Reid's backup QB in 2000. (football)",
})
await update('2026-05-15', 'G', {
  answer: 'GREER',
  letter_index: 0,
  clue_text: '1967 champion Sixers guard, Hall of Famer. (basketball)',
})

// ── 5/31 (14→10) ────────────────────────────────────────────────────────────
await update('2026-05-31', 'B', {
  answer: 'BIRON',
  letter_index: 0,
  clue_text: 'Carried Flyers to 2008 conference finals. (hockey)',
})
await update('2026-05-31', 'R', {
  answer: 'RYAN',
  letter_index: 0,
  clue_text: 'Blitz-loving Eagles coach, 1986-90. (football)',
})

// ── 5/12 (13→10): keep ROLLINS, swap SCHWARBER ──────────────────────────────
await update('2026-05-12', 'B', {
  answer: 'BASKETT',
  letter_index: 0,
  clue_text: 'Eagles WR in the Reid era. (football)',
})

// ── 5/19 (13→8) ─────────────────────────────────────────────────────────────
await update('2026-05-19', 'G', {
  answer: 'GEORGE',
  letter_index: 0,
  clue_text: "Heisman winner's final NFL season. (football)",
})

// ── 5/16 (13→8) ─────────────────────────────────────────────────────────────
await update('2026-05-16', 'R', {
  answer: 'ROMERO',
  letter_index: 0,
  clue_text: 'Setup man for the 2008 title team. (baseball)',
})
await update('2026-05-16', 'G', {
  answer: 'GLOVER',
  letter_index: 0,
  clue_text: 'Pro Bowl DT in the Reid era. (football)',
})
