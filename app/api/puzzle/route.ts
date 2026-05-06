import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseServer } from '@/lib/supabase'

function getTodayET(): string {
  const now = new Date()
  const etDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  return etDate // returns YYYY-MM-DD
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || getTodayET()

  // Fetch puzzle for the given date
  const { data: puzzle, error: puzzleError } = await supabase
    .from('puzzles')
    .select('id, puzzle_date')
    .eq('puzzle_date', date)
    .single()

  if (puzzleError || !puzzle) {
    return NextResponse.json(
      { error: 'No puzzle found for this date' },
      { status: 404 }
    )
  }

  // Fetch clues for this puzzle (without answer)
  const { data: clues, error: cluesError } = await supabase
    .from('puzzle_clues')
    .select('id, clue_order, clue_text, letter_index, acrostic_letter')
    .eq('puzzle_id', puzzle.id)
    .order('clue_order', { ascending: true })

  if (cluesError || !clues) {
    return NextResponse.json(
      { error: 'Failed to fetch clues' },
      { status: 500 }
    )
  }

  // Log visit (fire and forget — don't block response)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  void supabaseServer.from('visits').insert({ puzzle_date: date, ip_address: ip })

  return NextResponse.json({
    id: puzzle.id,
    puzzle_date: puzzle.puzzle_date,
    clues,
  })
}
