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
    activeInputs,
    setControlInput,
    triggerEngineStart,
  } = useVehicle();

  // Active keyboard state tracking
  const keys = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const k = e.key.toLowerCase();
      let keyDir: 'up' | 'down' | 'left' | 'right' | null = null;

      if (k === 'arrowup' || k === 'w') keyDir = 'up';
      if (k === 'arrowdown' || k === 's') keyDir = 'down';
      if (k === 'arrowleft' || k === 'a') keyDir = 'left';
      if (k === 'arrowright' || k === 'd') keyDir = 'right';

      if (keyDir) {
        if (!keys.current[keyDir]) {
          keys.current[keyDir] = true;
          setControlInput(keyDir, true);
        }
        if (engineState === 'STANDBY') {
          triggerEngineStart();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      let keyDir: 'up' | 'down' | 'left' | 'right' | null = null;

      if (k === 'arrowup' || k === 'w') keyDir = 'up';
      if (k === 'arrowdown' || k === 's') keyDir = 'down';
      if (k === 'arrowleft' || k === 'a') keyDir = 'left';
      if (k === 'arrowright' || k === 'd') keyDir = 'right';

      if (keyDir) {
        if (keys.current[keyDir]) {
          keys.current[keyDir] = false;
          setControlInput(keyDir, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [engineState, setControlInput, triggerEngineStart]);

  // Frame Loop Game Driving Physics (combining physical keyboard and touch D-Pad)
  useFrame((_, delta) => {
    if (engineState !== 'ACTIVE') return;

    const isUp = keys.current.up || activeInputs.up;
    const isDown = keys.current.down || activeInputs.down;
    const isLeft = keys.current.left || activeInputs.left;
    const isRight = keys.current.right || activeInputs.right;

    let newSpeed = speed;
    let newSteering = steeringAngle;
    let newX = truckX;

    // 1. Forward Acceleration (Up Arrow / W)
    if (isUp) {
      newSpeed = Math.min(40, newSpeed + 18 * delta);
      setGear('D');
    }
    // 2. Reverse / Braking (Down Arrow / S - minimizes acceleration when moving forward, backs up when stopped)
    else if (isDown) {
      if (newSpeed > 0) {
        // Active Braking / Deceleration
        newSpeed = Math.max(0, newSpeed - 34 * delta);
      } else {
        // Reverse Driving
        newSpeed = Math.max(-12, newSpeed - 12 * delta);
        setGear('R');
      }
    }
    // 3. Natural Friction Deceleration when no pedal key is pressed
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
    if (isLeft) {
      newSteering = Math.max(-30, newSteering - 80 * delta);
      newX = Math.max(-4.8, newX - 5.0 * delta);
    }
    // 5. Right Steering & Lateral Motion (Right Arrow / D)
    else if (isRight) {
      newSteering = Math.min(30, newSteering + 80 * delta);
      newX = Math.min(4.8, newX + 5.0 * delta);
    }
    // 6. Auto-Center Steering when no turn key is pressed
    else {
      newSteering = newSteering * Math.max(0, 1 - 9 * delta);
      if (Math.abs(newSteering) < 0.5) newSteering = 0;
    }

    // Update Telemetry State
    if (Math.abs(newSpeed - speed) > 0.05) setSpeed(parseFloat(newSpeed.toFixed(1)));
    if (Math.abs(newSteering - steeringAngle) > 0.5) setSteeringAngle(Math.round(newSteering));
    if (Math.abs(newX - truckX) > 0.02) setTruckX(parseFloat(newX.toFixed(2)));

    // 7. Dynamic Hazard Proximity Calculation while driving
    if (Math.abs(newSpeed) > 0) {
      const distDelta = (newSpeed * delta * 0.15);
      const nextFwdDist = Math.max(0.6, Math.min(15.0, distance - distDelta));
      const nextRearDist = Math.max(0.6, Math.min(15.0, rearDistance + distDelta));

      if (Math.abs(nextFwdDist - distance) > 0.05) setDistance(parseFloat(nextFwdDist.toFixed(1)));
      if (Math.abs(nextRearDist - rearDistance) > 0.05) setRearDistance(parseFloat(nextRearDist.toFixed(1)));
    }
  });

  return null;
};
