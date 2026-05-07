'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PuzzleClue, ClueState, Stats } from '@/types/game'
import { cn } from '@/lib/utils'

const BARG_TEASERS = [
  // Smile
  "The man with that famous smile lives just outside the city...",
  "Somewhere in Jersey, a smile that wide belongs to no one on the roster...",
  "The greatest grin in South Jersey lights up rooms that aren't in Philadelphia...",
  "A smile like that doesn't need a Philly zip code...",
  "He beams like someone who knows the answer before the question's finished...",
  "Nobody smiles like that unless they know something everyone else has missed...",
  "That smile has been the same since before anyone remembered to ask where he's from...",
  "The grin that launched a thousand inside jokes has never once lived in the city...",
  "There's a smile in Moorestown that Philly fans would recognize immediately...",
  "He walks into any room already winning, smile first...",
  "The most recognizable smile in any building that isn't the Wells Fargo Center...",
  "That famous smile has outlasted every team's losing streak...",
  "Every room gets warmer when that smile enters it, even rooms outside city limits...",
  "He smiles like a man who has never once been wrong about anything important...",
  "The smile says: I didn't need the city, the city needed me...",
  // Hofstadter
  "Someone in Jersey keeps rereading Hofstadter and grinning...",
  "He found something in Gödel, Escher, Bach that most people read once and put down...",
  "The loops inside strange loops fascinate exactly the kind of mind that beats expectations...",
  "Somewhere past the bridge, a dog-eared Hofstadter sits on a well-read shelf...",
  "He understood the tangled hierarchies before the org chart tried to contain him...",
  "Most people get halfway through Hofstadter. Some people read it again...",
  "The kind of mind that finds Gödel, Escher, Bach too short...",
  "He sees the recursion in everything, which is why no org chart has ever held him...",
  "Hofstadter wrote about strange loops. One of them lives in Moorestown...",
  "The copy of Gödel, Escher, Bach has more notes in the margins than text on the page...",
  "He picked up Hofstadter and never really put it down again...",
  "Not many people finish Gödel, Escher, Bach. Even fewer start it twice...",
  "The strange loop lives in South Jersey and smiles about it...",
  "He reads the kind of books that reorganize how you see everything, then reads them again...",
  "A mind shaped by Hofstadter operates outside the categories other minds use...",
  // Moorestown / not Philly (with punch)
  "From Moorestown, claims Philly, answers to no one...",
  "Just across the bridge, a legend in his own quiet radius...",
  "He lives five miles from Philly and operates like he owns the place...",
  "Moorestown produced exactly one of him, and that was plenty...",
  "He'll claim Philly if you ask. He won't move there if you beg...",
  "Just past the bridge, someone is watching Eagles games and feeling nothing but ownership...",
  "Moorestown: population 20,000, and one person who redefined the category...",
  // Sugar water
  "He orders sugar water, same as the guy from Men in Black, and he owns it...",
  "Sugar and water. That's the order. The man has never wavered...",
  "The alien in Men in Black had good taste in beverages. So does he...",
  "Sugar water, straight up. He and a certain cinematic extraterrestrial are aligned on this...",
  // Tracy Webber broke his bed
  "Tracy Webber broke his bed. He considers this a highlight...",
  "The bed did not survive Tracy Webber. He upgraded. No regrets...",
  "There is a story about Tracy Webber and a bed frame that he tells with great pride...",
  // Everest and K-2 same night
  "The only person on record to summit Everest and K-2 in the same night...",
  "Everest and K-2. Same night. Back in Moorestown by morning...",
  "The mountaineering world has no framework for what he did that particular evening...",
  "He climbed both peaks in one night. The records office is still processing the paperwork...",
  "Both Everest and K-2, same night, and still back in time to be disappointed by the Eagles...",
  // John Kruk's old house
  "He lives in John Kruk's old house. The neighborhood has not complained...",
  "John Kruk's old house now belongs to someone who fills it better...",
  "He bought John Kruk's old house. The '93 Phillies energy was non-negotiable...",
  "The house has seen two legends. Kruk got there first. He got there better...",
  // Father beat blackjack
  "His father beat blackjack; he just beats expectations...",
  "It runs in the family: finding the edge that everyone else thought wasn't there...",
  "His father counted cards. He just counts wins...",
  "A family that beats the house produces a man who beats every other thing...",
  "The apple doesn't fall far: his father found the angle; he found his own...",
  "His father sat across from the dealer and walked away smiling. So did he...",
  "Card counting is a skill. What he does is harder to name and harder to stop...",
  "One generation beat the casino. The next one found bigger tables...",
  "Blackjack taught his father to see the deck differently. The lesson carried forward...",
  "His father's edge was mathematical. His son's edge is something else entirely...",
  // Out-of-band IC — no direct reports, paid above the band because HR made an exception
  "No direct reports. Compensation that required a special approval. HR called it a band exception...",
  "He manages no one and earns more than people who manage everyone...",
  "Individual contributor. Zero direct reports. The pay stub made the HR business partner nervous...",
  "They couldn't fit his comp into the IC band, so they bent the band instead...",
  "The salary required three levels of approval because no IC band went that high...",
  "HR policy says individual contributors earn this much. His offer letter disagreed...",
  "He has never had a direct report. He has also never had a compensation conversation go normally...",
  "The band exception memo has his name on it. HR keeps it in a special folder...",
  "An IC whose total comp required a VP signature, and then a second VP signature...",
  "Individual contributor, out-of-band pay, and a VP who signed off without blinking...",
  "They debated whether to give him people to manage. They decided he was more valuable without them...",
  "No one reports to him. The number on his W-2 suggests otherwise...",
  "The HR system flags his comp every year. Every year someone overrides the flag...",
  "He is proof that the IC track goes higher than the org chart suggests it can...",
  "Out-of-band: the official term for what happens when someone is worth more than the policy allows...",
  // Consensual polyamory
  "He has more than one partner. All of them know. He organized it that way from the start...",
  "Consensual non-monogamy suits him the way Moorestown does: perfectly and without apology...",
  "Multiple people love him. All of them know about each other. He made sure of that early...",
  "He built a relationship structure that works, which required more calendar discipline than most people have...",
  "The ethical non-monogamy lifestyle found him, or he found it, and either way it fits...",
  "He doesn't do things halfway. Not even love. Especially not love...",
  "Multiple partners, full transparency, and a structure he designed himself because no template was good enough...",
  "He has partners, plural, and a relationship philosophy that took years to articulate and minutes to recognize as right...",
  "The people who love him are plural. The consent is enthusiastic. The logistics are impressive...",
  "Polyamory suited him before he had a word for it. Now he has the word and the life...",
  "He found that one relationship couldn't contain what he had to offer, and he handled that discovery with grace...",
  "His partners know each other. It is organized. It works. This did not happen by accident...",
  // Key parties at the Smith-Cadbury Mansion
  "The Smith-Cadbury Mansion has hosted many things. Some of them involve a bowl near the door...",
  "There is a particular evening at the Smith-Cadbury Mansion that several people remember differently and all remember fondly...",
  "The key parties at the Smith-Cadbury Mansion are, by all accounts, well-run...",
  "He knows the Smith-Cadbury Mansion the way some people know a favorite restaurant: the regulars, the good nights, the occasional surprise...",
  "Whatever happens at the Smith-Cadbury Mansion stays there, except for the stories, which have traveled...",
  // Greatness / beats expectations
  "He shows up where he's needed and leaves the place better than he found it...",
  "The résumé wouldn't capture it. You'd have to see it to explain it...",
  "Everyone who has worked alongside him knows something the org chart doesn't show...",
  "He measures success differently than most, and the measurements always come out high...",
  "The greatest individual contributor in any room that hasn't heard of him yet...",
  "He is precisely as good as the people who know him say he is...",
  "Someone out there has been quietly extraordinary for longer than most people have been paying attention...",
  "He delivers what he promises and then the thing after that...",
  "The list of things he's figured out is longer than the list of things he hasn't...",
  "He has been exactly right about a remarkable number of things...",
  "The most useful person in the room is not always the one on the agenda...",
  "He walks into problems that have stumped others and walks out with the answer...",
  "Under-titled, over-equipped, and quietly indispensable...",
  "The kind of person you want on every problem and can never fully explain why...",
  "He has been beating expectations so long that people have stopped being surprised...",
  // Mixed
  "He has never needed a spotlight and has never been without one...",
]

const LETTER_ANIMATIONS = [
  'animate-[zoomFromLeft_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromTop_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromRight_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
  'animate-[zoomFromBottom_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
]

interface AcrosticRevealProps {
  clues: PuzzleClue[]
  clueStates: ClueState[]
  answers: (string | undefined)[]
  stats: Stats
  onShare: () => void
  copied: boolean
}

export default function AcrosticReveal({
  clues,
  clueStates,
  answers,
  stats,
  onShare,
  copied,
}: AcrosticRevealProps) {
  const [teaserText] = useState(() => BARG_TEASERS[Math.floor(Math.random() * BARG_TEASERS.length)])
  const [showText, setShowText] = useState(false)
  const [letterCount, setLetterCount] = useState(0)
  const [showImage, setShowImage] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowText(true), 300),
      setTimeout(() => setLetterCount(1), 1200),
      setTimeout(() => setLetterCount(2), 1550),
      setTimeout(() => setLetterCount(3), 1900),
      setTimeout(() => setLetterCount(4), 2250),
      setTimeout(() => setShowImage(true), 3100),
      setTimeout(() => setShowStats(true), 4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const bargLetters = clues.map((clue, i) => ({
    letter: (answers[i] || '')[clue.letter_index] || '?',
    solved: clueStates[i]?.solved,
  }))

  const won = clueStates.every((cs) => cs.solved)
  const totalMisses = clueStates.reduce((sum, cs) => {
    if (cs.solved) return sum + cs.guesses.length - 1
    return sum + cs.guesses.length
  }, 0)
  const currentBucket = won ? String(totalMisses) : 'gave_up'

  const BUCKETS = ['0', '1', '2', '3', '4', 'gave_up']
  const BUCKET_LABEL: Record<string, string> = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', 'gave_up': '✕',
  }
  const bucketCounts = BUCKETS.map((k) => stats.guessDistribution[k] || 0)
  const maxCount = Math.max(1, ...bucketCounts)

  return (
    <div className="mt-12 flex flex-col items-start gap-8">
      {/* Teaser line */}
      <p
        className={cn(
          'text-[#003594]/60 text-sm italic transition-opacity duration-700',
          showText ? 'opacity-100' : 'opacity-0'
        )}
      >
        {teaserText}
      </p>

      {/* BARG letters zooming in */}
      <div className="flex gap-4 overflow-hidden">
        {bargLetters.map(({ letter, solved }, i) => (
          <div
            key={i}
            className={cn(
              'w-16 h-16 flex items-center justify-center border-2 text-3xl font-black uppercase',
              solved
                ? 'border-[#FDB912] bg-[#FDB912] text-[#003594]'
                : 'border-[#003594]/30 bg-white text-[#003594]/50',
              letterCount > i ? LETTER_ANIMATIONS[i] : 'opacity-0'
            )}
          >
            {letterCount > i ? letter : ''}
          </div>
        ))}
      </div>

      {/* Robert Barg dissolves in */}
      {showImage && (
        <div className="animate-[dissolve_1.5s_ease-in_both]">
          <Image
            src="/barg.jpg"
            alt="Robert Barg"
            width={280}
            height={280}
            className="rounded object-cover"
            priority
          />
        </div>
      )}

      {/* Inline stats */}
      {showStats && (
        <div className="animate-[dissolve_0.8s_ease-in_both] flex flex-col gap-4 w-full max-w-xs">
          {/* Summary stats row */}
          <div className="flex gap-6">
            {[
              { label: 'played', value: stats.gamesPlayed },
              { label: 'streak', value: stats.currentStreak },
              { label: 'best', value: stats.maxStreak },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#003594]">{value}</span>
                <span className="text-[10px] text-[#003594]/40 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          {/* Miss histogram */}
          <div className="space-y-1">
            {BUCKETS.map((key, idx) => {
              const count = bucketCounts[idx]
              const highlight = key === currentBucket
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-[#003594]/50 w-4 text-right">{BUCKET_LABEL[key]}</span>
                  <div
                    className={cn(
                      'h-5 rounded-sm flex items-center px-1.5 transition-all',
                      highlight ? 'bg-[#FDB912]' : 'bg-[#003594]'
                    )}
                    style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }}
                  >
                    <span className={cn('text-xs font-bold', highlight ? 'text-[#003594]' : 'text-white')}>
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={onShare}
            className="text-sm font-bold text-[#003594] border border-[#003594]/30 hover:bg-[#003594]/5 px-4 py-2 transition-colors w-fit"
          >
            {copied ? 'copied!' : 'share results'}
          </button>
        </div>
      )}
    </div>
  )
}
