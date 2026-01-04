# Execution Plan: Phase 2 Animation Tools

Epic: lm-k45
Generated: 2026-01-04

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 15 |
| Epics | 4 sub-epics |
| HIGH Risk | 4 tasks (may need spikes) |
| MEDIUM Risk | 5 tasks |
| LOW Risk | 2 tasks |
| Checkpoints | 5 |

## Tracks

| Track | Beads (in order) | File Scope |
|-------|------------------|------------|
| 1 | lm-k45.1.1 → lm-k45.1.2 → lm-k45.1.3 | `src/hooks/useLottieExport.ts`, `src/lib/animation/**` |
| 2 | lm-k45.2.1 → lm-k45.2.3 | `src/lib/animation/presets.ts`, `src/types/editor.ts` |
| 3 | lm-k45.3.1 → lm-k45.3.2 → lm-k45.3.3 | `src/components/editor/modals/**`, `src/lib/templates/**` |
| 4 | lm-k45.1.4, lm-k45.2.2 | `src/lib/canvas/**` (deferred, HIGH risk) |

## Execution Order

### Wave 1: Foundation (P0)
**Must complete first - unblocks all other work**

| ID | Task | Risk | File Scope |
|----|------|------|------------|
| `lm-k45.1.1` | Keyframe interpolation | MEDIUM | `src/hooks/useLottieExport.ts`, `src/lib/animation/easing.ts` |

**Checkpoint**: `lm-k45.4.1` after completion

### Wave 2: Core Animation (P1)
**Can run in parallel after Wave 1**

| ID | Task | Risk | File Scope |
|----|------|------|------------|
| `lm-k45.1.2` | Easing curve editor | HIGH | `src/components/editor/EasingEditor.tsx` |
| `lm-k45.1.3` | Copy/paste keyframes | MEDIUM | `src/store/slices/timeline.ts`, `src/components/editor/Timeline.tsx` |
| `lm-k45.2.1` | Animation presets | MEDIUM | `src/lib/animation/presets.ts` |
| `lm-k45.2.3` | Color animation | MEDIUM | `src/types/editor.ts`, `src/hooks/useLottieExport.ts` |

**Checkpoints**: `lm-k45.4.2` and `lm-k45.4.3` after completion

### Wave 3: UX Polish (P1-P2)
**Can run in parallel with Wave 2**

| ID | Task | Risk | File Scope |
|----|------|------|------------|
| `lm-k45.3.1` | Onboarding flow | LOW | `src/components/editor/modals/WelcomeModal.tsx` |
| `lm-k45.3.2` | Template picker | HIGH | `src/lib/templates/**`, `src/components/editor/modals/TemplatePicker.tsx` |
| `lm-k45.3.3` | Keyboard shortcut panel | LOW | `src/components/editor/modals/ShortcutPanel.tsx` |

**Checkpoint**: `lm-k45.4.4` after completion

### Wave 4: Deferred (P2)
**HIGH risk, can be deferred to Phase 3**

| ID | Task | Risk | File Scope |
|----|------|------|------------|
| `lm-k45.1.4` | Onion skinning | HIGH | `src/lib/canvas/onion-skin.ts` |
| `lm-k45.2.2` | Path animation | HIGH | `src/types/editor.ts`, `src/hooks/useLottieExport.ts` |

### Final: Regression
| ID | Task |
|----|------|
| `lm-k45.4.5` | Full Phase 2 regression |

## Dependency Graph

```
lm-k45.1.1 (Keyframe interpolation) ─┬→ lm-k45.1.2 (Easing editor) ──→ lm-k45.4.3 (CP3)
                                     ├→ lm-k45.2.1 (Presets) ────────┐
                                     ├→ lm-k45.2.3 (Color anim) ─────┼→ lm-k45.4.2 (CP2)
                                     └→ lm-k45.4.1 (CP1)             │
                                                                     ↓
lm-k45.3.1 (Onboarding) ─→ lm-k45.3.2 (Templates) ─→ lm-k45.4.4 (CP4)
                                                            ↓
                                                    lm-k45.4.5 (CP5)

[Independent - P2]
lm-k45.1.3 (Copy/paste)
lm-k45.1.4 (Onion skinning)
lm-k45.2.2 (Path animation)
lm-k45.3.3 (Shortcut panel)
```

## HIGH Risk Tasks - Spike Candidates

These tasks may benefit from time-boxed spikes before full implementation:

| Task | Spike Question | Time-box |
|------|----------------|----------|
| lm-k45.1.2 | Can we build a visual bezier editor with canvas/SVG that integrates smoothly? | 30 min |
| lm-k45.1.4 | How do we render onion skin overlays efficiently in Fabric.js? | 30 min |
| lm-k45.2.2 | How do we map path animation to Lottie's position keyframes? | 30 min |
| lm-k45.3.2 | What's the best template schema for storing objects + keyframes? | 20 min |

## Recommended Start

1. **Start with `lm-k45.1.1`** (Keyframe interpolation) - P0, unblocks most other work
2. Install `bezier-easing` library: `pnpm add bezier-easing && pnpm add -D @types/bezier-easing`
3. After completion, run `lm-k45.4.1` (CP1 tests)
4. Then proceed with Wave 2 tasks in parallel

## File Scope Summary (No Overlaps)

| Track | Files | Tasks |
|-------|-------|-------|
| Animation Core | `src/hooks/useLottieExport.ts`, `src/lib/animation/**` | lm-k45.1.1, lm-k45.1.2, lm-k45.2.1 |
| Timeline | `src/store/slices/timeline.ts`, `src/components/editor/Timeline.tsx` | lm-k45.1.3 |
| Types | `src/types/editor.ts`, `src/types/lottie.ts` | lm-k45.2.3 (shared with core) |
| Modals | `src/components/editor/modals/**` | lm-k45.3.1, lm-k45.3.2, lm-k45.3.3 |
| Templates | `src/lib/templates/**` | lm-k45.3.2 |
| Canvas | `src/lib/canvas/**` | lm-k45.1.4, lm-k45.2.2 |
