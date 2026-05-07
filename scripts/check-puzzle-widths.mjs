import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data } = await supabase
  .from('puzzle_clues')
  .select('answer, letter_index, puzzle_id, puzzles!inner(puzzle_date)')

const byDate = new Map()
for (const c of data) {
  const d = c.puzzles.puzzle_date
  if (!byDate.has(d)) byDate.set(d, [])
  byDate.get(d).push({ answer: c.answer, idx: c.letter_index })
}

const rows = [...byDate.entries()]
  .map(([date, clues]) => {
    const maxPre = Math.max(...clues.map((c) => c.idx))
    const maxPost = Math.max(...clues.map((c) => c.answer.length - c.idx - 1))
    const width = maxPre + 1 + maxPost
    return { date, clues, maxPre, maxPost, width }
  })
  .sort((a, b) => b.width - a.width)

console.log('puzzles ranked by aligned acrostic width (maxPre + 1 + maxPost):\n')
for (const r of rows) {
  const flag = r.width > 10 ? '❌' : r.width === 10 ? '⚠️ ' : '  '
  const detail = r.clues
    .map((c) => `${c.answer}[${c.idx}]`)
    .join(' ')
  console.log(`  ${flag} ${r.date}  width=${r.width}  (pre=${r.maxPre} +1 +post=${r.maxPost})  ${detail}`)
}
