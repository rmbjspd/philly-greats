'use client'

import { useEffect, useState } from 'react'
import { PuzzleClue, ClueState } from '@/types/game'
import { cn } from '@/lib/utils'

interface AcrosticRevealProps {
  clues: PuzzleClue[]
  clueStates: ClueState[]
  answers: (string | undefined)[]
}

export default function AcrosticReveal({ clues, clueStates, answers }: AcrosticRevealProps) {
  const [visible, setVisible] = useState([false, false, false, false])

  useEffect(() => {
    const timers = [0, 1, 2, 3].map((i) =>
      setTimeout(
        () =>
          setVisible((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          }),
        i * 280 + 400
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="mt-10 pt-8 border-t border-[#003594]/10">
      <div className="flex gap-3 justify-start">
        {clues.map((clue, i) => {
          const answer = answers[i] || ''
          const solved = clueStates[i]?.solved
          const letter = answer[clue.letter_index] || '?'

          return (
            <div
              key={clue.id}
              className={cn(
                'transition-all duration-500',
                visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 flex items-center justify-center border-2 text-lg font-black uppercase',
                  solved
                    ? 'border-[#FDB912] bg-[#FDB912] text-[#003594]'
                    : 'border-[#003594]/20 bg-white text-[#003594]/50'
                )}
              >
                {letter}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
