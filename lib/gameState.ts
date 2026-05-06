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

export function getShareText(gameState: GameState, clues: PuzzleClue[]): string {
  const spineColumn = Math.max(...clues.map((c) => c.letter_index))

  // Total wrong guesses across all clues
  const totalMisses = gameState.clueStates.reduce((sum, cs) => {
    if (cs.solved) return sum + cs.guesses.length - 1
    if (cs.revealed) return sum + cs.guesses.length
    return sum
  }, 0)

  const allSolved = gameState.clueStates.every((cs) => cs.solved)

  const rows = clues.map((clue, i) => {
    const cs = gameState.clueStates[i]
    const spacers = spineColumn - clue.letter_index
    const preCount = clue.letter_index
    const postCount = clue.answer_length - clue.letter_index - 1

    let fill: string
    let acrostic: string
    if (cs.solved) {
      fill = cs.guesses.length === 1 ? '🟩' : '🟨'
      acrostic = '🟥'
    } else {
      fill = '⬜'
      acrostic = '⬜'
    }

    return (
      '⬛'.repeat(spacers) +
      fill.repeat(preCount) +
      acrostic +
      fill.repeat(postCount)
    )
  })

  const solved = gameState.clueStates.filter((cs) => cs.solved).length
  const summary = allSolved
    ? `I solved Philly Greats with ${totalMisses} miss${totalMisses !== 1 ? 'es' : ''}`
    : `Philly Greats: ${solved}/4 solved, ${totalMisses} miss${totalMisses !== 1 ? 'es' : ''}`

  return [`Philly Greats · ${gameState.date}`, ...rows, '', summary].join('\n')
}
