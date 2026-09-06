'use client';

import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { Sliders, X, CloudFog, Gauge, ArrowRightLeft, AlertOctagon, RotateCcw, AlertTriangle, Radio } from 'lucide-react';

export const DemoSimPanel: React.FC = () => {
  const {
    distance,
    rearDistance,
    speed,
    fogVisibility,
    steeringAngle,
    isSimPanelOpen,
    threatZone,
    rearThreatZone,
    emesrtLevel,
    setDistance,
    setRearDistance,
    setSpeed,
    setFogVisibility,
    setSteeringAngle,
    applyPreset,
    toggleSimPanel,
  } = useVehicle();

  return (
    <>
      {/* Floating Trigger Button (Right Side) */}
      {/* Floating Trigger Button (Right Side) */}
      {!isSimPanelOpen && (
        <button
          onClick={toggleSimPanel}
          className="fixed right-3 bottom-3 sm:right-6 sm:bottom-6 z-50 flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[11px] sm:text-xs shadow-[0_0_30px_rgba(0,229,255,0.5)] border border-cyan-300 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
          <span>SIMULATOR</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-y-auto transition-all duration-300 transform ${
          isSimPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                  LIVE DEMO SIMULATOR CONTROLS
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Hardware-in-the-Loop (HIL) Pitch & Sensor Controls
                </p>
              </div>
            </div>
            <button
              onClick={toggleSimPanel}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Threat Status Pill */}
          <div className="my-4 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-400">EMESRT ACTIVE INTERVENTION:</span>
            <span
              className={`px-2.5 py-1 rounded font-bold ${
                emesrtLevel === 'LEVEL_9'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : emesrtLevel === 'LEVEL_8'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {emesrtLevel}
            </span>
          </div>

          {/* Sliders Form */}
          <div className="space-y-5">
            {/* 1. Forward Obstacle Distance Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                  FORWARD RADAR PROXIMITY
                </span>
                <span className="text-cyan-400 font-bold">{distance.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={distance}
                onChange={e => setDistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.5m (Zone 1 Red)</span>
                <span>5.0m (Zone 2 Yellow)</span>
                <span>15m (Zone 3 Green)</span>
              </div>
            </div>

            {/* 2. Rear Obstacle Distance Slider (Back of Truck) */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  REAR RADAR PROXIMITY (BACK)
                </span>
                <span className="text-amber-400 font-bold">{rearDistance.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.1"
                value={rearDistance}
                onChange={e => setRearDistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.5m (Rear Hazard)</span>
                <span>5.0m (Caution)</span>
                <span>15m (Clear)</span>
              </div>
            </div>

            {/* 3. Vehicle Speed Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  VEHICLE ROAD SPEED
                </span>
                <span className="text-cyan-400 font-bold">{speed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={speed}
                onChange={e => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 4. Fog Visibility Heatmap Density Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <CloudFog className="w-3.5 h-3.5 text-amber-400" />
                  SECTOR FOG DENSITY
                </span>
                <span className="text-amber-400 font-bold">{fogVisibility}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={fogVisibility}
                onChange={e => setFogVisibility(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* 5. Steering Angle Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-semibold">STEERING ANGLE</span>
                <span className="text-cyan-400 font-bold">{steeringAngle}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={steeringAngle}
                onChange={e => setSteeringAngle(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Quick One-Click Presets */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
            ONE-CLICK DEMO SCENARIOS
          </h4>
          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            <button
              onClick={() => applyPreset('FOG_HAZARD')}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">
                <CloudFog className="w-3.5 h-3.5" /> FOG HAZARD
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">92% Fog, 26km/h, 3.4m</div>
            </button>

            <button
              onClick={() => applyPreset('RESET_ROUTE')}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> RESET ROUTE
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">15% Fog, 12km/h, Clear</div>
            </button>

            <button
              onClick={() => applyPreset('ENGINE_FAULT')}
              className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> ENGINE FAULT
              </div>
              <div className="text-[10px] text-purple-400/80 mt-0.5">Engine Temp 118°C Overheat</div>
            </button>

            <button
              onClick={() => applyPreset('AUTO_BRAKE')}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-left transition-all"
            >
              <div className="font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> L9 EMERGENCY
              </div>
              <div className="text-[10px] text-red-400/80 mt-0.5">1.4m Hazard Auto-Brake</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
