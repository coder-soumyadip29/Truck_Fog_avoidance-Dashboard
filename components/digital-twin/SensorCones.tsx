'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThreatZone } from '../../context/VehicleContext';

interface SensorConesProps {
  threatZone: ThreatZone;
  obstacleDistance: number;
  rearThreatZone?: ThreatZone;
  rearObstacleDistance?: number;
}

export const SensorCones: React.FC<SensorConesProps> = ({
  threatZone,
  obstacleDistance,
  rearThreatZone = 'ZONE_3_SAFE',
  rearObstacleDistance = 11.0,
}) => {
  const fwdConeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const fwdRingRef = useRef<THREE.Mesh>(null);

  const rearConeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const rearRingRef = useRef<THREE.Mesh>(null);

  // Helper to determine cone color
  const getConeColor = (zone: ThreatZone) => {
    if (zone === 'ZONE_1_EMERGENCY') return '#FF1744';
    if (zone === 'ZONE_2_WARNING') return '#FFB300';
    return '#00E676';
  };

  const fwdColor = getConeColor(threatZone);
  const rearColor = getConeColor(rearThreatZone);

  // Animate pulse opacity and radar scanning sweep rings for both cones
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Forward Cone Animation
    if (fwdConeMatRef.current) {
      if (threatZone === 'ZONE_1_EMERGENCY') {
        fwdConeMatRef.current.opacity = Math.sin(t * 18) * 0.35 + 0.55;
      } else if (threatZone === 'ZONE_2_WARNING') {
        fwdConeMatRef.current.opacity = Math.sin(t * 8) * 0.2 + 0.4;
      } else {
        fwdConeMatRef.current.opacity = 0.28;
      }
    }
    if (fwdRingRef.current) {
      const zPos = 3.2 + ((t * 8) % (obstacleDistance + 2));
      fwdRingRef.current.position.z = zPos;
      fwdRingRef.current.scale.setScalar(1 + (zPos - 3.2) * 0.25);
    }

    // Rear Cone Animation
    if (rearConeMatRef.current) {
      if (rearThreatZone === 'ZONE_1_EMERGENCY') {
        rearConeMatRef.current.opacity = Math.sin(t * 18) * 0.35 + 0.55;
      } else if (rearThreatZone === 'ZONE_2_WARNING') {
        rearConeMatRef.current.opacity = Math.sin(t * 8) * 0.2 + 0.4;
      } else {
        rearConeMatRef.current.opacity = 0.28;
      }
    }
    if (rearRingRef.current) {
      const zPos = -3.2 - ((t * 8) % (rearObstacleDistance + 2));
      rearRingRef.current.position.z = zPos;
      rearRingRef.current.scale.setScalar(1 + (Math.abs(zPos) - 3.2) * 0.25);
    }
  });

  const fwdConeLength = Math.max(3, obstacleDistance + 1.5);
  const fwdConeRadius = fwdConeLength * 0.45;

  const rearConeLength = Math.max(3, rearObstacleDistance + 1.5);
  const rearConeRadius = rearConeLength * 0.45;

  return (
    <group>
      {/* --- FORWARD 24GHz mmWAVE RADAR BEAM --- */}
      <group position={[0, 1.0, 3.2]}>
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, fwdConeLength / 2]}>
          <mesh>
            <cylinderGeometry args={[fwdConeRadius, 0.2, fwdConeLength, 32, 1, true]} />
            <meshBasicMaterial
              ref={fwdConeMatRef}
              color={fwdColor}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Forward Scanning Ring */}
        <mesh ref={fwdRingRef} position={[0, 0, 1]}>
          <ringGeometry args={[0.3, 0.45, 32]} />
          <meshBasicMaterial color={fwdColor} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Forward Laser Beam */}
        <mesh position={[0, 0.2, fwdConeLength / 2]}>
          <boxGeometry args={[0.04, 0.04, fwdConeLength]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* --- REAR 24GHz mmWAVE RADAR BEAM (BACK OF TRUCK) --- */}
      <group position={[0, 1.0, -3.2]}>
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -rearConeLength / 2]}>
          <mesh>
            <cylinderGeometry args={[rearConeRadius, 0.2, rearConeLength, 32, 1, true]} />
            <meshBasicMaterial
              ref={rearConeMatRef}
              color={rearColor}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Rear Scanning Ring */}
        <mesh ref={rearRingRef} position={[0, 0, -1]}>
          <ringGeometry args={[0.3, 0.45, 32]} />
          <meshBasicMaterial color={rearColor} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Rear Laser Beam */}
        <mesh position={[0, 0.2, -rearConeLength / 2]}>
          <boxGeometry args={[0.04, 0.04, rearConeLength]} />
          <meshBasicMaterial color="#FFB300" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
