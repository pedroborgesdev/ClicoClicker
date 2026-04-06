# ClicoClicker

<p align="center">
  <img src="assets/banner.png" alt="ClicoClicker Banner" />
</p>

<p align="center">
  <strong>A powerful auto clicker with multiple concurrent sessions, burst mode, 13 themes, and human-like click patterns.</strong>
</p>

<p align="center">
  <a href="https://clicoclicker.com">Website</a> · <a href="https://github.com/pedroborgesdev/ClicoClicker/releases">Download</a> · <a href="#features">Features</a>
</p>

---

<p align="center">
  <img src="assets/application.png" alt="ClicoClicker Interface" width="500" />
</p>

## Table of Contents

- [Features](#features)
  - [Auto Clicker](#auto-clicker)
  - [Burst Clicker](#burst-clicker)
  - [Multi-Session](#multi-session)
  - [Themes](#themes)
  - [Other](#other)
- [How It Works](#how-it-works)
  - [Gaussian Variation](#gaussian-variation)
  - [Burst Threading](#burst-threading)
  - [Click Test Area](#click-test-area)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [IPC Channels](#ipc-channels)
  - [Python Scripts](#python-scripts)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Dev Mode](#dev-mode)
  - [Scripts](#scripts)
- [Building](#building)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

### Auto Clicker
- **CPS Control** — 1 to 100 clicks per second with a slider and numeric input
- **Gaussian Variation** — natural, human-like click patterns with 0–20 configurable variation range
- **Toggle or Hold-to-Click** — activate with a hotkey press (300ms debounce) or hold it down
- **Custom Hotkey** — any keyboard key or mouse button as trigger
- **Left or Right Click** — choose which mouse button to automate

### Burst Clicker
- **Click Multiplication** — each real click triggers 1–50 extra clicks
- **Configurable Delay** — 0–100ms between burst clicks for natural timing
- **Left or Right Button** — choose which mouse button to listen and burst on
- **Smart Injection** — artificial clicks are flagged to avoid feedback loops and conflicts with auto clicker sessions
- **Threaded Bursts** — each burst runs in its own daemon thread for non-blocking operation

### Multi-Session
- **Up to 5 Concurrent Sessions** — each with independent mode, CPS, hotkey, and settings
- **Independent Execution** — each session spawns its own Python process
- **Persistent Config** — all settings saved to `localStorage` and restored between app restarts
- **Session Sidebar** — add sessions with `+`, right-click to delete, click to switch
- **Running Indicator** — active sessions show an animated pulse dot

### Themes
13 handcrafted color themes that adapt every accent, gradient, and UI element:

| Theme | Color | Theme | Color |
|---|---|---|---|
| Ocean | `#5B8DEF` | Rose | `#F43F5E` |
| Crimson | `#EF4444` | Slate | `#64748B` |
| Emerald | `#34D399` | Teal | `#14B8A6` |
| Violet | `#A855F7` | Indigo | `#6366F1` |
| Amber | `#F59E0B` | Gold | `#FFD700` |
| Sky | `#38BDF8` | Carbon | `#A0A0A0` |
| Lime | `#A3E635` | | |

Theme is applied via `data-theme` attribute on the root element and persisted in `localStorage`.

### Other
- **Click Test Area** — real-time CPS measurement with 1-second window and exponential smoothing
- **Custom Titlebar** — frameless, transparent, non-resizable 530×620 window with native-like controls
- **Animated Intro** — 2.5s splash screen with clip-path exit animation
- **Cross-Platform** — Windows (.exe) and Linux (.deb / .AppImage)

## How It Works

### Gaussian Variation

The auto clicker doesn't simply click at a fixed rate. CPS varies using a **block system**:

1. A target CPS is generated using `random.gauss(base_cps, variation / 3.0)`, clamped to `[base_cps - variation, base_cps + variation]`
2. This CPS is held for a random **block duration** between 0.8–5.0 seconds
3. When the block expires, a new CPS is generated and a new block duration is assigned

This produces click patterns that feel natural and human-like rather than perfectly robotic.

### Burst Threading

When a real click is detected in burst mode:

1. The listener verifies it's not an artificial click (via the `injecting` flag)
2. A new **daemon thread** is spawned for the burst
3. The thread fires N extra clicks with `time.sleep(delay)` between each
4. The `injecting` flag prevents the burst's own clicks from triggering new bursts

### Click Test Area

The built-in test area measures click speed using:

- A **1-second sliding window** — timestamps older than 1s are pruned on each `requestAnimationFrame` tick
- **Exponential smoothing** (factor 0.12) for stable CPS display
- Displays: smoothed CPS (2 decimal places), clicks in the last second, total clicks, and a reset button

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Framer Motion |
| Desktop | Electron 33 |
| Click Engine | Python 3 (pynput) |
| Build | Vite 6, electron-builder |
| Tooling | ESLint, PostCSS, Autoprefixer |

## Architecture

```
src/
├── electron/          # Main process — window, IPC, Python subprocess management
│   ├── electron.ts    # Window setup, 7 IPC handlers, process lifecycle
│   ├── preload.ts     # Context bridge for renderer
│   └── types.ts       # Shared types (ClickerSettings, BurstClickerSettings)
├── scripts/           # Python scripts (spawned as child processes)
│   ├── auto_clicker.py    # Continuous clicking with Gaussian CPS variation
│   ├── burst_clicker.py   # Multiplies real clicks into configurable bursts
│   └── listen_hotkey.py   # One-shot hotkey capture for binding setup
├── web/               # Renderer process (React app)
│   ├── App.tsx        # Root — session state, persistence, theme management
│   ├── layout/        # Layout shell with titlebar, toolbar, mode tabs, sidebar
│   ├── pages/         # AutoClickerPage, BurstClickerPage
│   └── components/    # Sidebar, SettingsPanel, MouseDisplay, SliderInput,
│                      # TestArea, Toolbar, Titlebar, IntroOverlay, etc.
└── python/            # Bundled Python distribution (win/linux)
```

The app bundles an embedded Python distribution — no system Python installation required for end users.

### IPC Channels

The Electron main process exposes 7 IPC handlers:

| Channel | Description |
|---|---|
| `minimize-app` | Minimizes the window |
| `maximize-app` | Toggles maximize/unmaximize |
| `close-app` | Kills all clicker processes and closes the window |
| `listen-for-hotkey` | Spawns `listen_hotkey.py`, returns the first key/button detected |
| `start-clicker` | Spawns `auto_clicker.py` with `--cps`, `--variation`, `--hotkey`, `--button`, `--hold-to-click` |
| `start-burst-clicker` | Spawns `burst_clicker.py` with `--clicks`, `--delay`, `--button` |
| `stop-clicker` | Terminates the process tree for a session (`taskkill /T /F` on Windows, `pkill -P` on Linux) |

Processes are tracked in a `Map<sessionId, ChildProcess>`. On close, all processes are killed with `SIGKILL`.

### Python Scripts

| Script | Purpose | Arguments |
|---|---|---|
| `auto_clicker.py` | Continuous clicking with Gaussian variation | `--cps`, `--variation`, `--hotkey`, `--button`, `--hold-to-click`, `--debug` |
| `burst_clicker.py` | Multiplies each real click into extra clicks | `--clicks`, `--delay`, `--button`, `--debug` |
| `listen_hotkey.py` | One-shot capture of a key/button press | None |

All scripts use `pynput` for mouse control and input listening.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

### Setup

```bash
git clone https://github.com/pedroborgesdev/ClicoClicker.git
cd ClicoClicker
npm install
```

### Dev Mode

```bash
npm run electron:dev
```

This compiles the Electron TypeScript, starts Vite on port 4000, and launches Electron pointing to it using `concurrently` and `wait-on`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server only (port 4000) |
| `npm run build` | Build web + compile Electron TypeScript |
| `npm run electron:dev` | Full dev mode (Vite + Electron concurrently) |
| `npm run app:build` | Production build + package installer |
| `npm run electron:pack` | Package without creating installer |

## Building

```bash
npm run app:build
```

This runs `vite build` with `ELECTRON=true`, compiles Electron TypeScript, and packages everything with `electron-builder`. The installer is generated in `dist/`.

| Platform | Format | Notes |
|---|---|---|
| Windows | NSIS (.exe) | Windows 10+, 64-bit |
| Linux | .deb, .AppImage | May require `sudo` for the build step |

The build bundles Python scripts and the embedded Python distribution as `extraResources`.

> On Linux, the `.deb` package runs an `after-install.sh` script to set Chrome sandbox permissions (`chmod 4755`).

## Usage

1. **Create sessions** — Use the `+` button in the sidebar to add up to 5 sessions
2. **Choose mode** — Switch between Auto Clicker and Burst Clicker using the mode tabs (disabled while clicking)
3. **Configure** — Set CPS, variation, hotkey, mouse button, and activation mode
4. **Start** — Press the start button or your configured hotkey
5. **Stop** — Press stop (available after 500ms) or the hotkey again (toggle mode)
6. **Test** — Use the built-in test area to verify click speed
7. **Customize** — Click theme dots in the toolbar to switch between 13 themes
8. **Manage sessions** — Right-click a session to delete it; clicking sessions are stopped first

## Contributing

Contributions are welcome — bugs, features, docs, or ideas. Fork, change, and submit a pull request.

## License

MIT — see [LICENSE.md](LICENSE.md) for details.

## Author

**Pedro Borges** — [@pedroborgesdev](https://github.com/pedroborgesdev)
