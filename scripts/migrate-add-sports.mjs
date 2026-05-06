import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// answer → sport tag
const sports = {
  MCNABB:    'football',
  HALLADAY:  'baseball',
  ABREU:     'baseball',
  IGUODALA:  'basketball',
  BYNUM:     'basketball',
  WATKINS:   'football',
  BRIERE:    'hockey',
  GIROUX:    'hockey',
  BOUCHER:   'hockey',
  MAMULA:    'football',
  MORANDINI: 'baseball',
  GLANVILLE: 'baseball',
  BRASHEAR:  'hockey',
  HAYES:     'baseball',
  FORSBERG:  'hockey',
  INGE:      'baseball',
  BRUNTLETT: 'baseball',
  RATLIFF:   'basketball',
  DURBIN:    'baseball',
  MAGEE:     'baseball',
}

const { data: clues, error } = await supabase
  .from('puzzle_clues')
  .select('id, answer, clue_text')

if (error) { console.error(error.message); process.exit(1) }

let updated = 0
let skipped = 0

for (const clue of clues) {
  const sport = sports[clue.answer]
  if (!sport) { skipped++; continue }
  if (clue.clue_text.includes('(')) { skipped++; continue } // already tagged

  const newText = `${clue.clue_text} (${sport})`
  const { error: updateError } = await supabase
    .from('puzzle_clues')
    .update({ clue_text: newText })
    .eq('id', clue.id)

  if (updateError) {
    console.error(`Failed ${clue.answer}: ${updateError.message}`)
  } else {
    console.log(`✓ ${clue.answer}: "${newText}"`)
    updated++
  }
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped.`)
