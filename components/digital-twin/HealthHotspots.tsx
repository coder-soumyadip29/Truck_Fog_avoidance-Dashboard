'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useVehicle } from '../../context/VehicleContext';

export const HealthHotspots: React.FC = () => {
  const { healthMetrics, selectedHealthNode, setSelectedHealthNode } = useVehicle();

  const nodes = [
    {
      id: 'engine',
      name: 'Cat C175-16 Engine',
      position: [0, 2.0, 2.4] as [number, number, number],
      val: `${healthMetrics.engineTemp}°C`,
      label: 'TEMP',
      status: healthMetrics.engineTemp > 105 ? 'CRITICAL' : 'OPTIMAL',
    },
    {
      id: 'brakes',
      name: 'Hydraulic Disc Brakes',
      position: [1.9, 0.4, 1.8] as [number, number, number],
      val: `${healthMetrics.brakeWear}%`,
      label: 'WEAR',
      status: healthMetrics.brakeWear > 50 ? 'WARN' : 'GOOD',
    },
    {
      id: 'tires',
      name: 'Bridgestone 59/80R63',
      position: [-1.9, 0.4, -1.8] as [number, number, number],
      val: `${healthMetrics.tirePressure} PSI`,
      label: 'PRESSURE',
      status: 'NORMAL',
    },
    {
      id: 'fuel',
      name: 'Diesel Storage Cell',
      position: [1.6, 1.0, -0.6] as [number, number, number],
      val: `${healthMetrics.fuelLevel}%`,
      label: 'FUEL',
      status: healthMetrics.fuelLevel < 20 ? 'LOW' : 'GOOD',
    },
  ];

  return (
    <group>
      {nodes.map(node => {
        const isSelected = selectedHealthNode === node.id;
        return (
          <group key={node.id} position={node.position}>
            <Html center distanceFactor={14}>
              <div className="relative group cursor-pointer select-none">
                {/* Hotspot Pulse Node */}
                <button
                  onClick={() => setSelectedHealthNode(isSelected ? null : node.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-cyan-400 ring-4 ring-cyan-500/50 scale-125'
                      : 'bg-slate-900/90 border border-cyan-400/60 hover:scale-110 hover:border-cyan-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                </button>

                {/* Hotspot Hover / Selected Card */}
                <div
                  className={`absolute left-7 top-1/2 -translate-y-1/2 min-w-[140px] p-2.5 rounded-lg glass-panel text-xs transition-all duration-300 ${
                    isSelected
                      ? 'opacity-100 scale-100 pointer-events-auto ring-1 ring-cyan-400'
                      : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {node.label} NODE
                  </div>
                  <div className="text-slate-200 font-semibold text-xs mt-0.5">{node.name}</div>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-700/50">
                    <span className="text-sm font-mono font-bold text-white">{node.val}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                        node.status === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
