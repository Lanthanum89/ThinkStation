import wordList from '../data/words.json'

const ALL_WORDS: string[] = wordList as string[]

const WORD_SET = new Set(ALL_WORDS)

const WORDS_BY_LENGTH: Map<number, string[]> = new Map()
for (const word of ALL_WORDS) {
  const bucket = WORDS_BY_LENGTH.get(word.length)
  if (bucket) bucket.push(word)
  else WORDS_BY_LENGTH.set(word.length, [word])
}

export function isValidWord(word: string): boolean {
  return WORD_SET.has(word.toLowerCase())
}

export function wordsOfLength(length: number): string[] {
  return WORDS_BY_LENGTH.get(length) ?? []
}

function lettersMultiset(letters: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const ch of letters.toLowerCase()) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1)
  }
  return counts
}

/** Can `word` be formed using only the letters available (respecting counts)? */
export function isSubsetOfLetters(word: string, available: string): boolean {
  const pool = lettersMultiset(available)
  for (const ch of word.toLowerCase()) {
    const remaining = pool.get(ch) ?? 0
    if (remaining <= 0) return false
    pool.set(ch, remaining - 1)
  }
  return true
}

/** Find the longest dictionary word(s) that can be made from the given letters. */
export function findBestWords(available: string, maxCandidates = 5): string[] {
  const results: string[] = []
  for (let len = Math.min(available.length, 9); len >= 4; len--) {
    for (const word of wordsOfLength(len)) {
      if (isSubsetOfLetters(word, available)) {
        results.push(word)
        if (results.length >= maxCandidates) return results
      }
    }
    if (results.length > 0) return results
  }
  return results
}

export function randomWordOfLength(length: number): string {
  const pool = wordsOfLength(length)
  return pool[Math.floor(Math.random() * pool.length)]
}
