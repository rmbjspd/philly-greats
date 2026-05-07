import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

// 1. RUIZ — drop "Chooch"
{
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text: "Halladay's perfect-game catcher, 2010. (baseball)" })
    .eq('answer', 'RUIZ')
  if (error) console.error('RUIZ:', error.message)
  else console.log('✓ RUIZ — "Halladay\'s perfect-game catcher, 2010. (baseball)"')
}

// 2. KEARSE — use Freak as wordplay
{
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text: 'Freakishly fast. Eagles 2004 mega-signing. (football)' })
    .eq('answer', 'KEARSE')
  if (error) console.error('KEARSE:', error.message)
  else console.log('✓ KEARSE — "Freakishly fast. Eagles 2004 mega-signing. (football)"')
}

// 3. 6/7 R: JEFFERIES → WERTH
{
  const { data: p } = await supabase
    .from('puzzles').select('id').eq('puzzle_date', '2026-06-07').single()
  const { error } = await supabase
    .from('puzzle_clues')
    .update({
      answer: 'WERTH',
      letter_index: 2,
      clue_text: 'Bolted to Nationals. WIP cried betrayal. (baseball)',
    })
    .eq('puzzle_id', p.id)
    .eq('acrostic_letter', 'R')
  if (error) console.error('6/7 R:', error.message)
  else console.log('✓ 6/7 R: JEFFERIES → WERTH[2] — "Bolted to Nationals. WIP cried betrayal. (baseball)"')
}
