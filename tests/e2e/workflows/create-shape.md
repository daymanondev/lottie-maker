# E2E Test: Create Shape Workflow

## Test Objective
Verify user can create shapes on canvas and see them in the layers panel.

## Prerequisites
- Dev server running at http://localhost:3000
- Empty canvas state

## Test Steps

### 1. Navigate to Editor
```bash
# Navigate to app
browser_navigate url="http://localhost:3000/editor"
browser_wait_for text="Canvas"
```

### 2. Add Rectangle
```bash
# Click add rectangle button
browser_click element="Add Rectangle"

# Wait for shape to appear
browser_wait_for text="Rectangle 1"

# Verify layer panel shows rectangle
browser_snapshot
# Expected: Layer "Rectangle 1" visible in layers panel
```

### 3. Add Ellipse
```bash
# Click add ellipse button
browser_click element="Add Ellipse"

# Verify both shapes in layer panel
browser_snapshot
# Expected: "Rectangle 1" and "Ellipse 1" in layers panel
```

### 4. Add Path/Freeform
```bash
# Click add path button
browser_click element="Add Path"

# Draw on canvas (if interactive)
# For MVP, may just add default path

browser_snapshot
# Expected: Path layer added
```

### 5. Verify Canvas State
```bash
# Check canvas has objects
browser_evaluate script="window.__FABRIC_CANVAS__?.getObjects().length"
# Expected: 3

# Take screenshot for visual verification
browser_take_screenshot
```

### 6. Check for Errors
```bash
browser_console_messages
# Expected: No errors
```

## Expected Results
- [ ] Rectangle appears on canvas
- [ ] Ellipse appears on canvas
- [ ] Path appears on canvas
- [ ] All shapes listed in layers panel
- [ ] Shapes are selectable
- [ ] No console errors

## Edge Cases to Test
- [ ] Rapid clicking doesn't create duplicate shapes
- [ ] Shapes appear at canvas center
- [ ] Shape names are unique (Rectangle 1, Rectangle 2, etc.)
