import type { ButtonHTMLAttributes } from 'react'
import { playSound } from '../game/sound'

type Variant = 'green' | 'blue' | 'amber' | 'grey'

interface KeyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  wide?: boolean
}

export function Key({ variant = 'grey', wide, className, onClick, ...rest }: KeyProps) {
  return (
    <button
      className={`key key-${variant} ${wide ? 'key-wide' : ''} ${className ?? ''}`}
      onClick={(e) => {
        playSound('key')
        onClick?.(e)
      }}
      {...rest}
    />
  )
}
