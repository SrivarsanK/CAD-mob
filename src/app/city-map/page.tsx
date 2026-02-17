"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import GlassSphere from "@/components/3d/GlassSphere";
import CausalGraph from "@/components/ui/CausalGraph";
import ProbabilityFog from "@/components/3d/ProbabilityFog";

// Reusing 3D components for the full map view
export default function CityMapPage() {
    return (
        <main className="w-full h-screen bg-black relative">
            {/* HUD Overlay */}
            <div className="absolute top-24 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-light tracking-tight text-white drop-shadow-md">City Digital Twin</h1>
                <p className="text-white/60">Live 3D Visualization</p>
            </div>

            <div className="absolute inset-0">
                <Canvas
                    camera={{ position: [0, 5, 10], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    dpr={[1, 1.5]}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, -10, -10]} intensity={0.5} />

                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <group scale={1.5}>
                            <GlassSphere />
                            <group position={[3, 0, 0]}>
                                <CausalGraph />
                            </group>
                            <ProbabilityFog />
                        </group>
                    </Suspense>
                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>
        </main>
    );
}
