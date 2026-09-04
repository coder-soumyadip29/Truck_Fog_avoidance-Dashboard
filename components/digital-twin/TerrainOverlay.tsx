'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrainOverlayProps {
  obstacleDistance: number;
  rearDistance?: number;
  fogVisibility: number;
  threatZone: string;
  rearThreatZone?: string;
  speed?: number;
  engineActive?: boolean;
  truckX?: number;
}

export const TerrainOverlay: React.FC<TerrainOverlayProps> = ({
  obstacleDistance,
  rearDistance = 11.0,
  fogVisibility,
  threatZone,
  rearThreatZone = 'ZONE_3_SAFE',
  speed = 0,
  engineActive = false,
  truckX = 0,
}) => {
  const fogParticlesRef = useRef<THREE.Points>(null);
  const dustParticlesRef = useRef<THREE.Points>(null);
  const roadGridGroupRef = useRef<THREE.Group>(null);
  const redMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const orangeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const roadOffsetRef = useRef(0);

  // Animate pulse effects on Red and Orange threat zone rectangles centered on truck
  useFrame((_, delta) => {
    const t = Date.now() * 0.005;

    // Red Zone Pulse (Very Near)
    if (redMatRef.current) {
      if (threatZone === 'ZONE_1_EMERGENCY' || rearThreatZone === 'ZONE_1_EMERGENCY') {
        redMatRef.current.opacity = Math.sin(t * 8) * 0.25 + 0.45;
      } else {
        redMatRef.current.opacity = 0.18;
      }
    }

    // Orange Zone Pulse (Suspicious Danger)
    if (orangeMatRef.current) {
      if (threatZone === 'ZONE_2_WARNING' || rearThreatZone === 'ZONE_2_WARNING') {
        orangeMatRef.current.opacity = Math.sin(t * 4) * 0.15 + 0.3;
      } else {
        orangeMatRef.current.opacity = 0.12;
      }
    }

    // Fog Particles Drift
    if (fogParticlesRef.current) {
      fogParticlesRef.current.rotation.y += delta * 0.03;
    }

    // Road & Scenery Scrolling Motion when driving
    if (engineActive && speed > 0 && roadGridGroupRef.current) {
      roadOffsetRef.current = (roadOffsetRef.current - speed * delta * 0.3) % 10;
      roadGridGroupRef.current.position.z = roadOffsetRef.current;
    }

    // Dust particles behind wheels when moving
    if (dustParticlesRef.current && engineActive && speed > 0) {
      const positions = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] -= speed * delta * 0.5;
        if (positions[i + 2] < -15) {
          positions[i + 2] = -2.5 + (Math.random() - 0.5) * 1.5;
          positions[i] = (Math.random() - 0.5) * 4;
        }
      }
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Create fog particle positions
  const particleCount = 250;
  const fogPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    fogPos[i] = (Math.random() - 0.5) * 60;
    fogPos[i + 1] = Math.random() * 9;
    fogPos[i + 2] = (Math.random() - 0.5) * 60;
  }

  // Dust particle positions
  const dustCount = 80;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPos[i] = (Math.random() - 0.5) * 3.6;
    dustPos[i + 1] = Math.random() * 0.8;
    dustPos[i + 2] = -2.5 - Math.random() * 8;
  }

  // Forward obstacle mesh position and threat color
  const fwdZ = 3.2 + obstacleDistance;
  let fwdColor = '#00E676';
  if (threatZone === 'ZONE_1_EMERGENCY') fwdColor = '#FF1744';
  else if (threatZone === 'ZONE_2_WARNING') fwdColor = '#FF9100';

  // Rear obstacle mesh position and threat color
  const rearZ = -3.2 - rearDistance;
  let rearColor = '#00E676';
  if (rearThreatZone === 'ZONE_1_EMERGENCY') rearColor = '#FF1744';
  else if (rearThreatZone === 'ZONE_2_WARNING') rearColor = '#FF9100';

  return (
    <group>
      {/* --- SCROLLING ROAD & GROUND GRID --- */}
      <group ref={roadGridGroupRef}>
        <gridHelper args={[80, 80, '#00E5FF', '#1E293B']} position={[0, -0.05, 0]} />

        {/* Asphalt Road Mesh */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 80]} />
          <meshStandardMaterial color="#090D16" roughness={0.9} />
        </mesh>

        {/* Yellow Safety Boundary Lines */}
        {[-6.8, 6.8].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 80]} />
            <meshBasicMaterial color="#FFB300" transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Center Dash Stripes */}
        {[-30, -20, -10, 0, 10, 20, 30].map((zPos, idx) => (
          <mesh key={idx} position={[0, -0.07, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 4]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} />
          </mesh>
        ))}

        {/* Side Safety Posts */}
        {[-35, -25, -15, -5, 5, 15, 25, 35].map((zPos, idx) => (
          <group key={idx}>
            {[-7.2, 7.2].map((xPos, xIdx) => (
              <mesh key={xIdx} position={[xPos, 0.4, zPos]}>
                <cylinderGeometry args={[0.1, 0.1, 1.0, 8]} />
                <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* --- TRUCK-CENTERED COLOR-CODED CONCENTRIC THREAT ZONE RECTANGLES --- */}
      {/* ========================================================================= */}

      {/* 1. GREEN SAFE ZONE RECTANGLE (OUTERMOST - 13m x 22m) */}
      <group position={[truckX, -0.045, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[13, 22]} />
          <meshBasicMaterial color="#00E676" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(13, 22)]} />
          <lineBasicMaterial color="#00E676" linewidth={2} />
        </lineSegments>
      </group>

      {/* 2. ORANGE SUSPICIOUS DANGER ZONE RECTANGLE (MIDDLE - 9m x 14m) */}
      <group position={[truckX, -0.04, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 14]} />
          <meshBasicMaterial ref={orangeMatRef} color="#FF9100" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(9, 14)]} />
          <lineBasicMaterial color="#FF9100" linewidth={2} />
        </lineSegments>
      </group>

      {/* 3. RED HIGH ALARM / IMMEDIATE HAZARD ZONE RECTANGLE (INNERMOST - 5m x 8m) */}
      <group position={[truckX, -0.035, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5, 8]} />
          <meshBasicMaterial ref={redMatRef} color="#FF1744" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(5, 8)]} />
          <lineBasicMaterial color="#FF1744" linewidth={3} />
        </lineSegments>
      </group>

      {/* ========================================================================= */}

      {/* --- FORWARD DETECTED OBSTACLE VEHICLE --- */}
      <group position={[0, 0.7, fwdZ]}>
        <mesh>
          <boxGeometry args={[2.2, 1.6, 3.2]} />
          <meshBasicMaterial color={fwdColor} wireframe />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.4, 3.0]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
        </mesh>
        {[-0.8, 0.8].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0.4, -1.52]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color={fwdColor} emissive={fwdColor} emissiveIntensity={3} />
          </mesh>
        ))}
      </group>

      {/* --- REAR DETECTED OBSTACLE VEHICLE (BEHIND TRUCK) --- */}
      <group position={[0, 0.7, rearZ]}>
        <mesh>
          <boxGeometry args={[2.2, 1.6, 3.2]} />
          <meshBasicMaterial color={rearColor} wireframe />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.4, 3.0]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.5} />
        </mesh>
        {[-0.8, 0.8].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0.4, 1.52]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color={rearColor} emissive={rearColor} emissiveIntensity={3} />
          </mesh>
        ))}
      </group>

      {/* --- DUST TRAIL PARTICLES BEHIND WHEELS WHEN DRIVING --- */}
      {engineActive && speed > 0 && (
        <points ref={dustParticlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
          </bufferGeometry>
          <pointsMaterial size={1.2} color="#D97706" transparent opacity={0.6} depthWrite={false} />
        </points>
      )}

      {/* --- FOG PARTICLE HEATMAP SYSTEM --- */}
      {fogVisibility > 5 && (
        <points ref={fogParticlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[fogPos, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={1.8}
            color="#94A3B8"
            transparent
            opacity={(fogVisibility / 100) * 0.45}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
