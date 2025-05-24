# Overlay Animation Mockup Screenshots

Since we couldn't capture actual screenshots of the running app due to technical limitations, below are descriptions of what each overlay animation would look like when running on a game board:

## Board Completed Animation Overlay

The Board Completed animation would display:
- A colorful grid game board in the background (6x6 grid with alternating green cells)
- Semi-transparent firework particles emanating from the center point
- A subtle ripple wave effect expanding outward
- Particles gradually fading as they move outward
- The game board remaining visible through the animation
- No interference with game board interaction due to pointerEvents: 'none'

## High Score Animation Overlay

The High Score animation would display:
- A colorful grid game board in the background (6x6 grid with orange/yellow cells)
- "HIGH SCORE!" text appearing in the center with a gold color and subtle shadow
- Semi-transparent star particles bursting from behind the text
- A subtle golden glow effect across the screen
- Stars rotating slightly as they expand outward
- The game board remaining visible through the animation
- No interference with game board interaction due to pointerEvents: 'none'

## You're On Fire Animation Overlay

The You're On Fire animation would display:
- A colorful grid game board in the background (6x6 grid with red/purple cells)
- Semi-transparent flame particles rising from the bottom of the screen
- "YOU'RE ON FIRE!" text appearing above the flames
- Optional smoke particles rising with the flames
- In edge-only mode: flames appearing only at the left, right, and bottom edges of the screen
- The game board remaining fully visible through the animation
- No interference with game board interaction due to pointerEvents: 'none'

## Edge-Only Mode for On Fire Animation

The Edge-Only mode would display:
- A colorful grid game board in the background (6x6 grid with red/purple cells)
- Semi-transparent flames appearing only at the screen edges
- No text overlay in the center
- Flames pulsing slightly to indicate the "on fire" state
- The game board completely visible in the center area
- No interference with game board interaction due to pointerEvents: 'none'

## Animation Controls

The animation detail page would display:
- A mock game board in the preview area
- Play/Stop button below the preview
- Detailed controls for each animation parameter:
  - Sliders for numeric values (speed, particles, opacity, etc.)
  - Option selectors for categorical values (color schemes, positions, etc.)
- A description of the animation and its purpose
- Documentation about the overlay features
- The ability to test different configurations in real-time
