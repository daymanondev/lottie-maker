# Canvas Workspace UI Design

**Task**: lm-11s.1 - Canvas workspace with zoom/pan  
**Status**: Design Complete  
**Party Mode Review**: 2026-01-02  
**Reviewers**: Lana (Lottie), Felix (Frontend), Uma (UX)

---

## Overview

The Canvas Workspace is the central editing area where users create and manipulate shapes that become Lottie animations. It must integrate Fabric.js with React, sync with Zustand store, and provide familiar creative tool interactions.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar (tools, shapes)                                      │
├────────────┬────────────────────────────────────┬───────────┤
│            │                                    │           │
│  Layers    │        Canvas Workspace            │ Properties│
│  Panel     │    ┌──────────────────────┐        │  Panel    │
│  (240px)   │    │   Work Area          │        │  (280px)  │
│            │    │   512 × 512          │        │           │
│            │    └──────────────────────┘        │           │
│            │                                    │           │
│            │    [ - ] 100% [ + ] [ ⊡ Fit ]      │           │
├────────────┴────────────────────────────────────┴───────────┤
│ Timeline (200px height)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Theme** | Dark editor (#0a0a0a background) | Matches pro tools (After Effects, Figma), easier on eyes |
| **Work area** | Visible white boundary with dimensions label | Clear 1:1 mapping with Lottie export `w`/`h` |
| **Grid** | Optional toggle, 16px default spacing | Precise alignment, power-of-2 for Lottie |
| **Zoom range** | 10% - 500% | Covers detail work to overview |
| **Zoom controls** | Bottom-left cluster + keyboard + scroll wheel | Multiple input methods |
| **Pan** | Space+drag (temporary) or middle-mouse | Industry standard |
| **Empty state** | Centered guidance with drop zone | Onboarding for new users |

---

## Component Structure

```
src/components/editor/
├── EditorLayout.tsx        # Main layout shell with panels
├── CanvasWorkspace.tsx     # Canvas container + controls
├── Canvas.tsx              # Fabric.js canvas wrapper (uses useCanvas hook)
├── WorkArea.tsx            # Canvas bounds visual overlay
├── ZoomControls.tsx        # Zoom +/- percentage and fit button
├── EmptyCanvas.tsx         # Empty state guidance
├── Toolbar.tsx             # Tools bar (future: lm-11s.3)
├── LayersPanel.tsx         # (future: lm-11s.4)
├── PropertiesPanel.tsx     # (future: lm-11s.5)
└── Timeline.tsx            # (future: lm-11s.6)
```

---

## Party Mode Review

### 🎬 Lana (Lottie Expert)

**Perspective**: Canvas coordinate system must align with Lottie's model.

**Concerns**:
- Coordinate origin: Lottie uses top-left (0,0) - canvas must reflect this
- Zoom is visual-only: exported Lottie uses actual object positions
- Canvas bounds must match Lottie `w`/`h` dimensions exactly

**Recommendations**:
1. Display canvas dimensions prominently (e.g., "512 × 512")
2. Show work area boundaries as clear frame matching export dimensions
3. Grid should use Lottie-friendly units (power of 2: 8, 16, 32px)

---

### ⚛️ Felix (Frontend Dev)

**Perspective**: Clean React/Fabric.js integration with proper state management.

**Concerns**:
- Fabric.js lifecycle: initialize once, dispose on unmount
- Zoom/pan state in Zustand (already in `CanvasSlice`), not local state
- Canvas element shouldn't re-render on state changes - use refs
- `useCanvas` hook already exists, needs wiring to UI

**Recommendations**:
1. Structure: `<EditorLayout>` → `<CanvasWorkspace>` → `<Canvas ref>`
2. Use existing `useCanvas` hook for initialization
3. Zoom controls as separate component with store selectors:
   ```typescript
   const zoom = useEditorStore(s => s.zoom);
   const setZoom = useEditorStore(s => s.setZoom);
   ```
4. Add error boundary around canvas for crash isolation

---

### 🎨 Uma (UX Designer)

**Perspective**: Canvas is where users spend 90% of time - must feel familiar.

**Concerns**:
- Empty state: blank canvas is intimidating
- Visual hierarchy: canvas dominant, panels secondary
- Zoom UX: multiple input methods expected
- Pan affordance: hand cursor, space+drag convention

**Recommendations**:

**Zoom Controls UI**:
- Bottom-left corner: `[ - ] 100% [ + ] [ Fit ]`
- Click percentage to type custom value
- Keyboard: Cmd+Plus / Cmd+Minus / Cmd+0 (fit)
- Scroll wheel: zoom at cursor position

**Empty Canvas State**:
- Centered: "Drop SVG here or add a shape to get started"
- Subtle dotted border around work area
- Show after canvas initializes with no objects

**Cursor States**:
| Mode | Cursor |
|------|--------|
| Select (default) | `default` |
| Panning | `grab` → `grabbing` |
| Over handle | `nwse-resize` etc. |
| Drawing shape | `crosshair` |

---

## Technical Specifications

### Zoom Behavior

```typescript
// Zoom levels (discrete steps for scroll wheel)
const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5];

// Zoom constraints (already in store)
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

// Zoom to fit canvas bounds
function zoomToFit(canvas: FabricCanvas, containerSize: Size) {
  const workArea = { width: 512, height: 512 }; // from store
  const scale = Math.min(
    containerSize.width / workArea.width,
    containerSize.height / workArea.height
  ) * 0.9; // 90% to add padding
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
}
```

### Work Area Configuration

```typescript
interface WorkAreaConfig {
  width: number;       // Default: 512
  height: number;      // Default: 512
  backgroundColor: string;  // Default: '#ffffff'
  showGrid: boolean;   // Default: false
  gridSize: number;    // Default: 16
}
```

### Keyboard Shortcuts (Zoom/Pan)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + +` | Zoom in |
| `Cmd/Ctrl + -` | Zoom out |
| `Cmd/Ctrl + 0` | Zoom to fit |
| `Cmd/Ctrl + 1` | Zoom to 100% |
| `Space + Drag` | Pan canvas |
| `Scroll wheel` | Zoom at cursor |

---

## Styling (Tailwind)

### Color Tokens

```css
/* Dark theme palette */
--editor-bg: #0a0a0a;
--editor-surface: #141414;
--editor-border: #262626;
--editor-text: #fafafa;
--editor-text-muted: #a1a1aa;
--editor-accent: #3b82f6;  /* Blue for selection */
--work-area-bg: #ffffff;
--work-area-border: #404040;
```

### Component Classes

```tsx
// Canvas workspace container
className="relative flex-1 overflow-hidden bg-[#0a0a0a]"

// Work area frame
className="absolute border border-[#404040] bg-white shadow-2xl"

// Zoom controls
className="absolute bottom-4 left-4 flex items-center gap-1 rounded-lg bg-[#141414] p-1 border border-[#262626]"

// Panel (layers/properties)
className="flex flex-col border-r border-[#262626] bg-[#141414]"
```

---

## Implementation Order

1. **EditorLayout.tsx** - Main shell with panel slots
2. **CanvasWorkspace.tsx** - Container with overflow handling
3. **Canvas.tsx** - Fabric.js integration (wire useCanvas)
4. **WorkArea.tsx** - Visual bounds overlay
5. **ZoomControls.tsx** - Zoom UI component
6. **EmptyCanvas.tsx** - Empty state overlay

---

## Dependencies to Add

```bash
# Already installed: fabric, zustand
# May need for icons:
pnpm add lucide-react  # if not already
```

---

## Acceptance Criteria

- [ ] Dark theme editor layout renders
- [ ] Fabric.js canvas initializes without errors
- [ ] Work area (512×512) visible with white background
- [ ] Zoom controls functional (+, -, fit, percentage display)
- [ ] Keyboard shortcuts work (Cmd+Plus/Minus/0)
- [ ] Space+drag pans canvas
- [ ] Scroll wheel zooms at cursor
- [ ] Empty state shows when no objects
- [ ] No TypeScript errors
- [ ] Error boundary catches canvas failures
