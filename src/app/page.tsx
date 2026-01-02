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
  LottiePreview,
} from '@/components/editor'

export default function Home() {
  return (
    <EditorLayout
      toolbar={<Toolbar />}
      layersPanel={<LayersPanel />}
      propertiesPanel={<PropertiesPanel />}
      previewPanel={<LottiePreview />}
      timeline={<Timeline />}
    >
      <CanvasWorkspace zoomControls={<ZoomControls />}>
        <Canvas />
        <EmptyCanvas />
      </CanvasWorkspace>
    </EditorLayout>
  )
}
