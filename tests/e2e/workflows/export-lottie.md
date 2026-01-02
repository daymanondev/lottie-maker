# E2E Test: Export Lottie Workflow

## Test Objective
Verify user can export canvas content as valid Lottie JSON.

## Prerequisites
- Dev server running at http://localhost:3000

## Test Steps

### 1. Setup - Create Animated Shape
```bash
browser_navigate url="http://localhost:3000/editor"
browser_wait_for text="Canvas"

# Create rectangle
browser_click element="Add Rectangle"
browser_wait_for text="Rectangle 1"

# Add keyframe animation (optional for this test)
browser_click element="Rectangle 1"
browser_fill element="X Position" value="100"
browser_click element="Add Keyframe"
```

### 2. Open Export Dialog
```bash
browser_click element="Export"
browser_wait_for text="Export Options"

# Verify export dialog
browser_snapshot
# Expected: Dialog with export options visible
# Expected: Preview of animation
```

### 3. Configure Export Settings
```bash
# Set animation name
browser_fill element="Animation Name" value="My Animation"

# Set frame rate
browser_fill element="Frame Rate" value="30"

# Set duration
browser_fill element="Duration (frames)" value="60"

browser_snapshot
# Expected: Settings reflect input values
```

### 4. Validate Before Export
```bash
# Click validate button (if available)
browser_click element="Validate"
browser_wait_for text="Valid"

browser_snapshot
# Expected: "Valid Lottie JSON" indicator
```

### 5. Download JSON
```bash
# Click download
browser_click element="Download JSON"

# Wait for download to complete
browser_wait_for text="Downloaded"
# OR check network for download request
browser_network_requests

browser_snapshot
# Expected: Success message or download complete
```

### 6. Verify Preview Works
```bash
# If preview panel exists
browser_click element="Preview"
browser_wait_for text="Preview"

# Verify animation plays
browser_take_screenshot

# Check preview for errors
browser_console_messages
# Expected: No lottie-web errors
```

### 7. Test Export Empty Canvas
```bash
# Start fresh
browser_navigate url="http://localhost:3000/editor"
browser_wait_for text="Canvas"

# Try to export with no shapes
browser_click element="Export"
browser_wait_for text="Export Options"
browser_click element="Download JSON"

# Should still work (empty animation) or show warning
browser_snapshot
# Expected: Either downloads empty animation or shows helpful message
```

### 8. Check for Errors
```bash
browser_console_messages
# Expected: No errors
```

## Expected Results
- [ ] Export dialog opens
- [ ] Animation name can be set
- [ ] Frame rate can be configured
- [ ] Validation shows success for valid content
- [ ] JSON file downloads
- [ ] Exported JSON is valid Lottie format
- [ ] Preview plays the animation
- [ ] Empty canvas exports valid (empty) animation
- [ ] No console errors

## Validation Checklist
After export, the JSON should contain:
- [ ] `v` - version string
- [ ] `fr` - frame rate matching setting
- [ ] `ip` - in-point (0)
- [ ] `op` - out-point matching duration
- [ ] `w`, `h` - canvas dimensions
- [ ] `layers` - array with shape layer
- [ ] Layer has correct shape data
- [ ] Animation keyframes if added

## Edge Cases to Test
- [ ] Export with 100+ objects
- [ ] Export with complex paths
- [ ] Export with no keyframes (static)
- [ ] Export with very long animation
- [ ] Cancel export mid-process
- [ ] Export twice without refresh
