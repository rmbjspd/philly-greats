'use client'

import { useState } from 'react'
import { PuzzleClue, ClueState } from '@/types/game'
import { cn } from '@/lib/utils'

const MAX_GUESSES = 6
const BOX = 28   // px
const GAP = 3    // px
const SLOT = BOX + GAP  // 31px per cell

interface BoxProps {
  letter?: string
  highlight?: boolean
  solved?: boolean
  revealed?: boolean
}

function LetterBox({ letter = '', highlight, solved, revealed }: BoxProps) {
  const done = solved || revealed
  return (
    <div
      style={{ width: BOX, height: BOX, flexShrink: 0 }}
      className={cn(
        'flex items-center justify-center border text-[11px] font-bold uppercase tracking-wide',
        highlight
          ? done
            ? solved
              ? 'border-amber-400 bg-amber-500 text-black'
              : 'border-zinc-600 bg-zinc-900 text-zinc-500'
            : 'border-amber-400/50 bg-transparent text-zinc-600'
          : done
            ? solved
              ? 'border-green-800/60 bg-green-900/30 text-green-300'
              : 'border-zinc-700 bg-zinc-900/50 text-zinc-500'
            : 'border-zinc-700/60 bg-transparent text-zinc-600'
      )}
    >
      {letter}
    </div>
  )
}

interface ClueCardProps {
  clue: PuzzleClue
  state: ClueState
  onGuess: (guess: string) => void
  onReveal: () => void
  answer?: string
  disabled: boolean
  spineColumn: number
}

export default function ClueCard({
  clue,
  state,
  onGuess,
  onReveal,
  answer,
  disabled,
  spineColumn,
}: ClueCardProps) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  const canGuess = !state.solved && !state.revealed && !disabled
  const guessesLeft = MAX_GUESSES - state.guesses.length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const g = input.trim()
    if (!g) return
    if (state.guesses.some((x) => x.toLowerCase() === g.toLowerCase())) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    onGuess(g)
    setInput('')
  }

  const showAnswer = state.solved || state.revealed
  const letters = showAnswer && answer ? answer.split('') : []

  const preCt = clue.letter_index
  const postCt = showAnswer
    ? Math.max(0, letters.length - clue.letter_index - 1)
    : Math.max(0, clue.answer_length - clue.letter_index - 1)
  const spacerCt = spineColumn - preCt

  // pixel offset to the start of the right zone (after highlight)
  const rightStart = (spacerCt + preCt + 1) * SLOT

  return (
    <div className={cn('flex flex-col', shake && 'animate-[shake_0.5s]')}>
      {/* Main row */}
      <div className="flex items-center" style={{ gap: GAP }}>
        {/* Spacers */}
        {Array.from({ length: spacerCt }).map((_, i) => (
          <div key={`sp-${i}`} style={{ width: BOX, height: BOX, flexShrink: 0 }} />
        ))}

        {/* Pre-highlight boxes */}
        {Array.from({ length: preCt }).map((_, i) => (
          <LetterBox
            key={`pre-${i}`}
            letter={letters[i]}
            solved={state.solved}
            revealed={state.revealed}
          />
        ))}

        {/* Highlight box */}
        <LetterBox
          letter={letters[preCt]}
          highlight
          solved={state.solved}
          revealed={state.revealed}
        />

        {/* Post-highlight boxes */}
        {showAnswer &&
          Array.from({ length: postCt }).map((_, i) => (
            <LetterBox
              key={`post-${i}`}
              letter={letters[preCt + 1 + i]}
              solved={state.solved}
              revealed={state.revealed}
            />
          ))}

        {/* Clue text */}
        <span
          className={cn(
            'text-sm leading-snug shrink min-w-0',
            showAnswer
              ? state.solved
                ? 'text-zinc-400'
                : 'text-zinc-600'
              : 'text-zinc-300'
          )}
          style={{ marginLeft: 10 }}
        >
          {clue.clue_text}
        </span>
      </div>

      {/* Input zone — aligned under right of highlight */}
      {canGuess && (
        <div className="mt-2 flex flex-col gap-1" style={{ paddingLeft: rightStart + 10 }}>
          {state.guesses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-0.5">
              {state.guesses.map((g, i) => (
                <span key={i} className="text-xs text-zinc-700 line-through">
                  {g}
                </span>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="last name"
              className="bg-transparent border-b border-zinc-700 text-white text-sm py-0.5 w-32 focus:outline-none focus:border-amber-400 placeholder:text-zinc-700 tracking-wide"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="text-zinc-500 hover:text-white disabled:opacity-20 text-base transition-colors leading-none"
            >
              →
            </button>
            {guessesLeft <= 3 && (
              <span className="text-xs text-zinc-700">{guessesLeft}</span>
            )}
            {state.guesses.length >= 2 && (
              <button
                type="button"
                onClick={onReveal}
                className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors ml-1"
              >
                reveal
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
