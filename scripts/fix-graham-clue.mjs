import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzle } = await supabase
  .from('puzzles').select('id').eq('puzzle_date', '2026-05-11').single()

const { error } = await supabase
  .from('puzzle_clues')
  .update({
    clue_text: "Stripped Brady. Then said what nobody else would about AJ and Jalen. (football)",
  })
  .eq('puzzle_id', puzzle.id)
  .eq('clue_order', 4)

if (error) { console.error('Failed:', error.message) }
else { console.log('✓ May 11 #4 [GRAHAM] updated') }
