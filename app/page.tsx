export const dynamic = 'force-dynamic'

import { Puzzle } from '@/types/game'
import { supabase } from '@/lib/supabase'
import GameBoard from '@/components/GameBoard'

function getTodayET(): string {
  const now = new Date()
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

async function getPuzzle(): Promise<Puzzle | null> {
  const date = getTodayET()

  const { data: puzzleRow, error: puzzleError } = await supabase
    .from('puzzles')
    .select('id, puzzle_date')
    .eq('puzzle_date', date)
    .single()

  if (puzzleError || !puzzleRow) return null

  const { data: clues, error: cluesError } = await supabase
    .from('puzzle_clues')
    .select('id, clue_order, clue_text, letter_index, acrostic_letter')
    .eq('puzzle_id', puzzleRow.id)
    .order('clue_order', { ascending: true })

  if (cluesError || !clues) return null

  return {
    id: puzzleRow.id,
    puzzle_date: puzzleRow.puzzle_date,
    clues: clues.map((c) => ({
      ...c,
      answer: '', // not returned to client from server component
    })),
  }
}

export default async function Home() {
  const puzzle = await getPuzzle()

  if (!puzzle) {
    return (
      <main className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-black text-amber-400 tracking-widest mb-4">BARG</h1>
        <p className="text-zinc-400 text-center">
          No puzzle available for today. Check back tomorrow!
        </p>
        <p className="text-zinc-600 text-sm mt-2 text-center">
          Philadelphia sports trivia — daily acrostic
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e]">
      <GameBoard puzzle={puzzle} />
    </main>
  )
}
