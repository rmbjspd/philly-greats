import { supabaseServer } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getTodayET(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function dayName(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr + 'T12:00:00').getDay()]
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DayStat = {
  puzzle_date: string
  total_plays: number
  unique_ips: number
  ips: string[]
}

type UpcomingClue = {
  order: number
  letter: string
  answer: string
  letter_index: number
  clue_text: string
}

type UpcomingPuzzle = {
  date: string
  clues: UpcomingClue[]
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchStats(): Promise<DayStat[]> {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabaseServer
      .from('visits')
      .select('puzzle_date, ip_address')
      .gte('created_at', since)

    if (error || !data) return []

    const ipsByDate = new Map<string, Set<string>>()
    const playsByDate = new Map<string, number>()
    for (const row of data) {
      const d = row.puzzle_date as string
      if (!ipsByDate.has(d)) ipsByDate.set(d, new Set())
      ipsByDate.get(d)!.add(row.ip_address as string)
      playsByDate.set(d, (playsByDate.get(d) ?? 0) + 1)
    }

    return [...ipsByDate.entries()]
      .map(([date, ipSet]) => ({
        puzzle_date: date,
        total_plays: playsByDate.get(date) ?? 0,
        unique_ips: ipSet.size,
        ips: [...ipSet].sort(),
      }))
      .sort((a, b) => b.puzzle_date.localeCompare(a.puzzle_date))
  } catch {
    return []
  }
}

async function fetchUpcoming(today: string): Promise<UpcomingPuzzle[]> {
  const { data: puzzles } = await supabaseServer
    .from('puzzles')
    .select('id, puzzle_date')
    .gte('puzzle_date', today)
    .order('puzzle_date', { ascending: true })
    .limit(28)

  if (!puzzles || puzzles.length === 0) return []

  const { data: clues } = await supabaseServer
    .from('puzzle_clues')
    .select('puzzle_id, clue_order, acrostic_letter, answer, letter_index, clue_text')
    .in('puzzle_id', puzzles.map((p) => p.id))
    .order('clue_order', { ascending: true })

  if (!clues) return []

  const byPuzzle = new Map<string, typeof clues>()
  for (const c of clues) {
    if (!byPuzzle.has(c.puzzle_id)) byPuzzle.set(c.puzzle_id, [])
    byPuzzle.get(c.puzzle_id)!.push(c)
  }

  return puzzles.map((p) => ({
    date: p.puzzle_date as string,
    clues: (byPuzzle.get(p.id) ?? []).map((c) => ({
      order: c.clue_order as number,
      letter: c.acrostic_letter as string,
      answer: c.answer as string,
      letter_index: c.letter_index as number,
      clue_text: c.clue_text as string,
    })),
  }))
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function StatTable({ stats }: { stats: DayStat[] }) {
  if (stats.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-[#0f0f23] p-5 text-sm text-zinc-400">
        No visits logged yet in the last 30 days.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-700 overflow-hidden text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-800 text-zinc-400 text-left">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Day</th>
            <th className="px-4 py-3 font-medium text-right">Plays</th>
            <th className="px-4 py-3 font-medium text-right">Unique IPs</th>
            <th className="px-4 py-3 font-medium">IP addresses</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, i) => (
            <tr key={row.puzzle_date} className={i % 2 === 0 ? 'bg-[#0f0f23]' : 'bg-zinc-900/60'}>
              <td className="px-4 py-3 font-mono text-white">{row.puzzle_date}</td>
              <td className="px-4 py-3 text-zinc-400">{dayName(row.puzzle_date)}</td>
              <td className="px-4 py-3 text-white font-semibold text-right">{row.total_plays}</td>
              <td className="px-4 py-3 text-white text-right">{row.unique_ips}</td>
              <td className="px-4 py-3">
                <details>
                  <summary className="cursor-pointer text-zinc-500 hover:text-zinc-300 select-none list-none text-xs">
                    show {row.unique_ips} IP{row.unique_ips !== 1 ? 's' : ''}
                  </summary>
                  <div className="mt-2 space-y-0.5">
                    {row.ips.map((ip) => (
                      <div key={ip} className="font-mono text-xs text-zinc-300">
                        {ip}
                      </div>
                    ))}
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AnswerDisplay({ answer, letterIndex }: { answer: string; letterIndex: number }) {
  return (
    <span className="font-mono tracking-wider text-sm">
      {answer.split('').map((ch, i) => (
        <span key={i} className={i === letterIndex ? 'text-amber-400 font-black' : 'text-white'}>
          {ch}
        </span>
      ))}
    </span>
  )
}

function PuzzleCard({ puzzle, today }: { puzzle: UpcomingPuzzle; today: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-[#0f0f23] p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-amber-400 font-bold text-sm">{puzzle.date}</span>
        <span className="text-zinc-500 text-sm">{dayName(puzzle.date)}</span>
        {puzzle.date === today && (
          <span className="text-xs bg-[#E81828] text-white px-2 py-0.5 rounded-full font-semibold">
            TODAY
          </span>
        )}
        {puzzle.clues.length === 0 && (
          <span className="text-xs text-zinc-600 italic">no clues seeded</span>
        )}
      </div>
      <div className="space-y-3">
        {puzzle.clues.map((clue) => (
          <div key={clue.order} className="flex items-start gap-3">
            <span className="text-amber-400 font-black w-4 shrink-0 leading-5">{clue.letter}</span>
            <div className="flex-1 min-w-0 space-y-0.5">
              <AnswerDisplay answer={clue.answer} letterIndex={clue.letter_index} />
              <div className="text-zinc-400 text-xs leading-relaxed">{clue.clue_text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const today = getTodayET()
  const [stats, upcoming] = await Promise.all([fetchStats(), fetchUpcoming(today)])

  return (
    <main className="min-h-screen bg-[#1a1a2e] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-amber-400 tracking-widest">BARG Admin</h1>
        </div>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="text-white font-bold text-base mb-3">
            Player Stats <span className="text-zinc-500 font-normal text-sm">— last 30 days</span>
          </h2>
          <StatTable stats={stats} />
        </section>

        {/* Upcoming puzzles */}
        <section>
          <h2 className="text-white font-bold text-base mb-3">
            Upcoming Puzzles{' '}
            <span className="text-zinc-500 font-normal text-sm">— {upcoming.length} scheduled</span>
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-zinc-500 text-sm">No upcoming puzzles found.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((puzzle) => (
                <PuzzleCard key={puzzle.date} puzzle={puzzle} today={today} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
