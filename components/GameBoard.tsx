'use client'

import { useState, useEffect, useCallback } from 'react'
import { Puzzle, PuzzleClue, ClueState, GameState } from '@/types/game'
import {
  getGameState,
  saveGameState,
  getStats,
  updateStatsOnComplete,
} from '@/lib/gameState'
import ClueCard from './ClueCard'
import AcrosticReveal from './AcrosticReveal'
import StatsModal from './StatsModal'

const MAX_GUESSES = 6

function makeInitialClueState(): ClueState {
  return { guesses: [], solved: false, revealed: false }
}

function makeInitialGameState(date: string): GameState {
  return {
    date,
    clueStates: [
      makeInitialClueState(),
      makeInitialClueState(),
      makeInitialClueState(),
      makeInitialClueState(),
    ],
    completed: false,
  }
}

interface GameBoardProps {
  puzzle: Puzzle
}

export default function GameBoard({ puzzle }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [answers, setAnswers] = useState<(string | undefined)[]>([
    undefined, undefined, undefined, undefined,
  ])
  const [statsOpen, setStatsOpen] = useState(false)
  const [stats, setStats] = useState(() => getStats())
  const [statsUpdated, setStatsUpdated] = useState(false)

  // Load or create game state from localStorage on mount
  useEffect(() => {
    const saved = getGameState(puzzle.puzzle_date)
    if (saved) {
      setGameState(saved)
      // Restore answers for already-solved/revealed clues
      saved.clueStates.forEach((cs, i) => {
        if (cs.solved || cs.revealed) {
          // We need to fetch the answer for revealed ones; for solved ones,
          // the answer can be derived from the last guess
          if (cs.solved && cs.guesses.length > 0) {
            // We'll fetch from API to get proper casing
            fetchAnswer(puzzle.id, i + 1).then((ans) => {
              setAnswers((prev) => {
                const next = [...prev]
                next[i] = ans
                return next
              })
            })
          } else if (cs.revealed) {
            fetchAnswer(puzzle.id, i + 1).then((ans) => {
              setAnswers((prev) => {
                const next = [...prev]
                next[i] = ans
                return next
              })
            })
          }
        }
      })
    } else {
      const fresh = makeInitialGameState(puzzle.puzzle_date)
      setGameState(fresh)
      saveGameState(fresh)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.puzzle_date, puzzle.id])

  async function fetchAnswer(puzzleId: string, clueOrder: number): Promise<string> {
    const res = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzle_id: puzzleId, clue_order: clueOrder }),
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data.answer || ''
  }

  const checkCompletion = useCallback(
    (state: GameState, updatedStatsAlready?: boolean) => {
      const allDone = state.clueStates.every((cs) => cs.solved || cs.revealed)
      if (allDone && !state.completed) {
        const newState = { ...state, completed: true }
        saveGameState(newState)
        if (!updatedStatsAlready) {
          updateStatsOnComplete(newState)
          setStats(getStats())
          setStatsUpdated(true)
        }
        return newState
      }
      return state
    },
    []
  )

  // Show stats modal automatically when game completes (first time)
  useEffect(() => {
    if (statsUpdated) {
      setStatsOpen(true)
      setStatsUpdated(false)
    }
  }, [statsUpdated])

  async function handleGuess(clueIndex: number, guess: string) {
    if (!gameState) return

    const clue = puzzle.clues[clueIndex]
    const currentState = gameState.clueStates[clueIndex]

    if (currentState.solved || currentState.revealed) return
    if (currentState.guesses.length >= MAX_GUESSES) return

    // Check answer via API
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puzzle_id: puzzle.id,
        clue_order: clue.clue_order,
        guess,
      }),
    })

    if (!res.ok) return
    const { correct } = await res.json()

    const newGuesses = [...currentState.guesses, guess]
    const solved = correct
    const newClueState: ClueState = {
      guesses: newGuesses,
      solved,
      revealed: false,
    }

    const newClueStates = [...gameState.clueStates]
    newClueStates[clueIndex] = newClueState

    let newState: GameState = {
      ...gameState,
      clueStates: newClueStates,
    }

    if (solved) {
      // Fetch proper-cased answer
      const ans = await fetchAnswer(puzzle.id, clue.clue_order)
      setAnswers((prev) => {
        const next = [...prev]
        next[clueIndex] = ans
        return next
      })
    } else if (newGuesses.length >= MAX_GUESSES) {
      // Auto-reveal on exhaustion
      const ans = await fetchAnswer(puzzle.id, clue.clue_order)
      setAnswers((prev) => {
        const next = [...prev]
        next[clueIndex] = ans
        return next
      })
      newClueStates[clueIndex] = { ...newClueState, revealed: true }
      newState = { ...newState, clueStates: newClueStates }
    }

    saveGameState(newState)
    const finalState = checkCompletion(newState)
    setGameState(finalState)
  }

  async function handleReveal(clueIndex: number) {
    if (!gameState) return

    const clue = puzzle.clues[clueIndex]
    const ans = await fetchAnswer(puzzle.id, clue.clue_order)

    setAnswers((prev) => {
      const next = [...prev]
      next[clueIndex] = ans
      return next
    })

    const newClueStates = [...gameState.clueStates]
    newClueStates[clueIndex] = {
      ...gameState.clueStates[clueIndex],
      revealed: true,
    }

    let newState: GameState = { ...gameState, clueStates: newClueStates }
    saveGameState(newState)
    const finalState = checkCompletion(newState)
    setGameState(finalState)
  }

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-amber-400 text-lg animate-pulse">Loading...</div>
      </div>
    )
  }

  const cluesForStats: PuzzleClue[] = puzzle.clues.map((c, i) => ({
    ...c,
    answer: answers[i] || '',
  }))

  const spineColumn = Math.max(...puzzle.clues.map((c) => c.letter_index))

  return (
    <div className="w-full max-w-2xl mx-auto px-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between py-5 mb-8">
        <div>
          <h1 className="text-2xl font-black text-amber-400 tracking-widest">BARG</h1>
          <p className="text-xs text-zinc-600 mt-0.5">{puzzle.puzzle_date}</p>
        </div>
        <button
          onClick={() => {
            setStats(getStats())
            setStatsOpen(true)
          }}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest uppercase"
        >
          stats
        </button>
      </div>

      {/* Clue rows */}
      <div className="space-y-6">
        {puzzle.clues.map((clue, i) => (
          <ClueCard
            key={clue.id}
            clue={clue}
            state={gameState.clueStates[i]}
            onGuess={(guess) => handleGuess(i, guess)}
            onReveal={() => handleReveal(i)}
            answer={answers[i]}
            disabled={gameState.completed}
            spineColumn={spineColumn}
          />
        ))}
      </div>

      {/* Acrostic reveal when complete */}
      {gameState.completed && (
        <AcrosticReveal
          clues={puzzle.clues}
          clueStates={gameState.clueStates}
          answers={answers}
        />
      )}

      {/* Stats modal */}
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        gameState={gameState}
        clues={cluesForStats}
      />
    </div>
  )
}
