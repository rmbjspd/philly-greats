import { GameState, Stats, PuzzleClue } from '@/types/game'

const GAME_KEY_PREFIX = 'barg_game_'
const STATS_KEY = 'barg_stats'

export function getGameState(date: string): GameState | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(`${GAME_KEY_PREFIX}${date}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${GAME_KEY_PREFIX}${state.date}`, JSON.stringify(state))
}

export function getStats(): Stats {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
    }
  }
  const raw = localStorage.getItem(STATS_KEY)
  if (!raw) {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
    }
  }
  try {
    return JSON.parse(raw) as Stats
  } catch {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {},
    }
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function updateStatsOnComplete(gameState: GameState): void {
  const stats = getStats()
  const won = gameState.clueStates.every((s) => s.solved)

  stats.gamesPlayed += 1

  if (won) {
    stats.gamesWon += 1
    stats.currentStreak += 1
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak
    }

    // Count total guesses across all clues
    const totalGuesses = gameState.clueStates.reduce(
      (sum, s) => sum + s.guesses.length,
      0
    )
    const key = String(totalGuesses)
    stats.guessDistribution[key] = (stats.guessDistribution[key] || 0) + 1
  } else {
    stats.currentStreak = 0
  }

  saveStats(stats)
}

export function getShareText(gameState: GameState, _clues: PuzzleClue[]): string {
  const lines: string[] = [`BARG ${gameState.date}`]

  gameState.clueStates.forEach((state) => {
    if (state.revealed) {
      // Gave up: all red
      lines.push('🟥🟥🟥🟥🟥🟥')
    } else if (state.solved) {
      // solved: green box at the position where they got it right, rest empty
      const solveIndex = state.guesses.length - 1
      const row = Array(6).fill('⬛')
      row[solveIndex] = '🟩'
      lines.push(row.join(''))
    } else {
      // not solved, not revealed (shouldn't happen if game is complete, but just in case)
      lines.push('⬛⬛⬛⬛⬛⬛')
    }
  })

  return lines.join('\n')
}
