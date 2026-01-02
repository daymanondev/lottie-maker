# E2E Regression Test: Full MVP Workflow

## Test Objective
Complete end-to-end test covering all Phase 1 MVP features.
Run this test before completing Phase 1 to ensure all features work together.

## Prerequisites
- Dev server running at http://localhost:3000
- Clean browser state

---

## Part 1: Canvas & Shapes

### 1.1 Initialize Editor
```bash
browser_navigate url="http://localhost:3000/editor"
browser_wait_for text="Canvas"
browser_snapshot
# Verify: Empty canvas, toolbar, layers panel, properties panel, timeline visible
```

### 1.2 Create All Shape Types
```bash
# Add Rectangle
browser_click element="Add Rectangle"
browser_wait_for text="Rectangle 1"

# Add Ellipse
browser_click element="Add Ellipse"
browser_wait_for text="Ellipse 1"

# Add Path (if implemented)
browser_click element="Add Path"
browser_wait_for text="Path 1"

browser_snapshot
# Verify: 3 layers in panel, 3 shapes on canvas
```

### 1.3 Selection
```bash
# Click to select rectangle
browser_click element="Rectangle 1"
browser_snapshot
# Verify: Rectangle selected, properties show rectangle values

# Multi-select with shift
browser_press_key key="Shift"
browser_click element="Ellipse 1"
browser_snapshot
# Verify: Both selected
```

---

## Part 2: Layers Panel

### 2.1 Rename Layer
```bash
browser_click element="Rectangle 1" dblClick=true
browser_fill element="Layer name input" value="Hero Rectangle"
browser_press_key key="Enter"
browser_snapshot
# Verify: Layer renamed to "Hero Rectangle"
```

### 2.2 Reorder Layers
```bash
# Drag Hero Rectangle to top
browser_drag startElement="Hero Rectangle" endElement="Ellipse 1"
browser_snapshot
# Verify: Layer order changed
```

### 2.3 Toggle Visibility
```bash
browser_click element="Toggle visibility Hero Rectangle"
browser_snapshot
# Verify: Hero Rectangle hidden indicator
browser_take_screenshot
# Verify: Rectangle not visible on canvas
```

### 2.4 Restore Visibility
```bash
browser_click element="Toggle visibility Hero Rectangle"
browser_snapshot
# Verify: Rectangle visible again
```

---

## Part 3: Properties Panel

### 3.1 Modify Transform
```bash
browser_click element="Hero Rectangle"
browser_fill element="X Position" value="200"
browser_fill element="Y Position" value="150"
browser_fill element="Width" value="180"
browser_fill element="Height" value="100"
browser_fill element="Rotation" value="15"
browser_press_key key="Enter"
browser_take_screenshot
# Verify: Rectangle transformed
```

### 3.2 Modify Style
```bash
browser_click element="Fill Color"
browser_fill element="Color input" value="#3498db"
browser_press_key key="Enter"
browser_fill element="Opacity" value="80"
browser_press_key key="Enter"
browser_take_screenshot
# Verify: Rectangle is blue with 80% opacity
```

---

## Part 4: Timeline & Animation

### 4.1 Add Keyframes
```bash
# At frame 0
browser_click element="Hero Rectangle"
browser_click element="Add Keyframe"
browser_snapshot
# Verify: Keyframe at frame 0

# Move to frame 30
browser_click element="Frame 30"
browser_fill element="X Position" value="350"
browser_fill element="Opacity" value="30"
browser_click element="Add Keyframe"
browser_snapshot
# Verify: Keyframe at frame 30
```

### 4.2 Play Animation
```bash
browser_click element="Play"
browser_wait_for text="Pause"
# Wait for animation cycle
browser_take_screenshot
browser_click element="Pause"
```

### 4.3 Scrub Timeline
```bash
browser_click element="Frame 15"
browser_snapshot
# Verify: Interpolated values shown
# X Position should be ~275, Opacity ~55
```

---

## Part 5: Undo/Redo

### 5.1 Undo Action
```bash
# Delete a shape
browser_click element="Ellipse 1"
browser_press_key key="Delete"
browser_snapshot
# Verify: Ellipse deleted

# Undo
browser_press_key key="Control+z"
browser_snapshot
# Verify: Ellipse restored
```

### 5.2 Redo Action
```bash
browser_press_key key="Control+Shift+z"
browser_snapshot
# Verify: Ellipse deleted again

# Undo to restore
browser_press_key key="Control+z"
```

---

## Part 6: Keyboard Shortcuts

### 6.1 Delete Shortcut
```bash
browser_click element="Path 1"
browser_press_key key="Delete"
browser_snapshot
# Verify: Path deleted
```

### 6.2 Duplicate Shortcut
```bash
browser_click element="Ellipse 1"
browser_press_key key="Control+d"
browser_snapshot
# Verify: "Ellipse 2" created
```

### 6.3 Deselect Shortcut
```bash
browser_press_key key="Escape"
browser_snapshot
# Verify: Nothing selected
```

### 6.4 Arrow Key Movement
```bash
browser_click element="Ellipse 1"
browser_press_key key="ArrowRight"
browser_press_key key="ArrowRight"
browser_press_key key="ArrowDown"
browser_snapshot
# Verify: Position moved by 2px right, 1px down
```

---

## Part 7: Export

### 7.1 Open Export
```bash
browser_click element="Export"
browser_wait_for text="Export Options"
browser_snapshot
```

### 7.2 Configure & Export
```bash
browser_fill element="Animation Name" value="Regression Test Animation"
browser_click element="Download JSON"
browser_wait_for text="Downloaded"
```

### 7.3 Validate Export
```bash
browser_console_messages
# Verify: No errors during export
```

---

## Part 8: Error Handling

### 8.1 Check Console Throughout
```bash
browser_console_messages
# Verify: No JavaScript errors
# Verify: No React warnings (or only expected ones)
```

### 8.2 Final Screenshot
```bash
browser_take_screenshot
# Save as final state reference
```

---

## Summary Checklist

### Canvas & Shapes
- [ ] Canvas renders without errors
- [ ] Rectangle creation works
- [ ] Ellipse creation works
- [ ] Path creation works
- [ ] Selection works
- [ ] Multi-selection works

### Layers Panel
- [ ] Layers display correctly
- [ ] Rename works
- [ ] Reorder works
- [ ] Visibility toggle works

### Properties Panel
- [ ] Position modification works
- [ ] Size modification works
- [ ] Rotation modification works
- [ ] Color modification works
- [ ] Opacity modification works

### Timeline
- [ ] Timeline displays
- [ ] Keyframe creation works
- [ ] Playback works
- [ ] Scrubbing works

### Undo/Redo
- [ ] Undo restores state
- [ ] Redo re-applies

### Keyboard Shortcuts
- [ ] Delete works
- [ ] Duplicate works
- [ ] Escape deselects
- [ ] Arrow keys move

### Export
- [ ] Export dialog opens
- [ ] JSON downloads
- [ ] No export errors

### Overall
- [ ] No console errors
- [ ] No crashes
- [ ] Performance acceptable
