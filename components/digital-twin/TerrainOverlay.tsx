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
  roadsideScenario?: string;
  lidarHeatmapMode?: boolean;
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
  roadsideScenario = 'CLEAR',
  lidarHeatmapMode = false,
}) => {
  const fogParticlesRef = useRef<THREE.Points>(null);
  const dustParticlesRef = useRef<THREE.Points>(null);
  const roadGridGroupRef = useRef<THREE.Group>(null);
  const breakdownFlasherRef = useRef<THREE.PointLight>(null);
  const redMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const orangeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const roadOffsetRef = useRef(0);

  // Animate pulse effects on Red/Orange threat zones & breakdown hazard light
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

    // Breakdown Hazard Flasher
    if (breakdownFlasherRef.current) {
      breakdownFlasherRef.current.intensity = Math.sin(t * 12) > 0 ? 4.0 : 0.2;
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
  const particleCount = 280;
  const fogPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    fogPos[i] = (Math.random() - 0.5) * 60;
    fogPos[i + 1] = Math.random() * 9;
    fogPos[i + 2] = (Math.random() - 0.5) * 60;
  }

  // Dust particle positions
  const dustCount = 90;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPos[i] = (Math.random() - 0.5) * 3.6;
    dustPos[i + 1] = Math.random() * 0.8;
    dustPos[i + 2] = -2.5 - Math.random() * 8;
  }

  // 24GHz LiDAR Point Cloud grid points
  const lidarCount = 450;
  const lidarPos = new Float32Array(lidarCount * 3);
  for (let i = 0; i < lidarCount * 3; i += 3) {
    const angle = (i / 3) * 0.14;
    const radius = 1.8 + ((i / 3) % 30) * 0.55;
    lidarPos[i] = Math.cos(angle) * radius;
    lidarPos[i + 1] = Math.sin(angle * 3) * 0.6 + 0.3;
    lidarPos[i + 2] = Math.sin(angle) * radius;
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
      {/* --- SCROLLING ROAD & COAL MINE HILL STREET ENVIRONMENT --- */}
      <group ref={roadGridGroupRef}>
        <gridHelper args={[100, 100, '#00E5FF', '#1E293B']} position={[0, -0.05, 0]} />

        {/* 1. Coal Mine Hill Street Asphalt Haul Road */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 100]} />
          <meshStandardMaterial color="#0C1017" roughness={0.92} metalness={0.1} />
        </mesh>

        {/* Dirt & Gravel Shoulders on Left/Right of Hill Road */}
        {[-8.5, 8.5].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[3, 100]} />
            <meshStandardMaterial color="#221C16" roughness={0.98} />
          </mesh>
        ))}

        {/* Yellow Safety Boundary Lines */}
        {[-6.8, 6.8].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.35, 100]} />
            <meshBasicMaterial color="#FFB300" transparent opacity={0.8} />
          </mesh>
        ))}

        {/* Center Cyan Dash Stripes */}
        {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((zPos, idx) => (
          <mesh key={idx} position={[0, -0.07, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 4.5]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
          </mesh>
        ))}

        {/* 2. Mountain Hill Guardrails (W-Beam Crash Barriers along Roadside) */}
        {[-40, -25, -10, 5, 20, 35].map((zPos, idx) => (
          <group key={idx}>
            {/* Left & Right Metallic Guardrails */}
            {[-7.2, 7.2].map((xPos, xIdx) => (
              <group key={xIdx} position={[xPos, 0.45, zPos]}>
                {/* Vertical Steel Posts */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.15, 0.9, 0.15]} />
                  <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.3} />
                </mesh>
                {/* Horizontal W-Beam Rail */}
                <mesh position={[xIdx === 0 ? 0.1 : -0.1, 0.2, 0]}>
                  <boxGeometry args={[0.08, 0.35, 15]} />
                  <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.3} />
                </mesh>
                {/* Top Yellow Reflector */}
                <mesh position={[xIdx === 0 ? 0.15 : -0.15, 0.4, 0]}>
                  <boxGeometry args={[0.05, 0.1, 0.15]} />
                  <meshBasicMaterial color="#FFB300" />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* 3. COAL MINE HILL & MOUNTAIN PIT EMBANKMENTS (TERRACED ROCK SLOPES) */}
        {[-40, -20, 0, 20, 40].map((zPos, idx) => (
          <group key={idx}>
            {/* LEFT MOUNTAIN HILL RAMP (Ascending Coal Mine Wall) */}
            <group position={[-14, 0, zPos]}>
              {/* Lower Tier Bench */}
              <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0.25]} receiveShadow castShadow>
                <boxGeometry args={[8, 3.8, 20]} />
                <meshStandardMaterial color="#1E293B" roughness={0.95} />
              </mesh>
              {/* Mid Coal Seam Layer (Black Coal Strata) */}
              <mesh position={[-2.5, 3.8, 0]} rotation={[0, 0, 0.15]} receiveShadow castShadow>
                <boxGeometry args={[6, 2.5, 20]} />
                <meshStandardMaterial color="#0B0F19" roughness={0.9} />
              </mesh>
              {/* High Upper Mountain Peak */}
              <mesh position={[-5, 7.0, 0]} rotation={[0, 0, 0.3]} receiveShadow castShadow>
                <boxGeometry args={[8, 6.0, 20]} />
                <meshStandardMaterial color="#0F172A" roughness={0.98} />
              </mesh>
            </group>

            {/* RIGHT MOUNTAIN HILL SLOPE (Mine Pit Overburden Slope) */}
            <group position={[14, 0, zPos]}>
              {/* Lower Slope Wall */}
              <mesh position={[0, 1.8, 0]} rotation={[0, 0, -0.25]} receiveShadow castShadow>
                <boxGeometry args={[8, 3.8, 20]} />
                <meshStandardMaterial color="#1E293B" roughness={0.95} />
              </mesh>
              {/* Mid Red Dirt Soil Strata */}
              <mesh position={[2.5, 3.8, 0]} rotation={[0, 0, -0.15]} receiveShadow castShadow>
                <boxGeometry args={[6, 2.5, 20]} />
                <meshStandardMaterial color="#2D1F18" roughness={0.9} />
              </mesh>
              {/* High Hill Wall */}
              <mesh position={[5, 7.0, 0]} rotation={[0, 0, -0.3]} receiveShadow castShadow>
                <boxGeometry args={[8, 6.0, 20]} />
                <meshStandardMaterial color="#0F172A" roughness={0.98} />
              </mesh>
            </group>

            {/* Roadside Hill Coal Boulders & Mounds */}
            <mesh position={[-9.2, 0.6, zPos + 3]} rotation={[0.2, Math.PI / 4, 0]} castShadow>
              <dodecahedronGeometry args={[1.6, 1]} />
              <meshStandardMaterial color="#0F172A" roughness={0.95} />
            </mesh>
            <mesh position={[9.2, 0.7, zPos - 4]} rotation={[-0.1, -Math.PI / 3, 0]} castShadow>
              <dodecahedronGeometry args={[1.8, 1]} />
              <meshStandardMaterial color="#1C1917" roughness={0.92} />
            </mesh>
          </group>
        ))}

        {/* 4. OVERHEAD INDUSTRIAL COAL CONVEYOR BELT BRIDGE (Spanning Across Hill Street) */}
        {[-25, 25].map((zPos, idx) => (
          <group key={idx} position={[0, 0, zPos]}>
            {/* Left & Right Concrete Support Pillars */}
            {[-10, 10].map((xPos, pIdx) => (
              <mesh key={pIdx} position={[xPos, 5.0, 0]}>
                <cylinderGeometry args={[0.6, 0.8, 10, 12]} />
                <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
              </mesh>
            ))}
            {/* Overhead Steel Truss Gantry */}
            <mesh position={[0, 9.8, 0]}>
              <boxGeometry args={[22, 1.8, 2.4]} />
              <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Yellow Warning Stripe Frame */}
            <mesh position={[0, 8.8, 0]}>
              <boxGeometry args={[20, 0.3, 2.5]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
            </mesh>
            {/* Under-Bridge Warning Lights */}
            {[-5, 0, 5].map((xPos, lIdx) => (
              <pointLight key={lIdx} position={[xPos, 8.5, 0]} color="#00E5FF" intensity={3} distance={14} />
            ))}
          </group>
        ))}

        {/* 5. HILL STREET INDUSTRIAL FLOODLIGHT POLES & ROAD WARNING SIGNS */}
        {[-35, -15, 5, 25].map((zPos, idx) => (
          <group key={idx}>
            {/* Roadside Cobra-Head Street Light (Right Side of Hill Road) */}
            <group position={[8.5, 0, zPos]}>
              <mesh position={[0, 4.0, 0]}>
                <cylinderGeometry args={[0.12, 0.18, 8, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Curved Arm Overhanging Road */}
              <mesh position={[-0.8, 7.8, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.4, 0.25, 0.3]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              {/* Lamp Fixture */}
              <mesh position={[-1.3, 7.5, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.4]} />
                <meshStandardMaterial color="#FFB300" emissive="#FFB300" emissiveIntensity={4} />
              </mesh>
              {/* Streetlight Beam Casting Light Down onto Hill Road */}
              <spotLight
                position={[-1.3, 7.4, 0]}
                target-position={[-2, 0, 0]}
                angle={0.65}
                penumbra={0.5}
                intensity={6}
                color="#FFE082"
                distance={24}
                castShadow
              />
            </group>

            {/* Hill Pit Safety Diamond Warning Sign (Left Side) */}
            <group position={[-8.5, 0, zPos + 8]}>
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 3.0, 8]} />
                <meshStandardMaterial color="#64748B" metalness={0.9} />
              </mesh>
              {/* Yellow Diamond Signboard */}
              <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 6, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 0.08]} />
                <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
              </mesh>
            </group>
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

      {/* --- DYNAMIC ROADSIDE SIMULATION SCENARIO ENTITIES --- */}
      
      {/* SCENARIO A: STATIONARY ROADSIDE BREAKDOWN TRUCK ON SHOULDER */}
      {roadsideScenario === 'ROADSIDE_BREAKDOWN' && (
        <group position={[5.2, 0.8, 6.0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 2.0, 5.0]} />
            <meshStandardMaterial color="#EF4444" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={3} />
          </mesh>
          <pointLight ref={breakdownFlasherRef} position={[0, 1.8, 0]} color="#F59E0B" distance={15} />
        </group>
      )}

      {/* SCENARIO B: ONCOMING KOMATSU HAUL TRUCK ON ADJACENT LANE */}
      {roadsideScenario === 'ONCOMING_HAULER' && (
        <group position={[-3.8, 0.9, fwdZ + 2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.0, 1.8, 5.4]} />
            <meshStandardMaterial color="#0284C7" roughness={0.5} />
          </mesh>
          <spotLight position={[0, 0.5, -2.8]} target-position={[0, -1, -15]} color="#38BDF8" intensity={6} angle={0.5} />
        </group>
      )}

      {/* SCENARIO C: ROCKFALL DISLODGED BOULDER ON ROADSIDE EDGE */}
      {roadsideScenario === 'ROCKFALL_OBSTACLE' && (
        <group position={[2.8, 0.5, fwdZ]}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#78716C" roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[1.5, 1.8, 0.2, 8]} />
            <meshBasicMaterial color="#FF1744" wireframe />
          </mesh>
        </group>
      )}

      {/* SCENARIO D: HIGH-VISIBILITY PIT WORKER ON ROADSIDE */}
      {roadsideScenario === 'PIT_WORKER' && (
        <group position={[4.5, 0.8, fwdZ]}>
          {/* Worker Torso in High-Vis Orange */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.7, 8]} />
            <meshStandardMaterial color="#FF6D00" emissive="#FF6D00" emissiveIntensity={1.5} />
          </mesh>
          {/* Worker Hard Hat Helmet */}
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FFD600" emissive="#FFD600" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 0.8, 0]} color="#FFD600" distance={8} />
        </group>
      )}

      {/* --- DEFAULT FORWARD DETECTED OBSTACLE VEHICLE --- */}
      {roadsideScenario === 'CLEAR' && (
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
      )}

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

      {/* --- 24GHz LIDAR POINT-CLOUD HEATMAP SCANNING MATRIX --- */}
      {lidarHeatmapMode && (
        <group position={[truckX, 0, 0]}>
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[lidarPos, 3]} />
            </bufferGeometry>
            <pointsMaterial size={1.4} color="#00E5FF" transparent opacity={0.85} depthWrite={false} />
          </points>

          {/* Dynamic Laser Scanning Concentric Rings */}
          {[5, 10, 15, 20].map((r, idx) => (
            <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
              <ringGeometry args={[r - 0.15, r, 64]} />
              <meshBasicMaterial color="#00E5FF" transparent opacity={0.45 - idx * 0.09} side={THREE.DoubleSide} />
            </mesh>
          ))}

          {/* Roof-Mounted 360 Laser Dome Scan Cone */}
          <mesh position={[0, 3.8, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[14, 4.5, 32, 1, true]} />
            <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.25} />
          </mesh>
        </group>
      )}
    </group>
  );
};
