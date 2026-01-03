# Free Lottie Maker - Project Plan

## 🎯 Project Overview

A free, open-source web application that allows users to:
1. **Import SVG files** and convert them to Lottie animations
2. **Create animations from scratch** using a visual editor
3. **Edit existing Lottie files** (layers, colors, timing, keyframes)
4. **Use AI prompts** to generate/modify animations
5. **Export Lottie JSON files** for free (unlimited)

This eliminates the 3-export limit from services like LottieFiles.

---

## 📚 Research Summary

### What is Lottie?
- **JSON-based animation format** created by Airbnb
- Describes vector shapes + keyframe animations
- Lightweight, scalable, works on web/iOS/Android
- Official spec: https://lottie.github.io/lottie-spec/

### Key Lottie JSON Structure
```json
{
  "v": "5.5.7",           // Version
  "fr": 30,               // Frame rate
  "ip": 0,                // In-point (start frame)
  "op": 60,               // Out-point (end frame)
  "w": 512,               // Canvas width
  "h": 512,               // Canvas height
  "nm": "Animation Name",
  "layers": [...]         // Array of layer objects
}
```

### Existing Tools (Paid/Limited)
| Tool | Limitation |
|------|------------|
| LottieFiles Creator | 3 free exports/month |
| Lottielab | Freemium, limited |
| SVGator | Watermarks on free |
| After Effects + Bodymovin | Paid software |

### Open Source Libraries We Can Use

| Library | Purpose | License |
|---------|---------|---------|
| **@lottiefiles/lottie-js** | Manipulate Lottie JSON programmatically | MIT |
| **lottie-web** | Render/preview Lottie animations | MIT |
| **Fabric.js** or **Konva.js** | Canvas-based editor for shapes | MIT |
| **svg-to-lottie-converter** | Convert SVG to Lottie | AGPL |
| **Haiku Animator** | Open-source desktop editor (reference) | AGPL |
| **Glaxnimate** | Desktop vector animation (reference) | GPL |

---

## 🏗️ Architecture

### Tech Stack

```
Frontend:
├── Next.js 14 (React framework)
├── TypeScript
├── Tailwind CSS + shadcn/ui
├── Zustand (state management)
├── Fabric.js or Konva.js (canvas editor)
├── lottie-web (preview)
└── @lottiefiles/lottie-js (JSON manipulation)

Backend (Optional - for AI features):
├── Next.js API routes or separate service
├── OpenAI API (for prompt-based generation)
└── SVG parsing utilities

No database needed - everything runs client-side
```

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      LOTTIE MAKER                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Import  │    │  Create  │    │   Edit   │              │
│  │   SVG    │    │   New    │    │ Existing │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │                     │
│       └───────────────┼───────────────┘                     │
│                       ▼                                      │
│           ┌───────────────────────┐                         │
│           │    Canvas Editor      │                         │
│           │  ┌─────────────────┐  │                         │
│           │  │   Fabric.js/    │  │                         │
│           │  │   Konva.js      │  │                         │
│           │  └─────────────────┘  │                         │
│           └───────────┬───────────┘                         │
│                       │                                      │
│       ┌───────────────┼───────────────┐                     │
│       ▼               ▼               ▼                     │
│  ┌─────────┐   ┌───────────┐   ┌───────────┐               │
│  │ Layers  │   │ Timeline  │   │Properties │               │
│  │ Panel   │   │  Editor   │   │  Panel    │               │
│  └─────────┘   └───────────┘   └───────────┘               │
│                       │                                      │
│                       ▼                                      │
│           ┌───────────────────────┐                         │
│           │   Lottie Preview      │                         │
│           │   (lottie-web)        │                         │
│           └───────────────────────┘                         │
│                       │                                      │
│                       ▼                                      │
│           ┌───────────────────────┐                         │
│           │   Export JSON         │                         │
│           │   (Unlimited/Free)    │                         │
│           └───────────────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Core Features

### Phase 1: MVP (Core Editor) ✅ COMPLETE

#### Canvas & Shapes
- [x] **Canvas workspace** - Visual editing area with zoom/pan
- [x] **SVG Import** - Upload SVG, parse to editable shapes (basic paths, fills, strokes)
- [x] **Basic shapes** - Rectangle, ellipse, path, text
- [x] **Layers panel** - View/reorder/rename layers
- [x] **Properties panel** - Edit position, scale, rotation, color, opacity

#### Animation Core
- [x] **Timeline** - Basic keyframe editor
- [x] **Preview** - Real-time Lottie preview (lottie-web)
- [x] **Export** - Download as Lottie JSON (unlimited, free)
- [x] **Export validation** - Validate against Lottie schema before download

#### Essential UX (P0)
- [x] **Undo/Redo** - Full history stack with Cmd+Z / Cmd+Shift+Z
- [x] **Keyboard shortcuts** - Delete, arrow keys, Cmd+D (duplicate), Cmd+G (group)
- [x] **Empty states** - Guidance for empty canvas, no layers, no keyframes
- [x] **Error boundaries** - Graceful failure handling for canvas/preview

#### Architecture (P0)
- [x] **Unified Zustand store** - Single store with slices (not 3 separate stores)
- [x] **Custom hooks** - `useCanvas()`, `useSelection()`, `useLottieExport()`
- [x] **Fabric.js sync patterns** - Clear canvas ↔ React state synchronization

#### Testing
- [x] **152 unit tests** - Store slices, Fabric sync, shapes, SVG parser, Lottie validator

### Phase 2: Animation Tools

#### Keyframe Editing
- [ ] **Keyframe interpolation** - Linear, ease-in, ease-out, bezier
- [ ] **Easing curve editor** - Visual bezier curve editing (cubic-bezier)
- [ ] **Copy/paste keyframes**
- [ ] **Onion skinning** - See previous/next frames

#### Animation Features
- [ ] **Animation presets** - Fade, scale, rotate, bounce
- [ ] **Path animation** - Animate along path
- [ ] **Color animation** - Animate fill/stroke colors

#### UX Polish
- [ ] **Onboarding flow** - Welcome modal with "Import SVG" / "Start from template" / "Open Lottie"
- [ ] **Template picker** - Pre-built starting templates
- [ ] **Keyboard shortcut panel** - Discoverable shortcut reference

### Phase 3: Advanced Features
- [ ] **AI Prompt** - Describe animation, AI generates keyframes
- [ ] **Lottie import** - Edit existing .json files
- [ ] **Asset library** - Save reusable components
- [ ] **Expressions** - Simple scripted animations
- [ ] **Export formats** - GIF, MP4, WebM, dotLottie
- [ ] **Collaboration** - Share links (requires backend)

---

## ⚠️ Known Limitations & Scope

### SVG Import - Supported Features
| Feature | Support | Notes |
|---------|---------|-------|
| Basic paths (M, L, C, Z) | ✅ Full | Core path commands |
| Rectangles, ellipses | ✅ Full | Basic shapes |
| Solid fills | ✅ Full | Single colors |
| Solid strokes | ✅ Full | Single colors |
| Linear gradients | ⚠️ Partial | May need simplification |
| Radial gradients | ⚠️ Partial | Limited support |
| Text elements | ⚠️ Partial | Converted to paths |
| Masks/clipping | ❌ None | Not supported in MVP |
| Filters (blur, shadow) | ❌ None | Not supported |
| Embedded images | ❌ None | Vector only |

### Lottie Export - Supported Features
| Feature | Support | Notes |
|---------|---------|-------|
| Shape layers | ✅ Full | Rect, ellipse, path |
| Transform animations | ✅ Full | Position, scale, rotation, opacity |
| Bezier easing | ✅ Full | Custom curves |
| Shape morphing | ⚠️ Partial | Same point count only |
| Masks | ❌ None | Phase 3+ |
| Expressions | ❌ None | Phase 3+ |
| 3D layers | ❌ None | Not planned |

### Edge Cases to Handle
```
Canvas:
- Empty canvas export → Valid empty Lottie
- 500+ objects → Performance warning
- Objects outside canvas → Clip or warn

SVG Import:
- Malformed SVG → Error message with details
- File > 5MB → Size warning
- Unsupported features → Strip with notification

Timeline:
- 0 duration animation → Minimum 1 frame
- 10000+ frames → Performance warning
- Keyframe at same frame → Merge or warn
```

---

## 🎨 UI Design

### Design Documents

| Component | Design Doc | Status |
|-----------|------------|--------|
| Canvas Workspace | [docs/design/canvas-workspace.md](design/canvas-workspace.md) | ✅ Complete |
| Layers Panel | TBD | Pending |
| Properties Panel | TBD | Pending |
| Timeline | TBD | Pending |
| Toolbar | TBD | Pending |

### Editor Theme

**Dark theme** optimized for long editing sessions (like After Effects, Figma, Rive).

| Token | Value | Usage |
|-------|-------|-------|
| `--editor-bg` | `#0a0a0a` | Main background |
| `--editor-surface` | `#141414` | Panels, controls |
| `--editor-border` | `#262626` | Panel borders |
| `--editor-text` | `#fafafa` | Primary text |
| `--editor-text-muted` | `#a1a1aa` | Secondary text |
| `--editor-accent` | `#3b82f6` | Selection, focus |
| `--work-area-bg` | `#ffffff` | Canvas work area |

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar (48px)                                               │
├────────────┬────────────────────────────────────┬───────────┤
│            │                                    │           │
│  Layers    │        Canvas Workspace            │ Properties│
│  Panel     │    ┌──────────────────────┐        │  Panel    │
│  (240px)   │    │   Work Area          │        │  (280px)  │
│            │    │   512 × 512          │        │           │
│            │    └──────────────────────┘        │           │
│            │                                    │           │
├────────────┴────────────────────────────────────┴───────────┤
│ Timeline (200px)                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
lottie-maker/
├── app/                          # Next.js app router
│   ├── page.tsx                  # Landing/welcome page
│   ├── editor/
│   │   └── page.tsx              # Main editor
│   └── api/
│       └── ai/
│           └── route.ts          # AI generation endpoint
├── components/
│   ├── editor/
│   │   ├── EditorLayout.tsx      # Main layout shell with panels
│   │   ├── CanvasWorkspace.tsx   # Canvas container + zoom controls
│   │   ├── Canvas.tsx            # Fabric.js canvas wrapper
│   │   ├── WorkArea.tsx          # Canvas bounds visual overlay
│   │   ├── ZoomControls.tsx      # Zoom +/- and fit button
│   │   ├── EmptyCanvas.tsx       # Empty state guidance
│   │   ├── Toolbar.tsx           # Tools (select, shape, etc.)
│   │   ├── LayersPanel.tsx       # Layers list
│   │   ├── PropertiesPanel.tsx   # Object properties
│   │   ├── Timeline.tsx          # Keyframe timeline
│   │   ├── Preview.tsx           # Lottie preview
│   │   ├── EasingEditor.tsx      # Bezier curve editor (Phase 2)
│   │   └── WelcomeModal.tsx      # Onboarding flow (Phase 2)
│   ├── ui/                       # shadcn components
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── ErrorBoundary.tsx     # Graceful error handling
│   │   └── EmptyState.tsx        # Empty state components
│   └── shortcuts/
│       └── KeyboardShortcuts.tsx # Shortcut reference panel
├── hooks/                        # Custom React hooks
│   ├── useCanvas.ts              # Canvas initialization & sync
│   ├── useSelection.ts           # Selection state management
│   ├── useKeyframes.ts           # Keyframe operations
│   ├── useLottieExport.ts        # Export with validation
│   └── useHistory.ts             # Undo/redo stack
├── lib/
│   ├── lottie/
│   │   ├── converter.ts          # SVG → Lottie conversion
│   │   ├── exporter.ts           # Export to JSON
│   │   ├── validator.ts          # Lottie JSON schema validation
│   │   ├── parser.ts             # Parse Lottie JSON
│   │   └── types.ts              # TypeScript types
│   ├── canvas/
│   │   ├── shapes.ts             # Shape creation utilities
│   │   ├── selection.ts          # Selection handling
│   │   └── sync.ts               # Fabric ↔ React sync utilities
│   └── animation/
│       ├── keyframes.ts          # Keyframe utilities
│       ├── easing.ts             # Easing functions & curves
│       └── presets.ts            # Animation presets
├── store/
│   └── index.ts                  # Unified Zustand store with slices
│       # Slices: canvas, timeline, layers, history, ui
├── tests/                        # Test files
│   ├── lib/
│   │   └── lottie/
│   │       ├── converter.test.ts
│   │       ├── exporter.test.ts
│   │       └── validator.test.ts
│   └── components/
│       └── editor/
│           └── Canvas.test.tsx
├── styles/
│   └── globals.css
├── public/
│   ├── presets/                  # Preset animations
│   └── templates/                # Starter templates
├── docs/
│   ├── PROJECT_PLAN.md           # This file
│   ├── KEYBOARD_SHORTCUTS.md     # Shortcut reference
│   └── LOTTIE_FEATURES.md        # Supported features doc
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Key Implementation Details

### 1. SVG to Lottie Conversion

The core challenge is converting SVG paths to Lottie shape format:

```typescript
// SVG path: "M 10 10 L 50 50 C 100 100 150 50 200 100"
// Lottie shape path:
{
  "ty": "sh",  // Shape type
  "ks": {
    "k": {
      "i": [[0,0], [0,0], [-25,25]],  // In tangents
      "o": [[0,0], [25,-25], [0,0]],  // Out tangents
      "v": [[10,10], [50,50], [200,100]],  // Vertices
      "c": false  // Closed path
    }
  }
}
```

We can use:
- **svg-path-parser** - Parse SVG path data
- **@lottiefiles/lottie-js** - Build Lottie structure
- Custom conversion logic for transforms, colors, gradients

### 2. Keyframe Animation

Lottie keyframes use bezier easing:

```typescript
// Animated property structure
{
  "a": 1,  // Animated = true
  "k": [
    {
      "t": 0,           // Time (frame)
      "s": [100],       // Start value
      "e": [200],       // End value
      "o": { "x": 0.5, "y": 0 },  // Out bezier
      "i": { "x": 0.5, "y": 1 }   // In bezier
    },
    {
      "t": 30,
      "s": [200]
    }
  ]
}
```

### 3. Real-time Preview

```typescript
import lottie from 'lottie-web';

const animation = lottie.loadAnimation({
  container: document.getElementById('preview'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData: lottieJson  // Generated JSON
});
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "fabric": "^5.3.0",
    "lottie-web": "^5.12.2",
    "@lottiefiles/lottie-js": "^0.4.1",
    "zustand": "^4.4.0",
    "immer": "^10.0.0",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.294.0",
    "svg-path-parser": "^1.1.0",
    "ajv": "^8.12.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

### Key Dependencies Explained

| Package | Purpose |
|---------|---------|
| `fabric` | Canvas editor - shape creation, selection, transforms |
| `lottie-web` | Preview animations in real-time |
| `@lottiefiles/lottie-js` | Programmatic Lottie JSON manipulation |
| `zustand` + `immer` | State management with immutable updates |
| `svg-path-parser` | Parse SVG path data for conversion |
| `ajv` | JSON schema validation for Lottie export |
| `vitest` | Unit testing framework |

---

## 🚀 Getting Started

```bash
# Create project
npx create-next-app@latest lottie-maker --typescript --tailwind --eslint --app

# Install dependencies
cd lottie-maker
npm install fabric lottie-web @lottiefiles/lottie-js zustand immer svg-path-parser ajv
npm install -D @types/fabric vitest @testing-library/react @testing-library/jest-dom

# Add shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input slider tabs dialog tooltip

# Run development server
npm run dev
```

---

## 🎯 Milestones

### Week 1-2: Foundation
- Project setup with Next.js + TypeScript
- Basic canvas with Fabric.js
- Shape creation (rect, ellipse, path)
- Layer management
- **Unified Zustand store setup**
- **Custom hooks (`useCanvas`, `useSelection`)**

### Week 3-4: Animation & Core UX
- Timeline component
- Keyframe creation/editing
- Property animation (position, scale, rotation)
- Lottie JSON export **with validation**
- **Undo/redo implementation**
- **Keyboard shortcuts**
- **Empty states & error boundaries**

### Week 5-6: SVG Import & Polish
- SVG parser and converter
- Lottie preview integration
- UI polish and UX improvements
- **Onboarding welcome flow**
- Testing and bug fixes

### Week 7+: Advanced Features
- **Easing curve visual editor**
- AI-powered animation generation
- Animation presets
- Advanced export options
- Community features

---

## 🎉 Party Mode Review Summary

*Reviewed by: Lana (Lottie Expert), Felix (Frontend Dev), Uma (UX Designer), Quinn (QA Tester)*

### Key Additions from Review

| Priority | Addition | Rationale |
|----------|----------|-----------|
| P0 | Undo/Redo | Essential for any editor |
| P0 | Keyboard shortcuts | Creative tools require fast workflows |
| P0 | Export validation | Ensure valid Lottie output |
| P0 | Unified Zustand store | Avoid state sync issues |
| P1 | Custom hooks | Clean separation of concerns |
| P1 | Empty states | Guide new users |
| P1 | Error boundaries | Graceful failure handling |
| P1 | Testing setup | Quality assurance from start |
| P2 | Onboarding flow | Reduce time to first animation |
| P2 | Easing curve editor | Critical for animation quality |

### Architecture Decisions

1. **Single Zustand store with slices** instead of 3 separate stores
2. **Custom hooks pattern** for Fabric.js + React integration
3. **Lottie export validation** against JSON schema before download
4. **Documented feature scope** for SVG import and Lottie export

---

## 🧪 Testing Strategy

### Layered Testing Approach

```
┌─────────────────────────────────────────────────────────────────┐
│  UNIT TESTS: Run after EVERY task completion                   │
│  Tool: Vitest + React Testing Library                          │
│  - Pure functions (conversion, validation, easing)              │
│  - Zustand store slices                                         │
│  - Custom hooks (with mocked Fabric.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  E2E TESTS: Run at MILESTONE checkpoints                       │
│  Tool: Playwright MCP (webapp-e2e skill)                        │
│  - User workflows (create shape, modify properties)             │
│  - Canvas interactions                                          │
│  - Export/import flows                                          │
├─────────────────────────────────────────────────────────────────┤
│  REGRESSION: Run before phase completion                        │
│  - Full workflow test covering all features                     │
│  - Visual regression screenshots                                │
├─────────────────────────────────────────────────────────────────┤
│  PERFORMANCE: Run when issues reported or before release        │
│  Tool: Chrome DevTools MCP                                      │
│  - Animation frame rate                                         │
│  - Memory profiling                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Testing Checkpoints (Phase 1)

| Checkpoint | After Tasks | Test Scope |
|------------|-------------|------------|
| **CP1** | Store + Sync (lm-11s.14, .16) | Unit: Store slices, sync utilities |
| **CP2** | Canvas + Shapes (lm-11s.1, .3) | Unit + E2E: Canvas hooks, create-shape workflow |
| **CP3** | Layers + Properties (lm-11s.4, .5) | Unit + E2E: Layers store, modify-properties workflow |
| **CP4** | Timeline + Export (lm-11s.6, .8, .9) | Unit + E2E: Exporter, validator, timeline + export workflows |
| **CP5** | Undo + Shortcuts (lm-11s.10, .11) | Unit + E2E: History store, keyboard interactions |
| **CP6** | All Phase 1 Complete | Full regression: full-workflow.md |

### Test Files Structure

```
tests/
├── unit/                    # Vitest (skill:unit-testing)
│   ├── lib/lottie/          # converter, exporter, validator
│   ├── lib/animation/       # easing functions
│   ├── store/               # canvas, layers, history slices
│   └── hooks/               # useCanvas, useSelection
└── e2e/                     # Playwright MCP (skill:webapp-e2e)
    ├── workflows/           # Feature workflows
    │   ├── create-shape.md
    │   ├── modify-properties.md
    │   ├── timeline-animation.md
    │   └── export-lottie.md
    └── regression/
        └── full-workflow.md # Complete MVP regression
```

### Running Tests

```bash
# Unit tests
pnpm test                    # Run all unit tests
pnpm test:watch              # Watch mode
pnpm test:coverage           # With coverage

# E2E tests (via MCP)
# Load webapp-e2e skill, then follow workflow .md files
```

---

## 📖 Resources

- **Lottie Spec**: https://lottie.github.io/lottie-spec/
- **Lottie Docs**: https://lottiefiles.github.io/lottie-docs/
- **lottie-js**: https://github.com/LottieFiles/lottie-js
- **Fabric.js**: http://fabricjs.com/docs/
- **Haiku Animator (reference)**: https://github.com/HaikuTeam/animator
- **SVG to Lottie converter**: https://github.com/LottieFiles/svg-to-lottie-converter

---

## 💡 Why This Works

1. **No backend required** - Everything runs in the browser
2. **No export limits** - JSON file is generated client-side
3. **Open source** - All libraries we use are MIT/free
4. **Extensible** - Can add AI features, collaboration later
5. **Cross-platform** - Works on any device with a browser
