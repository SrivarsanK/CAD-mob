"use client";

import { useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { simulationFragmentShader } from './shaders';

interface SimulationMaterial extends THREE.ShaderMaterial {
    uniforms: {
        uPositions: { value: THREE.Texture | null };
        uTime: { value: number };
        uSpeed: { value: number };
        resolution: { value: THREE.Vector2 };
        uCausalInfluence: { value: number };
    }
}

interface GPGPUParticlesProps {
    causalInfluence?: number;
}

export default function GPGPUParticles({ causalInfluence = 0 }: GPGPUParticlesProps) {
    const size = 320; 
    const particleCount = size * size;
    const { gl } = useThree();

    const positionsParams = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: false,
    };

    const renderTarget1 = useFBO(size, size, positionsParams);
    const renderTarget2 = useFBO(size, size, positionsParams);

    const scene = useMemo(() => new THREE.Scene(), []);
    const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1), []);

    const simulationMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: null },
                uTime: { value: 0 },
                uSpeed: { value: 1.0 },
                resolution: { value: new THREE.Vector2(size, size) },
                uCausalInfluence: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: simulationFragmentShader,
        }) as SimulationMaterial;
    }, [size]);

    const simMesh = useMemo(() => {
        return new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial);
    }, [simulationMaterial]);

    useEffect(() => {
        scene.add(simMesh);
    }, [scene, simMesh]);

    useEffect(() => {
        const data = new Float32Array(particleCount * 4);
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.0 + Math.random() * 0.5;
            data[i * 4] = r * Math.sin(phi) * Math.cos(theta);
            data[i * 4 + 1] = r * Math.sin(phi) * Math.sin(theta);
            data[i * 4 + 2] = r * Math.cos(phi);
            data[i * 4 + 3] = 1.0;
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
        texture.needsUpdate = true;

        simulationMaterial.uniforms.uPositions.value = texture;
        gl.setRenderTarget(renderTarget1);
        gl.render(scene, camera);
        gl.setRenderTarget(renderTarget2);
        gl.render(scene, camera);
        gl.setRenderTarget(null);
    }, [gl, scene, camera, particleCount, size, simulationMaterial, renderTarget1, renderTarget2]);

    const particlesMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: null },
                uPixelRatio: { value: gl.getPixelRatio() },
            },
            vertexShader: `
                uniform sampler2D uPositions;
                uniform float uPixelRatio;
                attribute vec2 reference;
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                  vec4 posData = texture2D(uPositions, reference);
                  vec3 pos = posData.xyz;
                  float life = posData.w;
                  
                  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                  gl_Position = projectionMatrix * mvPosition;
                  
                  gl_PointSize = 2.0 * uPixelRatio * (1.0 / -mvPosition.z);
                  vColor = mix(vec3(0.1, 0.4, 0.9), vec3(0.6, 0.2, 0.9), length(pos) * 0.4);
                  vAlpha = smoothstep(0.0, 0.2, life) * smoothstep(1.0, 0.8, life);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                  float strength = distance(gl_PointCoord, vec2(0.5));
                  if (strength > 0.5) discard;
                  float alpha = (0.5 - strength) * 2.0;
                  gl_FragColor = vec4(vColor, alpha * vAlpha * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [gl]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const references = new Float32Array(particleCount * 2);

        for (let i = 0; i < particleCount; i++) {
            const x = (i % size) / size;
            const y = Math.floor(i / size) / size;
            references[i * 2] = x;
            references[i * 2 + 1] = y;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('reference', new THREE.BufferAttribute(references, 2));
        return geo;
    }, [particleCount, size]);

    const targetRef = useRef(renderTarget1);
    const sourceRef = useRef(renderTarget2);

    useFrame((state) => {
        const { gl, clock } = state;
        const temp = targetRef.current;
        targetRef.current = sourceRef.current;
        sourceRef.current = temp;

        simulationMaterial.uniforms.uTime.value = clock.elapsedTime;
        simulationMaterial.uniforms.uSpeed.value = 1.0 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
        simulationMaterial.uniforms.uPositions.value = sourceRef.current.texture;
        simulationMaterial.uniforms.uCausalInfluence.value = causalInfluence;

        gl.setRenderTarget(targetRef.current);
        gl.clear();
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        particlesMaterial.uniforms.uPositions.value = targetRef.current.texture;
    });

    return (
        <points geometry={geometry} material={particlesMaterial} frustumCulled={false} />
    );
}
