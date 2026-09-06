'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CloudFog, Eye, Sparkles, Wind, Sliders } from 'lucide-react';

export const FogMiningScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fogDensity, setFogDensity] = useState<number>(85); // 85% fog

  useEffect(() => {
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
      ctx.strokeStyle = 'rgba(255, 184, 0, 0.35)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.72);
      ctx.bezierCurveTo(width * 0.35, height * 0.62, width * 0.65, height * 0.82, width, height * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);

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
      truck1X += 1.2;
      if (truck1X > width + 150) truck1X = -150;
      const truck1Y = height * 0.7 - Math.sin(truck1X * 0.005) * 20;

      // Headlight Beam Cone (Piercing through Fog)
      const headlightGrad = ctx.createRadialGradient(
        truck1X + 60, truck1Y - 10, 10,
        truck1X + 260, truck1Y - 10, 180
      );
      headlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      headlightGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.35)');
      headlightGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = headlightGrad;
      ctx.beginPath();
      ctx.moveTo(truck1X + 50, truck1Y - 15);
      ctx.lineTo(truck1X + 280, truck1Y - 60);
      ctx.lineTo(truck1X + 280, truck1Y + 30);
      ctx.closePath();
      ctx.fill();

      // Truck Body (CAT 797F Mining Dumper Silhouette)
      ctx.fillStyle = '#FFB800'; // CAT Yellow
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
      truck2X -= 0.9;
      if (truck2X < -150) truck2X = width + 150;
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
  }, [fogDensity]);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl overflow-hidden glass-panel border border-slate-700/60 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
      {/* HTML5 Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Scanning Overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />

      {/* Top Left Badge - Live Pit Weather Status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-950/85 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-700/80 shadow-xl">
        <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
        <div className="font-mono">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <CloudFog className="w-4 h-4 text-amber-400" />
            <span>KORBA OPEN-CAST PIT 4B // ZERO-VISIBILITY FOG</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Heavy Dust & Fog Density: <span className="text-amber-400 font-bold">{fogDensity}%</span> | CAT 797F Fleet Operational
          </div>
        </div>
      </div>

      {/* Top Right Fog Control Slider Pill */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 bg-slate-950/85 backdrop-blur-xl px-4 py-2 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-400 font-semibold">SIMULATE FOG:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={fogDensity}
          onChange={e => setFogDensity(parseInt(e.target.value))}
          className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <span className="text-amber-400 font-extrabold w-8 text-right">{fogDensity}%</span>
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/85 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-800 font-mono text-xs shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block shadow-[0_0_10px_rgba(255,184,0,0.8)]" />
            <span className="text-slate-200 font-bold">CAT 797F #402 (MOVING)</span>
          </div>
          <div className="hidden xs:flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-cyan-400 inline-block shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <span className="text-slate-200 font-bold">KOMATSU 400T (HAULING)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span className="tracking-wider uppercase">24GHz mmWave Headlight Radar Beam Active</span>
        </div>
      </div>
    </div>
  );
};
