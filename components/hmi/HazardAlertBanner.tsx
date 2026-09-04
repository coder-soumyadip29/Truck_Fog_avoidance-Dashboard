'use client';

import React from 'react';
import { ThreatZone, EMESRTLevel } from '../../context/VehicleContext';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HazardAlertBannerProps {
  threatZone: ThreatZone;
  emesrtLevel: EMESRTLevel;
  distance: number;
  speed: number;
}

export const HazardAlertBanner: React.FC<HazardAlertBannerProps> = ({
  threatZone,
  distance,
  speed,
}) => {
  if (threatZone === 'ZONE_3_SAFE') {
    return (
      <div className="w-full glass-panel-safe px-4 py-2.5 rounded-xl flex items-center justify-between font-mono text-xs text-emerald-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold uppercase tracking-wider">
            GREEN SAFE ZONE ACTIVE // EMESRT LEVEL 7 INFORMATIONAL
          </span>
        </div>
        <span className="text-[10px] text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          CLEAR SECTOR: {distance.toFixed(1)}m
        </span>
      </div>
    );
  }

  if (threatZone === 'ZONE_2_WARNING') {
    return (
      <div className="w-full glass-panel-warning px-4 py-2.5 rounded-xl flex items-center justify-between font-mono text-xs text-amber-400 animate-pulse">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="font-bold uppercase tracking-wider">
            ORANGE ZONE BREACH // SUSPICIOUS DANGER ({distance.toFixed(1)}m) - REDUCE SPEED
          </span>
        </div>
        <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/50 font-bold">
          LEVEL 8 ADVISORY ({speed} KM/H)
        </span>
      </div>
    );
  }

  return (
    <div className="w-full glass-panel-danger px-4 py-3 rounded-xl flex items-center justify-between font-mono text-xs text-red-400 animate-strobe-fast">
      <div className="flex items-center gap-2.5">
        <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
        <div>
          <div className="font-extrabold uppercase tracking-widest text-sm text-red-300">
            CRITICAL RED ZONE BREACH // IMMEDIATE HAZARD (&lt; 2.0m)
          </div>
          <div className="text-[10px] text-red-400/90 font-medium">
            EMESRT LEVEL 9 AUTOMATIC INTERVENTION ENGAGED — EMERGENCY BRAKING ACTIVE
          </div>
        </div>
      </div>
      <div className="px-3 py-1 bg-red-600 text-white rounded font-bold text-xs tracking-wider animate-pulse">
        EMERGENCY STOP
      </div>
    </div>
  );
};
