# Life Simulator

Web simulator of a predator-prey ecosystem between foxes and rabbits, inspired by the Lotka-Volterra equations. This first step implements the simulation grid and the movement of the animals. Predation, reproduction and population dynamics will be added in future iterations.

## Features

- Configurable simulation grid rendered on a canvas, framed as a naturalist atlas plate with a figure caption (dark olive-ink theme, colored dots for each species).
- Food layer on the ground: green cells have food, darker hatched cells have been eaten and regrow after a configurable number of turns.
- Rabbits and foxes placed at random positions at the start of each simulation.
- Each animal moves one cell per step to a randomly chosen adjacent cell (including diagonals). Movement is random: this matches the mixing assumption behind the Lotka-Volterra model, where encounters depend on population densities.
- Toroidal grid: animals wrap around the edges.
- One animal per cell: animals only move into free adjacent cells and stay still if all of them are occupied.
- Rabbits eat the food of the cell they occupy, which resets their hunger counter. A rabbit that goes a configurable number of turns without eating dies and disappears.
- Foxes hunt rabbits: after moving, a fox with at least one adjacent rabbit (8-cell neighborhood) has one hunt attempt per turn with a configurable success chance. The eaten rabbit disappears and the fox's hunger resets.
- Foxes that go a configurable number of turns without eating die and disappear.
- Reproduction: each turn, every pair of animals of the same species within a configurable reproduction radius (default: adjacent cells) that has eaten this turn (both parents for rabbits, at least one for foxes) has a configurable chance of producing an offspring in a free adjacent cell. Births are tied to food intake: without food there are no offspring. An optional gestation period (default 1 = none) delays the next birth of each parent.
- Board legend: color and shape of every species (adults and newborns) and terrain state (grass vs eaten ground).
- Animals are drawn with a thin dark halo so they stay readable over any terrain state.
- Simulation controls: start, pause and restart, with keyboard shortcuts (space to start or pause, R to restart).
- Simulation status in the header: running, paused or finished, with a hint to run it again when the configured duration ends.
- Settings editable from the web and applied when starting or restarting the simulation, grouped into basic and advanced sections with sliders for percentage values. Settings are saved in the browser and restored on the next visit:
  - Grid size (10 to 200 cells per side).
  - Initial number of rabbits.
  - Initial number of foxes.
  - Simulation duration in seconds (0 = unlimited).
  - Seconds per step (movement speed).
  - Turns until eaten cells regrow food (default 5).
  - Turns a rabbit can survive without food (default 4).
  - Initial food coverage of the grid in percent (default 100).
  - Fox hunt success chance in percent (default 60).
  - Turns a fox can survive without eating (default 15).
  - Rabbit reproduction chance in percent (default 50).
  - Fox reproduction chance in percent (default 40).
  - Reproduction radius in cells (default 1 = adjacent).
  - Gestation turns between births (default 1 = none).
- Smooth movement: dots glide between cells with a requestAnimationFrame interpolation instead of jumping at each step. The ground layer is cached and only redrawn when the food changes, so the animation stays cheap even with thousands of animals.
- Newborns are drawn in a different color for their first 5 turns: gray rabbits and brown foxes.
- Live stats: rabbit count, fox count, step count and grass (food) percentage.
- Population chart over time: rabbits, foxes and grass percentage plotted per turn on a canvas (no chart dependencies), with a hover tooltip showing the values of the nearest turn and each series labeled at the end of its line.
- Phase portrait chart: rabbits vs foxes over time (the classic Lotka-Volterra loop), with the current state marked and labeled with its values, and the time direction encoded in the line opacity.
- Naturalist atlas visual identity: Fraunces display + Archivo UI typography, hairline rules, tabular figures and figure captions.
- Responsive layout for mobile, tablet and desktop. On desktop the board is sized against the viewport height so the charts stay close to the fold.
- Installable Progressive Web App (manifest + service worker).

## Default values

| Setting                     | Default   |
| --------------------------- | --------- |
| Grid size                   | 50 x 50   |
| Rabbits                     | 425       |
| Foxes                       | 60        |
| Duration                    | Unlimited |
| Seconds/step                | 0.5       |
| Food regrowth (turns)       | 5         |
| Rabbit starvation (turns)   | 4         |
| Initial food coverage       | 100%      |
| Fox hunt chance             | 60%       |
| Fox starvation (turns)      | 15        |
| Rabbit reproduction chance  | 50%       |
| Fox reproduction chance     | 40%       |
| Reproduction radius (cells) | 1         |
| Gestation (turns)           | 1 (none)  |

## Tech stack

- React 19
- Vite
- JavaScript (ES6+)
- Plain CSS
- pnpm

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm dev
```

Start the simulation with the "Empezar" button and pause it with "Pausar" (the space bar toggles them too). Starting always uses the values set in the configuration form: they are applied and the simulation is rebuilt only when they changed, so pausing and resuming keeps the current run. The "Reiniciar" button (or the R key) applies the form values too but leaves the simulation stopped at step 0.

## Other scripts

```bash
pnpm build   # production build
pnpm preview # preview the production build
pnpm lint    # run the linter
```

## Project structure

```text
src/
├── components/       # SimulatorBoard, SpeciesLegend, PopulationChart, PhaseChart, ControlPanel, ControlField, StatsBar, Footer
├── hooks/            # useSimulation (simulation state, step loop and history)
├── utils/            # movement, food, hunting, reproduction, settings validation and settings persistence
├── constants/        # default settings, limits and colors
├── styles/           # variables.css (design tokens)
├── App.jsx
└── main.jsx
public/               # manifest, icons, favicon and service worker
```

## Notes

- Application icons are temporary placeholders until definitive branding assets are supplied.
- Simulation and chart colors are defined in `src/constants/simulationConfig.js` (`ANIMAL_COLORS`, `NEWBORN_COLORS`, `GROUND_COLORS` and `CHART_COLORS`) and match the CSS design tokens in `src/styles/variables.css`.
