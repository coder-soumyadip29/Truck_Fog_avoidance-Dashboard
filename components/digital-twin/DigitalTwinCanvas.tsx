'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useVehicle } from '../../context/VehicleContext';
import { DumperTruckMesh } from './DumperTruckMesh';
import { SensorCones } from './SensorCones';
import { TerrainOverlay } from './TerrainOverlay';
import { HealthHotspots } from './HealthHotspots';
import { KeyboardControls } from './KeyboardControls';
import { RefreshCw, Eye, ShieldCheck, Radio, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const {
    engineState,
    threatZone,
    rearThreatZone,
    distance,
    rearDistance,
    fogVisibility,
    steeringAngle,
    truckX,
    speed,
    selectedHealthNode,
    setSelectedHealthNode,
    activeInputs,
    setControlInput,
    triggerEngineStart,
  } = useVehicle();

  const handleTouch = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    setControlInput(dir, active);
    if (active && engineState === 'STANDBY') {
      triggerEngineStart();
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] rounded-2xl overflow-hidden glass-panel border border-slate-800">
      {/* Top HUD Header Bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-200 uppercase truncate">
            360° DIGITAL TWIN // 4-ARROW DRIVING MODE
          </span>
          <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {engineState === 'ACTIVE' ? 'DRIVE ACTIVE' : 'READY'}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setSelectedHealthNode(null)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[10px] sm:text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            Reset Camera
          </button>
        </div>
      </div>

      {/* Center Game Controls On-Screen Keyboard & Touch Guide Pill */}
      <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-800 text-[10px] sm:text-[11px] font-mono shadow-xl max-w-[92%] sm:max-w-none">
        <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-bounce" />
        <span className="text-slate-400 font-medium hidden xs:inline">CONTROLS:</span>
        <div className="flex items-center gap-1 text-white font-bold">
          <span className={`px-1.5 py-0.5 rounded border transition-colors flex items-center gap-0.5 ${activeInputs.up ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <ArrowUp className="w-3 h-3 text-cyan-400" /> ▲ ACCEL
          </span>
          <span className={`px-1.5 py-0.5 rounded border transition-colors flex items-center gap-0.5 ${activeInputs.down ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <ArrowDown className="w-3 h-3 text-cyan-400" /> ▼ BRAKE
          </span>
          <span className={`px-1.5 py-0.5 rounded border transition-colors flex items-center gap-0.5 ${activeInputs.left ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <ArrowLeft className="w-3 h-3 text-amber-400" /> ◀ LEFT
          </span>
          <span className={`px-1.5 py-0.5 rounded border transition-colors flex items-center gap-0.5 ${activeInputs.right ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-300'}`}>
            <ArrowRight className="w-3 h-3 text-amber-400" /> ▶ RIGHT
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[12, 8, 14]} fov={45} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={6}
          maxDistance={36}
        />

        {/* Ambient & Directional Pit Lights */}
        <ambientLight intensity={0.6} color="#94A3B8" />
        <directionalLight
          position={[20, 30, 15]}
          intensity={1.4}
          color="#00E5FF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, 10, -15]} intensity={0.8} color="#FFB300" />

        <Suspense fallback={null}>
          {/* Arrow Keys Driving Physics Controller */}
          <KeyboardControls />

          {/* Main 3D Mining Vehicle */}
          <DumperTruckMesh
            steeringAngle={steeringAngle}
            engineActive={engineState === 'ACTIVE'}
            speed={speed}
            truckX={truckX}
          />

          {/* Dual 24GHz Radar Sensors */}
          <SensorCones
            threatZone={threatZone}
            obstacleDistance={distance}
            rearThreatZone={rearThreatZone}
            rearObstacleDistance={rearDistance}
            truckX={truckX}
          />

          {/* Concentric Color-Coded Threat Rectangles */}
          <TerrainOverlay
            obstacleDistance={distance}
            rearDistance={rearDistance}
            fogVisibility={fogVisibility}
            threatZone={threatZone}
            rearThreatZone={rearThreatZone}
            speed={speed}
            engineActive={engineState === 'ACTIVE'}
            truckX={truckX}
          />

          {/* Clickable 3D Health Hotspots */}
          <HealthHotspots />
        </Suspense>
      </Canvas>

      {/* Touch Mobile On-Screen 4-Arrow D-Pad Controller */}
      <div className="absolute bottom-16 sm:bottom-4 right-3 sm:right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-950/80 backdrop-blur-lg border border-slate-800 shadow-2xl">
        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
          TOUCH D-PAD
        </div>
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          {/* UP Button */}
          <button
            onTouchStart={e => { e.preventDefault(); handleTouch('up', true); }}
            onTouchEnd={e => { e.preventDefault(); handleTouch('up', false); }}
            onTouchCancel={e => { e.preventDefault(); handleTouch('up', false); }}
            onMouseDown={() => handleTouch('up', true)}
            onMouseUp={() => handleTouch('up', false)}
            onMouseLeave={() => handleTouch('up', false)}
            aria-label="Accelerate Forward"
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border transition-all active:scale-90 ${
              activeInputs.up
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)]'
                : 'bg-slate-900/90 text-cyan-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* LEFT Button */}
          <button
            onTouchStart={e => { e.preventDefault(); handleTouch('left', true); }}
            onTouchEnd={e => { e.preventDefault(); handleTouch('left', false); }}
            onTouchCancel={e => { e.preventDefault(); handleTouch('left', false); }}
            onMouseDown={() => handleTouch('left', true)}
            onMouseUp={() => handleTouch('left', false)}
            onMouseLeave={() => handleTouch('left', false)}
            aria-label="Steer Left"
            className={`absolute top-1/2 left-0 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border transition-all active:scale-90 ${
              activeInputs.left
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(255,179,0,0.8)]'
                : 'bg-slate-900/90 text-amber-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* RIGHT Button */}
          <button
            onTouchStart={e => { e.preventDefault(); handleTouch('right', true); }}
            onTouchEnd={e => { e.preventDefault(); handleTouch('right', false); }}
            onTouchCancel={e => { e.preventDefault(); handleTouch('right', false); }}
            onMouseDown={() => handleTouch('right', true)}
            onMouseUp={() => handleTouch('right', false)}
            onMouseLeave={() => handleTouch('right', false)}
            aria-label="Steer Right"
            className={`absolute top-1/2 right-0 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border transition-all active:scale-90 ${
              activeInputs.right
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(255,179,0,0.8)]'
                : 'bg-slate-900/90 text-amber-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* DOWN Button */}
          <button
            onTouchStart={e => { e.preventDefault(); handleTouch('down', true); }}
            onTouchEnd={e => { e.preventDefault(); handleTouch('down', false); }}
            onTouchCancel={e => { e.preventDefault(); handleTouch('down', false); }}
            onMouseDown={() => handleTouch('down', true)}
            onMouseUp={() => handleTouch('down', false)}
            onMouseLeave={() => handleTouch('down', false)}
            aria-label="Brake / Reverse"
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border transition-all active:scale-90 ${
              activeInputs.down
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.8)]'
                : 'bg-slate-900/90 text-cyan-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer Status Overlay */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none max-w-[60%] sm:max-w-[70%]">
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 truncate">
              360° ORBIT
            </span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700 hidden xs:block" />
          <div className="hidden xs:flex items-center gap-1.5 sm:gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono text-slate-300">
              F:{distance.toFixed(1)}m | R:{rearDistance.toFixed(1)}m
            </span>
          </div>
        </div>

        {selectedHealthNode && (
          <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/40 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg pointer-events-auto text-[10px] sm:text-xs font-mono text-cyan-300 animate-pulse truncate">
            NODE: {selectedHealthNode.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};
