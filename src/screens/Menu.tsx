import { Device } from '../components/Device'
import { Key } from '../components/Key'

interface MenuProps {
  onStartFullGame: () => void
  onPractice: (kind: 'letters' | 'numbers' | 'conundrum') => void
  lastScore?: number
}

export function Menu({ onStartFullGame, onPractice, lastScore }: MenuProps) {
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
