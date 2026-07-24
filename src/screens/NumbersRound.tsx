import { useMemo, useState, type ReactNode } from 'react'
import { Device } from '../components/Device'
import { Key } from '../components/Key'
import {
  LARGE_NUMBERS,
  NUMBERS_COUNT,
  drawNumbers,
  evaluateExpression,
  randomTarget,
  scoreNumbers,
  solveNumbers,
} from '../game/numbers'
import { useCountdown } from '../game/useCountdown'

type Phase = 'draw' | 'play' | 'reveal'

interface NumbersRoundProps {
  roundLabel?: string
  onComplete: (score: number) => void
}

const OPS = ['+', '-', '*', '/', '(', ')']

export function NumbersRound({ roundLabel, onComplete }: NumbersRoundProps) {
  const [bigCount, setBigCount] = useState(0)
  const [smallCount, setSmallCount] = useState(0)
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState(0)
  const [phase, setPhase] = useState<Phase>('draw')
  const [expr, setExpr] = useState('')
  const [usedTiles, setUsedTiles] = useState<Set<number>>(new Set())
  const [finalExpr, setFinalExpr] = useState('')

  const totalPicked = bigCount + smallCount

  function pick(kind: 'big' | 'small') {
    if (totalPicked >= NUMBERS_COUNT) return
    if (kind === 'big') setBigCount((n) => n + 1)
    else setSmallCount((n) => n + 1)
    if (totalPicked + 1 === NUMBERS_COUNT) {
      const finalBig = kind === 'big' ? bigCount + 1 : bigCount
      const hand = drawNumbers(finalBig)
      setNumbers(hand)
      setTarget(randomTarget())
      setPhase('play')
    }
  }

  const remaining = useCountdown(30, phase === 'play', () => {
    setFinalExpr((prev) => prev || expr)
    setPhase('reveal')
  })

  function tapNumber(index: number) {
    if (usedTiles.has(index)) return
    setExpr((e) => e + numbers[index])
    setUsedTiles((s) => new Set(s).add(index))
  }

  function tapOp(op: string) {
    setExpr((e) => e + op)
  }

  function clear() {
    setExpr('')
    setUsedTiles(new Set())
  }

  function submit() {
    setFinalExpr(expr)
    setPhase('reveal')
  }

  const result = useMemo(() => (phase === 'reveal' ? evaluateExpression(finalExpr, numbers) : null), [phase, finalExpr, numbers])
  const score = phase === 'reveal' ? scoreNumbers(target, result) : 0
  const solverAnswer = useMemo(() => (phase === 'reveal' ? solveNumbers(numbers, target) : null), [phase, numbers, target])

  let controls: ReactNode
  if (phase === 'draw') {
    controls = (
      <>
        <div className="control-row">
          <Key variant="blue" onClick={() => pick('big')} disabled={bigCount >= LARGE_NUMBERS.length || totalPicked >= NUMBERS_COUNT}>
            Big
          </Key>
          <Key variant="green" onClick={() => pick('small')} disabled={totalPicked >= NUMBERS_COUNT}>
            Small
          </Key>
        </div>
        <p className="footer-note">{NUMBERS_COUNT - totalPicked} numbers left to choose (max 4 big)</p>
      </>
    )
  } else if (phase === 'play') {
    controls = (
      <>
        <div className="keypad-grid">
          {numbers.map((n, i) => (
            <Key key={i} variant="grey" disabled={usedTiles.has(i)} onClick={() => tapNumber(i)}>
              {n}
            </Key>
          ))}
        </div>
        <div className="keypad-grid">
          {OPS.map((op) => (
            <Key key={op} variant="blue" onClick={() => tapOp(op)}>
              {op}
            </Key>
          ))}
        </div>
        <div className="control-row">
          <Key variant="grey" onClick={clear}>
            Clear
          </Key>
          <Key variant="amber" wide onClick={submit}>
            Enter
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
      <p className="screen-title">Numbers{roundLabel ? ` — ${roundLabel}` : ''}</p>

      {phase === 'draw' && (
        <>
          <p className="screen-heading">Choose 6 numbers</p>
          <div className="tiles">
            {Array.from({ length: totalPicked }).map((_, i) => (
              <span key={i} className="tile tile-lg">
                ?
              </span>
            ))}
            {Array.from({ length: NUMBERS_COUNT - totalPicked }).map((_, i) => (
              <span key={`e${i}`} className="tile tile-lg" style={{ opacity: 0.25 }} />
            ))}
          </div>
        </>
      )}

      {phase === 'play' && (
        <>
          <p className="screen-line dim">Target</p>
          <p className="screen-heading" style={{ fontSize: 28, textAlign: 'center' }}>
            {target}
          </p>
          <p className="screen-timer">{String(remaining).padStart(2, '0')}</p>
          <div className="entry-line">{expr || ' '}</div>
        </>
      )}

      {phase === 'reveal' && (
        <>
          <p className="screen-line dim">Target: {target}</p>
          <p className="screen-line">
            You entered: <strong>{finalExpr || '(nothing)'}</strong>
          </p>
          <p className={`screen-line ${score > 0 ? 'result-good' : 'result-bad'}`}>
            {result === null ? 'Invalid expression — 0 points' : `= ${result}, +${score} points`}
          </p>
          {solverAnswer && (
            <p className="screen-line dim">
              Expert says: {solverAnswer.expr} = {solverAnswer.value}
            </p>
          )}
        </>
      )}

      <div className="screen-flex-spacer" />
    </Device>
  )
}
