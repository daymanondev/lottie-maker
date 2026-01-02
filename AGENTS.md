# Lottie Maker - Agent Instructions

## Commands
- **Build**: `pnpm build` | **Lint**: `pnpm lint` | **Type-check**: `pnpm type-check`
- **Test all**: `pnpm test` | **Single test**: `pnpm test -- tests/unit/store/canvas.test.ts`
- **Quality gate**: `pnpm type-check && pnpm lint && pnpm build`

## Architecture
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Fabric.js, Zustand, Vitest
- **Structure**: `src/app/` (pages), `src/components/editor/` (UI), `src/lib/canvas/` (Fabric sync), `src/lib/lottie/` (export/validation), `src/store/` (Zustand slices), `src/hooks/` (custom hooks), `src/types/`
- **State**: Single Zustand store with 5 slices: canvas, layers, timeline, history, ui
- **Canvas**: Fabric.js objects synced via registry in `lib/canvas/fabric-sync.ts`

## Code Style
- Use `pnpm` (not npm/yarn) | Prefer named exports | No code comments unless complex
- Types in `src/types/` | shadcn/ui components in `src/components/ui/`
- Conventional commits: `feat(canvas):`, `fix(timeline):`, `test(store):`
- Hooks use `use` prefix | Store actions are verb-first (`addObject`, `setZoom`)

## Task Tracking
- Issues in `.beads/issues.jsonl` | Skills in `.agents/skills/`
- Close tasks after quality gate passes
