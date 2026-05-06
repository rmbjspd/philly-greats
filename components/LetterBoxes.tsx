'use client'

import { cn } from '@/lib/utils'

interface LetterBoxesProps {
  word: string
  guess: string
  highlightIndex: number
  solved: boolean
  revealed: boolean
}

export default function LetterBoxes({
  word,
  guess,
  highlightIndex,
  solved,
  revealed,
}: LetterBoxesProps) {
  const displayWord = solved || revealed ? word : ''
  const letters = displayWord ? displayWord.split('') : Array(Math.max(word.length || 5, 1)).fill('')

  // If not solved/revealed, show the typed guess letters
  const displayLetters = (solved || revealed)
    ? letters
    : letters.map((_, i) => guess[i] || '')

  if (!word && !solved && !revealed) {
    // No word known yet, show placeholder boxes based on guess length or 5
    const count = guess.length > 0 ? Math.max(guess.length, 5) : 5
    return (
      <div className="flex flex-wrap gap-1 my-2">
        {Array(count).fill('').map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-9 h-9 flex items-center justify-center border-2 rounded text-sm font-bold uppercase',
              'bg-[#1a1a2e] text-white border-zinc-600',
              i === highlightIndex && 'border-amber-400 shadow-[0_0_0_1px_#f59e0b]'
            )}
          >
            {guess[i] || ''}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1 my-2">
      {displayLetters.map((letter, i) => {
        const isHighlight = i === highlightIndex
        const isSolvedOrRevealed = solved || revealed

        return (
          <div
            key={i}
            className={cn(
              'w-9 h-9 flex items-center justify-center border-2 rounded text-sm font-bold uppercase transition-all',
              isSolvedOrRevealed
                ? solved
                  ? 'bg-green-700 border-green-500 text-white'
                  : 'bg-red-900 border-red-600 text-white'
                : 'bg-[#1a1a2e] text-white border-zinc-600',
              isHighlight && !isSolvedOrRevealed && 'border-amber-400 shadow-[0_0_0_1px_#f59e0b]',
              isHighlight && isSolvedOrRevealed && solved && 'border-amber-400 bg-amber-600 shadow-[0_0_0_1px_#f59e0b]',
              isHighlight && isSolvedOrRevealed && revealed && 'border-amber-400 shadow-[0_0_0_1px_#f59e0b]'
            )}
          >
            {letter}
          </div>
        )
      })}
    </div>
  )
}
