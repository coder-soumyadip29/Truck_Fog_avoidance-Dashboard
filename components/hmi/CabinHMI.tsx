'use client';

import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { ProximityArc } from './ProximityArc';
import { TelemetryGauges } from './TelemetryGauges';
import { HazardAlertBanner } from './HazardAlertBanner';
import { PitMap } from './PitMap';
import { Terminal, Volume2, VolumeX, Radio, Map, Truck, ShieldAlert } from 'lucide-react';

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
    nearestVehicle,
    nearestHazard,
  } = useVehicle();

  const [hmiTab, setHmiTab] = useState<'RADAR_ARC' | 'PIT_MAP'>('RADAR_ARC');

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Top Banner Alert Bar */}
      <HazardAlertBanner
        threatZone={threatZone}
        emesrtLevel={emesrtLevel}
        distance={distance}
        speed={speed}
      />

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between gap-2 px-1 font-mono text-xs">
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setHmiTab('RADAR_ARC')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              hmiTab === 'RADAR_ARC'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>24GHz RADAR ARC</span>
          </button>
          <button
            onClick={() => setHmiTab('PIT_MAP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              hmiTab === 'PIT_MAP'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS PIT & HAZARD MAP</span>
          </button>
        </div>

        {/* Nearest Truck Live Proximity Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px]">
          <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
          <span className="text-slate-400">NEAREST FLEET:</span>
          <span className="font-bold text-white">{nearestVehicle.name.split(' ')[0]} {nearestVehicle.name.split(' ').pop()}</span>
          <span className="text-cyan-300 font-bold">({nearestVehicle.distance.toFixed(1)}m)</span>
        </div>
      </div>

      {/* Main HMI Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center View Component (Radar Arc OR Pit Map) */}
        <div className="lg:col-span-5 flex flex-col">
          {hmiTab === 'RADAR_ARC' ? (
            <ProximityArc
              threatZone={threatZone}
              emesrtLevel={emesrtLevel}
              distance={distance}
              rearDistance={rearDistance}
              timeToCollision={timeToCollision}
            />
          ) : (
            <PitMap />
          )}
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
