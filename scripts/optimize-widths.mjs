import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

const { data } = await supabase
  .from('puzzle_clues')
  .select('answer, letter_index, clue_order, acrostic_letter, puzzle_id, puzzles!inner(puzzle_date)')

const byDate = new Map()
for (const c of data) {
  const d = c.puzzles.puzzle_date
  if (!byDate.has(d)) byDate.set(d, [])
  byDate.get(d).push({
    answer: c.answer,
    idx: c.letter_index,
    order: c.clue_order,
    letter: c.acrostic_letter,
  })
}

function widthOf(clues) {
  const maxPre = Math.max(...clues.map((c) => c.idx))
  const maxPost = Math.max(...clues.map((c) => c.answer.length - c.idx - 1))
  return maxPre + 1 + maxPost
}

function findOccurrences(answer, letter) {
  const out = []
  for (let i = 0; i < answer.length; i++) if (answer[i] === letter) out.push(i)
  return out
}

function bestCombo(clues) {
  const opts = clues.map((c) => findOccurrences(c.answer, c.letter))
  let best = { width: Infinity, combo: null }
  for (const i0 of opts[0]) for (const i1 of opts[1]) for (const i2 of opts[2]) for (const i3 of opts[3]) {
    const trial = [
      { ...clues[0], idx: i0 },
      { ...clues[1], idx: i1 },
      { ...clues[2], idx: i2 },
      { ...clues[3], idx: i3 },
    ]
    const w = widthOf(trial)
    if (w < best.width) best = { width: w, combo: trial }
  }
  return best
}

const results = []
for (const [date, clues] of byDate) {
  clues.sort((a, b) => a.order - b.order)
  const cur = widthOf(clues)
  const best = bestCombo(clues)
  results.push({ date, currentWidth: cur, bestWidth: best.width, current: clues, best: best.combo })
}

results.sort((a, b) => b.bestWidth - a.bestWidth)

console.log('=== STILL OVER 10 EVEN WITH BEST RESHUFFLE (need answer swap) ===\n')
for (const r of results.filter((x) => x.bestWidth > 10)) {
  console.log(`${r.date}  best=${r.bestWidth}  (was ${r.currentWidth})`)
  console.log(`  best combo: ${r.best.map((c) => `${c.answer}[${c.idx}]`).join(' ')}`)
  console.log(`  per clue (answer, available indices for ${r.best[0].letter}/${r.best[1].letter}/${r.best[2].letter}/${r.best[3].letter}):`)
  for (const c of r.best) {
    const occ = findOccurrences(c.answer, c.letter)
    console.log(`    ${c.letter}: ${c.answer} (len ${c.answer.length}) — ${c.letter} at [${occ.join(',')}]`)
  }
  console.log()
}

console.log('\n=== FIXED BY RESHUFFLE ALONE (no answer change needed) ===\n')
for (const r of results.filter((x) => x.currentWidth > 10 && x.bestWidth <= 10)) {
  console.log(`${r.date}  ${r.currentWidth} → ${r.bestWidth}`)
  const changes = r.best.map((c, i) => {
    const old = r.current[i]
    return c.idx !== old.idx ? `${c.answer}: ${old.idx}→${c.idx}` : null
  }).filter(Boolean)
  console.log(`  changes: ${changes.join(', ')}`)
}

console.log('\n=== ALREADY OK ===')
console.log(results.filter((x) => x.currentWidth <= 10).length, 'puzzles')

// Also check duplicates
console.log('\n=== DUPLICATE ANSWERS ACROSS ALL PUZZLES ===\n')
const seen = new Map()
for (const [date, clues] of byDate) {
  for (const c of clues) {
    if (!seen.has(c.answer)) seen.set(c.answer, [])
    seen.get(c.answer).push(date)
  }
}
for (const [ans, dates] of seen) {
  if (dates.length > 1) console.log(`  ${ans}: ${dates.join(', ')}`)
}
