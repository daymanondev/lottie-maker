'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useEditorStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Settings,
  Diamond,
} from 'lucide-react'
import type { CanvasObject, Keyframe } from '@/types'

const FRAME_WIDTH = 12
const HEADER_WIDTH = 180

interface TimelineTrackProps {
  layer: CanvasObject
  keyframes: Keyframe[]
  currentFrame: number
  duration: number
  isSelected: boolean
  onAddKeyframe: (objectId: string, frame: number) => void
  onSelectKeyframe: (keyframe: Keyframe) => void
}

function TimelineTrack({
  layer,
  keyframes,
  currentFrame,
  duration,
  isSelected,
  onAddKeyframe,
  onSelectKeyframe,
}: TimelineTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const frame = Math.round(x / FRAME_WIDTH)
    if (frame >= 0 && frame <= duration) {
      onAddKeyframe(layer.id, frame)
    }
  }

  return (
    <div
      className={`flex h-7 border-b border-[#262626] ${
        isSelected ? 'bg-[#1d4ed8]/10' : ''
      }`}
    >
      <div className="flex w-[180px] shrink-0 items-center gap-2 border-r border-[#262626] px-2">
        <span className="truncate text-xs text-[#a1a1aa]">{layer.name}</span>
      </div>
      <div
        ref={trackRef}
        className="relative flex-1 cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        {keyframes.length === 0 && isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-[#3f3f46]">Double-click to add keyframe</span>
          </div>
        )}
        {keyframes.map((kf) => (
          <button
            key={kf.id}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
            style={{ left: `${kf.frame * FRAME_WIDTH}px` }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectKeyframe(kf)
            }}
          >
            <Diamond
              className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]"
              strokeWidth={1.5}
            />
          </button>
        ))}
        <div
          className="pointer-events-none absolute top-0 h-full w-px bg-[#3b82f6]"
          style={{ left: `${currentFrame * FRAME_WIDTH}px` }}
        />
      </div>
    </div>
  )
}

function FrameRuler({
  duration,
  frameRate,
  currentFrame,
  onFrameClick,
}: {
  duration: number
  frameRate: number
  currentFrame: number
  onFrameClick: (frame: number) => void
}) {
  const rulerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const frame = Math.max(0, Math.min(duration, Math.round(x / FRAME_WIDTH)))
    onFrameClick(frame)
  }

  const markers: { frame: number; label: string }[] = []
  const majorInterval = frameRate
  const minorInterval = Math.max(1, Math.floor(frameRate / 6))

  for (let f = 0; f <= duration; f++) {
    if (f % majorInterval === 0) {
      const seconds = f / frameRate
      markers.push({ frame: f, label: `${seconds.toFixed(1)}s` })
    }
  }

  return (
    <div className="flex h-6 border-b border-[#262626]">
      <div className="w-[180px] shrink-0 border-r border-[#262626]" />
      <div
        ref={rulerRef}
        className="relative flex-1 cursor-pointer bg-[#1a1a1a]"
        onClick={handleClick}
      >
        {Array.from({ length: duration + 1 }).map((_, f) => {
          const isMajor = f % majorInterval === 0
          const isMinor = !isMajor && f % minorInterval === 0
          if (!isMajor && !isMinor) return null
          return (
            <div
              key={f}
              className={`absolute bottom-0 w-px ${
                isMajor ? 'h-3 bg-[#71717a]' : 'h-1.5 bg-[#3f3f46]'
              }`}
              style={{ left: `${f * FRAME_WIDTH}px` }}
            />
          )
        })}
        {markers.map(({ frame, label }) => (
          <span
            key={frame}
            className="absolute top-0.5 -translate-x-1/2 text-[9px] text-[#71717a]"
            style={{ left: `${frame * FRAME_WIDTH}px` }}
          >
            {label}
          </span>
        ))}
        <div
          className="absolute top-0 h-full w-0.5 bg-[#3b82f6]"
          style={{ left: `${currentFrame * FRAME_WIDTH}px` }}
        />
      </div>
    </div>
  )
}

function PlaybackControls({
  isPlaying,
  currentFrame,
  duration,
  frameRate,
  onPlay,
  onPause,
  onStop,
  onSeekStart,
  onSeekEnd,
  onFrameChange,
}: {
  isPlaying: boolean
  currentFrame: number
  duration: number
  frameRate: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSeekStart: () => void
  onSeekEnd: () => void
  onFrameChange: (frame: number) => void
}) {
  const formatTime = (frame: number) => {
    const seconds = frame / frameRate
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(1)
    return `${mins}:${secs.padStart(4, '0')}`
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
        onClick={onSeekStart}
        title="Go to start"
      >
        <SkipBack className="h-3.5 w-3.5" />
      </Button>
      {isPlaying ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
          onClick={onPause}
          title="Pause"
        >
          <Pause className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
          onClick={onPlay}
          title="Play"
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
        onClick={onStop}
        title="Stop"
      >
        <Square className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
        onClick={onSeekEnd}
        title="Go to end"
      >
        <SkipForward className="h-3.5 w-3.5" />
      </Button>

      <div className="mx-2 h-4 w-px bg-[#262626]" />

      <div className="flex items-center gap-1.5">
        <span className="text-xs tabular-nums text-[#71717a]">
          {formatTime(currentFrame)}
        </span>
        <span className="text-xs text-[#52525b]">/</span>
        <span className="text-xs tabular-nums text-[#52525b]">
          {formatTime(duration)}
        </span>
      </div>

      <div className="mx-2 h-4 w-px bg-[#262626]" />

      <div className="flex items-center gap-1">
        <span className="text-[10px] text-[#52525b]">Frame</span>
        <Input
          type="number"
          value={currentFrame}
          onChange={(e) => {
            const frame = parseInt(e.target.value, 10)
            if (!isNaN(frame)) {
              onFrameChange(Math.max(0, Math.min(duration, frame)))
            }
          }}
          className="h-6 w-14 bg-[#1a1a1a] border-[#262626] px-1.5 text-center text-xs text-[#fafafa]"
        />
      </div>
    </div>
  )
}

function TimelineSettings({
  duration,
  frameRate,
  onDurationChange,
  onFrameRateChange,
}: {
  duration: number
  frameRate: number
  onDurationChange: (d: number) => void
  onFrameRateChange: (r: number) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-[#71717a] hover:text-[#fafafa]"
          title="Timeline settings"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 bg-[#141414] border-[#262626]"
        align="end"
      >
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a1a1aa]">Duration (frames)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => {
                const d = parseInt(e.target.value, 10)
                if (!isNaN(d) && d > 0) onDurationChange(d)
              }}
              className="h-8 bg-[#1a1a1a] border-[#262626] text-xs text-[#fafafa]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#a1a1aa]">Frame rate (fps)</label>
            <Input
              type="number"
              value={frameRate}
              onChange={(e) => {
                const r = parseInt(e.target.value, 10)
                if (!isNaN(r) && r > 0 && r <= 120) onFrameRateChange(r)
              }}
              className="h-8 bg-[#1a1a1a] border-[#262626] text-xs text-[#fafafa]"
            />
          </div>
          <div className="text-[10px] text-[#52525b]">
            Duration: {(duration / frameRate).toFixed(2)}s
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function Timeline() {
  const {
    objects,
    selectedIds,
    currentFrame,
    duration,
    frameRate,
    isPlaying,
    setCurrentFrame,
    setDuration,
    setFrameRate,
    play,
    pause,
    stop,
    addKeyframe,
    getKeyframesForObject,
  } = useEditorStore()

  const [isDragging, setIsDragging] = useState(false)
  const [selectedKeyframe, setSelectedKeyframe] = useState<Keyframe | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const playbackRef = useRef<number | null>(null)

  useEffect(() => {
    if (isPlaying) {
      const frameDuration = 1000 / frameRate
      let lastTime = performance.now()

      const tick = (now: number) => {
        const delta = now - lastTime
        if (delta >= frameDuration) {
          lastTime = now - (delta % frameDuration)
          setCurrentFrame((currentFrame + 1) % (duration + 1))
        }
        playbackRef.current = requestAnimationFrame(tick)
      }

      playbackRef.current = requestAnimationFrame(tick)

      return () => {
        if (playbackRef.current) {
          cancelAnimationFrame(playbackRef.current)
        }
      }
    }
  }, [isPlaying, frameRate, duration, currentFrame, setCurrentFrame])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    setIsDragging(true)
    updateFrameFromMouse(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !timelineRef.current) return
    updateFrameFromMouse(e)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateFrameFromMouse = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - HEADER_WIDTH
    const frame = Math.max(0, Math.min(duration, Math.round(x / FRAME_WIDTH)))
    setCurrentFrame(frame)
  }

  const handleAddKeyframe = useCallback(
    (objectId: string, frame: number) => {
      const id = `kf_${crypto.randomUUID()}`
      addKeyframe({
        id,
        objectId,
        frame,
        property: 'position',
        value: [0, 0],
        easing: { type: 'linear' },
      })
    },
    [addKeyframe]
  )

  const handleSelectKeyframe = useCallback((kf: Keyframe) => {
    setSelectedKeyframe(kf)
  }, [])

  const handleSeekStart = () => setCurrentFrame(0)
  const handleSeekEnd = () => setCurrentFrame(duration)

  const orderedLayers = useEditorStore((s) => s.layerOrder)
    .map((id) => objects.find((obj) => obj.id === id))
    .filter((obj): obj is CanvasObject => obj !== undefined)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[#262626] px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#fafafa]">Timeline</span>
          <span className="text-xs text-[#71717a]">{frameRate}fps</span>
        </div>
        <div className="flex items-center gap-2">
          <PlaybackControls
            isPlaying={isPlaying}
            currentFrame={currentFrame}
            duration={duration}
            frameRate={frameRate}
            onPlay={play}
            onPause={pause}
            onStop={stop}
            onSeekStart={handleSeekStart}
            onSeekEnd={handleSeekEnd}
            onFrameChange={setCurrentFrame}
          />
          <TimelineSettings
            duration={duration}
            frameRate={frameRate}
            onDurationChange={setDuration}
            onFrameRateChange={setFrameRate}
          />
        </div>
      </div>

      <div
        ref={timelineRef}
        className="flex-1 overflow-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{ minWidth: `${HEADER_WIDTH + duration * FRAME_WIDTH}px` }}>
          <FrameRuler
            duration={duration}
            frameRate={frameRate}
            currentFrame={currentFrame}
            onFrameClick={setCurrentFrame}
          />

          {orderedLayers.length === 0 ? (
            <div className="flex h-24 flex-col items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a]">
                <Diamond className="h-5 w-5 text-[#3f3f46]" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-[#71717a]">No timeline tracks</span>
                <span className="text-xs text-[#52525b]">Add shapes to animate them</span>
              </div>
            </div>
          ) : (
            orderedLayers.map((layer) => (
              <TimelineTrack
                key={layer.id}
                layer={layer}
                keyframes={getKeyframesForObject(layer.id)}
                currentFrame={currentFrame}
                duration={duration}
                isSelected={selectedIds.includes(layer.id)}
                onAddKeyframe={handleAddKeyframe}
                onSelectKeyframe={handleSelectKeyframe}
              />
            ))
          )}
        </div>
      </div>

      {selectedKeyframe && (
        <div className="flex h-8 items-center gap-2 border-t border-[#262626] px-4 text-xs">
          <span className="text-[#71717a]">Keyframe:</span>
          <span className="text-[#a1a1aa]">
            Frame {selectedKeyframe.frame}, {selectedKeyframe.property}
          </span>
          <span className="text-[#52525b]">
            ({selectedKeyframe.easing.type})
          </span>
        </div>
      )}
    </div>
  )
}
