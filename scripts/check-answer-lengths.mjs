import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data, error } = await supabase
  .from('puzzle_clues')
  .select('answer, puzzle_id, puzzles!inner(puzzle_date)')

if (error) { console.error(error.message); process.exit(1) }

const tooLong = data.filter((c) => c.answer.length > 10)
const atLimit = data.filter((c) => c.answer.length === 10)

console.log(`Total clues: ${data.length}`)
console.log(`Answers > 10 chars: ${tooLong.length}`)
console.log(`Answers exactly 10 chars: ${atLimit.length}`)

if (tooLong.length > 0) {
  console.log('\n❌ OVER LIMIT:')
  for (const c of tooLong) {
    console.log(`  ${c.puzzles.puzzle_date}  ${c.answer} (${c.answer.length})`)
  }
} else {
  console.log('\n✓ No answers exceed 10 characters.')
}

if (atLimit.length > 0) {
  console.log('\nAt 10-char limit (allowed but tight):')
  for (const c of atLimit) {
    console.log(`  ${c.puzzles.puzzle_date}  ${c.answer}`)
  }
}
