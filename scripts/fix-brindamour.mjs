import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { error } = await supabase
  .from('puzzle_clues')
  .update({ clue_text: 'Crooked nose. Gym rat. Two Selkes. (hockey)' })
  .eq('answer', 'BRINDAMOUR')

if (error) { console.error(error.message); process.exit(1) }
console.log('✓ Updated BRINDAMOUR clue: "Crooked nose. Gym rat. Two Selkes. (hockey)"')
