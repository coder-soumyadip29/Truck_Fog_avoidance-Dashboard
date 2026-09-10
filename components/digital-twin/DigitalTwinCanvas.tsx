'use client';

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useVehicle } from '../../context/VehicleContext';
import { audioSynth } from '../../utils/audioSynth';
import { DumperTruckMesh } from './DumperTruckMesh';
import { SensorCones } from './SensorCones';
import { TerrainOverlay } from './TerrainOverlay';
import { HealthHotspots } from './HealthHotspots';
import { KeyboardControls } from './KeyboardControls';
import { RefreshCw, Eye, ShieldCheck, Radio, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const CockpitCameraController: React.FC<{ cameraMode: string; truckX: number; steeringAngle: number; speed: number }> = ({
  cameraMode,
  truckX,
  steeringAngle,
  speed,
}) => {
  useFrame(({ camera }) => {
    if (cameraMode === 'COCKPIT') {
      const targetX = truckX + 1.0;
      const bounceY = speed > 0 ? Math.sin(Date.now() * 0.012) * 0.03 : 0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.15);
      camera.position.y = 2.35 + bounceY;
      camera.position.z = 1.45;

      const lookAtX = targetX + (steeringAngle * 0.06);
      const lookAtY = 1.9 + bounceY;
      const lookAtZ = 20.0;
      camera.lookAt(lookAtX, lookAtY, lookAtZ);
    }
  });
  return null;
};

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
    gear,
    selectedHealthNode,
    setSelectedHealthNode,
    activeInputs,
    setControlInput,
    triggerEngineStart,
    cameraMode,
    setCameraMode,
    roadsideScenario,
    wipersActive,
    toggleWipers,
    lidarHeatmapMode,
    toggleLidarHeatmap,
    fatigueState,
    triggerFatigueSimulation,
    resetFatigue,
    teleOpActive,
    toggleTeleOp,
  } = useVehicle();

  const handleTouch = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    setControlInput(dir, active);
    if (active && engineState === 'STANDBY') {
      triggerEngineStart();
    }
  };

  // Determine Camera Position and FOV based on cameraMode
  let camPos: [number, number, number] = [12, 8, 14];
  let camFov = 45;
  if (cameraMode === 'COCKPIT') {
    camPos = [truckX + 1.0, 2.35, 1.45];
    camFov = 68;
  } else if (cameraMode === 'TOP_DOWN') {
    camPos = [truckX, 26, 0.1];
    camFov = 40;
  } else if (cameraMode === 'REAR') {
    camPos = [truckX, 3.5, -8.5];
    camFov = 50;
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] rounded-2xl overflow-hidden glass-panel border border-slate-800">
      {/* Top HUD Header Bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-200 uppercase truncate">
            360° DIGITAL TWIN // {cameraMode} VIEW
          </span>
          <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {engineState === 'ACTIVE' ? 'DRIVE ACTIVE' : 'READY'}
          </span>
        </div>

        {/* Camera View Switcher & Interactive Feature Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto font-mono text-[10px]">
          <button
            onClick={() => setCameraMode('ORBIT')}
            className={`px-2 py-1 rounded-lg transition-all ${cameraMode === 'ORBIT' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            ORBIT 3D
          </button>
          <button
            onClick={() => setCameraMode('COCKPIT')}
            className={`px-2 py-1 rounded-lg transition-all ${cameraMode === 'COCKPIT' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            CABIN 1ST 🚘
          </button>
          <button
            onClick={() => setCameraMode('TOP_DOWN')}
            className={`px-2 py-1 rounded-lg transition-all ${cameraMode === 'TOP_DOWN' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            DRONE TOP
          </button>

          {/* Interactive Feature Controls */}
          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          <button
            onClick={toggleLidarHeatmap}
            className={`px-2 py-1 rounded-lg transition-all border ${
              lidarHeatmapMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold animate-pulse'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle 24GHz LiDAR Laser Matrix"
          >
            📡 LIDAR {lidarHeatmapMode ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleWipers}
            className={`px-2 py-1 rounded-lg transition-all border ${
              wipersActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Heavy Duty Windshield Wipers"
          >
            🌧️ WIPERS {wipersActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleTeleOp}
            className={`px-2 py-1 rounded-lg transition-all border ${
              teleOpActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle 5G Remote Tele-Operation Override"
          >
            🛰️ 5G TELE-OP
          </button>

          <button
            onClick={() => setSelectedHealthNode(null)}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 ml-1"
            title="Reset Camera View"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center Game Controls On-Screen Keyboard & Touch Guide Pill */}
      <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-800 text-[10px] sm:text-[11px] font-mono shadow-xl max-w-[92%] sm:max-w-none">
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

      {/* --- ONCOMING TRUCK COLLISION RISK RED ALERT BANNER --- */}
      {roadsideScenario === 'ONCOMING_HAULER' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none font-mono text-xs bg-red-600/90 text-white font-extrabold px-4 py-2 rounded-2xl shadow-[0_0_35px_rgba(239,68,68,0.8)] border border-red-300 animate-pulse flex items-center gap-2 max-w-[90%] text-center">
          <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>🚨 RED ALERT: ONCOMING KOMATSU HAULER IN OPPOSITE LANE // LEVEL 9 AUTO-BRAKE PREVENTING ACCIDENT!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- CABIN 1ST PERSON DRIVER WINDSHIELD & HUD OVERLAY LAYER --- */}
      {/* ========================================================================= */}
      {cameraMode === 'COCKPIT' && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden font-mono">
          {/* 1. Left & Right Carbon Fiber A-Pillar Frames */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent opacity-95 border-r border-slate-800" />
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 via-slate-900 to-transparent opacity-95 border-l border-slate-800" />
          
          {/* Top Sun Visor Strip */}
          <div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-center text-[10px] text-cyan-400/80 font-bold tracking-widest uppercase">
            CAT 797F HEAVY COCKPIT // HEAD-UP DISPLAY ONLINE
          </div>

          {/* 2. Projected Windshield Telemetry Reticle (Center Line of Sight) */}
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            {/* Projected Laser Targeting Reticle */}
            <div className={`relative w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
              threatZone === 'ZONE_1_EMERGENCY'
                ? 'border-red-500 bg-red-500/10 animate-ping-slow'
                : threatZone === 'ZONE_2_WARNING'
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-cyan-400/60'
            }`}>
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white">
                {distance.toFixed(1)}m
              </div>
            </div>

            {/* Projected Speed & Gear Banner */}
            <div className="mt-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-cyan-500/40 text-center shadow-lg">
              <div className="text-base font-extrabold text-cyan-300">
                {speed} <span className="text-xs text-slate-400">KM/H</span> <span className="text-amber-400 font-black">[{gear}]</span>
              </div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest">
                FORWARD HAUL PROXIMITY
              </div>
            </div>
          </div>

          {/* --- INTERACTIVE WINDSHIELD WIPER ANIMATION OVERLAY --- */}
          {wipersActive && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {/* Dual Pneumatic Wiper Arm 1 (Driver Side) */}
              <div
                className="absolute bottom-0 left-[20%] w-3.5 h-[320px] bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-x border-slate-700 rounded-t-full origin-bottom animate-wiper-sweep"
                style={{ transformOrigin: 'bottom center' }}
              />
              {/* Dual Pneumatic Wiper Arm 2 (Passenger Side) */}
              <div
                className="absolute bottom-0 left-[60%] w-3.5 h-[320px] bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-x border-slate-700 rounded-t-full origin-bottom animate-wiper-sweep"
                style={{ transformOrigin: 'bottom center', animationDelay: '0.15s' }}
              />
              {/* Water/Mist Clearing Streak FX */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-amber-500/5 animate-pulse" />
            </div>
          )}

          {/* 3. Bottom Dashboard Steering Wheel Rim & Telemetry Console */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex items-end justify-between px-4 sm:px-8 pb-3">
            {/* Rotating 4-Spoke Heavy Mining Steering Wheel (Bottom Left) */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 translate-y-6">
              <div
                className="w-full h-full rounded-full border-8 border-slate-800 bg-slate-950/70 shadow-2xl relative transition-transform duration-100 flex items-center justify-center"
                style={{ transform: `rotate(${steeringAngle * 2.5}deg)` }}
              >
                {/* Center Hub */}
                <div className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-slate-900 flex items-center justify-center font-black text-slate-950 text-[9px]">
                  CAT
                </div>
                {/* Horizontal & Vertical Steering Spokes */}
                <div className="absolute w-full h-2 bg-slate-800" />
                <div className="absolute h-full w-2 bg-slate-800" />
              </div>
            </div>

            {/* Left & Right Side Mirror Radar Overlay Cards */}
            <div className="flex items-center gap-3">
              {/* Left Side Mirror */}
              <div className="hidden xs:flex flex-col bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[10px]">
                <div className="text-slate-400 font-bold text-[9px]">◀ LEFT MIRROR</div>
                <div className="text-cyan-300 font-bold">REAR: {rearDistance.toFixed(1)}m</div>
              </div>

              {/* Right Side Mirror */}
              <div className="flex flex-col bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[10px]">
                <div className="text-slate-400 font-bold text-[9px]">RIGHT MIRROR ▶</div>
                <div className="text-amber-300 font-bold">STEER: {steeringAngle}°</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 5G REMOTE TELE-OPERATION OVERRIDE HUD CARD --- */}
      {teleOpActive && (
        <div className="absolute top-16 left-4 z-30 font-mono text-xs bg-slate-950/90 backdrop-blur-xl border border-emerald-500/60 p-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-fade-in flex flex-col gap-2 max-w-[260px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-black text-emerald-400 uppercase text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              5G TELE-OP REMOTE OVERRIDE
            </span>
            <button
              onClick={toggleTeleOp}
              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/40"
            >
              DISENGAGE
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 bg-slate-900/80 p-2 rounded-xl">
            <div>
              <div className="text-slate-500">5G URLLC PING:</div>
              <div className="text-emerald-400 font-bold">5.8 ms (100Gbps)</div>
            </div>
            <div>
              <div className="text-slate-500">REMOTE PILOT:</div>
              <div className="text-cyan-300 font-bold">HQ-UNIT-04</div>
            </div>
          </div>
          <div className="text-[9px] text-slate-400">
            Manual remote steering joystick connected over private 5G mining slice.
          </div>
        </div>
      )}

      {/* --- AI DRIVER FATIGUE MONITORING WARNING MODAL --- */}
      {fatigueState !== 'ALERT' && (
        <div className="absolute top-16 right-4 z-30 font-mono text-xs bg-slate-950/95 backdrop-blur-xl border border-red-500 p-3.5 rounded-2xl shadow-[0_0_35px_rgba(239,68,68,0.5)] animate-bounce-slow flex flex-col gap-2 max-w-[280px]">
          <div className="flex items-center justify-between text-red-400 font-black text-[11px] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              AI FATIGUE ALARM // {fatigueState}
            </span>
          </div>
          <p className="text-[11px] text-slate-200 leading-tight">
            Driver eye closure & head drop detected by cabin IR camera!
          </p>
          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              onClick={() => {
                audioSynth.playTruckHorn();
              }}
              className="flex-1 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[10px] hover:bg-amber-500/40"
            >
              🎺 WAKE HORN
            </button>
            <button
              onClick={resetFatigue}
              className="flex-1 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] hover:bg-emerald-500/40"
            >
              DISMISS / OK
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030712']} />
        <PerspectiveCamera makeDefault position={camPos} fov={camFov} />
        <fogExp2 attach="fog" color="#08101E" density={Math.max(0.015, (fogVisibility / 100) * 0.05)} />

        {/* Dynamic Cockpit Camera LookAt & Pitch Controller */}
        <CockpitCameraController
          cameraMode={cameraMode}
          truckX={truckX}
          steeringAngle={steeringAngle}
          speed={speed}
        />
        
        {cameraMode === 'ORBIT' && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={6}
            maxDistance={36}
          />
        )}

        {/* Ambient & Directional Pit Lights */}
        <ambientLight intensity={0.7} color="#94A3B8" />
        <directionalLight
          position={[20, 35, 20]}
          intensity={1.6}
          color="#00E5FF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, 12, -15]} intensity={1.2} color="#FFB300" />
        <pointLight position={[15, 12, 15]} intensity={0.8} color="#38BDF8" />

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

          {/* Concentric Color-Coded Threat Rectangles & Roadside Terrain */}
          <TerrainOverlay
            obstacleDistance={distance}
            rearDistance={rearDistance}
            fogVisibility={fogVisibility}
            threatZone={threatZone}
            rearThreatZone={rearThreatZone}
            speed={speed}
            engineActive={engineState === 'ACTIVE'}
            truckX={truckX}
            roadsideScenario={roadsideScenario}
            lidarHeatmapMode={lidarHeatmapMode}
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
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none max-w-[60%] sm:max-w-[70%]">
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 truncate">
              {cameraMode} VIEW
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
