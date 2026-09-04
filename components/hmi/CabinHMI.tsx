'use client';

import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { ProximityArc } from './ProximityArc';
import { TelemetryGauges } from './TelemetryGauges';
import { HazardAlertBanner } from './HazardAlertBanner';
import { Terminal, Volume2, VolumeX } from 'lucide-react';

export const CabinHMI: React.FC = () => {
  const {
    threatZone,
    emesrtLevel,
    distance,
    rearDistance,
    speed,
    rpm,
    gear,
    engineState,
    timeToCollision,
    healthMetrics,
    steeringAngle,
    diagnosticLogs,
    isMuted,
    toggleMute,
  } = useVehicle();

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Top Banner Alert Bar */}
      <HazardAlertBanner
        threatZone={threatZone}
        emesrtLevel={emesrtLevel}
        distance={distance}
        speed={speed}
      />

      {/* Main HMI Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center 180° Radar Arc */}
        <div className="lg:col-span-5 flex flex-col">
          <ProximityArc
            threatZone={threatZone}
            emesrtLevel={emesrtLevel}
            distance={distance}
            rearDistance={rearDistance}
            timeToCollision={timeToCollision}
          />
        </div>

        {/* Right Gauges & Diagnostics */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <TelemetryGauges
            speed={speed}
            rpm={rpm}
            gear={gear}
            engineState={engineState}
            batteryVoltage={healthMetrics.batteryVoltage}
            steeringAngle={steeringAngle}
          />

          {/* Diagnostic Log Console Feed */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                  CAN-BUS DIAGNOSTIC FEED // DGMS COMPLIANT
                </span>
              </div>
              <button
                onClick={toggleMute}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE'}
              </button>
            </div>

            <div className="h-24 overflow-y-auto font-mono text-[11px] space-y-1.5 pr-2">
              {diagnosticLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 font-semibold">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      log.level === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : log.level === 'warn'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
