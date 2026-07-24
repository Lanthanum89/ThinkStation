// Letter frequencies modelled on the classic tile bag used by the TV show
// this handheld imitates: enough copies of each letter to keep the odds
// realistic, split into a vowel bag and a consonant bag.
const VOWEL_BAG = 'AAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEIIIIIIIIIIIIOOOOOOOOOOOUUUUU'.split('')
const CONSONANT_BAG =
  'BBCCCCDDDDDDFFGGGHHJKLLLLLMMMMNNNNNNNNPPPPQRRRRRRRRRSSSSSSTTTTTTTTTVVWWXYYZ'.split('')

export const MAX_LETTERS = 9

export class LetterBag {
  private vowels: string[]
  private consonants: string[]

  constructor() {
    this.vowels = shuffle([...VOWEL_BAG])
    this.consonants = shuffle([...CONSONANT_BAG])
  }

  drawVowel(): string {
    const letter = this.vowels.pop()
    if (!letter) throw new Error('Out of vowels')
    return letter
  }

  drawConsonant(): string {
    const letter = this.consonants.pop()
    if (!letter) throw new Error('Out of consonants')
    return letter
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function isVowel(letter: string): boolean {
  return 'AEIOU'.includes(letter.toUpperCase())
}

/** Score for a valid word: length in points, with the show's classic +9 bonus for using all 9 letters. */
export function scoreWord(word: string): number {
  if (word.length < 4) return 0
  return word.length === 9 ? word.length + 9 : word.length
}
