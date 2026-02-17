"use client";

import { useFrame, useThree, extend } from '@react-three/fiber';
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
    }
}

interface ParticlesMaterial extends THREE.ShaderMaterial {
    uniforms: {
        uPositions: { value: THREE.Texture | null };
        uPixelRatio: { value: number };
    }
}

export default function GPGPUParticles() {
    const size = 320; // 320x320 = 102,400 particles (Phase 2 Spec: 100k)
    const particleCount = size * size;

    const { gl } = useThree();

    // FBO setup
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

    // Simulation Scene
    const scene = useMemo(() => new THREE.Scene(), []);
    const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1), []);

    // Simulation Material
    const simulationMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: null },
                uTime: { value: 0 },
                uSpeed: { value: 1.0 },
                resolution: { value: new THREE.Vector2(size, size) }
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

    // Simulation Mesh (Full Screen Quad)
    const simMesh = useMemo(() => {
        return new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial);
    }, [simulationMaterial]);

    useEffect(() => {
        scene.add(simMesh);
    }, [scene, simMesh]);

    // Initial Data
    useEffect(() => {
        const data = new Float32Array(particleCount * 4);
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.0 + Math.random() * 0.5;

            data[i * 4] = r * Math.sin(phi) * Math.cos(theta); // x
            data[i * 4 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
            data[i * 4 + 2] = r * Math.cos(phi); // z
            data[i * 4 + 3] = 1.0; // w
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
        texture.needsUpdate = true;

        // Set initial uniforms
        simulationMaterial.uniforms.uPositions.value = texture;
        // Render initial state to both FBOs
        gl.setRenderTarget(renderTarget1);
        gl.render(scene, camera);
        gl.setRenderTarget(renderTarget2);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

    }, [gl, scene, camera, particleCount, size, simulationMaterial, renderTarget1, renderTarget2]);


    // Display Material
    const particlesMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: null }, // Will be updated in loop
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
          
          // Fade out as life dies, fade in as life starts
          vAlpha = smoothstep(0.0, 0.2, life) * smoothstep(1.0, 0.8, life);
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float strength = distance(gl_PointCoord, vec2(0.5));
          if (strength > 0.5) discard;
          
          // Soft edge
          float alpha = (0.5 - strength) * 2.0;
          gl_FragColor = vec4(vColor, alpha * vAlpha * 0.8);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        }) as ParticlesMaterial;
    }, []);

    // Geometry references
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3); // Dummy positions
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

    // Ping-Pong References
    const targetRef = useRef(renderTarget1);
    const sourceRef = useRef(renderTarget2);

    useFrame((state) => {
        const { gl, clock } = state;

        // 1. Swap buffers
        const temp = targetRef.current;
        targetRef.current = sourceRef.current;
        sourceRef.current = temp;

        // 2. Update Simulation
        simulationMaterial.uniforms.uTime.value = clock.elapsedTime;
        simulationMaterial.uniforms.uSpeed.value = 1.0 + Math.sin(clock.elapsedTime * 0.5) * 0.3;
        simulationMaterial.uniforms.uPositions.value = sourceRef.current.texture;

        gl.setRenderTarget(targetRef.current);
        gl.clear();
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        // 3. Update Display
        particlesMaterial.uniforms.uPositions.value = targetRef.current.texture;
    });

    return (
        <points geometry={geometry} material={particlesMaterial} frustumCulled={false} />
    );
}
