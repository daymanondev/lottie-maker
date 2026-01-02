import type { StateCreator } from 'zustand'
import type { Keyframe } from '@/types'
import type { EditorStore } from '../types'

export interface TimelineSlice {
  currentFrame: number
  duration: number
  frameRate: number
  isPlaying: boolean
  keyframes: Keyframe[]

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
  clearKeyframes: () => void
}

export const createTimelineSlice: StateCreator<EditorStore, [], [], TimelineSlice> = (set, get) => ({
  currentFrame: 0,
  duration: 60,
  frameRate: 30,
  isPlaying: false,
  keyframes: [],

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

  clearKeyframes: () => set({ keyframes: [] }),
})
