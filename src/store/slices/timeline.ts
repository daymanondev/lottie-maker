import type { StateCreator } from 'zustand'
import type { Keyframe } from '@/types'
import type { EditorStore } from '../types'

export interface KeyframeClipboard {
  keyframes: Omit<Keyframe, 'id'>[]
  sourceFrame: number
}

export interface TimelineSlice {
  currentFrame: number
  duration: number
  frameRate: number
  isPlaying: boolean
  keyframes: Keyframe[]
  selectedKeyframeIds: string[]
  clipboard: KeyframeClipboard | null

  setCurrentFrame: (frame: number) => void
  setDuration: (duration: number) => void
  setFrameRate: (rate: number) => void
  play: () => void
  pause: () => void
  togglePlayback: () => void
  stop: () => void

  addKeyframe: (keyframe: Keyframe) => void
  removeKeyframe: (id: string) => void
  updateKeyframe: (id: string, updates: Partial<Keyframe>) => void
  getKeyframesForObject: (objectId: string) => Keyframe[]
  getKeyframesAtFrame: (frame: number) => Keyframe[]
  setKeyframes: (keyframes: Keyframe[]) => void
  clearKeyframes: () => void

  selectKeyframe: (id: string, addToSelection?: boolean) => void
  deselectKeyframe: (id: string) => void
  selectAllKeyframesAtFrame: (frame: number) => void
  clearKeyframeSelection: () => void
  copySelectedKeyframes: () => void
  pasteKeyframes: (targetObjectId?: string) => void
  deleteSelectedKeyframes: () => void
}

function generateId(): string {
  return `kf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const createTimelineSlice: StateCreator<EditorStore, [], [], TimelineSlice> = (set, get) => ({
  currentFrame: 0,
  duration: 60,
  frameRate: 30,
  isPlaying: false,
  keyframes: [],
  selectedKeyframeIds: [],
  clipboard: null,

  setCurrentFrame: (frame) =>
    set({ currentFrame: Math.max(0, Math.min(frame, get().duration)) }),

  setDuration: (duration) =>
    set({
      duration: Math.max(1, duration),
      currentFrame: Math.min(get().currentFrame, duration),
    }),

  setFrameRate: (rate) => set({ frameRate: Math.max(1, Math.min(120, rate)) }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

  stop: () => set({ isPlaying: false, currentFrame: 0 }),

  addKeyframe: (keyframe) =>
    set((state) => {
      const existing = state.keyframes.find(
        (kf) =>
          kf.objectId === keyframe.objectId &&
          kf.frame === keyframe.frame &&
          kf.property === keyframe.property
      )
      if (existing) {
        return {
          keyframes: state.keyframes.map((kf) =>
            kf.id === existing.id ? { ...kf, ...keyframe } : kf
          ),
        }
      }
      return { keyframes: [...state.keyframes, keyframe] }
    }),

  removeKeyframe: (id) =>
    set((state) => ({
      keyframes: state.keyframes.filter((kf) => kf.id !== id),
      selectedKeyframeIds: state.selectedKeyframeIds.filter((kfId) => kfId !== id),
    })),

  updateKeyframe: (id, updates) =>
    set((state) => ({
      keyframes: state.keyframes.map((kf) =>
        kf.id === id ? { ...kf, ...updates } : kf
      ),
    })),

  getKeyframesForObject: (objectId) => {
    return get().keyframes.filter((kf) => kf.objectId === objectId)
  },

  getKeyframesAtFrame: (frame) => {
    return get().keyframes.filter((kf) => kf.frame === frame)
  },

  setKeyframes: (keyframes) => set({ keyframes }),

  clearKeyframes: () => set({ keyframes: [], selectedKeyframeIds: [] }),

  selectKeyframe: (id, addToSelection = false) =>
    set((state) => {
      if (addToSelection) {
        if (state.selectedKeyframeIds.includes(id)) {
          return state
        }
        return { selectedKeyframeIds: [...state.selectedKeyframeIds, id] }
      }
      return { selectedKeyframeIds: [id] }
    }),

  deselectKeyframe: (id) =>
    set((state) => ({
      selectedKeyframeIds: state.selectedKeyframeIds.filter((kfId) => kfId !== id),
    })),

  selectAllKeyframesAtFrame: (frame) =>
    set((state) => {
      const idsAtFrame = state.keyframes
        .filter((kf) => kf.frame === frame)
        .map((kf) => kf.id)
      return { selectedKeyframeIds: idsAtFrame }
    }),

  clearKeyframeSelection: () => set({ selectedKeyframeIds: [] }),

  copySelectedKeyframes: () =>
    set((state) => {
      const selected = state.keyframes.filter((kf) =>
        state.selectedKeyframeIds.includes(kf.id)
      )
      if (selected.length === 0) {
        return state
      }

      const minFrame = Math.min(...selected.map((kf) => kf.frame))
      const keyframesToCopy: Omit<Keyframe, 'id'>[] = selected.map(
        ({ id: _, ...rest }) => rest
      )

      return {
        clipboard: {
          keyframes: keyframesToCopy,
          sourceFrame: minFrame,
        },
      }
    }),

  pasteKeyframes: (targetObjectId) =>
    set((state) => {
      const { clipboard, currentFrame, keyframes } = state
      if (!clipboard || clipboard.keyframes.length === 0) {
        return state
      }

      const frameOffset = currentFrame - clipboard.sourceFrame
      const newKeyframes: Keyframe[] = clipboard.keyframes.map((kf) => ({
        ...kf,
        id: generateId(),
        frame: kf.frame + frameOffset,
        objectId: targetObjectId ?? kf.objectId,
      }))

      const newKeyframeIds = newKeyframes.map((kf) => kf.id)

      return {
        keyframes: [...keyframes, ...newKeyframes],
        selectedKeyframeIds: newKeyframeIds,
      }
    }),

  deleteSelectedKeyframes: () =>
    set((state) => ({
      keyframes: state.keyframes.filter(
        (kf) => !state.selectedKeyframeIds.includes(kf.id)
      ),
      selectedKeyframeIds: [],
    })),
})
