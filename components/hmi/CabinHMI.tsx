'use client';

import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { ProximityArc } from './ProximityArc';
import { TelemetryGauges } from './TelemetryGauges';
import { HazardAlertBanner } from './HazardAlertBanner';
import { PitMap } from './PitMap';
import { Terminal, Volume2, VolumeX, Radio, Map, Truck, ShieldAlert } from 'lucide-react';

import { audioSynth } from '../../utils/audioSynth';

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
    addDiagnosticLog,
    wipersActive,
    toggleWipers,
    lidarHeatmapMode,
    toggleLidarHeatmap,
    fatigueState,
    triggerFatigueSimulation,
    resetFatigue,
    teleOpActive,
    toggleTeleOp,
    roadsideScenario,
  } = useVehicle();

  const [hmiTab, setHmiTab] = useState<'RADAR_ARC' | 'PIT_MAP'>('RADAR_ARC');

  const handleAirHorn = () => {
    audioSynth.playTruckHorn();
    addDiagnosticLog('DRIVER ACTUATED: Dual Air Horn Warning Bark.', 'info');
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Top Banner Alert Bar */}
      <HazardAlertBanner
        threatZone={threatZone}
        emesrtLevel={emesrtLevel}
        distance={distance}
        speed={speed}
        roadsideScenario={roadsideScenario}
      />

      {/* View Switcher & Interactive Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
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

        {/* Interactive Features Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* WIPERS TOGGLE */}
          <button
            onClick={() => {
              toggleWipers();
              audioSynth.playAirBrakeHiss();
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              wipersActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Pneumatic Windshield Wipers"
          >
            🌧️ WIPERS {wipersActive ? 'ON' : 'OFF'}
          </button>

          {/* 3D LIDAR SCAN TOGGLE */}
          <button
            onClick={toggleLidarHeatmap}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              lidarHeatmapMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 24GHz LiDAR Laser Scan Heatmap"
          >
            📡 LIDAR {lidarHeatmapMode ? 'ON' : 'OFF'}
          </button>

          {/* AI DRIVER FATIGUE TRIGGER */}
          <button
            onClick={() => {
              if (fatigueState === 'NORMAL') {
                triggerFatigueSimulation();
                audioSynth.playTruckHorn();
              } else {
                resetFatigue();
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              fatigueState !== 'NORMAL'
                ? 'bg-red-500/20 text-red-400 border-red-500 animate-bounce'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Simulate AI Driver Fatigue Eye-Blink Alert"
          >
            👁️ FATIGUE {fatigueState !== 'NORMAL' ? 'ALARM!' : 'TEST'}
          </button>

          {/* 5G TELE-OP OVERRIDE TOGGLE */}
          <button
            onClick={toggleTeleOp}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              teleOpActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 5G Remote Control Override"
          >
            🛰️ 5G TELE-OP
          </button>

          {/* AIR HORN HMI Button */}
          <button
            onClick={handleAirHorn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold transition-all hover:scale-105 active:scale-95 text-[11px]"
            title="Actuate Heavy Truck Air Horn"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>AIR HORN</span>
          </button>
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
