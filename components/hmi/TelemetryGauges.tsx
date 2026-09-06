'use client';

import React from 'react';
import { GearPosition, EngineState } from '../../context/VehicleContext';
import { Gauge, Zap, Activity, Cpu } from 'lucide-react';

interface TelemetryGaugesProps {
  speed: number;
  rpm: number;
  gear: GearPosition;
  engineState: EngineState;
  batteryVoltage: number;
  steeringAngle: number;
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({
  speed,
  rpm,
  gear,
  engineState,
  batteryVoltage,
  steeringAngle,
}) => {
  const isSweeping = engineState === 'SWEEPING';
  const gears: GearPosition[] = ['P', 'R', 'N', 'D'];

  // Speedometer rotation angle (-120deg to 120deg)
  const maxSpeed = 50;
  const speedAngle = -120 + (Math.min(speed, maxSpeed) / maxSpeed) * 240;

  // RPM rotation angle (-120deg to 120deg)
  const maxRpm = 3500;
  const rpmAngle = -120 + (Math.min(rpm, maxRpm) / maxRpm) * 240;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* --- SPEEDOMETER GAUGE CARD --- */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              SPEEDOMETER
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            LIMIT: 40 KM/H
          </span>
        </div>

        {/* Circular Speedometer Arc */}
        <div className="relative flex justify-center items-center my-3">
          <svg viewBox="0 0 180 130" className="w-full max-w-[180px] h-auto">
            <path
              d="M 30 110 A 70 70 0 1 1 150 110"
              fill="none"
              stroke="#1E293B"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 30 110 A 70 70 0 1 1 150 110"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={300 - (speed / maxSpeed) * 220}
              className="transition-all duration-300"
            />
            {/* Needle */}
            <g transform={`rotate(${speedAngle}, 90, 80)`} className={isSweeping ? 'animate-gauge-sweep' : 'transition-all duration-200'}>
              <line x1="90" y1="80" x2="90" y2="25" stroke="#FF1744" strokeWidth="3" strokeLinecap="round" />
              <circle cx="90" cy="80" r="6" fill="#00E5FF" />
            </g>
          </svg>

          {/* Central Digital Speed */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-mono font-extrabold text-white tracking-tight">
              {speed}
            </div>
            <div className="text-[10px] font-mono text-slate-400 font-medium">KM/H</div>
          </div>
        </div>

        {/* Gear Selection Pills */}
        <div className="flex justify-center items-center gap-2 pt-2 border-t border-slate-800/60">
          {gears.map(g => (
            <span
              key={g}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all ${
                gear === g
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* --- ENGINE RPM & DIAGNOSTICS CARD --- */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              ENGINE TACHOMETER
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">CAT C175 V16</span>
        </div>

        {/* Circular Tachometer Arc */}
        <div className="relative flex justify-center items-center my-3">
          <svg viewBox="0 0 180 130" className="w-full max-w-[180px] h-auto">
            <path
              d="M 30 110 A 70 70 0 1 1 150 110"
              fill="none"
              stroke="#1E293B"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 30 110 A 70 70 0 1 1 150 110"
              fill="none"
              stroke="#00E676"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={300 - (rpm / maxRpm) * 220}
              className="transition-all duration-300"
            />
            {/* Needle */}
            <g transform={`rotate(${rpmAngle}, 90, 80)`} className={isSweeping ? 'animate-gauge-sweep' : 'transition-all duration-200'}>
              <line x1="90" y1="80" x2="90" y2="25" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
              <circle cx="90" cy="80" r="6" fill="#00E676" />
            </g>
          </svg>

          {/* Central Digital RPM */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-mono font-extrabold text-white tracking-tight">
              {rpm}
            </div>
            <div className="text-[10px] font-mono text-slate-400 font-medium">RPM</div>
          </div>
        </div>

        {/* System Voltage & Steering Angle Footer */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">VOLTS:</span>
            <span className="text-slate-200 font-bold">{batteryVoltage}V</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">STEER:</span>
            <span className="text-slate-200 font-bold">{steeringAngle}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
