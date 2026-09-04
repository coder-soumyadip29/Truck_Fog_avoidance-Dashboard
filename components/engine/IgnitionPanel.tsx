'use client';

import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { Power, ShieldCheck, Activity, Zap, CheckCircle2 } from 'lucide-react';

export const IgnitionPanel: React.FC = () => {
  const { engineState, triggerEngineStart, triggerEngineStop } = useVehicle();

  const isStandby = engineState === 'STANDBY';
  const isSweeping = engineState === 'SWEEPING';
  const isActive = engineState === 'ACTIVE';

  return (
    <div className="w-full glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Left Info & Diagnostic Status */}
      <div className="flex items-center gap-5 z-10">
        {/* Pulsing Push Button */}
        <div className="relative">
          <button
            onClick={isActive ? triggerEngineStop : triggerEngineStart}
            disabled={isSweeping}
            className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs transition-all duration-300 transform active:scale-95 ${
              isActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] border-2 border-red-400'
                : isSweeping
                ? 'bg-amber-500 text-slate-950 animate-pulse border-2 border-amber-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_35px_rgba(16,185,129,0.6)] border-2 border-emerald-400 animate-glow-pulse'
            }`}
          >
            <Power className={`w-7 h-7 mb-0.5 ${isSweeping ? 'animate-spin' : ''}`} />
            <span className="text-[9px] tracking-widest font-extrabold uppercase">
              {isActive ? 'STOP' : isSweeping ? 'SWEEPING' : 'START'}
            </span>
          </button>

          {/* Glowing Ring */}
          <div
            className={`absolute -inset-2 rounded-full pointer-events-none transition-all duration-500 ${
              isActive
                ? 'border border-red-500/40 animate-ping-slow'
                : 'border border-emerald-500/40 animate-ping-slow'
            }`}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isActive
                  ? 'bg-emerald-400 animate-pulse'
                  : isSweeping
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-500'
              }`}
            />
            <h3 className="text-lg font-mono font-bold text-white tracking-wide">
              {isActive
                ? 'ENGINE ACTIVE // CAS LEVEL 9 ONLINE'
                : isSweeping
                ? 'IGNITION SEQUENCE IN PROGRESS (2s SWEEP)'
                : 'SYSTEM IN LOW-POWER STANDBY'}
            </h3>
          </div>

          <p className="text-xs text-slate-400 mt-1 font-mono">
            {isActive
              ? '24GHz mmWave Radars active. CAN-Bus telemetry polling at 100Hz.'
              : 'Press ENGINE START to initiate gauge sweep, audio ping, and sensor telemetry.'}
          </p>

          {/* Diagnostic Checks Checklist */}
          <div className="flex items-center gap-4 mt-3 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>RADAR mmWave: CALIBRATED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>CAN-Bus J1939: READY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>EMESRT L9 BRAKE: ARMED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Telemetry Badge */}
      <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 z-10">
        <Activity className="w-5 h-5 text-cyan-400" />
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            SYSTEM POWER STATE
          </div>
          <div className="text-sm font-mono font-bold text-cyan-400">
            {engineState}
          </div>
        </div>
      </div>
    </div>
  );
};
