import { useState } from 'react'
import './App.css'
import { Menu } from './screens/Menu'
import { LettersRound } from './screens/LettersRound'
import { NumbersRound } from './screens/NumbersRound'
import { ConundrumRound } from './screens/ConundrumRound'
import { GameOver } from './screens/GameOver'

type RoundKind = 'letters' | 'numbers' | 'conundrum'

const FULL_GAME_SEQUENCE: RoundKind[] = ['letters', 'letters', 'numbers', 'letters', 'numbers', 'letters', 'conundrum']

const ROUND_TITLE: Record<RoundKind, string> = {
  letters: 'Letters',
  numbers: 'Numbers',
  conundrum: 'Conundrum',
}

interface CompletedRound {
  label: string
  score: number
}

function App() {
  const [queue, setQueue] = useState<RoundKind[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [history, setHistory] = useState<CompletedRound[]>([])
  const [lastGameScore, setLastGameScore] = useState<number>()
  const [gameOver, setGameOver] = useState(false)

  function startPractice(kind: RoundKind) {
    setQueue([kind])
    setQueueIndex(0)
    setHistory([])
    setGameOver(false)
  }

  function startFullGame() {
    setQueue(FULL_GAME_SEQUENCE)
    setQueueIndex(0)
    setHistory([])
    setGameOver(false)
  }

  function handleRoundComplete(score: number) {
    const kind = queue[queueIndex]
    const label = `${ROUND_TITLE[kind]} ${history.filter((h) => h.label.startsWith(ROUND_TITLE[kind])).length + 1}`
    const nextHistory = [...history, { label, score }]
    setHistory(nextHistory)

    if (queueIndex + 1 < queue.length) {
      setQueueIndex((i) => i + 1)
    } else {
      setLastGameScore(nextHistory.reduce((sum, r) => sum + r.score, 0))
      setGameOver(true)
    }
  }

  function backToMenu() {
    setQueue([])
    setQueueIndex(0)
    setHistory([])
    setGameOver(false)
  }

  if (gameOver) {
    return <GameOver rounds={history} total={history.reduce((sum, r) => sum + r.score, 0)} onDone={backToMenu} />
  }

  if (queue.length === 0) {
    return <Menu onStartFullGame={startFullGame} onPractice={startPractice} lastScore={lastGameScore} />
  }

  const current = queue[queueIndex]
  const roundLabel = queue.length > 1 ? `Round ${queueIndex + 1} of ${queue.length}` : undefined

  if (current === 'letters') return <LettersRound key={queueIndex} roundLabel={roundLabel} onComplete={handleRoundComplete} />
  if (current === 'numbers') return <NumbersRound key={queueIndex} roundLabel={roundLabel} onComplete={handleRoundComplete} />
  return <ConundrumRound key={queueIndex} onComplete={handleRoundComplete} />
}

export default App
