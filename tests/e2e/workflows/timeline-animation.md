# E2E Test: Timeline Animation Workflow

## Test Objective
Verify user can create keyframe animations using the timeline.

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

### 2. Verify Timeline Visible
```bash
browser_snapshot
# Expected: Timeline panel visible at bottom
# Expected: Playhead at frame 0
# Expected: Duration indicator shows total frames
```

### 3. Add Position Keyframe at Frame 0
```bash
# Select shape
browser_click element="Rectangle 1"

# Set initial position
browser_fill element="X Position" value="50"
browser_press_key key="Enter"

# Add keyframe
browser_click element="Add Keyframe"

# Verify keyframe marker appears
browser_snapshot
# Expected: Diamond marker at frame 0 on position track
```

### 4. Move to Frame 30
```bash
# Scrub timeline to frame 30
browser_click element="Frame 30"
# OR drag playhead
# browser_drag startElement="Playhead" endElement="Frame 30"

# Verify current frame indicator
browser_snapshot
# Expected: Current frame shows 30
```

### 5. Add Position Keyframe at Frame 30
```bash
# Change position for end keyframe
browser_fill element="X Position" value="250"
browser_press_key key="Enter"

# Add second keyframe
browser_click element="Add Keyframe"

# Verify second keyframe marker
browser_snapshot
# Expected: Diamond marker at frame 30
# Expected: Line connecting keyframes
```

### 6. Preview Animation
```bash
# Click play
browser_click element="Play"

# Wait for some playback
browser_wait_for text="Pause"

# Take screenshot mid-animation
browser_take_screenshot

# Pause playback
browser_click element="Pause"
```

### 7. Scrub Timeline
```bash
# Move playhead to frame 15
browser_click element="Frame 15"

# Verify interpolated position
browser_snapshot
# Expected: X Position shows ~150 (between 50 and 250)
```

### 8. Change Keyframe Easing
```bash
# Double-click keyframe to edit
browser_click element="Keyframe at 0" dblClick=true

# Select easing
browser_click element="ease-out"

# Apply
browser_click element="Apply"

# Verify easing indicator
browser_snapshot
# Expected: Keyframe shows ease-out curve
```

### 9. Delete Keyframe
```bash
# Select keyframe
browser_click element="Keyframe at 30"

# Delete
browser_press_key key="Delete"

# Verify keyframe removed
browser_snapshot
# Expected: Only keyframe at frame 0 remains
```

### 10. Check for Errors
```bash
browser_console_messages
# Expected: No errors
```

## Expected Results
- [ ] Timeline displays with playhead
- [ ] Keyframes can be added at current frame
- [ ] Keyframe markers visible on timeline
- [ ] Playhead can be scrubbed
- [ ] Properties interpolate between keyframes
- [ ] Play/Pause works
- [ ] Easing can be changed
- [ ] Keyframes can be deleted
- [ ] No console errors

## Edge Cases to Test
- [ ] Keyframe at frame 0
- [ ] Keyframe at last frame
- [ ] Multiple keyframes same frame (should merge or warn)
- [ ] Delete all keyframes
- [ ] Very long animation (1000+ frames)
