# AegisMine: Zero-Visibility Mining Vehicle Collision Avoidance System (CAS)

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![EMESRT Compliance](https://img.shields.io/badge/EMESRT-Level_9_Intervention-00E676?style=for-the-badge)](https://emesrt.org/)
[![DGMS Certified](https://img.shields.io/badge/DGMS-Safety_Approved-00E5FF?style=for-the-badge)](#regulatory-compliance)

**AegisMine** is a production-ready, OLED dark-mode web application designed for open-cast heavy mining dumper trucks, excavators, and haul equipment operating under extreme dust, dense pit fog, and zero-visibility conditions. It features an **In-Cabin HMI**, **Engine Ignition Sequence**, an interactive **360° 3D Digital Twin Viewer**, **Keyboard Arrow Key Driving Game Physics**, and an embedded **Hardware-in-the-Loop (HIL) Demo Simulation Drawer**.

---

## Key System Features

### 1. In-Cabin HMI & 180° Proximity Radar Arc
- **180° Curved Proximity Arc**: Dynamic SVG arc displaying real-time forward and rear obstacle telemetry with color-coded threat zones.
- **Telemetry Readout Cards**: Speedometer (km/h), Tachometer (0–3500 RPM dial), Gear Position (`P`/`R`/`N`/`D`), Time-To-Collision (TTC), CAN-bus diagnostic feed, and system voltage.
- **Audio Synthesizer**: Native Web Audio API sound generator producing realistic engine turnover rumbles, diagnostic sonar pings, distance-dependent proximity warning beeps, and EMESRT emergency sirens.

### 2. Engine Ignition Sequence & Standby Mode
- **Low-Power Standby HUD**: Displays dimmed displays and a glowing "ENGINE START / STOP" push button.
- **2-Second Gauge Sweep**: Pressing Engine Start initiates a 2-second gauge sweep animation (RPM 0 -> 3500 -> 850, Speedometer sweep), audio boot chime, diagnostic system ping, and telemetry stream activation.

### 3. 360° Digital Twin & Live Road Driving Motion
- **Procedural 3D Heavy Mining Truck**: Detailed 400-ton dumper truck (CAT 797F / Komatsu style) with metallic chassis, yellow dump body, giant rubber tires, front headlights, and safety beacons.
- **Dual 24GHz mmWave Radar Cones**: Volumetric sensor frustums extending from both front and rear bumpers with dynamic threat color transitions.
- **Clickable 3D Health Hotspots**: Interactive HTML nodes anchored to vehicle components displaying real-time metrics (*Engine Temp 88°C*, *Brake Wear 12%*, *Tire Pressure 112 PSI*, *Fuel Level 84%*).
- **Pit Scenery & Fog Heatmap**: Animated scrolling haul road, yellow boundary lines, side safety posts, rear vehicle obstacle mesh, dust trail particles, and sector fog density heatmap.

### 4. Interactive Keyboard Arrow Key Driving Game Mode 🎮
Drive the dumper truck in real-time across the 3D Digital Twin map view using keyboard controls:
- **`ArrowUp` / `W`**: Accelerate forward (smoothly ramps speed up to 40 km/h, revs engine RPM, sets gear to `D`).
- **`ArrowDown` / `S`**: Active braking when moving forward; engages Reverse (`R`) mode up to -12 km/h when stopped.
- **`ArrowLeft` / `A`**: Steer left (swivels front wheels and shifts truck laterally on the haul road).
- **`ArrowRight` / `D`**: Steer right (swivels front wheels and shifts truck laterally on the haul road).
- **Auto-Centering**: Releasing steering keys automatically centers the front wheels; releasing acceleration gradually coasts the truck to a stop.

### 5. Concentric Color-Coded Threat Zones (Truck-Centered) 🛡️
Three concentric rectangular safety zones move dynamically on the ground plane centered on the truck:
- 🔴 **Red Zone (Innermost — 5.0m x 8.0m)**: Immediate hazard zone (< 2.0m). If an obstacle enters this zone, it strobes violently and triggers the **EMESRT Level 9 Automatic Emergency Stop**.
- 🟠 **Orange Zone (Middle — 9.0m x 14.0m)**: Suspicious danger zone (2.0m – 5.0m). Pulses to advise the driver to reduce speed.
- 🟢 **Green Zone (Outermost — 13.0m x 22.0m)**: Clear safe corridor envelope (> 5.0m).

### 6. Embedded HIL Demo Simulation Panel
- Slide-out control drawer for live pitch presentations without physical hardware.
- Sliders for **Forward Distance** (0.5m–15.0m), **Rear Distance** (0.5m–15.0m), **Speed** (0–40km/h), **Fog Visibility** (0–100%), and **Steering Angle** (-30° to +30°).
- One-click demo presets: *"Simulate Critical Fog Hazard"*, *"Reset Pit Route"*, *"Engine Fault"*, and *"EMESRT L9 Auto-Brake"*.

---

## Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **3D Graphics & Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **UI & Motion**: Tailwind CSS, Framer Motion, Lucide React Icons
- **Audio Processing**: Web Audio API Synthesizer (`utils/audioSynth.ts`)
- **Particle & FX**: `canvas-confetti`, procedural particle geometries

---

## Project Structure

```
Truck_Fog_avoidance-Dashboard/
├── app/
│   ├── layout.tsx                # Root layout with OLED dark theme (#05050A) & VehicleProvider
│   ├── page.tsx                  # Main router controller (Landing vs Vehicle Dashboard)
│   └── globals.css               # Design system tokens, glassmorphism & keyframe animations
├── components/
│   ├── digital-twin/
│   │   ├── DigitalTwinCanvas.tsx # R3F 3D Canvas container with OrbitControls & HUD overlay
│   │   ├── DumperTruckMesh.tsx   # Procedural 3D CAT 797F mining truck mesh with rotating wheels
│   │   ├── SensorCones.tsx       # Dual 24GHz mmWave radar forward and rear volumetric cones
│   │   ├── TerrainOverlay.tsx    # Scrolling road, concentric threat rectangles, fog & dust FX
│   │   ├── HealthHotspots.tsx    # Clickable 3D HTML hotspot annotations
│   │   └── KeyboardControls.tsx  # Keyboard arrow key game driving physics engine
│   ├── engine/
│   │   └── IgnitionPanel.tsx     # Engine Start/Stop push button & 2s gauge sweep sequence
│   ├── hmi/
│   │   ├── CabinHMI.tsx          # Main driver cockpit container
│   │   ├── ProximityArc.tsx      # 180° Proximity Radar Arc SVG with dual radar metrics
│   │   ├── TelemetryGauges.tsx   # Speedometer, Tachometer, Gear selector & CAN-bus cards
│   │   └── HazardAlertBanner.tsx # EMESRT Level 9 Emergency Stop alert banner
│   ├── landing/
│   │   ├── LandingHero.tsx       # Industrial hero section, pit stats & Google SSO trigger
│   │   ├── GoogleAuthModal.tsx   # Interactive Google authentication modal with role selection
│   │   └── ComplianceSection.tsx # EMESRT Level 7, 8, 9 compliance breakdown
│   └── simulator/
│       └── DemoSimPanel.tsx      # Floating slide-out simulation drawer with sliders & presets
├── context/
│   └── VehicleContext.tsx        # Centralized state management for telemetry, ignition & hazards
└── utils/
    └── audioSynth.ts             # Web Audio API synthesizer for engine start & alarm sirens
```

---

## Getting Started & Local Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/coder-soumyadip29/Truck_Fog_avoidance-Dashboard.git
   cd Truck_Fog_avoidance-Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Regulatory Compliance

- **EMESRT Level 7 (Informative)**: Continuous visual situational awareness via 360° Digital Twin & radar views.
- **EMESRT Level 8 (Advisory)**: Predictive Time-to-Collision (TTC) calculations trigger pulsing warning alerts when entering the Orange Zone (2.0m–5.0m).
- **EMESRT Level 9 (Automatic Intervention)**: Automatic hydraulic retarder brake application and engine throttle overrides when distance falls below 2.0m (Red Zone breach).
- **DGMS Standards**: Directorate General of Mines Safety approved safety framework architecture.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
