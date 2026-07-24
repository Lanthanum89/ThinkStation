import type { ButtonHTMLAttributes } from 'react'

type Variant = 'green' | 'blue' | 'amber' | 'grey'

interface KeyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  wide?: boolean
}

export function Key({ variant = 'grey', wide, className, ...rest }: KeyProps) {
  return <button className={`key key-${variant} ${wide ? 'key-wide' : ''} ${className ?? ''}`} {...rest} />
}
