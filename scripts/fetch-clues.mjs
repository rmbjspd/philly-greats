import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data: puzzles } = await supabase
  .from('puzzles')
  .select('id, puzzle_date')
  .order('puzzle_date', { ascending: true })

const { data: clues } = await supabase
  .from('puzzle_clues')
  .select('puzzle_id, clue_order, acrostic_letter, answer, letter_index, clue_text')
  .in('puzzle_id', puzzles.map(p => p.id))
  .order('clue_order', { ascending: true })

const byPuzzle = new Map()
for (const c of clues) {
  if (!byPuzzle.has(c.puzzle_id)) byPuzzle.set(c.puzzle_id, [])
  byPuzzle.get(c.puzzle_id).push(c)
}

const result = puzzles.map(p => ({
  date: p.puzzle_date,
  clues: (byPuzzle.get(p.id) ?? []).map(c => ({
    order: c.clue_order,
    letter: c.acrostic_letter,
    answer: c.answer,
    letter_index: c.letter_index,
    answer_length: c.answer.length,
    clue_text: c.clue_text,
  }))
}))

console.log(JSON.stringify(result, null, 2))
