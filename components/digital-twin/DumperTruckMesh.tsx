'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DumperTruckMeshProps {
  steeringAngle?: number;
  engineActive?: boolean;
  speed?: number;
  truckX?: number;
}

export const DumperTruckMesh: React.FC<DumperTruckMeshProps> = ({
  steeringAngle = 0,
  engineActive = false,
  speed = 0,
  truckX = 0,
}) => {
  const truckGroup = useRef<THREE.Group>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);
  const wheelsGroupRef = useRef<THREE.Group>(null);

  // Wheel rotation angle state
  const wheelRotation = useRef(0);

  // Animate beacon and wheel spin when moving
  useFrame((_, delta) => {
    if (beaconLightRef.current && engineActive) {
      beaconLightRef.current.intensity = Math.sin(Date.now() * 0.01) * 2.5 + 3.0;
    }

    // Spin wheels according to speed
    if (engineActive && Math.abs(speed) > 0 && wheelsGroupRef.current) {
      wheelRotation.current += speed * delta * 0.35;
      wheelsGroupRef.current.children.forEach(wheel => {
        wheel.rotation.x = wheelRotation.current;
      });
    }
  });

  const bodyYellow = '#EAB308'; // Heavy Machinery Industrial Yellow
  const metalDark = '#1E293B';  // Dark Steel Frame
  const tireBlack = '#0F172A';  // Tire Rubber
  const rimGold = '#F59E0B';    // Metallic Rim Accent

  return (
    <group ref={truckGroup} position={[truckX, 0.8, 0]}>
      {/* --- CHASSIS & MAIN BODY --- */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.2, 6.0]} />
        <meshStandardMaterial color={metalDark} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* --- DUMP BED (YELLOW HEAVY CONTAINER) --- */}
      <group position={[0, 2.2, -0.4]} rotation={[-0.05, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 1.8, 5.2]} />
          <meshStandardMaterial color={bodyYellow} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Dump bed side ribs */}
        {[-2.0, -1.0, 0, 1.0, 2.0].map((zPos, i) => (
          <mesh key={i} position={[0, 0, zPos]}>
            <boxGeometry args={[3.8, 1.9, 0.2]} />
            <meshStandardMaterial color="#CA8A04" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* --- DRIVER CABIN (TOP FRONT RIGHT) --- */}
      <group position={[1.0, 2.3, 1.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.4, 1.6]} />
          <meshStandardMaterial color={bodyYellow} roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Cabin Glass Window */}
        <mesh position={[0, 0.15, 0.81]}>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <meshPhysicalMaterial
            color="#00E5FF"
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Safety Warning Beacon on Roof */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshStandardMaterial
            color={engineActive ? '#FFB300' : '#475569'}
            emissive={engineActive ? '#FFB300' : '#000000'}
            emissiveIntensity={engineActive ? 2 : 0}
          />
        </mesh>
        {engineActive && (
          <pointLight
            ref={beaconLightRef}
            position={[0, 1.0, 0]}
            color="#FFB300"
            distance={15}
            decay={2}
          />
        )}
      </group>

      {/* --- FRONT RADIATOR & BUMPER --- */}
      <group position={[0, 1.0, 3.1]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, 0.21]}>
          <planeGeometry args={[2.4, 0.8]} />
          <meshStandardMaterial color="#334155" wireframe />
        </mesh>
        {/* Dual Front Headlights */}
        {[-1.2, 1.2].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0.22]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive={engineActive ? '#00E5FF' : '#1E293B'}
                emissiveIntensity={engineActive ? 3 : 0}
              />
            </mesh>
            {engineActive && (
              <spotLight
                position={[0, 0, 0.2]}
                target-position={[0, -1, 10]}
                angle={0.6}
                penumbra={0.5}
                color="#00E5FF"
                intensity={8}
                distance={25}
              />
            )}
          </group>
        ))}
      </group>

      {/* --- REAR BUMPER & TAILLIGHTS (BACK OF TRUCK) --- */}
      <group position={[0, 0.6, -3.05]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 0.8, 0.3]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        {/* Rear Red Brake Lights */}
        {[-1.3, 1.3].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0, -0.16]}>
            <boxGeometry args={[0.4, 0.25, 0.05]} />
            <meshStandardMaterial
              color="#FF1744"
              emissive={engineActive ? '#FF1744' : '#475569'}
              emissiveIntensity={engineActive ? 2.5 : 0}
            />
          </mesh>
        ))}
        {/* Rear 24GHz mmWave Radar Sensor Mount */}
        <mesh position={[0, -0.1, -0.18]}>
          <boxGeometry args={[0.5, 0.3, 0.15]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={engineActive ? 1.5 : 0} />
        </mesh>
      </group>

      {/* --- GIANT MINING TIRES (ANIMATED ROTATING WHEELS) --- */}
      <group ref={wheelsGroupRef}>
        {/* Front Wheels (Swiveling with steering angle) */}
        <group position={[0, -0.1, 1.8]} rotation={[0, (steeringAngle * Math.PI) / 180, 0]}>
          {[-1.8, 1.8].map((xPos, i) => (
            <group key={i} position={[xPos, 0, 0]}>
              <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.95, 0.95, 0.7, 24]} />
                <meshStandardMaterial color={tireBlack} roughness={0.9} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.55, 0.55, 0.72, 16]} />
                <meshStandardMaterial color={rimGold} metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Rear Dual Axle Wheels */}
        {[-1.4, -2.4].map((zPos, zIdx) => (
          <group key={zIdx} position={[0, -0.1, zPos]}>
            {[-1.8, 1.8].map((xPos, i) => (
              <group key={i} position={[xPos, 0, 0]}>
                <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.95, 0.95, 0.7, 24]} />
                  <meshStandardMaterial color={tireBlack} roughness={0.9} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.55, 0.55, 0.72, 16]} />
                  <meshStandardMaterial color={rimGold} metalness={0.8} roughness={0.3} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* --- EXHAUST STACKS --- */}
      <mesh position={[-1.5, 2.5, 1.0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.2, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};
