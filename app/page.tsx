'use client';

import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { LandingHero } from '../components/landing/LandingHero';
import { IgnitionPanel } from '../components/engine/IgnitionPanel';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { CabinHMI } from '../components/hmi/CabinHMI';
import { DemoSimPanel } from '../components/simulator/DemoSimPanel';
import { Shield, LogOut, User, Radio, Cpu } from 'lucide-react';

export default function Home() {
  const { user, logout, engineState } = useVehicle();

  if (!user.isLoggedIn) {
    return <LandingHero />;
  }

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-100 p-4 md:p-6 bg-hex-pattern font-sans relative">
      {/* Top Main Navigation Bar */}
      <header className="w-full glass-panel px-6 py-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-extrabold text-white tracking-wide">
              AEGIS<span className="text-cyan-400">MINE</span> // CABIN HMI
            </h1>
            <p className="text-[10px] font-mono text-slate-400">
              OPEN-CAST PIT SECTOR 4B // EMESRT LEVEL 9 CAS
            </p>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
            />
            <div className="text-left font-mono">
              <div className="text-xs font-bold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-cyan-400">{user.role}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 text-xs font-mono transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="space-y-6 max-w-[1700px] mx-auto">
        {/* Engine Ignition Banner */}
        <IgnitionPanel />

        {/* Core Views Split: Left 3D Digital Twin, Right In-Cabin HMI */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* 3D Digital Twin Viewer */}
          <div className="xl:col-span-6 h-[560px]">
            <DigitalTwinCanvas />
          </div>

          {/* In-Cabin HMI & Telemetry */}
          <div className="xl:col-span-6">
            <CabinHMI />
          </div>
        </div>
      </main>

      {/* Floating Demo Simulation Controls */}
      <DemoSimPanel />
    </div>
  );
}
