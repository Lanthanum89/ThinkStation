import { Device } from '../components/Device'
import { Key } from '../components/Key'

interface GameOverProps {
  rounds: { label: string; score: number }[]
  total: number
  onDone: () => void
}

export function GameOver({ rounds, total, onDone }: GameOverProps) {
  const controls = (
    <div className="control-row">
      <Key variant="amber" wide onClick={onDone}>
        Main Menu
      </Key>
    </div>
  )

  return (
    <Device ledTotal={30} ledLit={30} controls={controls}>
      <p className="screen-title">Game Over</p>
      <p className="screen-heading">Final Score: {total}</p>
      {rounds.map((r, i) => (
        <div className="scoreboard" key={i}>
          <span>{r.label}</span>
          <span>{r.score}</span>
        </div>
      ))}
      <div className="screen-flex-spacer" />
    </Device>
  )
}
