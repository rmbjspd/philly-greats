'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PuzzleClue, ClueState, Stats } from '@/types/game'
import { cn } from '@/lib/utils'

const LETTER_ANIMATIONS = [
  'animate-[zoomFromLeft_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromTop_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromRight_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromBottom_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
]

interface AcrosticRevealProps {
  clues: PuzzleClue[]
  clueStates: ClueState[]
  answers: (string | undefined)[]
  stats: Stats
  onShare: () => void
  copied: boolean
}

export default function AcrosticReveal({
  clues,
  clueStates,
  answers,
  stats,
  onShare,
  copied,
}: AcrosticRevealProps) {
  const [showText, setShowText] = useState(false)
  const [letterCount, setLetterCount] = useState(0)
  const [showImage, setShowImage] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowText(true), 300),
      setTimeout(() => setLetterCount(1), 1200),
      setTimeout(() => setLetterCount(2), 1550),
      setTimeout(() => setLetterCount(3), 1900),
      setTimeout(() => setLetterCount(4), 2250),
      setTimeout(() => setShowImage(true), 3100),
      setTimeout(() => setShowStats(true), 4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const bargLetters = clues.map((clue, i) => ({
    letter: (answers[i] || '')[clue.letter_index] || '?',
    solved: clueStates[i]?.solved,
  }))

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0

  return (
    <div className="mt-12 flex flex-col items-start gap-8">
      {/* Teaser line */}
      <p
        className={cn(
          'text-[#003594]/60 text-sm italic transition-opacity duration-700',
          showText ? 'opacity-100' : 'opacity-0'
        )}
      >
        and the ultimate philly (well, near philly) great of them all…
      </p>

      {/* BARG letters zooming in */}
      <div className="flex gap-4 overflow-hidden">
        {bargLetters.map(({ letter, solved }, i) => (
          <div
            key={i}
            className={cn(
              'w-16 h-16 flex items-center justify-center border-2 text-3xl font-black uppercase',
              solved
                ? 'border-[#FDB912] bg-[#FDB912] text-[#003594]'
                : 'border-[#003594]/30 bg-white text-[#003594]/50',
              letterCount > i ? LETTER_ANIMATIONS[i] : 'opacity-0'
            )}
          >
            {letterCount > i ? letter : ''}
          </div>
        ))}
      </div>

      {/* Robert Barg dissolves in */}
      {showImage && (
        <div className="animate-[dissolve_1.5s_ease-in_both]">
          <Image
            src="/barg.jpg"
            alt="Robert Barg"
            width={280}
            height={280}
            className="rounded object-cover"
            priority
          />
        </div>
      )}

      {/* Inline stats */}
      {showStats && (
        <div className="animate-[dissolve_0.8s_ease-in_both] flex flex-col gap-4 w-full max-w-xs">
          <div className="flex gap-6">
            {[
              { label: 'played', value: stats.gamesPlayed },
              { label: 'win %', value: winPct },
              { label: 'streak', value: stats.currentStreak },
              { label: 'best', value: stats.maxStreak },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#003594]">{value}</span>
                <span className="text-[10px] text-[#003594]/40 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onShare}
            className="text-sm font-bold text-[#003594] border border-[#003594]/30 hover:bg-[#003594]/5 px-4 py-2 transition-colors w-fit"
          >
            {copied ? 'copied!' : 'share results'}
          </button>
        </div>
      )}
    </div>
  )
}
