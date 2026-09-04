'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useVehicle } from '../../context/VehicleContext';

export const KeyboardControls: React.FC = () => {
  const {
    engineState,
    speed,
    steeringAngle,
    truckX,
    setSpeed,
    setSteeringAngle,
    setTruckX,
    setGear,
    setDistance,
    setRearDistance,
    distance,
    rearDistance,
  } = useVehicle();

  // Active key state tracking
  const keys = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Local UI state for HUD key highlights
  const [activeKeys, setActiveKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling when using arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const k = e.key.toLowerCase();
      let changed = false;

      if (k === 'arrowup' || k === 'w') {
        if (!keys.current.up) { keys.current.up = true; changed = true; }
      }
      if (k === 'arrowdown' || k === 's') {
        if (!keys.current.down) { keys.current.down = true; changed = true; }
      }
      if (k === 'arrowleft' || k === 'a') {
        if (!keys.current.left) { keys.current.left = true; changed = true; }
      }
      if (k === 'arrowright' || k === 'd') {
        if (!keys.current.right) { keys.current.right = true; changed = true; }
      }

      if (changed) {
        setActiveKeys({ ...keys.current });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      let changed = false;

      if (k === 'arrowup' || k === 'w') {
        if (keys.current.up) { keys.current.up = false; changed = true; }
      }
      if (k === 'arrowdown' || k === 's') {
        if (keys.current.down) { keys.current.down = false; changed = true; }
      }
      if (k === 'arrowleft' || k === 'a') {
        if (keys.current.left) { keys.current.left = false; changed = true; }
      }
      if (k === 'arrowright' || k === 'd') {
        if (keys.current.right) { keys.current.right = false; changed = true; }
      }

      if (changed) {
        setActiveKeys({ ...keys.current });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Frame Loop Game Driving Physics
  useFrame((_, delta) => {
    if (engineState !== 'ACTIVE') return;

    let newSpeed = speed;
    let newSteering = steeringAngle;
    let newX = truckX;

    // 1. Forward Acceleration (Up Arrow / W)
    if (keys.current.up) {
      newSpeed = Math.min(40, newSpeed + 16 * delta);
      setGear('D');
    }
    // 2. Reverse / Braking (Down Arrow / S)
    else if (keys.current.down) {
      if (newSpeed > 0) {
        // Active Braking
        newSpeed = Math.max(0, newSpeed - 32 * delta);
      } else {
        // Reverse Drive
        newSpeed = Math.max(-12, newSpeed - 12 * delta);
        setGear('R');
      }
    }
    // 3. Natural Friction Deceleration when no pedal is pressed
    else {
      if (newSpeed > 0) {
        newSpeed = Math.max(0, newSpeed - 10 * delta);
      } else if (newSpeed < 0) {
        newSpeed = Math.min(0, newSpeed + 10 * delta);
      }
      if (Math.abs(newSpeed) < 0.2) {
        newSpeed = 0;
        setGear('P');
      }
    }

    // 4. Left Steering & Lateral Motion (Left Arrow / A)
    if (keys.current.left) {
      newSteering = Math.max(-30, newSteering - 70 * delta);
      newX = Math.max(-4.8, newX - 4.5 * delta);
    }
    // 5. Right Steering & Lateral Motion (Right Arrow / D)
    else if (keys.current.right) {
      newSteering = Math.min(30, newSteering + 70 * delta);
      newX = Math.min(4.8, newX + 4.5 * delta);
    }
    // 6. Auto-Center Steering when no turn key is pressed
    else {
      newSteering = newSteering * Math.max(0, 1 - 8 * delta);
      if (Math.abs(newSteering) < 0.5) newSteering = 0;
    }

    // Update Telemetry State
    if (Math.abs(newSpeed - speed) > 0.05) setSpeed(parseFloat(newSpeed.toFixed(1)));
    if (Math.abs(newSteering - steeringAngle) > 0.5) setSteeringAngle(Math.round(newSteering));
    if (Math.abs(newX - truckX) > 0.02) setTruckX(parseFloat(newX.toFixed(2)));

    // 7. Dynamic Hazard Proximity Calculation while driving
    if (Math.abs(newSpeed) > 0) {
      // Driving forward reduces forward distance & increases rear distance
      const distDelta = (newSpeed * delta * 0.15);
      const nextFwdDist = Math.max(0.6, Math.min(15.0, distance - distDelta));
      const nextRearDist = Math.max(0.6, Math.min(15.0, rearDistance + distDelta));

      if (Math.abs(nextFwdDist - distance) > 0.05) setDistance(parseFloat(nextFwdDist.toFixed(1)));
      if (Math.abs(nextRearDist - rearDistance) > 0.05) setRearDistance(parseFloat(nextRearDist.toFixed(1)));
    }
  });

  return null;
};
