'use client'

import { useEffect, useState } from 'react'
import { PuzzleClue, ClueState } from '@/types/game'
import { cn } from '@/lib/utils'

const BARG_LETTERS = ['B', 'A', 'R', 'G'] as const

interface AcrosticRevealProps {
  clues: PuzzleClue[]
  clueStates: ClueState[]
  answers: (string | undefined)[]
}

export default function AcrosticReveal({ clues, clueStates, answers }: AcrosticRevealProps) {
  const [visible, setVisible] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    BARG_LETTERS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisible((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
        }, i * 300 + 200)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="rounded-xl border border-amber-500/40 bg-[#0f0f23] p-6 mt-4 shadow-xl">
      <h2 className="text-center text-amber-400 font-bold text-lg mb-4 tracking-widest uppercase">
        Today&apos;s BARG
      </h2>
      <div className="flex justify-center gap-4 mb-6">
        {BARG_LETTERS.map((letter, i) => (
          <div
            key={letter}
            className={cn(
              'flex flex-col items-center gap-1 transition-all duration-500',
              visible[i] ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-lg font-black text-2xl border-2',
                clueStates[i]?.solved
                  ? 'bg-amber-500 border-amber-400 text-black'
                  : 'bg-zinc-800 border-zinc-600 text-amber-400'
              )}
            >
              {letter}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {clues.map((clue, i) => {
          const answer = answers[i] || ''
          const solved = clueStates[i]?.solved
          const revealed = clueStates[i]?.revealed

          return (
            <div
              key={clue.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-500',
                visible[i] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
                solved ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/20 border border-red-700/30'
              )}
              style={{ transitionDelay: `${i * 300 + 400}ms` }}
            >
              <span
                className={cn(
                  'w-7 h-7 flex items-center justify-center rounded font-bold text-sm shrink-0',
                  solved ? 'bg-amber-500 text-black' : 'bg-zinc-700 text-amber-400'
                )}
              >
                {BARG_LETTERS[i]}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn('font-semibold text-sm truncate', solved ? 'text-green-300' : 'text-red-300')}>
                  {answer || clue.answer || '—'}
                </p>
                <p className="text-xs text-zinc-500 truncate">{clue.clue_text}</p>
              </div>
              <span className="text-base">
                {solved ? '✓' : revealed ? '✗' : '?'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
