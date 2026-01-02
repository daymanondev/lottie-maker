'use client'

import { useEditorStore } from '@/store'

interface WorkAreaProps {
  width?: number
  height?: number
}

export function WorkArea({ width = 512, height = 512 }: WorkAreaProps) {
  const zoom = useEditorStore((s) => s.zoom)

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* Work area frame */}
      <div
        className="relative border border-[#404040] bg-white shadow-2xl"
        style={{
          width: width * zoom,
          height: height * zoom,
        }}
      >
        {/* Dimensions label */}
        <div className="absolute -top-6 left-0 flex items-center gap-1 text-xs text-[#a1a1aa]">
          <span>{width}</span>
          <span>×</span>
          <span>{height}</span>
        </div>
      </div>
    </div>
  )
}
