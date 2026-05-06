export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-zinc-700 bg-[#0f0f23] p-8 shadow-xl">
        <h1 className="text-2xl font-black text-amber-400 tracking-widest mb-2">BARG Admin</h1>
        <p className="text-zinc-400 text-sm mb-6">Puzzle management</p>

        <div className="rounded-lg border border-zinc-600 bg-zinc-800/50 p-4 mb-6">
          <h2 className="text-white font-semibold mb-2">Add Puzzles</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Use Supabase Studio to add puzzles directly to the database.
          </p>
          <a
            href="https://supabase.com/dashboard/project/asqlulsyjdbdqntfaedz/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-4 py-2 bg-[#E81828] hover:bg-[#c0111f] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Open Supabase Studio →
          </a>
        </div>

        <div className="rounded-lg border border-zinc-600 bg-zinc-800/50 p-4">
          <h2 className="text-white font-semibold mb-2">Database Schema</h2>
          <pre className="text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap">
{`-- puzzles
id          uuid primary key
puzzle_date date unique not null

-- puzzle_clues
id              uuid primary key
puzzle_id       uuid references puzzles(id)
clue_order      int (1-4)
clue_text       text
answer          text
letter_index    int  (0-based index)
acrostic_letter text ('B','A','R','G')`}
          </pre>
        </div>
      </div>
    </main>
  )
}
