import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { realtime: { transport: ws } })
const { data: puzzles } = await sb.from('puzzles').select('id, puzzle_date').order('puzzle_date')
const { data: clues } = await sb.from('puzzle_clues').select('puzzle_id, acrostic_letter, answer, letter_index, clue_text')
for (const p of puzzles) {
  const pc = clues.filter(c => c.puzzle_id === p.id).sort((a,b) => 'BARG'.indexOf(a.acrostic_letter) - 'BARG'.indexOf(b.acrostic_letter))
  const row = pc.map(c => `${c.acrostic_letter}:${c.answer}[${c.letter_index}]`).join('  ')
  console.log(p.puzzle_date, ' ', row)
}
