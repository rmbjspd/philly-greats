'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Stats, GameState, PuzzleClue } from '@/types/game'
import { getShareText } from '@/lib/gameState'
import { useState } from 'react'

interface StatsModalProps {
  open: boolean
  onClose: () => void
  stats: Stats
  gameState: GameState | null
  clues: PuzzleClue[]
}

export default function StatsModal({ open, onClose, stats, gameState, clues }: StatsModalProps) {
  const [copied, setCopied] = useState(false)

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0

  const BUCKETS = ['0', '1', '2', '3', '4', 'gave_up']
  const BUCKET_LABEL: Record<string, string> = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', 'gave_up': '✕',
  }
  const bucketCounts = BUCKETS.map((k) => stats.guessDistribution[k] || 0)
  const maxCount = Math.max(1, ...bucketCounts)

  function handleShare() {
    if (!gameState) return
    const text = getShareText(gameState, clues)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => { if (!o) onClose() }}>
      <DialogContent
        className="bg-[#EBF4FB] border border-[#003594]/20 text-[#003594] max-w-sm"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-[#003594] font-black text-xl tracking-widest text-center">
            STATISTICS
          </DialogTitle>
        </DialogHeader>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 text-center my-2">
          {[
            { label: 'Played', value: stats.gamesPlayed },
            { label: 'Win %', value: winPct },
            { label: 'Streak', value: stats.currentStreak },
            { label: 'Max', value: stats.maxStreak },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#003594]">{value}</span>
              <span className="text-xs text-[#003594]/50 leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Miss distribution */}
        {stats.gamesPlayed > 0 ? (
          <div>
            <h3 className="text-xs font-bold text-[#003594]/50 uppercase tracking-widest mb-2 text-center">
              Miss Distribution
            </h3>
            <div className="space-y-1">
              {BUCKETS.map((key, idx) => {
                const count = bucketCounts[idx]
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-[#003594]/50 w-4 text-right">{BUCKET_LABEL[key]}</span>
                    <div
                      className="h-5 bg-[#003594] rounded-sm flex items-center px-1.5 transition-all"
                      style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }}
                    >
                      <span className="text-xs font-bold text-white">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-[#003594]/40 text-sm">No games played yet.</p>
        )}

        {/* Share button */}
        {gameState?.completed && (
          <Button
            onClick={handleShare}
            className="w-full bg-[#003594] hover:bg-[#002070] text-white font-bold mt-2"
          >
            {copied ? 'Copied!' : 'Share Results'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full border-[#003594]/30 text-[#003594]/60 hover:text-[#003594] hover:bg-[#003594]/10"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
