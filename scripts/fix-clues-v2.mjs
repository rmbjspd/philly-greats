import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { realtime: { transport: ws } }
)

async function update(date, letter, clue_text) {
  const { data: puzzle } = await supabase
    .from('puzzles').select('id').eq('puzzle_date', date).single()
  if (!puzzle) { console.error(`no puzzle for ${date}`); return }
  const { error } = await supabase
    .from('puzzle_clues')
    .update({ clue_text })
    .eq('puzzle_id', puzzle.id)
    .eq('acrostic_letter', letter)
  if (error) { console.error(`${date} ${letter}:`, error.message); return }
  console.log(`✓ ${date} [${letter}] — "${clue_text}"`)
}

// 1. ERTZ — "Philly Special" was Foles catching, not Ertz. Fix the clue.
await update('2026-05-19', 'R',
  "Caught the TD that briefly wasn't. Super Bowl LII. (football)")

// 2. GORE — indicate he's actually in the Hall now
await update('2026-05-23', 'G',
  "Hall of Famer's lone Eagles season. (football)")

// 5. LINDROS — full rewrite. Clarke traded him to the Rangers, not Toronto.
//    Lead with the feud and concussion saga — that's the real story.
await update('2026-05-29', 'R',
  "His parents called out Clarke over the concussions. WIP took sides. (hockey)")

// 7. BASKETT — too generic. Hands team + the Saints onside kick.
await update('2026-05-12', 'B',
  "Muffed the Saints' Super Bowl onside kick. Hands team. (football)")

// 6. June clues missing sport tags
await update('2026-06-01', 'R',
  "\"Harper to Philly\" broke WIP for days. (baseball)")

await update('2026-06-02', 'A',
  "Eagles corner. Three Pro Bowls in Philly. (football)")

await update('2026-06-02', 'G',
  "Flyers big contract. Immediate disappointment. (hockey)")

await update('2026-06-03', 'A',
  "WIP called him automatic. (football)")

await update('2026-06-04', 'R',
  "Sixers max deal. WIP questioned every year. (basketball)")

await update('2026-06-05', 'B',
  "Phillies backup catcher. Lieberthal's insurance. (baseball)")

await update('2026-06-05', 'A',
  "Flyers traded alongside Richards to LA. (hockey)")

await update('2026-06-05', 'R',
  "Eagles right tackle. McNabb's blind side. (football)")

await update('2026-06-05', 'G',
  "Sixers GM. Burner Twitter account ended him. (basketball)")

await update('2026-06-06', 'R',
  "Eagles LB. Gang Green defense anchor. (football)")
