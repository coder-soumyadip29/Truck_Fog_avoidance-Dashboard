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
  const { user, logout, engineState, isMuted, toggleMute, fogVisibility, weatherCondition } = useVehicle();

  if (!user.isLoggedIn) {
    return <LandingHero />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-3 sm:p-4 md:p-6 bg-hex-pattern font-sans relative">
      {/* Top Main Navigation Bar */}
      <header className="w-full glass-panel px-4 sm:px-6 py-3 sm:py-4 rounded-2xl mb-4 sm:mb-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 border border-slate-800/80 shadow-2xl">
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-cyan-300/40 shrink-0">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="font-orbitron text-base sm:text-xl font-black text-white tracking-wider truncate">
                AEGIS<span className="text-cyan-400 text-glow-accent">MINE</span> <span className="text-xs font-mono text-slate-400">// CABIN HMI</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 tracking-wider truncate">
                OPEN-CAST PIT SECTOR 4B // EMESRT LEVEL 9 CAS OS 2.0
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 text-[11px] font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>EXIT</span>
          </button>
        </div>

        {/* Live Network & Audio Status Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto font-mono text-xs">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24GHz RADAR: ONLINE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-[11px]">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>FOG: {fogVisibility}%</span>
          </div>

          {/* Quick Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
              isMuted
                ? 'bg-red-500/10 border-red-500/40 text-red-400'
                : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE'}</span>
          </button>

          {/* User Profile & Sign Out */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-cyan-400/50"
              />
              <div className="text-left font-mono">
                <div className="text-[11px] font-bold text-slate-200">{user.name}</div>
                <div className="text-[9px] text-cyan-400">{user.role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 text-[11px] font-mono transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="space-y-4 sm:space-y-6 max-w-[1700px] mx-auto">
        {/* Engine Ignition Banner */}
        <IgnitionPanel />

        {/* Core Views Split: Left 3D Digital Twin, Right In-Cabin HMI */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          {/* 3D Digital Twin Viewer */}
          <div className="xl:col-span-6">
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
