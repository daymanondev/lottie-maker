'use client'

import {
  EditorLayout,
  CanvasWorkspace,
  Canvas,
  ZoomControls,
  Toolbar,
  LayersPanel,
  PropertiesPanel,
  Timeline,
  LottiePreview,
  CanvasErrorBoundary,
  PreviewErrorBoundary,
  TimelineErrorBoundary,
} from '@/components/editor'

export default function Home() {
  return (
    <EditorLayout
      toolbar={<Toolbar />}
      layersPanel={<LayersPanel />}
      propertiesPanel={<PropertiesPanel />}
      previewPanel={
        <PreviewErrorBoundary>
          <LottiePreview />
        </PreviewErrorBoundary>
      }
      timeline={
        <TimelineErrorBoundary>
          <Timeline />
        </TimelineErrorBoundary>
      }
    >
      <CanvasErrorBoundary>
        <CanvasWorkspace zoomControls={<ZoomControls />}>
          <Canvas />
        </CanvasWorkspace>
      </CanvasErrorBoundary>
    </EditorLayout>
  )
}
