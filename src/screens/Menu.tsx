import { Device } from '../components/Device'
import { Key } from '../components/Key'
import { DIFFICULTIES, ROUND_SECONDS, updateSettings, useSettings } from '../game/settings'

interface MenuProps {
  onStartFullGame: () => void
  onPractice: (kind: 'letters' | 'numbers' | 'conundrum') => void
  lastScore?: number
}

export function Menu({ onStartFullGame, onPractice, lastScore }: MenuProps) {
  const { difficulty, soundOn } = useSettings()
  const nextDifficulty = DIFFICULTIES[(DIFFICULTIES.indexOf(difficulty) + 1) % DIFFICULTIES.length]
  const controls = (
    <>
      <div className="control-row">
        <Key variant="amber" wide onClick={onStartFullGame}>
          Full Game
        </Key>
      </div>
      <div className="control-row">
        <Key variant="green" onClick={() => onPractice('letters')}>
          Letters
        </Key>
        <Key variant="green" onClick={() => onPractice('numbers')}>
          Numbers
        </Key>
      </div>
      <div className="control-row">
        <Key variant="blue" wide onClick={() => onPractice('conundrum')}>
          Conundrum
        </Key>
      </div>
      <div className="control-row">
        <Key
          aria-label={`Difficulty: ${difficulty}, ${ROUND_SECONDS[difficulty]} seconds per round. Press to change.`}
          onClick={() => updateSettings({ difficulty: nextDifficulty })}
        >
          {difficulty} · {ROUND_SECONDS[difficulty]}s
        </Key>
        <Key aria-pressed={soundOn} onClick={() => updateSettings({ soundOn: !soundOn })}>
          Sound {soundOn ? 'on' : 'off'}
        </Key>
      </div>
    </>
  )

  return (
    <Device ledTotal={30} ledLit={30} controls={controls}>
      <p className="screen-title">ThinkStation</p>
      <p className="screen-heading">Electronic Countdown</p>
      <p className="screen-line dim">Starting...</p>
      <div className="screen-flex-spacer" />
      {lastScore !== undefined && <p className="screen-line">Last game score: {lastScore}</p>}
      <p className="screen-line dim">Choose a round to practice, or play the Full Game.</p>
    </Device>
  )
}
