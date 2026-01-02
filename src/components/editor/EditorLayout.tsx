'use client'

import { ReactNode } from 'react'
import { useEditorStore } from '@/store'

interface EditorLayoutProps {
  toolbar?: ReactNode
  layersPanel?: ReactNode
  propertiesPanel?: ReactNode
  timeline?: ReactNode
  children: ReactNode
}

export function EditorLayout({
  toolbar,
  layersPanel,
  propertiesPanel,
  timeline,
  children,
}: EditorLayoutProps) {
  const panels = useEditorStore((s) => s.panels)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Toolbar */}
      {toolbar && (
        <header className="flex h-12 shrink-0 items-center border-b border-[#262626] bg-[#141414] px-4">
          {toolbar}
        </header>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layers Panel */}
        {panels.layers && layersPanel && (
          <aside className="flex w-60 shrink-0 flex-col border-r border-[#262626] bg-[#141414]">
            {layersPanel}
          </aside>
        )}

        {/* Canvas Workspace */}
        <main className="relative flex-1 overflow-hidden">{children}</main>

        {/* Properties Panel */}
        {panels.properties && propertiesPanel && (
          <aside className="flex w-[280px] shrink-0 flex-col border-l border-[#262626] bg-[#141414]">
            {propertiesPanel}
          </aside>
        )}
      </div>

      {/* Timeline */}
      {panels.timeline && timeline && (
        <footer className="h-[200px] shrink-0 border-t border-[#262626] bg-[#141414]">
          {timeline}
        </footer>
      )}
    </div>
  )
}
