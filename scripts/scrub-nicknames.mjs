import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const rewrites = {
  REID:    'Thirteen Eagles seasons. No ring. (football)',
  DYKSTRA: "'93 Series leadoff man. Federal prison later. (baseball)",
  HARDEN:  'Came from Brooklyn. Cataldi smelled title. (basketball)',
  LINDROS: 'Clarke traded him to Toronto. Feud. (hockey)',
}

for (const [answer, clue_text] of Object.entries(rewrites)) {
  const { error } = await supabase.from('puzzle_clues').update({ clue_text }).eq('answer', answer)
  if (error) { console.error(answer, error.message); continue }
  console.log(`✓ ${answer.padEnd(8)} — "${clue_text}"`)
}
