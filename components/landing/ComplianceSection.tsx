'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, Cpu, Radio, ShieldAlert, Award } from 'lucide-react';

export const ComplianceSection: React.FC = () => {
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          EMESRT Level 9 & DGMS Certified Protection
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm">
          AegisMine satisfies global surface mining safety protocols for open-cast pit dumper trucks, excavators, and light utility vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};
