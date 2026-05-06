'use client'

import { PuzzleClue, ClueState } from '@/types/game'
import { cn } from '@/lib/utils'

const BOX = 30    // px
const GAP = 3     // px
const SLOT = BOX + GAP  // 33px per cell

interface LetterBoxProps {
  letter?: string
  highlight?: boolean
  solved?: boolean
  revealed?: boolean
  isCursor?: boolean
  isActive?: boolean
}

function LetterBox({ letter = '', highlight, solved, revealed, isCursor, isActive }: LetterBoxProps) {
  const done = solved || revealed

  let classes: string
  if (done) {
    if (solved) {
      classes = highlight
        ? 'border-2 border-[#FDB912] bg-[#FDB912] text-[#003594]'
        : 'border-2 border-[#003594] bg-[#003594] text-white'
    } else {
      // revealed (gave up)
      classes = highlight
        ? 'border-2 border-[#7A9CC5] bg-[#B8CCE0] text-[#003594]/70'
        : 'border-2 border-[#7A9CC5] bg-[#B8CCE0] text-[#003594]/70'
    }
  } else if (highlight) {
    classes = 'border-2 border-[#FDB912] bg-white text-[#003594]'
  } else if (isCursor) {
    classes = 'border-2 border-[#003594] bg-white text-[#003594]'
  } else if (letter) {
    classes = 'border-2 border-[#003594]/70 bg-white text-[#003594]'
  } else if (isActive) {
    classes = 'border border-[#003594]/30 bg-white text-[#003594]'
  } else {
    classes = 'border border-[#003594]/15 bg-white/50 text-[#003594]'
  }

  return (
    <div
      style={{ width: BOX, height: BOX, flexShrink: 0 }}
      className={cn('flex items-center justify-center text-[11px] font-bold uppercase tracking-wide', classes)}
    >
      {letter}
    </div>
  )
}

interface ClueCardProps {
  clue: PuzzleClue
  state: ClueState
  onReveal: () => void
  answer?: string
  disabled: boolean
  spineColumn: number
  isActive: boolean
  currentInput: string
  onActivate: () => void
}

export default function ClueCard({
  clue,
  state,
  onReveal,
  answer,
  disabled,
  spineColumn,
  isActive,
  currentInput,
  onActivate,
}: ClueCardProps) {
  const showAnswer = state.solved || state.revealed
  const letters = showAnswer && answer ? answer.split('') : []

  const spacerCt = spineColumn - clue.letter_index
  const totalBoxes = clue.answer_length
  const cursorPos = isActive && !showAnswer ? currentInput.length : -1

  return (
    <div
      className={cn(
        'flex flex-col cursor-default select-none',
        !state.solved && !state.revealed && !disabled && 'cursor-pointer'
      )}
      onClick={() => {
        if (!state.solved && !state.revealed && !disabled) onActivate()
      }}
    >
      {/* Box row + clue */}
      <div className="flex items-center flex-wrap gap-y-1">
        {/* Spacers to align highlight column */}
        {Array.from({ length: spacerCt }).map((_, i) => (
          <div key={`sp-${i}`} style={{ width: BOX, height: BOX, flexShrink: 0, marginRight: GAP }} />
        ))}

        {/* All letter boxes */}
        {Array.from({ length: totalBoxes }).map((_, i) => {
          const isHighlight = i === clue.letter_index
          const letter = showAnswer ? (letters[i] || '') : (isActive ? (currentInput[i] || '') : '')
          const isCursor = i === cursorPos

          return (
            <div key={i} style={{ marginRight: i < totalBoxes - 1 ? GAP : 0 }}>
              <LetterBox
                letter={letter}
                highlight={isHighlight}
                solved={state.solved}
                revealed={state.revealed}
                isCursor={isCursor}
                isActive={isActive}
              />
            </div>
          )
        })}

        {/* Clue text */}
        <span
          className={cn(
            'text-sm leading-snug',
            showAnswer
              ? state.solved ? 'text-[#003594]/50' : 'text-[#003594]/30'
              : isActive ? 'text-[#003594]/80' : 'text-[#003594]/60'
          )}
          style={{ marginLeft: 12 }}
        >
          {clue.clue_text}
        </span>
      </div>

      {/* Wrong guesses + controls under active row */}
      {isActive && !showAnswer && (
        <div
          className="mt-2 flex flex-col gap-1"
          style={{ paddingLeft: (spacerCt + clue.letter_index + 1) * SLOT + 4 }}
        >
          {state.guesses.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {state.guesses.map((g, i) => (
                <span key={i} className="text-xs text-[#003594]/30 line-through">
                  {g}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#003594]/30 tracking-wide">↵ enter to submit</span>
            {state.guesses.length >= 2 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReveal() }}
                className="text-[10px] text-[#003594]/25 hover:text-[#003594]/50 transition-colors"
              >
                reveal answer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
