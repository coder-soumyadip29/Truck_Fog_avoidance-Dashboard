'use client';

import React, { useState } from 'react';
import { GoogleAuthModal } from './GoogleAuthModal';
import { ComplianceSection } from './ComplianceSection';
import { FogMiningScene } from './FogMiningScene';
import { Shield, Radio, Activity, ArrowRight, Zap, CheckCircle2, CloudFog, Sparkles, Flame, Eye } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden bg-hex-pattern">
      {/* Glow Ambient Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)] border border-cyan-300/40 shrink-0">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-orbitron text-xl sm:text-2xl font-black tracking-wider text-white">
              AEGIS<span className="text-cyan-400 text-glow-accent">MINE</span>
            </h1>
            <p className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase truncate">
              DGMS LEVEL 9 CAS // PIT CAS OS 2.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-emerald-500/40 text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            DGMS PIT NETWORK: ACTIVE
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-orbitron font-extrabold text-xs shadow-[0_0_30px_rgba(0,240,255,0.4)] border border-cyan-200 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
            </svg>
            <span>OPERATOR SIGN IN</span>
          </button>
        </div>
      </nav>

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-10 pb-12 sm:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column - Hero Text */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <span>LIVE COAL MINE FOG REVEAL // 24GHz mmWAVE RADAR</span>
            </div>

            <h1 className="font-orbitron text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
              Zero-Visibility <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-300 text-glow-accent">
                Mining Collision Avoidance
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-sans">
              Engineered for dense pit dust, heavy fog, and dark open-cast coal mines. AegisMine tracks moving heavy mining dump trucks in real-time, providing continuous 360° Proximity Awareness and EMESRT Level 9 Automatic Brake Intervention.
            </p>

            {/* Action Portal Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-orbitron font-black text-sm shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all hover:scale-105 active:scale-95 border border-cyan-100"
              >
                <span>ENTER MINING CABIN</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl glass-panel text-slate-200 font-mono text-xs border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DGMS APPROVED SAFETY SYSTEM</span>
              </div>
            </div>

            {/* Live Pit Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 font-orbitron">
              <div>
                <div className="text-2xl sm:text-4xl font-black text-cyan-400 text-glow-accent">2,480+</div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1">ACTIVE SHIFTS</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black text-emerald-400 text-glow-safe">0</div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 font-bold mt-1">CAS COLLISIONS</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black text-amber-400 text-glow-warning">99.9%</div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1">RADAR UPTIME</div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Animated Foggy Coal Mine Scene */}
          <div className="lg:col-span-6">
            <FogMiningScene />
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <ComplianceSection />

      {/* Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
