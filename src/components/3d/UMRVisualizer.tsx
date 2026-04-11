"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { UMRAlignment } from '@/lib/core/umr/types';

interface UMRVisualizerProps {
    alignment: UMRAlignment | null;
    position?: [number, number, number];
}

/**
 * UMRVisualizer: Renders the "Fused Latent Point" in 3D.
 * Pulses based on confidence and distorts based on latent heterogeneity.
 */
export default function UMRVisualizer({ alignment, position = [0, 0, 0] }: UMRVisualizerProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Group>(null);

    // Calculate distortion speed and amount based on alignment metadata or latent variance
    const distortionFactor = useMemo(() => {
        if (!alignment) return 0.2;
        // Simple variance of the first 10 dimensions as a proxy for "complexity"
        const subset = alignment.latent.slice(0, 10);
        const mean = subset.reduce((a, b) => a + b, 0) / subset.length;
        const variance = subset.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / subset.length;
        return 0.1 + variance * 2;
    }, [alignment]);

    useFrame((state) => {
        if (!meshRef.current || !alignment) return;
        
        const time = state.clock.getElapsedTime();
        
        // Pulse scale based on confidence
        const pulse = 1 + Math.sin(time * (alignment.confidence * 10)) * 0.05;
        meshRef.current.scale.setScalar(pulse);

        // Slow rotation
        if (outerRef.current) {
            outerRef.current.rotation.y = time * 0.2;
            outerRef.current.rotation.z = time * 0.1;
        }
    });

    if (!alignment) return null;

    return (
        <group position={position} ref={outerRef}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Inner Core: The Fused Intention */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <MeshDistortMaterial
                        color="#a855f7"
                        emissive="#7c3aed"
                        emissiveIntensity={2}
                        distort={distortionFactor}
                        speed={3}
                        roughness={0}
                        metalness={1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Outer Field: Head Weights Distribution (Energy Strands Placeholder) */}
                <group scale={1.2}>
                    <PointsRing 
                        count={20} 
                        radius={0.5} 
                        color="#3b82f6" 
                        opacity={alignment.headWeights.reasoning} 
                    />
                    <PointsRing 
                        count={20} 
                        radius={0.6} 
                        color="#ec4899" 
                        opacity={alignment.headWeights.diffusion} 
                        rotationOffset={Math.PI / 4}
                    />
                </group>

                {/* Connection Lines (Aura) */}
                <mesh scale={1.1}>
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
                </mesh>
            </Float>
        </group>
    );
}

function PointsRing({ count, radius, color, opacity, rotationOffset = 0 }: { 
    count: number; 
    radius: number; 
    color: string; 
    opacity: number;
    rotationOffset?: number;
}) {
    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            p.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
        }
        return p;
    }, [count, radius]);

    return (
        <group rotation={[0, 0, rotationOffset]}>
            {points.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={opacity * 0.5} />
                </mesh>
            ))}
        </group>
    );
}
