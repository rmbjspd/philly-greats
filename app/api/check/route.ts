import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s''\-]/g, '')
}

export async function POST(request: NextRequest) {
  let body: { puzzle_id: string; clue_order: number; guess: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { puzzle_id, clue_order, guess } = body

  if (!puzzle_id || clue_order === undefined || !guess) {
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

  const correct = normalize(clue.answer) === normalize(guess)

  return NextResponse.json({ correct })
}
