import { randomWordOfLength } from './dictionary'

export interface Conundrum {
  answer: string
  scrambled: string
}

function shuffleWord(word: string): string {
  const letters = word.split('')
  let scrambled = word
  // Keep re-shuffling until it differs from the original (always true for len 9 words in practice).
  let attempts = 0
  while (scrambled === word && attempts < 20) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    scrambled = letters.join('')
    attempts++
  }
  return scrambled
}

export function generateConundrum(): Conundrum {
  const answer = randomWordOfLength(9)
  return { answer, scrambled: shuffleWord(answer).toUpperCase() }
}
