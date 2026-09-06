'use client';

import React, { useState } from 'react';
import { GoogleAuthModal } from './GoogleAuthModal';
import { ComplianceSection } from './ComplianceSection';
import { Shield, Radio, Activity, ArrowRight, Zap, CheckCircle2, CloudFog } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-100 relative overflow-hidden bg-hex-pattern">
      {/* Glow Ambient Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-mono text-lg sm:text-xl font-extrabold tracking-tight text-white">
              AEGIS<span className="text-cyan-400">MINE</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider truncate">
              ZERO-VISIBILITY MINING CAS // EMESRT L9
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DGMS PIT NETWORK: ACTIVE
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-[11px] sm:text-xs shadow-lg shadow-cyan-500/25 border border-cyan-300 transition-all hover:scale-105 active:scale-95 shrink-0"
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
            <span>SIGN IN</span>
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12 pb-12 sm:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-400 text-[10px] sm:text-xs font-mono font-semibold max-w-full truncate">
              <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse shrink-0" />
              <span className="truncate">24GHz mmWAVE RADAR & 3D DIGITAL TWIN</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Zero-Visibility <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                Mining Collision Avoidance
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Engineered for extreme dust, heavy fog, and dark open-cast pit operations. AegisMine provides continuous 360° Proximity Awareness, 2-second Ignition Diagnostics, and EMESRT Level 9 Automatic Brake Intervention.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-extrabold text-xs sm:text-sm shadow-[0_0_35px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
              >
                <span>ENTER CABIN DASHBOARD</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl glass-panel text-slate-300 font-mono text-[11px] sm:text-xs border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DGMS APPROVED SAFETY SYSTEM</span>
              </div>
            </div>

            {/* Live Pit Stats Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-slate-800/80 font-mono">
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-cyan-400">2,480+</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400">ACTIVE SHIFTS</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-emerald-400">0</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400 font-bold">CAS COLLISIONS</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-amber-400">99.9%</div>
                <div className="text-[9px] sm:text-[11px] text-slate-400">RADAR UPTIME</div>
              </div>
            </div>
          </div>

          {/* Right Column Preview Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    LIVE HMI TELEMETRY PREVIEW
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  STANDBY
                </span>
              </div>

              {/* Graphic Mock */}
              <div className="relative h-64 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                <div className="w-32 h-32 rounded-full border-4 border-cyan-500/40 border-t-cyan-400 animate-spin-slow flex items-center justify-center">
                  <CloudFog className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="mt-4 font-mono text-xs font-bold text-slate-200">
                  CAT 797F HEAVY DUMPER // SECTOR 4B
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Click 'SIGN IN WITH GOOGLE' to launch HMI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <ComplianceSection />

      {/* Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
