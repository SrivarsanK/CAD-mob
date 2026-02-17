import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CityTrajectory() {
    const count = 50;
    const radius = 2;

    // Create random curved paths
    const lines = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => {
            const points = [];
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            for (let j = 0; j < 50; j++) {
                const factor = j / 50;
                const r = radius + Math.sin(factor * 10 + i) * 0.1;
                const x = r * Math.sin(phi) * Math.cos(theta + factor * 2);
                const y = r * Math.sin(phi) * Math.sin(theta + factor * 2);
                const z = r * Math.cos(phi);
                points.push(new THREE.Vector3(x, y, z));
            }
            return new THREE.CatmullRomCurve3(points);
        });
    }, []);

    return (
        <group>
            {lines.map((curve, index) => (
                <mesh key={index}>
                    <tubeGeometry args={[curve, 64, 0.005, 2, false]} />
                    <meshBasicMaterial color={new THREE.Color(0.2, 0.4, 1).multiplyScalar(2)} transparent opacity={0.3} toneMapped={false} />
                </mesh>
            ))}
            <Particles curves={lines} />
        </group>
    );
}

function Particles({ curves }: { curves: THREE.CatmullRomCurve3[] }) {
    const ref = useRef<THREE.InstancedMesh>(null);
    const count = curves.length;
    const dummy = new THREE.Object3D();
    const speed = useRef(new Float32Array(count).map(() => Math.random() * 0.002 + 0.001));
    const pos = useRef(new Float32Array(count).fill(0));

    useFrame(() => {
        if (!ref.current) return;

        for (let i = 0; i < count; i++) {
            pos.current[i] += speed.current[i];
            if (pos.current[i] > 1) pos.current[i] = 0;

            const point = curves[i].getPointAt(pos.current[i]);
            const tangent = curves[i].getTangentAt(pos.current[i]);

            dummy.position.copy(point);
            dummy.lookAt(point.clone().add(tangent));
            dummy.scale.setScalar(2);
            dummy.updateMatrix();

            ref.current.setMatrixAt(i, dummy.matrix);
        }
        ref.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={ref} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={new THREE.Color(1, 0.5, 0.2).multiplyScalar(4)} toneMapped={false} />
        </instancedMesh>
    );
}
