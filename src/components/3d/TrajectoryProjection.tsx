"use client";

import { useMemo } from 'react';
import * as THREE from 'three';
import { Point } from '@/lib/prodiff/types';

interface TrajectoryProjectionProps {
    path: Point[];
    color?: string;
    opacity?: number;
    lineWidth?: number;
}

/**
 * TrajectoryProjection: Renders a predictive path in the 3D map.
 * Converts lat/lng coordinates to 3D space scaled for the city model.
 */
export default function TrajectoryProjection({ 
    path, 
    color = "#8b5cf6", 
    opacity = 0.6,
    lineWidth = 0.02 
}: TrajectoryProjectionProps) {
    
    const curve = useMemo(() => {
        if (!path || path.length < 2) return null;

        // Scale coordinates for the 3D scene (Mapping NYC area approx to [-1.5, 1.5])
        // Assuming path represents a small local movement
        const points = path.map(p => {
            // Mock projection: (lat, lng) -> (x, y, z)
            // Normalized around center of path
            const x = (p.lng - path[0].lng) * 1000;
            const y = (p.lat - path[0].lat) * 1000;
            const z = 0; // Flat for now on the city ground
            
            // Apply slight vertical "arc" for visual flair
            const dist = Math.sqrt(x*x + y*y);
            const height = Math.sin((dist / 10) * Math.PI) * 0.2;
            
            return new THREE.Vector3(x, height, y);
        });

        return new THREE.CatmullRomCurve3(points);
    }, [path]);

    if (!curve) return null;

    return (
        <group>
            {/* The Main Trajectory Line */}
            <mesh>
                <tubeGeometry args={[curve, 128, lineWidth, 8, false]} />
                <meshStandardMaterial 
                    color={color} 
                    emissive={color} 
                    emissiveIntensity={2} 
                    transparent 
                    opacity={opacity} 
                    roughness={0}
                    metalness={1}
                />
            </mesh>

            {/* Glowing endpoint spheres */}
            <mesh position={curve.getPointAt(0)}>
                <sphereGeometry args={[lineWidth * 2, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            
            <mesh position={curve.getPointAt(1)}>
                <sphereGeometry args={[lineWidth * 4, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
            </mesh>

            {/* Subtle shadow projection on "ground" */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <tubeGeometry args={[curve, 128, lineWidth * 2, 8, false]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}
