# Approach: Phase 2 Animation Tools

## Gap Analysis

| Component | Have | Need | Gap |
|-----------|------|------|-----|
| Keyframe interpolation | Easing types defined | Wire to Lottie export | Map `easing.type` → Lottie `i/o` tangents |
| Easing curve editor | Bezier type defined | Visual bezier UI | New `EasingEditor` component + `bezier-easing` lib |
| Copy/paste keyframes | Keyframe CRUD | Clipboard | Add clipboard state + actions |
| Onion skinning | Nothing | Frame overlay | New render layer + controls |
| Animation presets | Color presets pattern | Animation presets | New `presets.ts` + apply logic |
| Path animation | Path shapes exist | Path keyframes | Extend keyframe type + data model |
| Color animation | Color UI exists | Color keyframes | Extend property union + export |
| Onboarding | Welcome modal state | Modal content | Add content + template picker trigger |
| Template picker | Nothing | Template system | Schema + registry + UI picker |
| Shortcut panel | Shortcuts exist | Reference UI | New dialog component |

## Recommended Approach

### Execution Order (Dependencies)
1. **Foundation**: Keyframe interpolation (unblocks correct animation export)
2. **Core Animation**: Copy/paste keyframes, Animation presets, Color animation
3. **Advanced Animation**: Easing curve editor, Path animation
4. **Novel Features**: Onion skinning (HIGH risk, can be deferred)
5. **UX Polish**: Onboarding flow, Template picker, Keyboard shortcut panel

### Groupings
- **Group A (Animation Core)**: Features 1, 3, 5, 7 - Use existing patterns
- **Group B (Advanced)**: Features 2, 4, 6 - Need spikes or careful implementation
- **Group C (UX)**: Features 8, 9, 10 - UI-focused, modal patterns

## Risk Map

| Feature | Risk | Reason | Verification |
|---------|------|--------|--------------|
| Keyframe interpolation | MEDIUM | Extend existing export | Type-check after changes |
| Easing curve editor | HIGH | New visual component + bezier-easing | Spike: visual bezier interaction |
| Copy/paste keyframes | MEDIUM | Extend timeline slice | Follow existing pattern |
| Onion skinning | HIGH | Novel render layer | Spike: Fabric.js overlay perf |
| Animation presets | MEDIUM | Similar to color presets | Interface sketch |
| Path animation | HIGH | New animation data model | Spike: path-to-Lottie mapping |
| Color animation | MEDIUM | Extend property union | Follow existing pattern |
| Onboarding flow | LOW | Modal pattern exists | Proceed directly |
| Template picker | HIGH | New cross-cutting system | Spike: template schema design |
| Keyboard shortcut panel | LOW | Simple dialog | Proceed directly |

## Alternative Approaches

1. **Easing curve editor**: 
   - Option A: Build custom SVG-based editor (more control)
   - Option B: Use `react-bezier-curve-editor` library (faster)
   - **Decision**: Custom is preferred for tight integration with timeline

2. **Onion skinning**:
   - Option A: Fabric.js layer with opacity
   - Option B: Canvas overlay with separate render
   - **Decision**: Defer to spike

3. **Template picker**:
   - Option A: JSON templates in codebase
   - Option B: Remote template server
   - **Decision**: Local JSON templates for MVP (no backend)

## Dependencies Between Features

```
Keyframe interpolation
    └── Easing curve editor (needs interpolation working first)
    └── Animation presets (uses interpolation)

Color animation
    └── Animation presets (presets can include color animations)

Onboarding flow
    └── Template picker (onboarding launches template picker)

Path animation (independent, can be deferred)
Onion skinning (independent, can be deferred)
Keyboard shortcut panel (independent)
```
