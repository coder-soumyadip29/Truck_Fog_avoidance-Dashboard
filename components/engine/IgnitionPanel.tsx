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
    <div className="w-full glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
      {/* Left Info & Diagnostic Status */}
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5 z-10 w-full md:w-auto">
        {/* Pulsing Push Button */}
        <div className="relative shrink-0">
          <button
            onClick={isActive ? triggerEngineStop : triggerEngineStart}
            disabled={isSweeping}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs transition-all duration-300 transform active:scale-95 ${
              isActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] border-2 border-red-400'
                : isSweeping
                ? 'bg-amber-500 text-slate-950 animate-pulse border-2 border-amber-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_35px_rgba(16,185,129,0.6)] border-2 border-emerald-400 animate-glow-pulse'
            }`}
          >
            <Power className={`w-5 h-5 sm:w-7 sm:h-7 mb-0.5 ${isSweeping ? 'animate-spin' : ''}`} />
            <span className="text-[8px] sm:text-[9px] tracking-widest font-extrabold uppercase">
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
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isActive
                  ? 'bg-emerald-400 animate-pulse'
                  : isSweeping
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-500'
              }`}
            />
            <h3 className="text-sm sm:text-base md:text-lg font-mono font-bold text-white tracking-wide">
              {isActive
                ? 'ENGINE ACTIVE // CAS LEVEL 9 ONLINE'
                : isSweeping
                ? 'IGNITION SEQUENCE IN PROGRESS (2s SWEEP)'
                : 'SYSTEM IN LOW-POWER STANDBY'}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 font-mono">
            {isActive
              ? '24GHz mmWave Radars active. Arrow keys & Touch D-Pad enabled.'
              : 'Press ENGINE START or press Arrow Keys / Touch D-Pad to initiate ignition & drive.'}
          </p>

          {/* Diagnostic Checks Checklist */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 mt-2.5 text-[10px] sm:text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>RADAR mmWave: CALIBRATED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>CAN-Bus J1939: READY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>EMESRT L9 BRAKE: ARMED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Telemetry Badge */}
      <div className="flex items-center gap-3 bg-slate-950/70 px-3.5 py-2.5 rounded-xl border border-slate-800 z-10 w-full md:w-auto justify-center md:justify-end shrink-0">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        <div className="text-right font-mono">
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">
            SYSTEM POWER STATE
          </div>
          <div className="text-xs sm:text-sm font-bold text-cyan-400">
            {engineState}
          </div>
        </div>
      </div>
    </div>
  );
};
