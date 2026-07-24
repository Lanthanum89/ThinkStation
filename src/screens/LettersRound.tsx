import { useMemo, useRef, useState, type ReactNode } from 'react'
import { Device } from '../components/Device'
import { Key } from '../components/Key'
import { LetterBag, MAX_LETTERS, scoreWord } from '../game/letters'
import { findBestWords, isSubsetOfLetters, isValidWord } from '../game/dictionary'
import { useCountdown } from '../game/useCountdown'

type Phase = 'draw' | 'play' | 'reveal'

interface LettersRoundProps {
  roundLabel?: string
  onComplete: (score: number) => void
}

export function LettersRound({ roundLabel, onComplete }: LettersRoundProps) {
  const bagRef = useRef(new LetterBag())
  const [letters, setLetters] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('draw')
  const [entry, setEntry] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const remaining = useCountdown(30, phase === 'play', () => {
    setSubmitted((prev) => prev ?? entry)
    setPhase('reveal')
  })

  const bestWords = useMemo(() => (phase === 'reveal' ? findBestWords(letters.join('')) : []), [phase, letters])

  function pick(kind: 'vowel' | 'consonant') {
    if (letters.length >= MAX_LETTERS) return
    const letter = kind === 'vowel' ? bagRef.current.drawVowel() : bagRef.current.drawConsonant()
    const next = [...letters, letter]
    setLetters(next)
    if (next.length === MAX_LETTERS) setPhase('play')
  }

  function submit() {
    setSubmitted(entry)
    setPhase('reveal')
  }

  const finalWord = (submitted ?? '').toLowerCase().replace(/[^a-z]/g, '')
  const valid = finalWord.length >= 4 && isSubsetOfLetters(finalWord, letters.join('')) && isValidWord(finalWord)
  const score = valid ? scoreWord(finalWord) : 0

  const upperLetters = letters.map((l) => l.toUpperCase())
  const usedSet = new Set(finalWord.toUpperCase().split(''))

  let controls: ReactNode
  if (phase === 'draw') {
    controls = (
      <div className="control-row">
        <Key variant="green" onClick={() => pick('vowel')} disabled={letters.length >= MAX_LETTERS}>
          Vowel
        </Key>
        <Key variant="green" onClick={() => pick('consonant')} disabled={letters.length >= MAX_LETTERS}>
          Cons
        </Key>
      </div>
    )
  } else if (phase === 'play') {
    controls = (
      <>
        <div className="text-input-row">
          <input
            autoFocus
            value={entry}
            maxLength={MAX_LETTERS}
            onChange={(e) => setEntry(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="YOUR WORD"
          />
        </div>
        <div className="control-row">
          <Key variant="amber" wide onClick={submit}>
            Submit
          </Key>
        </div>
      </>
    )
  } else {
    controls = (
      <div className="control-row">
        <Key variant="blue" wide onClick={() => onComplete(score)}>
          Continue
        </Key>
      </div>
    )
  }

  return (
    <Device ledTotal={30} ledLit={phase === 'play' ? 30 - remaining : phase === 'reveal' ? 0 : 30} controls={controls}>
      <p className="screen-title">Letters{roundLabel ? ` — ${roundLabel}` : ''}</p>

      {phase === 'draw' && (
        <>
          <p className="screen-heading">Pick vowel or consonant</p>
          <div className="tiles">
            {upperLetters.map((l, i) => (
              <span key={i} className="tile tile-lg">
                {l}
              </span>
            ))}
            {Array.from({ length: MAX_LETTERS - letters.length }).map((_, i) => (
              <span key={`e${i}`} className="tile tile-lg" style={{ opacity: 0.25 }} />
            ))}
          </div>
          <p className="screen-line dim">{MAX_LETTERS - letters.length} letters to go</p>
        </>
      )}

      {phase === 'play' && (
        <>
          <div className="tiles">
            {upperLetters.map((l, i) => (
              <span key={i} className="tile">
                {l}
              </span>
            ))}
          </div>
          <p className="screen-timer">{String(remaining).padStart(2, '0')}</p>
          <p className="screen-line dim">Type the longest word you can make</p>
        </>
      )}

      {phase === 'reveal' && (
        <>
          <div className="tiles">
            {upperLetters.map((l, i) => (
              <span key={i} className={`tile ${usedSet.has(l) ? '' : 'tile-used'}`}>
                {l}
              </span>
            ))}
          </div>
          <p className="screen-line">
            You said: <strong>{finalWord.toUpperCase() || '(nothing)'}</strong>
          </p>
          <p className={`screen-line ${valid ? 'result-good' : 'result-bad'}`}>
            {finalWord.length === 0
              ? 'No word entered — 0 points'
              : valid
                ? `Valid word! +${score} points`
                : 'Not valid — 0 points'}
          </p>
          {bestWords.length > 0 && <p className="screen-line dim">Expert says: {bestWords[0].toUpperCase()}</p>}
        </>
      )}

      <div className="screen-flex-spacer" />
    </Device>
  )
}
