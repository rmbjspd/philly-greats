import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'

const puzzles = JSON.parse(readFileSync('/tmp/clues.json', 'utf8'))
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Build the masked clue sheet (no answers)
function buildClueSheet(puzzles) {
  const lines = []
  for (const p of puzzles) {
    lines.push(`\n=== ${p.date} ===`)
    for (const c of p.clues) {
      const blank = '_'.repeat(c.answer_length)
      lines.push(`  [${c.letter}] ${blank} (${c.answer_length} letters) — "${c.clue_text}"`)
    }
  }
  return lines.join('\n')
}

// Build answer reveal
function buildAnswerKey(puzzles) {
  const lines = []
  for (const p of puzzles) {
    lines.push(`\n=== ${p.date} ===`)
    for (const c of p.clues) {
      lines.push(`  [${c.letter}] ${c.answer} — "${c.clue_text}"`)
    }
  }
  return lines.join('\n')
}

const clueSheet = buildClueSheet(puzzles)
const answerKey = buildAnswerKey(puzzles)

const SYSTEM = `You are a Philly sports trivia oracle — equal parts Ken Jennings (encyclopedic recall, loves the obscure), Joe Conklin (603 WIP energy, razor wit, you can hear the impressions in the prose), and Sonny Hill (you've watched every Philly player since Wilt, you know the community angle, the backstory, the weight of it).

Your era of peak knowledge: late 1990s through the early 2000s. The AI era, the T.O. era, the Iverson era, the McNabb era, the Sixers core-four years. You listened to 610 WIP every morning — Cataldi, Morganti, Big Daddy Graham, the whole crew. You remember Person's People. You remember Reese's Pieces being thrown. You know the lore.

Sport tags at the end of each clue tell you the domain. You know Philly sports inside out — across all eras but sharpest on that late-90s/early-00s window.

Format rules:
- For each clue, write your guess on its own line starting with GUESS: followed by the answer in ALL CAPS
- Be terse in your reasoning — one punchy line max before the guess, like a WIP caller who's been holding for 20 minutes and knows exactly what he wants to say
- No hedging. Make a call. If you're 50/50, pick one and own it.`

const ROUND1_PROMPT = `Here are 132 clues from a Philadelphia sports acrostic puzzle game. Each clue gives you the acrostic letter [B/A/R/G], a blank of the right length, the letter count, and the clue text with a sport/media tag.

The four answers in each puzzle spell BARG — the name of the person the puzzle is secretly about (a well-known Philly-connected figure, not necessarily an athlete).

Your job: for each clue, make your best guess at the answer. One line of reasoning, then GUESS: ANSWER.

${clueSheet}

Work through every single clue in order. Don't skip any.`

const ROUND2_PROMPT = `Here are the correct answers:

${answerKey}

Now score yourself and critique every clue. For each puzzle date, go through all 4 clues and:

1. Mark each: ✓ (you got it right) or ✗ (you got it wrong — say what you guessed)
2. For each clue, give your honest critique in the voice you've been told to use:
   - KEEP: solid clue, works as-is
   - TWEAK: basically good but one thing is off — say exactly what
   - OVERHAUL: this clue is broken — say why and suggest a better one

Be specific. Be sharp. If a clue is too easy, too obscure, too vague, relies on a factual stretch, has a sport tag that doesn't fit, or is just a weak clue — say so. Don't pull punches. This is WIP, not WMMR.

End with a summary scorecard:
- Your overall score (X/132)
- The 5 strongest clues in the whole set
- The 5 weakest clues that most need overhaul
- Any patterns you noticed (too many baseball players from one era? not enough hockey? clues that are all the same shape?)`

// --- Round 1: Guesses ---
console.log('\n' + '═'.repeat(70))
console.log('  PHILLY SPORTS TRIVIA GURU — ROUND 1: GUESSES')
console.log('═'.repeat(70) + '\n')

const messages = [{ role: 'user', content: ROUND1_PROMPT }]

let round1Response = ''
const stream1 = await client.messages.stream({
  model: 'claude-opus-4-7',
  max_tokens: 8000,
  system: SYSTEM,
  messages,
})

for await (const chunk of stream1) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
    round1Response += chunk.delta.text
  }
}

// --- Round 2: Scoring & Critique ---
console.log('\n\n' + '═'.repeat(70))
console.log('  ROUND 2: SCORING & CRITIQUE')
console.log('═'.repeat(70) + '\n')

messages.push(
  { role: 'assistant', content: round1Response },
  { role: 'user', content: ROUND2_PROMPT }
)

const stream2 = await client.messages.stream({
  model: 'claude-opus-4-7',
  max_tokens: 16000,
  system: SYSTEM,
  messages,
})

for await (const chunk of stream2) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
  }
}

console.log('\n')
