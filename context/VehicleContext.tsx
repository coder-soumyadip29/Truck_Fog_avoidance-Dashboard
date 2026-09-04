'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { audioSynth } from '../utils/audioSynth';

export type EngineState = 'STANDBY' | 'SWEEPING' | 'ACTIVE' | 'FAULT';
export type ThreatZone = 'ZONE_3_SAFE' | 'ZONE_2_WARNING' | 'ZONE_1_EMERGENCY';
export type EMESRTLevel = 'LEVEL_7' | 'LEVEL_8' | 'LEVEL_9';
export type GearPosition = 'P' | 'R' | 'N' | 'D';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: 'Chief Safety Engineer' | 'Fleet Operator' | 'DGMS Pit Inspector';
  sector: string;
  isLoggedIn: boolean;
}

export interface HealthMetrics {
  engineTemp: number; // °C
  brakeWear: number;  // %
  tirePressure: number; // PSI
  fuelLevel: number; // %
  batteryVoltage: number; // V
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
}

export interface VehicleContextType {
  user: UserProfile;
  engineState: EngineState;
  speed: number;
  distance: number;
  rearDistance: number;
  rpm: number;
  fogVisibility: number;
  steeringAngle: number;
  gear: GearPosition;
  timeToCollision: number;
  threatZone: ThreatZone;
  rearThreatZone: ThreatZone;
  emesrtLevel: EMESRTLevel;
  healthMetrics: HealthMetrics;
  selectedHealthNode: string | null;
  diagnosticLogs: DiagnosticLog[];
  isSimPanelOpen: boolean;
  isMuted: boolean;
  radarMode: 'DUAL' | 'FORWARD' | 'REAR';
  
  // Actions
  loginWithGoogle: (role: UserProfile['role'], name?: string, email?: string) => void;
  logout: () => void;
  triggerEngineStart: () => void;
  triggerEngineStop: () => void;
  setSpeed: (speed: number) => void;
  setDistance: (distance: number) => void;
  setRearDistance: (distance: number) => void;
  setFogVisibility: (fog: number) => void;
  setSteeringAngle: (angle: number) => void;
  setGear: (gear: GearPosition) => void;
  setSelectedHealthNode: (nodeId: string | null) => void;
  setRadarMode: (mode: 'DUAL' | 'FORWARD' | 'REAR') => void;
  applyPreset: (preset: 'FOG_HAZARD' | 'RESET_ROUTE' | 'ENGINE_FAULT' | 'AUTO_BRAKE') => void;
  toggleSimPanel: () => void;
  toggleMute: () => void;
  addDiagnosticLog: (message: string, level?: DiagnosticLog['level']) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User state
  const [user, setUser] = useState<UserProfile>({
    name: 'Vikramaditya Sharma',
    email: 'v.sharma@aegismine.dgms.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    role: 'Chief Safety Engineer',
    sector: 'Korba Open-Cast Pit 4B',
    isLoggedIn: false,
  });

  // Engine state
  const [engineState, setEngineState] = useState<EngineState>('STANDBY');

  // Telemetry state
  const [speed, setSpeed] = useState<number>(0);
  const [distance, setDistance] = useState<number>(8.5); // meters (forward)
  const [rearDistance, setRearDistance] = useState<number>(11.0); // meters (rear)
  const [radarMode, setRadarMode] = useState<'DUAL' | 'FORWARD' | 'REAR'>('DUAL');
  const [rpm, setRpm] = useState<number>(0);
  const [fogVisibility, setFogVisibility] = useState<number>(20); // %
  const [steeringAngle, setSteeringAngle] = useState<number>(0); // deg
  const [gear, setGear] = useState<GearPosition>('P');
  const [selectedHealthNode, setSelectedHealthNode] = useState<string | null>(null);
  const [isSimPanelOpen, setIsSimPanelOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Health Metrics
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    engineTemp: 88,
    brakeWear: 12,
    tirePressure: 112,
    fuelLevel: 84,
    batteryVoltage: 28.4,
  });

  // Diagnostic Logs
  const [diagnosticLogs, setDiagnosticLogs] = useState<DiagnosticLog[]>([
    { id: '1', timestamp: '13:58:01', level: 'info', message: 'CAN-Bus J1939 telemetry online.' },
    { id: '2', timestamp: '13:58:02', level: 'info', message: 'Dual 24GHz mmWave Radars (FWD + REAR) calibrated. EMESRT L9 active.' },
  ]);

  const addDiagnosticLog = useCallback((message: string, level: DiagnosticLog['level'] = 'info') => {
    const newLog: DiagnosticLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      message,
    };
    setDiagnosticLogs(prev => [newLog, ...prev.slice(0, 14)]);
  }, []);

  // Compute EMESRT Threat Zones (Forward & Rear)
  let threatZone: ThreatZone = 'ZONE_3_SAFE';
  let emesrtLevel: EMESRTLevel = 'LEVEL_7';

  if (distance < 2.0) {
    threatZone = 'ZONE_1_EMERGENCY';
    emesrtLevel = 'LEVEL_9'; // Intervention / Auto Brake
  } else if (distance <= 5.0) {
    threatZone = 'ZONE_2_WARNING';
    emesrtLevel = 'LEVEL_8'; // Advisory
  }

  let rearThreatZone: ThreatZone = 'ZONE_3_SAFE';
  if (rearDistance < 2.0) {
    rearThreatZone = 'ZONE_1_EMERGENCY';
    if (emesrtLevel !== 'LEVEL_9') emesrtLevel = 'LEVEL_9';
  } else if (rearDistance <= 5.0) {
    rearThreatZone = 'ZONE_2_WARNING';
    if (emesrtLevel === 'LEVEL_7') emesrtLevel = 'LEVEL_8';
  }

  // Calculate Time-To-Collision (TTC)
  const speedInMps = Math.max(speed * 0.277778, 0.01);
  const timeToCollision = parseFloat((distance / speedInMps).toFixed(1));

  // Audio warning effects loop
  useEffect(() => {
    if (engineState !== 'ACTIVE') return;

    if (threatZone === 'ZONE_1_EMERGENCY') {
      audioSynth.playEmergencyAlarm();
      // Level 9 Automatic Brake Intervention
      if (speed > 0) {
        const timer = setTimeout(() => {
          setSpeed(prev => Math.max(0, parseFloat((prev - 8).toFixed(1))));
        }, 300);
        return () => clearTimeout(timer);
      }
    } else if (threatZone === 'ZONE_2_WARNING') {
      const interval = Math.max(200, Math.min(800, (distance - 2) * 200));
      const timer = setInterval(() => {
        audioSynth.playProximityBeep(distance);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [engineState, threatZone, distance, speed]);

  // Auth Functions
  const loginWithGoogle = (role: UserProfile['role'], name?: string, email?: string) => {
    setUser({
      name: name || (role === 'Chief Safety Engineer' ? 'Vikramaditya Sharma' : 'Rajesh Kumar'),
      email: email || 'v.sharma@aegismine.dgms.gov.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      role,
      sector: 'Korba Open-Cast Pit 4B',
      isLoggedIn: true,
    });
    addDiagnosticLog(`Operator logged in: ${name || 'Vikramaditya Sharma'} (${role})`, 'info');
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setEngineState('STANDBY');
    setSpeed(0);
    setRpm(0);
    setGear('P');
    addDiagnosticLog('Operator signed out. HMI returned to Standby.', 'warn');
  };

  // Engine Start / Stop
  const triggerEngineStart = () => {
    if (engineState === 'ACTIVE' || engineState === 'SWEEPING') return;

    setEngineState('SWEEPING');
    audioSynth.playEngineStartup();
    addDiagnosticLog('ENGINE IGNITION STARTED - Performing 2s Gauge Sweep & Diagnostic Ping...', 'info');

    // 2s Gauge Sweep Simulation
    let sweepProgress = 0;
    const sweepInterval = setInterval(() => {
      sweepProgress += 0.05;
      if (sweepProgress <= 0.5) {
        setRpm(Math.round(sweepProgress * 2 * 3500));
        setSpeed(Math.round(sweepProgress * 2 * 40));
      } else {
        setRpm(Math.round((1 - (sweepProgress - 0.5) * 2) * 2700 + 800));
        setSpeed(Math.round((1 - (sweepProgress - 0.5) * 2) * 25));
      }
    }, 50);

    setTimeout(() => {
      clearInterval(sweepInterval);
      setEngineState('ACTIVE');
      setRpm(850); // Engine Idle RPM
      setSpeed(14); // Cruising speed
      setGear('D');
      audioSynth.playDiagnosticPing();
      addDiagnosticLog('ENGINE RUNNING - All 24GHz Radars & EMESRT CAS Systems ONLINE.', 'info');
    }, 2000);
  };

  const triggerEngineStop = () => {
    setEngineState('STANDBY');
    setSpeed(0);
    setRpm(0);
    setGear('P');
    addDiagnosticLog('Engine stopped. CAS power in Low-Power Standby Mode.', 'warn');
  };

  const applyPreset = (preset: 'FOG_HAZARD' | 'RESET_ROUTE' | 'ENGINE_FAULT' | 'AUTO_BRAKE') => {
    switch (preset) {
      case 'FOG_HAZARD':
        setFogVisibility(92);
        setSpeed(26);
        setDistance(3.4);
        addDiagnosticLog('DEMO PRESET APPLIED: Zero-Visibility Heavy Pit Fog Hazard.', 'warn');
        break;
      case 'RESET_ROUTE':
        setFogVisibility(15);
        setSpeed(12);
        setDistance(11.5);
        setEngineState('ACTIVE');
        addDiagnosticLog('DEMO PRESET APPLIED: Pit Haul Route Reset.', 'info');
        break;
      case 'ENGINE_FAULT':
        setEngineState('FAULT');
        setSpeed(0);
        setRpm(0);
        setHealthMetrics(prev => ({ ...prev, engineTemp: 118 }));
        addDiagnosticLog('CRITICAL FAULT SIMULATION: Engine Overheating 118°C.', 'critical');
        break;
      case 'AUTO_BRAKE':
        setSpeed(32);
        setDistance(1.4); // Immediate Zone 1 trigger
        addDiagnosticLog('EMESRT L9 DEMO: Rapid obstacle approach triggered Level 9 Emergency Stop.', 'critical');
        break;
    }
  };

  const toggleSimPanel = () => setIsSimPanelOpen(prev => !prev);
  const toggleMute = () => {
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
  };

  return (
    <VehicleContext.Provider
      value={{
        user,
        engineState,
        speed,
        distance,
        rearDistance,
        rpm,
        fogVisibility,
        steeringAngle,
        gear,
        timeToCollision,
        threatZone,
        rearThreatZone,
        emesrtLevel,
        healthMetrics,
        selectedHealthNode,
        diagnosticLogs,
        isSimPanelOpen,
        isMuted,
        radarMode,
        loginWithGoogle,
        logout,
        triggerEngineStart,
        triggerEngineStop,
        setSpeed,
        setDistance,
        setRearDistance,
        setFogVisibility,
        setSteeringAngle,
        setGear,
        setSelectedHealthNode,
        setRadarMode,
        applyPreset,
        toggleSimPanel,
        toggleMute,
        addDiagnosticLog,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
