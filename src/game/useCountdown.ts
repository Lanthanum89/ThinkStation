import { useEffect, useRef, useState } from 'react'

/**
 * Countdown timer in whole seconds. `running` starts/stops the tick;
 * `onExpire` fires once when it reaches zero.
 */
export function useCountdown(seconds: number, running: boolean, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(seconds)
  const expiredRef = useRef(false)

  useEffect(() => {
    setRemaining(seconds)
    expiredRef.current = false
  }, [seconds])

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
      }
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, remaining])

  return remaining
}
