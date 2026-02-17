import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import GPGPUParticles from './GPGPUParticles';

export default function GlassSphere() {
    const sphereRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            // Smoothly interpolate IOR
            const targetIor = hovered ? 1.2 : 1.5;
            const currentMaterial = sphereRef.current.material as THREE.MeshPhysicalMaterial & { ior: number };
            currentMaterial.ior = THREE.MathUtils.lerp(currentMaterial.ior, targetIor, 0.1);
        }
    });

    return (
        <group>
            {/* GPGPU Particles */}
            <group scale={1.0}>
                <GPGPUParticles />
            </group>

            {/* The Glass Enclosure */}
            <mesh
                ref={sphereRef}
                scale={2}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshTransmissionMaterial
                    backside
                    samples={6}
                    resolution={256}
                    transmission={1}
                    roughness={0.1}
                    clearcoat={0.1}
                    clearcoatRoughness={0.1}
                    thickness={1.5}
                    ior={1.5}
                    chromaticAberration={0.04}
                    anisotropy={16}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    attenuationDistance={0.5}
                    attenuationColor="#8b5cf6"
                    color="#c0a0ff"
                />
            </mesh>
        </group>
    );
}
