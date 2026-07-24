import type { ReactNode } from 'react'
import { LedStrip } from './LedStrip'

interface DeviceProps {
  ledTotal?: number
  ledLit?: number
  children: ReactNode
  controls: ReactNode
}

export function Device({ ledTotal = 30, ledLit = 0, children, controls }: DeviceProps) {
  return (
    <div className="device">
      <div className="device-top">
        <span className="brand">ThinkStation</span>
        <span className="brand-sub">electronic puzzle</span>
      </div>
      <LedStrip total={ledTotal} lit={ledLit} />
      <div className="lcd-frame">
        <div className="lcd-screen">{children}</div>
      </div>
      <div className="controls">{controls}</div>
    </div>
  )
}
