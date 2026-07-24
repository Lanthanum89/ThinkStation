import { useRef, useState, type ReactNode } from 'react'
import { Device } from '../components/Device'
import { Key } from '../components/Key'
import { generateConundrum } from '../game/conundrum'
import { useCountdown } from '../game/useCountdown'

type Phase = 'play' | 'reveal'

interface ConundrumRoundProps {
  onComplete: (score: number) => void
}

export function ConundrumRound({ onComplete }: ConundrumRoundProps) {
  const puzzleRef = useRef(generateConundrum())
  const { answer, scrambled } = puzzleRef.current
  const [phase, setPhase] = useState<Phase>('play')
  const [guess, setGuess] = useState('')
  const [finalGuess, setFinalGuess] = useState('')

  const remaining = useCountdown(30, phase === 'play', () => {
    setFinalGuess((prev) => prev || guess)
    setPhase('reveal')
  })

  function submit() {
    setFinalGuess(guess)
    setPhase('reveal')
  }

  const correct = finalGuess.toLowerCase() === answer.toLowerCase()
  const score = correct ? 10 : 0

  let controls: ReactNode
  if (phase === 'play') {
    controls = (
      <>
        <div className="text-input-row">
          <input
            autoFocus
            value={guess}
            maxLength={9}
            onChange={(e) => setGuess(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="YOUR ANSWER"
          />
        </div>
        <div className="control-row">
          <Key variant="amber" wide onClick={submit}>
            Buzz In
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
    <Device ledTotal={30} ledLit={phase === 'play' ? 30 - remaining : 0} controls={controls}>
      <p className="screen-title">Conundrum</p>
      <div className="tiles">
        {scrambled.split('').map((l, i) => (
          <span key={i} className="tile">
            {l}
          </span>
        ))}
      </div>

      {phase === 'play' && (
        <>
          <p className="screen-timer">{String(remaining).padStart(2, '0')}</p>
          <p className="screen-line dim">Unscramble the 9-letter word</p>
        </>
      )}

      {phase === 'reveal' && (
        <>
          <p className="screen-line">
            You said: <strong>{finalGuess || '(nothing)'}</strong>
          </p>
          <p className={`screen-line ${correct ? 'result-good' : 'result-bad'}`}>
            {correct ? `Correct! +${score} points` : 'Not quite — 0 points'}
          </p>
          <p className="screen-line dim">Answer: {answer.toUpperCase()}</p>
        </>
      )}

      <div className="screen-flex-spacer" />
    </Device>
  )
}
