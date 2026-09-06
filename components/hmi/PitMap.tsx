'use client';

import React, { useState } from 'react';
import { useVehicle, NearbyVehicle, PitHazard } from '../../context/VehicleContext';
import {
  MapPin,
  Navigation,
  Radio,
  Truck,
  AlertTriangle,
  CloudFog,
  Crosshair,
  Layers,
  ShieldAlert,
  Flame,
  Info,
  Maximize2,
  RefreshCw,
  Compass,
} from 'lucide-react';

export const PitMap: React.FC = () => {
  const {
    speed,
    distance,
    rearDistance,
    truckX,
    steeringAngle,
    nearbyVehicles,
    nearestVehicle,
    pitHazards,
    nearestHazard,
    focusVehicleId,
    setFocusVehicleId,
  } = useVehicle();

  const [mapMode, setMapMode] = useState<'SATELLITE' | 'TACTICAL'>('SATELLITE');
  const [selectedPin, setSelectedPin] = useState<{ type: 'TRUCK' | 'HAZARD'; id: string } | null>(null);

  // Center position offset for operator truck
  const operatorX = 200 + truckX * 12;
  const operatorY = 220;

  // Selected object info
  const selectedTruck = nearbyVehicles.find(v => v.id === selectedPin?.id);
  const selectedHazard = pitHazards.find(h => h.id === selectedPin?.id);

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden h-full min-h-[460px]">
      {/* Top Banner - Nearest Fleet Vehicle Proximity Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            GIS PIT MAP // FLEET & HAZARD TRACKER
          </span>
        </div>

        {/* Nearest Truck Live Alert Box */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 font-mono text-[11px]">
          <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400">NEAREST:</span>
          <span className="font-extrabold text-white truncate max-w-[140px] sm:max-w-none">
            {nearestVehicle.name}
          </span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            nearestVehicle.distance < 2.0
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : nearestVehicle.distance <= 5.0
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {nearestVehicle.distance.toFixed(1)}m
          </span>
        </div>
      </div>

      {/* Map Interactive Canvas Header Controls */}
      <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs z-10">
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setMapMode('SATELLITE')}
            className={`px-2.5 py-1 rounded-md transition-all font-bold ${
              mapMode === 'SATELLITE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SATELLITE PIT
          </button>
          <button
            onClick={() => setMapMode('TACTICAL')}
            className={`px-2.5 py-1 rounded-md transition-all font-bold ${
              mapMode === 'TACTICAL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RADAR MESH
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setFocusVehicleId(nearestVehicle.id);
              setSelectedPin({ type: 'TRUCK', id: nearestVehicle.id });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-bold transition-all text-[11px]"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Focus Nearest Truck
          </button>
          <button
            onClick={() => {
              setFocusVehicleId(null);
              setSelectedPin(null);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all text-[11px]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Open-Cast Pit Map Graphic Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-hex-pattern opacity-40 pointer-events-none" />

        {/* SVG Pit Topography & Satellite Layer */}
        <svg viewBox="0 0 400 320" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="pitGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#05050A" stopOpacity="0" />
            </radialGradient>
            <filter id="glowGis" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Pit Contour Rings */}
          <ellipse cx="200" cy="160" rx="180" ry="130" fill="url(#pitGlow)" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="6 4" />
          <ellipse cx="200" cy="160" rx="140" ry="100" fill="none" stroke="#1E293B" strokeWidth="1.5" />
          <ellipse cx="200" cy="160" rx="90" ry="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* Pit Haul Roads */}
          <path d="M 40 300 Q 120 220 200 220 T 360 80" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
          <path d="M 40 300 Q 120 220 200 220 T 360 80" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="8 6" strokeOpacity="0.5" />

          {/* Hazard Region Overlay Polygons */}
          {/* Fog Zone Overlay */}
          <polygon
            points="220,100 290,90 320,150 250,160"
            fill="#FFB300"
            fillOpacity="0.18"
            stroke="#FFB300"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Active Blast Zone Overlay */}
          <circle cx="100" cy="100" r="35" fill="#FF1744" fillOpacity="0.12" stroke="#FF1744" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Dynamic Radar Concentric Circles around Operator */}
          <circle cx={operatorX} cy={operatorY} r="30" fill="none" stroke="#00E676" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx={operatorX} cy={operatorY} r="70" fill="none" stroke="#FFB300" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx={operatorX} cy={operatorY} r="120" fill="none" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.2" />

          {/* Distance Line from Operator Truck to Nearest Vehicle (#402) */}
          <line
            x1={operatorX}
            y1={operatorY}
            x2={operatorX + (nearestVehicle.latOffset * 100000)}
            y2={operatorY - (nearestVehicle.lngOffset * 100000)}
            stroke={nearestVehicle.distance < 2.0 ? '#FF1744' : nearestVehicle.distance <= 5.0 ? '#FFB300' : '#00E5FF'}
            strokeWidth="2"
            strokeDasharray="4 4"
            filter="url(#glowGis)"
          />

          {/* Distance Text on Line */}
          <text
            x={(operatorX + (operatorX + nearestVehicle.latOffset * 100000)) / 2}
            y={(operatorY + (operatorY - nearestVehicle.lngOffset * 100000)) / 2 - 8}
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {nearestVehicle.distance.toFixed(1)}m
          </text>

          {/* --- OPERATOR TRUCK PIN (YOUR VEHICLE) --- */}
          <g transform={`translate(${operatorX}, ${operatorY})`}>
            {/* Pulsing Beacon */}
            <circle cx="0" cy="0" r="14" fill="#00E5FF" fillOpacity="0.25" className="animate-ping-slow" />
            <circle cx="0" cy="0" r="8" fill="#00E5FF" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Heading Arrow */}
            <g transform={`rotate(${steeringAngle})`}>
              <line x1="0" y1="0" x2="0" y2="-18" stroke="#00E5FF" strokeWidth="2.5" markerEnd="url(#arrow)" />
            </g>
            <text x="0" y="20" textAnchor="middle" fill="#00E5FF" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
              YOU (CAT 797F)
            </text>
          </g>

          {/* --- NEARBY FLEET VEHICLE PINS --- */}
          {nearbyVehicles.map(v => {
            const vx = operatorX + (v.latOffset * 100000);
            const vy = operatorY - (v.lngOffset * 100000);
            const isSelected = selectedPin?.id === v.id || focusVehicleId === v.id;

            return (
              <g
                key={v.id}
                transform={`translate(${vx}, ${vy})`}
                onClick={() => {
                  setSelectedPin({ type: 'TRUCK', id: v.id });
                  setFocusVehicleId(v.id);
                }}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                {isSelected && (
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 3" className="animate-spin-slow" />
                )}
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="3"
                  fill={v.status === 'EMERGENCY' ? '#FF1744' : v.status === 'WARNING' ? '#FFB300' : '#0284C7'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text x="0" y="-12" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
                  {v.name.split(' ')[0]} {v.name.split(' ').pop()}
                </text>
                <text x="0" y="18" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono">
                  {v.distance.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* --- PIT HAZARD PINS --- */}
          {pitHazards.map(h => {
            const hx = operatorX + (h.latOffset * 80000);
            const hy = operatorY - (h.lngOffset * 80000);
            const isSelected = selectedPin?.id === h.id;

            return (
              <g
                key={h.id}
                transform={`translate(${hx}, ${hy})`}
                onClick={() => setSelectedPin({ type: 'HAZARD', id: h.id })}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                {isSelected && <circle cx="0" cy="0" r="14" fill="none" stroke="#FF1744" strokeWidth="2" />}
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill={h.severity === 'CRITICAL' ? '#FF1744' : h.severity === 'WARNING' ? '#FFB300' : '#A855F7'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text x="0" y="16" textAnchor="middle" fill="#F43F5E" fontSize="8" fontWeight="bold" fontFamily="JetBrains Mono">
                  ⚠️ {h.title.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Top Left Pit GPS Coordinates Display */}
        <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 pointer-events-none">
          <div className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>KORBA PIT 4B // 22.3512° N, 82.6845° E</span>
          </div>
        </div>

        {/* Selected Pin Details Overlay Card */}
        {(selectedTruck || selectedHazard) && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-cyan-500/40 shadow-xl text-xs font-mono flex items-center justify-between">
            {selectedTruck ? (
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{selectedTruck.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      DRIVER: {selectedTruck.driver}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    BEARING: {selectedTruck.bearing} | SPEED: {selectedTruck.speed} km/h | PROXIMITY: <span className="text-cyan-300 font-bold">{selectedTruck.distance.toFixed(1)}m</span>
                  </div>
                </div>
              </div>
            ) : selectedHazard ? (
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <span>{selectedHazard.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      {selectedHazard.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    LOCATION: {selectedHazard.locationName} | DISTANCE: <span className="text-amber-300 font-bold">{selectedHazard.distance.toFixed(1)}m</span>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => setSelectedPin(null)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>

      {/* Footer Fleet Proximity & Hazard List Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-mono text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            NEAR TRUCK (#402):
          </span>
          <span className={`font-bold ${nearestVehicle.distance < 2.0 ? 'text-red-400 animate-pulse' : nearestVehicle.distance <= 5.0 ? 'text-amber-400' : 'text-cyan-400'}`}>
            {nearestVehicle.distance.toFixed(1)}m ({nearestVehicle.bearing.split(' ')[0]})
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            CLOSEST HAZARD:
          </span>
          <span className="font-bold text-amber-300 truncate max-w-[130px]">
            {nearestHazard.title.split(' ')[0]} ({nearestHazard.distance.toFixed(1)}m)
          </span>
        </div>
      </div>
    </div>
  );
};
