import { useSyncExternalStore } from 'react'

export type Difficulty = 'easy' | 'normal' | 'hard'

export const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard']

export const ROUND_SECONDS: Record<Difficulty, number> = {
  easy: 45,
  normal: 30,
  hard: 20,
}

interface Settings {
  difficulty: Difficulty
  soundOn: boolean
}

const STORAGE_KEY = 'thinkstation:settings'
const DEFAULTS: Settings = { difficulty: 'normal', soundOn: false }

function load(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return {
      difficulty: DIFFICULTIES.includes(raw.difficulty) ? raw.difficulty : DEFAULTS.difficulty,
      soundOn: typeof raw.soundOn === 'boolean' ? raw.soundOn : DEFAULTS.soundOn,
    }
  } catch {
    return DEFAULTS
  }
}

let current = load()
const listeners = new Set<() => void>()

export function getSettings(): Settings {
  return current
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // storage unavailable (private mode etc.): keep the in-memory value
  }
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, getSettings)
}

export function useRoundSeconds(): number {
  return ROUND_SECONDS[useSettings().difficulty]
}
