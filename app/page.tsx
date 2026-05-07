export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { Puzzle } from '@/types/game'
import { supabase, supabaseServer } from '@/lib/supabase'
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
    .select('id, clue_order, clue_text, letter_index, acrostic_letter, answer')
    .eq('puzzle_id', puzzleRow.id)
    .order('clue_order', { ascending: true })

  if (cluesError || !clues) return null

  return {
    id: puzzleRow.id,
    puzzle_date: puzzleRow.puzzle_date,
    clues: clues.map((c) => ({
      id: c.id,
      clue_order: c.clue_order,
      clue_text: c.clue_text,
      letter_index: c.letter_index,
      acrostic_letter: c.acrostic_letter,
      answer: '',
      answer_length: Math.min((c.answer as string).length, 10),
    })),
  }
}

async function logVisit(date: string) {
  const h = await headers()
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  const city = h.get('x-vercel-ip-city') ?? null
  const country = h.get('x-vercel-ip-country') ?? null
  const { error } = await supabaseServer
    .from('visits')
    .insert({ puzzle_date: date, ip_address: ip, city, country })
  if (error) console.error('[visits insert]', error.message, error.details)
  else console.log('[visits insert] ok', date, ip, city, country)
}

export default async function Home() {
  const puzzle = await getPuzzle()
  if (puzzle) await logVisit(puzzle.puzzle_date)

  if (!puzzle) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-[#003594] text-center">No puzzle today. Check back tomorrow.</p>
        <p className="text-[#003594]/40 text-sm mt-2 text-center">Philadelphia sports · daily</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <GameBoard puzzle={puzzle} />
    </main>
  )
}
