import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store'
import type { Keyframe } from '@/types'

const createMockKeyframe = (overrides: Partial<Keyframe> = {}): Keyframe => ({
  id: `kf_${Math.random().toString(36).slice(2)}`,
  objectId: 'obj-1',
  frame: 0,
  property: 'position',
  value: [100, 100],
  easing: { type: 'linear' },
  ...overrides,
})

describe('Timeline Slice', () => {
  beforeEach(() => {
    useEditorStore.setState({
      currentFrame: 0,
      duration: 60,
      frameRate: 30,
      isPlaying: false,
      keyframes: [],
    })
  })

  describe('frame control', () => {
    it('setCurrentFrame updates current frame', () => {
      useEditorStore.getState().setCurrentFrame(30)
      expect(useEditorStore.getState().currentFrame).toBe(30)
    })

    it('clamps frame to 0 minimum', () => {
      useEditorStore.getState().setCurrentFrame(-10)
      expect(useEditorStore.getState().currentFrame).toBe(0)
    })

    it('clamps frame to duration maximum', () => {
      useEditorStore.setState({ duration: 60 })
      useEditorStore.getState().setCurrentFrame(100)
      expect(useEditorStore.getState().currentFrame).toBe(60)
    })
  })

  describe('duration', () => {
    it('setDuration updates duration', () => {
      useEditorStore.getState().setDuration(120)
      expect(useEditorStore.getState().duration).toBe(120)
    })

    it('enforces minimum duration of 1', () => {
      useEditorStore.getState().setDuration(0)
      expect(useEditorStore.getState().duration).toBe(1)
    })

    it('clamps currentFrame when duration decreases', () => {
      useEditorStore.setState({ currentFrame: 50, duration: 60 })
      useEditorStore.getState().setDuration(30)
      expect(useEditorStore.getState().currentFrame).toBe(30)
    })
  })

  describe('frameRate', () => {
    it('setFrameRate updates frame rate', () => {
      useEditorStore.getState().setFrameRate(60)
      expect(useEditorStore.getState().frameRate).toBe(60)
    })

    it('clamps to minimum 1', () => {
      useEditorStore.getState().setFrameRate(0)
      expect(useEditorStore.getState().frameRate).toBe(1)
    })

    it('clamps to maximum 120', () => {
      useEditorStore.getState().setFrameRate(200)
      expect(useEditorStore.getState().frameRate).toBe(120)
    })
  })

  describe('playback', () => {
    it('play sets isPlaying to true', () => {
      useEditorStore.getState().play()
      expect(useEditorStore.getState().isPlaying).toBe(true)
    })

    it('pause sets isPlaying to false', () => {
      useEditorStore.setState({ isPlaying: true })
      useEditorStore.getState().pause()
      expect(useEditorStore.getState().isPlaying).toBe(false)
    })

    it('togglePlayback toggles isPlaying', () => {
      useEditorStore.getState().togglePlayback()
      expect(useEditorStore.getState().isPlaying).toBe(true)
      useEditorStore.getState().togglePlayback()
      expect(useEditorStore.getState().isPlaying).toBe(false)
    })

    it('stop sets isPlaying to false and resets frame to 0', () => {
      useEditorStore.setState({ isPlaying: true, currentFrame: 30 })
      useEditorStore.getState().stop()
      expect(useEditorStore.getState().isPlaying).toBe(false)
      expect(useEditorStore.getState().currentFrame).toBe(0)
    })
  })

  describe('keyframes', () => {
    it('addKeyframe adds a new keyframe', () => {
      const kf = createMockKeyframe({ id: 'kf-1' })
      useEditorStore.getState().addKeyframe(kf)

      expect(useEditorStore.getState().keyframes).toHaveLength(1)
      expect(useEditorStore.getState().keyframes[0].id).toBe('kf-1')
    })

    it('addKeyframe updates existing keyframe at same position/property', () => {
      const kf1 = createMockKeyframe({ id: 'kf-1', objectId: 'obj-1', frame: 0, property: 'position', value: [0, 0] })
      const kf2 = createMockKeyframe({ id: 'kf-2', objectId: 'obj-1', frame: 0, property: 'position', value: [100, 100] })

      useEditorStore.getState().addKeyframe(kf1)
      useEditorStore.getState().addKeyframe(kf2)

      const { keyframes } = useEditorStore.getState()
      expect(keyframes).toHaveLength(1)
      expect(keyframes[0].value).toEqual([100, 100])
    })

    it('removeKeyframe removes keyframe by id', () => {
      const kf = createMockKeyframe({ id: 'kf-1' })
      useEditorStore.setState({ keyframes: [kf] })

      useEditorStore.getState().removeKeyframe('kf-1')

      expect(useEditorStore.getState().keyframes).toHaveLength(0)
    })

    it('updateKeyframe updates keyframe properties', () => {
      const kf = createMockKeyframe({ id: 'kf-1', frame: 0 })
      useEditorStore.setState({ keyframes: [kf] })

      useEditorStore.getState().updateKeyframe('kf-1', { frame: 15, easing: { type: 'ease-in' } })

      const updated = useEditorStore.getState().keyframes[0]
      expect(updated.frame).toBe(15)
      expect(updated.easing).toEqual({ type: 'ease-in' })
    })

    it('getKeyframesForObject returns keyframes for specific object', () => {
      useEditorStore.setState({
        keyframes: [
          createMockKeyframe({ id: 'kf-1', objectId: 'obj-1' }),
          createMockKeyframe({ id: 'kf-2', objectId: 'obj-2' }),
          createMockKeyframe({ id: 'kf-3', objectId: 'obj-1' }),
        ],
      })

      const result = useEditorStore.getState().getKeyframesForObject('obj-1')
      expect(result).toHaveLength(2)
      expect(result.every((kf) => kf.objectId === 'obj-1')).toBe(true)
    })

    it('getKeyframesAtFrame returns keyframes at specific frame', () => {
      useEditorStore.setState({
        keyframes: [
          createMockKeyframe({ id: 'kf-1', frame: 0 }),
          createMockKeyframe({ id: 'kf-2', frame: 15 }),
          createMockKeyframe({ id: 'kf-3', frame: 0, objectId: 'obj-2' }),
        ],
      })

      const result = useEditorStore.getState().getKeyframesAtFrame(0)
      expect(result).toHaveLength(2)
      expect(result.every((kf) => kf.frame === 0)).toBe(true)
    })

    it('setKeyframes replaces all keyframes', () => {
      useEditorStore.setState({ keyframes: [createMockKeyframe({ id: 'old' })] })

      const newKeyframes = [
        createMockKeyframe({ id: 'new-1' }),
        createMockKeyframe({ id: 'new-2' }),
      ]
      useEditorStore.getState().setKeyframes(newKeyframes)

      expect(useEditorStore.getState().keyframes).toHaveLength(2)
      expect(useEditorStore.getState().keyframes[0].id).toBe('new-1')
    })

    it('clearKeyframes removes all keyframes', () => {
      useEditorStore.setState({
        keyframes: [createMockKeyframe(), createMockKeyframe()],
      })

      useEditorStore.getState().clearKeyframes()

      expect(useEditorStore.getState().keyframes).toHaveLength(0)
    })
  })
})
