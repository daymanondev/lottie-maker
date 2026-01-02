'use client'

import {
  EditorLayout,
  CanvasWorkspace,
  Canvas,
  ZoomControls,
  EmptyCanvas,
  Toolbar,
} from '@/components/editor'

export default function Home() {
  return (
    <EditorLayout
      toolbar={<Toolbar />}
      layersPanel={<PlaceholderPanel title="Layers" />}
      propertiesPanel={<PlaceholderPanel title="Properties" />}
      timeline={<PlaceholderTimeline />}
    >
      <CanvasWorkspace zoomControls={<ZoomControls />}>
        <Canvas />
        <EmptyCanvas />
      </CanvasWorkspace>
    </EditorLayout>
  )
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center border-b border-[#262626] px-4">
        <span className="text-sm font-medium text-[#fafafa]">{title}</span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <span className="text-xs text-[#a1a1aa]">Coming soon</span>
      </div>
    </div>
  )
}

function PlaceholderTimeline() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center border-b border-[#262626] px-4">
        <span className="text-sm font-medium text-[#fafafa]">Timeline</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-xs text-[#a1a1aa]">Timeline coming soon</span>
      </div>
    </div>
  )
}
