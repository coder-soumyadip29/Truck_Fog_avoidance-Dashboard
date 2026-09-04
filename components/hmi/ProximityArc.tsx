'use client';

import React from 'react';
import { ThreatZone, EMESRTLevel } from '../../context/VehicleContext';
import { Shield, AlertTriangle, Octagon, Radio, ArrowUp, ArrowDown } from 'lucide-react';

interface ProximityArcProps {
  threatZone: ThreatZone;
  emesrtLevel: EMESRTLevel;
  distance: number;
  rearDistance?: number;
  timeToCollision: number;
}

export const ProximityArc: React.FC<ProximityArcProps> = ({
  threatZone,
  emesrtLevel,
  distance,
  rearDistance = 11.0,
  timeToCollision,
}) => {
  // Arc Colors & Status Configuration
  let arcColor = '#00E676';
  let glowStyle = 'glass-panel-safe text-glow-safe';
  let badgeBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  let statusText = 'ALL CLEAR // DUAL RADARS OK';
  let icon = <Shield className="w-5 h-5 text-emerald-400" />;

  if (threatZone === 'ZONE_1_EMERGENCY') {
    arcColor = '#FF1744';
    glowStyle = 'glass-panel-danger text-glow-danger animate-strobe-fast';
    badgeBg = 'bg-red-500/30 text-red-400 border-red-500/60 animate-pulse';
    statusText = 'EMERGENCY BRAKE ENGAGED (EMESRT LEVEL 9)';
    icon = <Octagon className="w-5 h-5 text-red-400 animate-bounce" />;
  } else if (threatZone === 'ZONE_2_WARNING') {
    arcColor = '#FFB300';
    glowStyle = 'glass-panel-warning text-glow-warning';
    badgeBg = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    statusText = 'WARNING: SLOW DOWN (EMESRT LEVEL 8)';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />;
  }

  // Calculate obstacle position on 180° arc (from 15m to 0m)
  const clampedDist = Math.max(0.5, Math.min(15.0, distance));
  const normalizedPos = (clampedDist - 0.5) / 14.5;
  const angleRad = (1 - normalizedPos) * Math.PI;
  const radius = 130;
  const obstacleX = 160 + radius * Math.cos(Math.PI - angleRad);
  const obstacleY = 150 - radius * Math.sin(Math.PI - angleRad);

  return (
    <div className={`relative p-6 rounded-2xl transition-all duration-300 ${glowStyle}`}>
      {/* Top Header Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
            DUAL RADAR PROXIMITY ARC (FWD + REAR)
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold border ${badgeBg}`}>
          {icon}
          <span>{emesrtLevel} ACTIVE</span>
        </div>
      </div>

      {/* SVG 180° Curved Radar Arc */}
      <div className="relative flex justify-center items-center py-2">
        <svg width="320" height="180" viewBox="0 0 320 180" className="overflow-visible">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Outer Arc Rings */}
          <path
            d="M 30 150 A 130 130 0 0 1 290 150"
            fill="none"
            stroke="#1E293B"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Zone 3 (>5m) Green Segment */}
          <path
            d="M 30 150 A 130 130 0 0 1 125 35"
            fill="none"
            stroke="#00E676"
            strokeWidth="16"
            strokeOpacity="0.8"
            filter="url(#glow)"
          />

          {/* Zone 2 (2m–5m) Yellow Segment */}
          <path
            d="M 125 35 A 130 130 0 0 1 215 35"
            fill="none"
            stroke="#FFB300"
            strokeWidth="16"
            strokeOpacity="0.8"
            filter="url(#glow)"
          />

          {/* Zone 1 (<2m) Red Segment */}
          <path
            d="M 215 35 A 130 130 0 0 1 290 150"
            fill="none"
            stroke="#FF1744"
            strokeWidth="16"
            strokeOpacity="0.8"
            filter="url(#glow)"
          />

          {/* Radar Radial Sweep Lines */}
          <line x1="160" y1="150" x2="30" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="160" y1="150" x2="160" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="160" y1="150" x2="290" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* Dynamic Distance Indicator Arc Pointer */}
          <circle
            cx={obstacleX}
            cy={obstacleY}
            r="12"
            fill={arcColor}
            filter="url(#glow)"
            className="transition-all duration-200"
          />
          <circle
            cx={obstacleX}
            cy={obstacleY}
            r="5"
            fill="#FFFFFF"
            className="transition-all duration-200"
          />

          {/* Center Origin Node */}
          <circle cx="160" cy="150" r="8" fill="#00E5FF" />
          <text x="160" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
            TRUCK FRONT
          </text>
        </svg>

        {/* Central Live Distance Floating Readout */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-4xl font-mono font-extrabold text-white tracking-tight">
            {distance.toFixed(1)} <span className="text-lg font-normal text-slate-400">m</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider uppercase mt-1">
            FORWARD DISTANCE
          </div>
        </div>
      </div>

      {/* Dual Radar Status Readout Bar */}
      <div className="grid grid-cols-2 gap-2 my-2 font-mono text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> FWD 24GHz:
          </span>
          <span className="font-bold text-cyan-300">{distance.toFixed(1)}m</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" /> REAR 24GHz:
          </span>
          <span className="font-bold text-amber-300">{rearDistance.toFixed(1)}m</span>
        </div>
      </div>

      {/* Bottom Status Banner */}
      <div className="mt-2 text-center p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between font-mono text-xs">
        <span className="text-slate-400 font-medium">{statusText}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">TTC:</span>
          <span className={`font-bold ${timeToCollision < 2.5 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {timeToCollision > 99 ? 'SAFE' : `${timeToCollision}s`}
          </span>
        </div>
      </div>
    </div>
  );
};
