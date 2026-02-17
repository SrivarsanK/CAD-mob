"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function CausalGraph() {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    // Mock Causal Nodes
    const nodes = [
        { id: 1, pos: [-1.2, 0.5, 0], label: "Bridge Traffic" },
        { id: 2, pos: [0, -0.2, 0.5], label: "Subway Load" },
        { id: 3, pos: [1.2, 0.5, 0], label: "Bike Lane Usage" },
        { id: 4, pos: [0, 1.2, -0.5], label: "Weather Index" },
    ];

    // Edges
    const edges = [
        [0, 1], [0, 2], [3, 1], [3, 2]
    ];

    return (
        <group>
            {/* Edges */}
            {edges.map(([start, end], i) => (
                <Line
                    key={i}
                    start={nodes[start].pos}
                    end={nodes[end].pos}
                    active={hoveredNode === nodes[start].id || hoveredNode === nodes[end].id}
                />
            ))}

            {/* Nodes */}
            {nodes.map((node) => (
                <group key={node.id} position={new THREE.Vector3(...node.pos)}>
                    <mesh
                        onPointerOver={() => setHoveredNode(node.id)}
                        onPointerOut={() => setHoveredNode(null)}
                    >
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshPhysicalMaterial
                            color={hoveredNode === node.id ? "#ffffff" : "#8b5cf6"}
                            emissive={hoveredNode === node.id ? "#8b5cf6" : "#000000"}
                            roughness={0.2}
                            metalness={0.8}
                            transmission={0.5}
                            thickness={0.5}
                        />
                    </mesh>
                    <Html distanceFactor={10} zIndexRange={[100, 0]}>
                        <div className={`pointer-events-none px-2 py-1 rounded bg-black/50 backdrop-blur-md text-white text-xs whitespace-nowrap border border-white/10 transition-opacity duration-300 ${hoveredNode === node.id ? 'opacity-100' : 'opacity-0'}`}>
                            {node.label}
                        </div>
                    </Html>
                </group>
            ))}
        </group>
    );
}

function Line({ start, end, active }: { start: number[], end: number[], active: boolean }) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
    const material = useMemo(() => new THREE.LineBasicMaterial({
        color: active ? "#3b82f6" : "#ffffff",
        transparent: true,
        opacity: active ? 1 : 0.2
    }), [active]);

    const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

    useFrame((state) => {
        if (active) {
            material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
            // material.needsUpdate = true; // Not strictly needed for opacity usually, but good to have if issues arise
        }
    });

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    return <primitive object={line} />;
}
