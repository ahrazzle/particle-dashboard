# particle-dashboard

Tech demo demonstrating capabilities of running quantized local AI on average consumer hardware (MacBook Pro M1).

## Run

Open `particle-dashboard.html` in a browser. The simulation is self-contained
Canvas 2D and JavaScript; no model, backend, installation, or network is required.
Drag on the canvas to attract particles, scroll to repel, and double-click to
spawn a burst. The count slider sets the base particle count; bursts add extras.

## Checks

`node tests/simulation.mjs` verifies particle count changes, connection counting,
readouts, and burst spawning without dependencies.
