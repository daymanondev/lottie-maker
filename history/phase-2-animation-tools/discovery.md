# Discovery Report: Phase 2 Animation Tools

## Architecture Snapshot

### Relevant Modules
| Module | Path | Purpose |
|--------|------|---------|
| Timeline UI | `src/components/editor/Timeline.tsx` | Keyframe display, playback controls, track editing |
| Timeline Store | `src/store/slices/timeline.ts` | Keyframe CRUD, playback state |
| Lottie Export | `src/hooks/useLottieExport.ts` | `buildKeyframeArray()` converts keyframes to Lottie format |
| Types | `src/types/editor.ts`, `src/types/lottie.ts` | Keyframe and Lottie type definitions |
| UI Slice | `src/store/slices/ui.ts` | Modal states (welcome modal pattern) |

### Entry Points
- Timeline component: `src/components/editor/Timeline.tsx`
- Keyframe types: `src/types/editor.ts#L10-L20`
- Lottie keyframe export: `src/hooks/useLottieExport.ts` → `buildKeyframeArray()`

### Patterns Used
- Zustand slices with immer for state
- shadcn/ui Dialog/Popover for modals
- Fabric.js objects synced via registry
- Lottie-web for preview rendering

## Existing Patterns

### Easing/Interpolation
```typescript
// src/types/editor.ts#L16-L19
easing: {
  type: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier'
  bezier?: { x1: number; y1: number; x2: number; y2: number }
}
```
- Bezier curve support already typed
- Default: `easing: { type: 'linear' }` (Timeline.tsx#L426)

### Property Animation
```typescript
// src/types/editor.ts
property: 'position' | 'scale' | 'rotation' | 'opacity'
value: number | number[]

// src/types/lottie.ts#L36-L42
interface LottieKeyframe {
  t: number       // time
  s: number[]     // start value
  i?: { x; y }    // in-tangent (bezier)
  o?: { x; y }    // out-tangent (bezier)
}
```

### Modal/Dialog
- shadcn Dialog: `src/components/ui/dialog.tsx`
- Welcome modal state: `ui.isWelcomeModalOpen`, `ui.setWelcomeModalOpen`
- Popover pattern: Timeline.tsx#L298-L343, PropertiesPanel.tsx#L107-L152

### Preset Pattern
- Color presets: `PRESET_COLORS` array in PropertiesPanel.tsx
- Defaults: `DEFAULT_*` naming convention

### Naming Conventions
| Pattern | Convention |
|---------|------------|
| Types | PascalCase: `Keyframe`, `LottieTransform` |
| Store actions | verb-first: `addKeyframe`, `setWelcomeModalOpen` |
| Presets | SCREAMING_SNAKE: `PRESET_COLORS` |
| UI state | `is*Open`, `is*Visible` |

## Technical Constraints

### Current Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `@lottiefiles/lottie-js` | ^0.4.2 | Lottie JSON manipulation |
| `lottie-web` | ^5.13.0 | Animation preview |
| `fabric` | ^7.1.0 | Canvas transforms |
| `immer` | ^11.1.3 | Immutable state updates |

### Missing Dependencies
| Feature | Library | Notes |
|---------|---------|-------|
| Bezier easing | `bezier-easing` | **Not installed** - needed for custom curves |

### TypeScript
- Strict mode enabled
- Path alias: `@/*` → `./src/*`

## Current Gaps for Phase 2

| Feature | Current State | Gap |
|---------|---------------|-----|
| Keyframe interpolation | `buildKeyframeArray()` ignores `easing` | Wire easing → Lottie bezier handles |
| Easing curve editor | No UI | New `EasingEditor` component |
| Copy/paste keyframes | No clipboard | Add clipboard to timeline store |
| Onion skinning | No `lib/animation/` | Create onion skinning renderer |
| Animation presets | No preset system | Add `lib/animation/presets.ts` |
| Path animation | `property` enum missing `'path'` | Extend keyframe types |
| Color animation | `property` enum missing `'fill'/'stroke'` | Extend types, add to export |
| Onboarding flow | Welcome modal exists but no content | Add modal content + templates |
| Template picker | No templates | Create template system |
| Keyboard shortcut panel | No UI | Add shortcut reference dialog |
