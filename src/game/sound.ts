import { getSettings } from './settings'

export type Sound = 'key' | 'tick' | 'good' | 'bad'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function beep(ac: AudioContext, freq: number, start: number, duration: number, type: OscillatorType, volume = 0.08) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  const t0 = ac.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

/** Synthesised retro beeps, so there are no audio files to bundle. No-op while sound is off. */
export function playSound(sound: Sound) {
  if (!getSettings().soundOn) return
  const ac = getContext()
  if (!ac) return
  switch (sound) {
    case 'key':
      beep(ac, 880, 0, 0.05, 'square', 0.04)
      break
    case 'tick':
      beep(ac, 1200, 0, 0.04, 'square', 0.05)
      break
    case 'good':
      beep(ac, 660, 0, 0.12, 'square')
      beep(ac, 880, 0.12, 0.12, 'square')
      beep(ac, 1320, 0.24, 0.2, 'square')
      break
    case 'bad':
      beep(ac, 220, 0, 0.25, 'sawtooth')
      beep(ac, 165, 0.25, 0.35, 'sawtooth')
      break
  }
}
