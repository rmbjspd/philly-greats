export type AcrosticLetter = 'B' | 'A' | 'R' | 'G'

export interface PuzzleClue {
  id: string
  clue_order: number
  clue_text: string
  answer: string        // returned from API after solve or on give-up
  answer_length: number // populated server-side; answer itself is never sent to client
  letter_index: number  // which letter of answer feeds into BARG
  acrostic_letter: AcrosticLetter
}

export interface Puzzle {
  id: string
  puzzle_date: string
  clues: PuzzleClue[]
}

export interface ClueState {
  guesses: string[]     // list of guesses made
  solved: boolean
  revealed: boolean     // gave up
}

export interface GameState {
  date: string
  clueStates: ClueState[]  // index 0-3 matches clue_order 1-4
  completed: boolean
}

export interface Stats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: Record<string, number>  // "4"-"24" total guesses
}
