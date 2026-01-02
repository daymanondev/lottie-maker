'use client'

import { ReactNode } from 'react'

interface CanvasWorkspaceProps {
  children: ReactNode
  zoomControls?: ReactNode
}

export function CanvasWorkspace({ children, zoomControls }: CanvasWorkspaceProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Canvas container - centered */}
      <div className="relative">{children}</div>

      {/* Zoom controls overlay */}
      {zoomControls && (
        <div className="absolute bottom-4 left-4 z-10">{zoomControls}</div>
      )}
    </div>
  )
}
