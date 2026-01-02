'use client'

import { useEditorStore } from '@/store'
import { Upload } from 'lucide-react'

export function EmptyCanvas() {
  const objects = useEditorStore((s) => s.objects)

  if (objects.length > 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-[#404040] bg-[#141414]">
          <Upload className="h-6 w-6 text-[#a1a1aa]" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[#fafafa]">
            Drop SVG here or add a shape
          </p>
          <p className="text-xs text-[#a1a1aa]">
            Use the toolbar above to get started
          </p>
        </div>
      </div>
    </div>
  )
}
