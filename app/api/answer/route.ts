import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  let body: { puzzle_id: string; clue_order: number }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { puzzle_id, clue_order } = body

  if (!puzzle_id || clue_order === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: clue, error } = await supabaseServer
    .from('puzzle_clues')
    .select('answer')
    .eq('puzzle_id', puzzle_id)
    .eq('clue_order', clue_order)
    .single()

  if (error || !clue) {
    return NextResponse.json({ error: 'Clue not found' }, { status: 404 })
  }

  return NextResponse.json({ answer: clue.answer })
}
