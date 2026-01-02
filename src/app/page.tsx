'use client'

import {
  EditorLayout,
  CanvasWorkspace,
  Canvas,
  ZoomControls,
  EmptyCanvas,
  Toolbar,
  LayersPanel,
  PropertiesPanel,
  Timeline,
} from '@/components/editor'

export default function Home() {
  return (
    <EditorLayout
      toolbar={<Toolbar />}
      layersPanel={<LayersPanel />}
      propertiesPanel={<PropertiesPanel />}
      timeline={<Timeline />}
    >
      <CanvasWorkspace zoomControls={<ZoomControls />}>
        <Canvas />
        <EmptyCanvas />
      </CanvasWorkspace>
    </EditorLayout>
  )
}
