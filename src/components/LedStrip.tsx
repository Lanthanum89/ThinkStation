interface LedStripProps {
  total: number
  lit: number
}

export function LedStrip({ total, lit }: LedStripProps) {
  const leds = Array.from({ length: total }, (_, i) => i)
  return (
    <div className="led-strip" aria-hidden="true">
      {leds.map((i) => {
        const on = i < lit
        const fracFromEnd = (total - i) / total
        let color = 'var(--led-green)'
        if (fracFromEnd <= 1 / 3) color = 'var(--led-red)'
        else if (fracFromEnd <= 2 / 3) color = 'var(--led-amber)'
        return (
          <span
            key={i}
            className="led"
            style={{ background: on ? color : 'var(--led-off)', boxShadow: on ? `0 0 6px ${color}` : 'none' }}
          />
        )
      })}
    </div>
  )
}
