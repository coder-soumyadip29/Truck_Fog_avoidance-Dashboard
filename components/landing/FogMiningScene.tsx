'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CloudFog, Eye, Sparkles, Wind, Sliders, Volume2, ShieldAlert, Radio, Activity, Box, Play } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';
import { useVehicle } from '../../context/VehicleContext';

export const FogMiningScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fogDensity, setFogDensity] = useState<number>(85); // 85% fog
  const [activeTab, setActiveTab] = useState<'RADAR_FOG' | 'TELEMETRY'>('RADAR_FOG');
  const [isBrakeTriggered, setIsBrakeTriggered] = useState(false);
  const { loginWithGoogle } = useVehicle();

  const handleBrakeTest = () => {
    setIsBrakeTriggered(true);
    audioSynth.playAirBrakeHiss();
    setTimeout(() => setIsBrakeTriggered(false), 2200);
  };

  const handleHornDemo = () => {
    audioSynth.playTruckHorn();
  };

  const handleGuestLaunch = () => {
    loginWithGoogle('Chief Safety Engineer', 'Guest Operator', 'guest@aegismine.dgms.gov.in');
  };

  useEffect(() => {
    if (activeTab !== 'RADAR_FOG') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fog Particle Generator
    const fogParticles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 45; i++) {
      fogParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 80 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: 0.15 + Math.random() * 0.3,
      });
    }

    // Moving Mining Truck State
    let truck1X = -120;
    let truck2X = width + 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Pit Background Sky & Terraces
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#0B132B');
      bgGrad.addColorStop(1, '#050B14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Terraced Coal Mine Pit Slopes
      ctx.fillStyle = '#08101E';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.35);
      ctx.lineTo(width * 0.3, height * 0.45);
      ctx.lineTo(width * 0.7, height * 0.38);
      ctx.lineTo(width, height * 0.48);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Lower Haul Road Ramp (Dark Charcoal Slope)
      ctx.fillStyle = '#0F1A2E';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.65);
      ctx.bezierCurveTo(width * 0.35, height * 0.55, width * 0.65, height * 0.75, width, height * 0.68);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Haul Road Path Line (Glowing Amber Accent Line)
      ctx.strokeStyle = isBrakeTriggered ? '#FF1744' : 'rgba(255, 184, 0, 0.35)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.35, height * 0.62, width * 0.65, height * 0.82, width, height * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);

      // 24GHz RADAR SCAN RAYS PENETRATING FOG
      const time = Date.now() * 0.003;
      const radarSweepX = (Math.sin(time) * 0.5 + 0.5) * width;
      const sweepGrad = ctx.createLinearGradient(radarSweepX - 80, 0, radarSweepX + 80, 0);
      sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      sweepGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
      sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(radarSweepX - 80, 0, 160, height);

      // Pit Light Tower Beacons
      const lightTowers = [
        { x: width * 0.2, y: height * 0.4 },
        { x: width * 0.8, y: height * 0.32 },
      ];
      lightTowers.forEach(t => {
        // Spotlight cone
        const coneGrad = ctx.createRadialGradient(t.x, t.y, 5, t.x, t.y, 180);
        coneGrad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        coneGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 180, 0, Math.PI * 2);
        ctx.fill();

        // Tower Pin
        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. MOVING MINING TRUCK #1 (CAT 797F Moving Right)
      if (!isBrakeTriggered) {
        truck1X += 1.2;
        if (truck1X > width + 150) truck1X = -150;
      }
      const truck1Y = height * 0.7 - Math.sin(truck1X * 0.005) * 20;

      // Headlight Beam Cone (Piercing through Fog)
      const headlightGrad = ctx.createRadialGradient(
        truck1X + 60, truck1Y - 10, 10,
        truck1X + 260, truck1Y - 10, 180
      );
      headlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      headlightGrad.addColorStop(0.4, isBrakeTriggered ? 'rgba(255, 23, 68, 0.6)' : 'rgba(0, 240, 255, 0.35)');
      headlightGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = headlightGrad;
      ctx.beginPath();
      ctx.moveTo(truck1X + 50, truck1Y - 15);
      ctx.lineTo(truck1X + 280, truck1Y - 60);
      ctx.lineTo(truck1X + 280, truck1Y + 30);
      ctx.closePath();
      ctx.fill();

      // Threat Zone Radar Box around Truck
      ctx.strokeStyle = isBrakeTriggered ? '#FF1744' : '#00E676';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(truck1X - 55, truck1Y - 55, 120, 75);
      ctx.setLineDash([]);

      // Truck Body (CAT 797F Mining Dumper Silhouette)
      ctx.fillStyle = isBrakeTriggered ? '#FF1744' : '#FFB800'; // CAT Yellow / Red Brake
      ctx.fillRect(truck1X - 35, truck1Y - 30, 75, 26);
      ctx.fillStyle = '#1E293B'; // Dump Body Top
      ctx.fillRect(truck1X - 45, truck1Y - 45, 60, 20);
      ctx.fillStyle = '#00F0FF'; // Cabin Window
      ctx.fillRect(truck1X + 20, truck1Y - 38, 14, 12);

      // Wheels
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(truck1X - 25, truck1Y, 10, 0, Math.PI * 2);
      ctx.arc(truck1X + 25, truck1Y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. MOVING MINING TRUCK #2 (Komatsu 400T Moving Left)
      if (!isBrakeTriggered) {
        truck2X -= 0.9;
        if (truck2X < -150) truck2X = width + 150;
      }
      const truck2Y = height * 0.46 - Math.cos(truck2X * 0.004) * 15;

      // Headlight Beam Left
      const headlightGrad2 = ctx.createRadialGradient(
        truck2X - 50, truck2Y - 5, 10,
        truck2X - 220, truck2Y - 5, 160
      );
      headlightGrad2.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      headlightGrad2.addColorStop(0.5, 'rgba(255, 184, 0, 0.3)');
      headlightGrad2.addColorStop(1, 'rgba(255, 184, 0, 0)');

      ctx.fillStyle = headlightGrad2;
      ctx.beginPath();
      ctx.moveTo(truck2X - 40, truck2Y - 10);
      ctx.lineTo(truck2X - 240, truck2Y - 50);
      ctx.lineTo(truck2X - 240, truck2Y + 30);
      ctx.closePath();
      ctx.fill();

      // Truck Body #2
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(truck2X - 35, truck2Y - 25, 70, 22);
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(truck2X - 20, truck2Y, 9, 0, Math.PI * 2);
      ctx.arc(truck2X + 20, truck2Y, 9, 0, Math.PI * 2);
      ctx.fill();

      // 5. VOLUMETRIC DRIFTING HEAVY PIT FOG LAYER
      const fogAlphaMultiplier = (fogDensity / 100);

      fogParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const fogGrad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.radius);
        fogGrad.addColorStop(0, `rgba(148, 163, 184, ${p.alpha * fogAlphaMultiplier * 0.85})`);
        fogGrad.addColorStop(0.6, `rgba(30, 41, 59, ${p.alpha * fogAlphaMultiplier * 0.4})`);
        fogGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');

        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fogDensity, activeTab, isBrakeTriggered]);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[600px] rounded-3xl overflow-hidden glass-panel-accent border border-cyan-500/40 shadow-[0_25px_60px_rgba(0,240,255,0.15)] flex flex-col justify-between p-3 sm:p-4">
      {/* Top Header Mode Tabs & Badge Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('RADAR_FOG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'RADAR_FOG'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>2D RADAR FOG</span>
          </button>
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'TELEMETRY'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>LIVE MATRIX</span>
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="hidden xs:flex items-center gap-2 bg-slate-950/90 px-3 py-1.5 rounded-full border border-emerald-500/40 font-mono text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>24GHz RADAR: PENETRATING FOG</span>
        </div>
      </div>

      {/* Center Display Area */}
      {activeTab === 'RADAR_FOG' ? (
        <div className="relative flex-1 w-full my-2 rounded-2xl overflow-hidden border border-slate-800">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

          {/* Emergency Brake Trigger Overlay Banner */}
          {isBrakeTriggered && (
            <div className="absolute inset-0 bg-red-600/20 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none animate-pulse z-30 font-mono text-center p-4">
              <ShieldAlert className="w-12 h-12 text-red-500 animate-bounce mb-2" />
              <div className="text-xl font-black text-white bg-red-600 px-4 py-1 rounded-xl shadow-2xl">
                EMESRT LEVEL 9 AUTOMATIC BRAKE ENGAGED
              </div>
              <div className="text-xs text-red-300 font-bold mt-2">
                CRITICAL COLLISION PROXIMITY BREACHED (ZONE 1 RED)
              </div>
            </div>
          )}

          {/* Fog Density Slider HUD Bar (Floating Bottom of Canvas) */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 font-mono text-xs shadow-2xl">
            <div className="flex items-center gap-2 text-slate-300">
              <CloudFog className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-[11px]">PIT FOG DENSITY:</span>
              <span className="text-amber-400 font-extrabold">{fogDensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={fogDensity}
              onChange={e => setFogDensity(parseInt(e.target.value))}
              className="w-28 sm:w-36 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>
      ) : (
        /* LIVE TELEMETRY MATRIX TAB */
        <div className="flex-1 my-2 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              CAN-BUS REAL-TIME SAFETY STREAM
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              ISO 21815 COMPLIANT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500">RADAR FREQUENCY:</div>
              <div className="text-cyan-300 font-bold">24.150 GHz (mmWave)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500">PROXIMITY SCAN RANGE:</div>
              <div className="text-cyan-300 font-bold">360° (Forward & Rear)</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500">EMESRT INTERVENTION:</div>
              <div className="text-emerald-400 font-bold">LEVEL 9 AUTOMATIC</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-500">HAUL FLEET LATENCY:</div>
              <div className="text-amber-300 font-bold">12 ms CAN-Bus</div>
            </div>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-300">
            <div className="flex justify-between text-slate-400">
              <span>ACTIVE FLEET VEHICLES:</span>
              <span className="text-white font-bold">CAT 797F #402 & KOMATSU 400T</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>MINE SECTOR:</span>
              <span className="text-cyan-400 font-bold">KORBA COAL PIT SECTOR 4B</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Interactive Sound & Demo Controls Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBrakeTest}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/60 text-red-300 font-bold transition-all hover:scale-105 active:scale-95 text-[11px]"
            title="Test EMESRT Level 9 Brake Intervention"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>BRAKE TEST</span>
          </button>

          <button
            onClick={handleHornDemo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold transition-all hover:scale-105 active:scale-95 text-[11px]"
            title="Sound V16 Air Horn"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>AIR HORN</span>
          </button>
        </div>

        {/* 1-Click Guest Operator Launch */}
        <button
          onClick={handleGuestLaunch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-orbitron font-extrabold text-[11px] shadow-lg shadow-cyan-500/30 border border-cyan-200 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>TRY LIVE CABIN DEMO</span>
        </button>
      </div>
    </div>
  );
};
