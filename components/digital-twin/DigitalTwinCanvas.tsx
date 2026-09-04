'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useVehicle } from '../../context/VehicleContext';
import { DumperTruckMesh } from './DumperTruckMesh';
import { SensorCones } from './SensorCones';
import { TerrainOverlay } from './TerrainOverlay';
import { HealthHotspots } from './HealthHotspots';
import { RefreshCw, Eye, ShieldCheck, Radio } from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const {
    engineState,
    threatZone,
    rearThreatZone,
    distance,
    rearDistance,
    fogVisibility,
    steeringAngle,
    speed,
    selectedHealthNode,
    setSelectedHealthNode,
  } = useVehicle();

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden glass-panel border border-slate-800">
      {/* HUD Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            360° DIGITAL TWIN // LIVE ROAD MOTION
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            DUAL RADAR (FWD+REAR)
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setSelectedHealthNode(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Reset Camera
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[12, 8, 14]} fov={45} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05} // Don't go below ground
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
          {/* Main 3D Mining Vehicle with Animated Spinning Wheels */}
          <DumperTruckMesh
            steeringAngle={steeringAngle}
            engineActive={engineState === 'ACTIVE'}
            speed={speed}
          />

          {/* Dual 24GHz Radar Sensors (Forward + Rear Cones) */}
          <SensorCones
            threatZone={threatZone}
            obstacleDistance={distance}
            rearThreatZone={rearThreatZone}
            rearObstacleDistance={rearDistance}
          />

          {/* Animated Driving Road, Color-Coded Threat Corridor, Rear Vehicle, Dust */}
          <TerrainOverlay
            obstacleDistance={distance}
            rearDistance={rearDistance}
            fogVisibility={fogVisibility}
            threatZone={threatZone}
            rearThreatZone={rearThreatZone}
            speed={speed}
            engineActive={engineState === 'ACTIVE'}
          />

          {/* Clickable 3D Health Hotspots */}
          <HealthHotspots />
        </Suspense>
      </Canvas>

      {/* Footer Status Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300">
              ORBIT: 360° FREE ROTATE
            </span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">
              FWD: {distance.toFixed(1)}m | REAR: {rearDistance.toFixed(1)}m
            </span>
          </div>
        </div>

        {selectedHealthNode && (
          <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/40 px-3.5 py-1.5 rounded-lg pointer-events-auto text-xs font-mono text-cyan-300 animate-pulse">
            ACTIVE INSPECTION NODE: {selectedHealthNode.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};
