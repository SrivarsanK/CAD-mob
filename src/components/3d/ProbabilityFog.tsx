"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ProbabilityFog() {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#8b5cf6") },
        },
        transparent: true,
        depthWrite: false,
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPos;
            void main() {
                vUv = uv;
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec2 vUv;
            varying vec3 vPos;

            // Simple noise
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            void main() {
                // Moving fog clusters
                float noise = random(vUv * 10.0 + uTime * 0.1);
                
                // Radial fade
                float dist = length(vUv - 0.5);
                float alpha = (1.0 - dist * 2.0) * noise * 0.3;
                
                gl_FragColor = vec4(uColor, alpha);
            }
        `
    }), []);

    useFrame((state) => {
        if (material) {
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 10, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
