'use client'

import { useState, useEffect } from 'react'
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
  WelcomeModal,
  ShortcutPanel,
  TemplatePicker,
} from '@/components/editor'
import { useCanvasContext } from '@/contexts'
import type { Canvas as FabricCanvas } from 'fabric'

export default function Home() {
  const { canvasRef } = useCanvasContext()
  const [isShortcutPanelOpen, setShortcutPanelOpen] = useState(false)
  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false)
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null)

  useEffect(() => {
    const checkCanvas = () => {
      if (canvasRef.current && !canvas) {
        setCanvas(canvasRef.current)
      }
    }
    checkCanvas()
    const interval = setInterval(checkCanvas, 100)
    return () => clearInterval(interval)
  }, [canvasRef, canvas])

  return (
    <>
      <EditorLayout
        toolbar={<Toolbar onOpenShortcuts={() => setShortcutPanelOpen(true)} />}
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

      <WelcomeModal canvas={canvas} onOpenTemplatePicker={() => setTemplatePickerOpen(true)} />
      <ShortcutPanel open={isShortcutPanelOpen} onOpenChange={setShortcutPanelOpen} />
      <TemplatePicker open={isTemplatePickerOpen} onOpenChange={setTemplatePickerOpen} canvas={canvas} />
    </>
  )
}
