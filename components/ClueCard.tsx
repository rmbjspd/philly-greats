'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PuzzleClue, ClueState } from '@/types/game'
import LetterBoxes from './LetterBoxes'
import { cn } from '@/lib/utils'

const MAX_GUESSES = 6

interface ClueCardProps {
  clue: PuzzleClue
  state: ClueState
  onGuess: (guess: string) => void
  onReveal: () => void
  answer?: string
  acrosticChar: 'B' | 'A' | 'R' | 'G'
  disabled: boolean
}

export default function ClueCard({
  clue,
  state,
  onGuess,
  onReveal,
  answer,
  acrosticChar,
  disabled,
}: ClueCardProps) {
  const [input, setInput] = useState('')
  const [shaking, setShaking] = useState(false)

  const canGuess = !state.solved && !state.revealed && !disabled
  const guessesLeft = MAX_GUESSES - state.guesses.length
  const canGiveUp = canGuess && state.guesses.length < MAX_GUESSES

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    if (state.guesses.some((g) => g.toLowerCase() === trimmed.toLowerCase())) {
      // Already guessed — shake
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      return
    }
    onGuess(trimmed)
    setInput('')
  }

  const displayWord = answer || ''
  const currentGuess = canGuess ? input : ''

  return (
    <div
      className={cn(
        'rounded-xl border p-4 bg-[#0f0f23] border-zinc-700 shadow-lg flex flex-col gap-3',
        shaking && 'animate-[shake_0.5s_ease-in-out]'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              'text-base font-bold px-2 py-0.5 rounded',
              'bg-amber-500 text-black border-amber-400'
            )}
          >
            {acrosticChar}
          </Badge>
          {state.solved && (
            <span className="text-green-400 font-bold text-lg">✓</span>
          )}
          {state.revealed && (
            <span className="text-red-400 font-bold text-lg">✗</span>
          )}
        </div>
        {canGuess && (
          <span className="text-xs text-zinc-400 mt-1">
            {guessesLeft} guess{guessesLeft !== 1 ? 'es' : ''} left
          </span>
        )}
      </div>

      {/* Clue text */}
      <p className="text-white text-base leading-snug font-medium">{clue.clue_text}</p>

      {/* Letter boxes */}
      <LetterBoxes
        word={displayWord}
        guess={currentGuess}
        highlightIndex={clue.letter_index}
        solved={state.solved}
        revealed={state.revealed}
      />

      {/* Previous wrong guesses */}
      {state.guesses.length > 0 && !state.solved && (
        <div className="flex flex-wrap gap-1">
          {state.guesses.map((g, i) => (
            <span
              key={i}
              className="text-xs bg-zinc-800 text-zinc-300 rounded px-2 py-0.5 border border-zinc-600 line-through"
            >
              {g}
            </span>
          ))}
        </div>
      )}
      {state.solved && state.guesses.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {state.guesses.slice(0, -1).map((g, i) => (
            <span
              key={i}
              className="text-xs bg-zinc-800 text-zinc-300 rounded px-2 py-0.5 border border-zinc-600 line-through"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Input + buttons */}
      {canGuess && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className={cn(
              'flex-1 bg-zinc-800 border border-zinc-600 text-white rounded px-3 py-2 text-sm',
              'placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-[#E81828] hover:bg-[#c0111f] text-white font-bold px-4"
          >
            Go
          </Button>
        </form>
      )}

      {canGiveUp && (
        <button
          type="button"
          onClick={onReveal}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline text-left w-fit transition-colors"
        >
          Give up on this clue
        </button>
      )}

      {/* Revealed answer label */}
      {state.revealed && answer && (
        <p className="text-sm text-red-400">
          Answer: <span className="font-bold text-red-300">{answer}</span>
        </p>
      )}
    </div>
  )
}
