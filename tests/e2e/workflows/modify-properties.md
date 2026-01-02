# E2E Test: Modify Properties Workflow

## Test Objective
Verify user can select objects and modify their properties via the properties panel.

## Prerequisites
- Dev server running at http://localhost:3000
- At least one shape on canvas

## Test Steps

### 1. Setup - Create Shape
```bash
browser_navigate url="http://localhost:3000/editor"
browser_wait_for text="Canvas"
browser_click element="Add Rectangle"
browser_wait_for text="Rectangle 1"
```

### 2. Select Shape
```bash
# Click on layer to select
browser_click element="Rectangle 1"

# Verify properties panel shows rectangle properties
browser_snapshot
# Expected: Properties panel shows position, size, color, opacity
```

### 3. Modify Position
```bash
# Change X position
browser_click element="X Position"
browser_fill element="X Position" value="100"

# Change Y position
browser_click element="Y Position"  
browser_fill element="Y Position" value="150"

# Apply changes
browser_press_key key="Enter"

# Verify position changed
browser_snapshot
# Expected: Position shows X: 100, Y: 150
```

### 4. Modify Size
```bash
# Change width
browser_fill element="Width" value="200"
browser_fill element="Height" value="120"
browser_press_key key="Enter"

# Verify size changed
browser_snapshot
# Expected: Size shows 200 x 120
```

### 5. Modify Fill Color
```bash
# Click color picker
browser_click element="Fill Color"

# Enter hex color
browser_fill element="Color input" value="#e74c3c"
browser_press_key key="Enter"

# Take screenshot to verify color
browser_take_screenshot
# Expected: Rectangle is red (#e74c3c)
```

### 6. Modify Opacity
```bash
# Change opacity
browser_fill element="Opacity" value="50"
browser_press_key key="Enter"

# Verify opacity
browser_snapshot
# Expected: Opacity shows 50%
```

### 7. Modify Rotation
```bash
# Change rotation
browser_fill element="Rotation" value="45"
browser_press_key key="Enter"

# Take screenshot
browser_take_screenshot
# Expected: Rectangle rotated 45 degrees
```

### 8. Verify Canvas State
```bash
# Check object properties in canvas
browser_evaluate script="
  const obj = window.__FABRIC_CANVAS__?.getActiveObject();
  if (!obj) return 'No active object';
  return {
    left: obj.left,
    top: obj.top,
    width: obj.width * obj.scaleX,
    height: obj.height * obj.scaleY,
    angle: obj.angle,
    opacity: obj.opacity
  };
"
# Expected: Matches properties panel values
```

### 9. Check for Errors
```bash
browser_console_messages
# Expected: No errors
```

## Expected Results
- [ ] Selecting shape shows its properties
- [ ] Position changes update canvas
- [ ] Size changes update canvas
- [ ] Color changes update canvas
- [ ] Opacity changes update canvas
- [ ] Rotation changes update canvas
- [ ] Properties panel stays in sync with canvas
- [ ] No console errors

## Edge Cases to Test
- [ ] Negative position values
- [ ] Zero width/height (should prevent or warn)
- [ ] Opacity at 0% and 100%
- [ ] Rotation beyond 360 degrees
- [ ] Invalid color values
