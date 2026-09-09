'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Cpu, Radio, ShieldAlert, Award, Sliders, CheckCircle2 } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';

export const ComplianceSection: React.FC = () => {
  const [testSpeed, setTestSpeed] = useState(25); // km/h
  const stoppingDistance = (testSpeed * 0.45).toFixed(1);
  const emesrtState = testSpeed > 20 ? 'LEVEL_9_ACTIVE' : testSpeed > 10 ? 'LEVEL_8_WARNING' : 'LEVEL_7_MONITORING';

  const levels = [
    {
      level: 'EMESRT LEVEL 7',
      title: 'Informative Operator Display',
      desc: '360° radar and GPS telemetry provides continuous real-time visual situational awareness of surrounding pit obstacles.',
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400',
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
    },
    {
      level: 'EMESRT LEVEL 8',
      title: 'Advisory Warning System',
      desc: 'Predictive Time-to-Collision (TTC) algorithm calculates speed vectors and triggers pulsing audio-visual alerts when approaching danger zones.',
      color: 'border-amber-500/40 bg-amber-500/5 text-amber-400',
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
    },
    {
      level: 'EMESRT LEVEL 9',
      title: 'Automatic Intervention (Auto-Brake)',
      desc: 'Direct CAN-Bus interface initiates mandatory hydraulic retarder braking and throttle overrides when impact distance falls below 2.0 meters.',
      color: 'border-red-500/40 bg-red-500/5 text-red-400',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
    },
  ];

  return (
    <div className="w-full py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Award className="w-4 h-4" /> REGULATORY COMPLIANCE ARCHITECTURE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-orbitron">
          EMESRT Level 9 & DGMS Certified Protection
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm">
          AegisMine satisfies global surface mining safety protocols for open-cast pit dumper trucks, excavators, and light utility vehicles.
        </p>
      </div>

      {/* Levels Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {levels.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${item.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-black/40 border border-current">
                {item.level}
              </span>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Level 9 Hydraulic Brake Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-accent border border-cyan-500/40 max-w-4xl mx-auto shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 font-mono">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              INTERACTIVE EMESRT LEVEL 9 BRAKE CALCULATOR
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              emesrtState === 'LEVEL_9_ACTIVE'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {emesrtState.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-6">
          <div className="md:col-span-7 space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-2">
                <span>SIMULATED HAUL TRUCK SPEED:</span>
                <span className="text-cyan-400 font-extrabold text-sm">{testSpeed} KM/H</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={testSpeed}
                onChange={e => {
                  setTestSpeed(parseInt(e.target.value));
                  if (parseInt(e.target.value) > 30) audioSynth.playAirBrakeHiss();
                }}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] pt-2">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500">REQUIRED HYDRAULIC STOPPING DISTANCE:</div>
                <div className="text-emerald-400 font-bold text-base mt-0.5">{stoppingDistance} METERS</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500">CAN-BUS BRAKE INTERVENTION LATENCY:</div>
                <div className="text-cyan-300 font-bold text-base mt-0.5">&lt; 15 MILLISECONDS</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pb-1 border-b border-slate-800">
              <CheckCircle2 className="w-4 h-4" />
              DGMS MANDATE COMPLIANT
            </div>
            <div className="flex justify-between text-slate-400">
              <span>CAN-Bus Interface:</span>
              <span className="text-white font-bold">J1939 Mining Standard</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Brake Overrides:</span>
              <span className="text-cyan-400 font-bold">Retarder & Hydraulic Line</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sensor Fusion:</span>
              <span className="text-amber-400 font-bold">24GHz mmWave + LiDAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
