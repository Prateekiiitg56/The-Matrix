import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Stars, Html } from '@react-three/drei';
import { useState, useRef, Suspense } from 'react';

function PillModel({ position, baseRotation = [0, 0, 0], color, label, tooltip, onClick, delay = 0 }) {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        // When hovered, the pill gently hovers higher and spins rapidly to invite interaction
        if (hovered) {
            meshRef.current.rotation.x += delta * 2;
        } else {
            // Restore native resting rotation slowly
            meshRef.current.rotation.x = 0;
        }
    });

    return (
        <group position={position} rotation={baseRotation}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8} floatingRange={[-0.1, 0.1]}>
                <mesh
                    ref={meshRef}
                    onClick={onClick}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHover(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHover(false);
                    }}
                    scale={hovered ? 1.1 : 1}
                >
                    {/* Scaled down to match the physical pills in the photo accurately */}
                    <capsuleGeometry args={[0.18, 0.85, 32, 32]} />
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.1}
                        metalness={0.5}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        emissive={hovered ? color : '#000000'}
                        emissiveIntensity={hovered ? 0.8 : 0}
                    />

                    {/* HTML Overlay Tooltip when hovered */}
                    {hovered && (
                        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
                            <div className="bg-black/90 border border-subtle-line p-4 rounded tracking-[2px] w-64 text-center backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-opacity animate-in fade-in duration-200">
                                <h3 className="font-display text-white text-[14px] font-bold mb-1" style={{ color: color }}>{label.split('\\n')[0]}</h3>
                                <p className="font-code text-muted-text text-[10px] leading-relaxed uppercase">{tooltip}</p>
                            </div>
                        </Html>
                    )}
                </mesh>
            </Float>
        </group>
    );
}

export default function PillChoice({ onSelect }) {
    return (
        <div className="w-full h-screen bg-[#020302] relative overflow-hidden select-none">

            {/* Cinematic Overlay Element */}
            <div className="absolute top-[8%] left-0 w-full text-center pointer-events-none z-10">
                <h1 className="text-4xl md:text-5xl font-display text-white tracking-[12px] mb-4 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Make your choice
                </h1>
                <p className="text-muted-text font-code tracking-[4px] text-xs max-w-xl mx-auto [text-shadow:0_0_10px_#000]">
                    Hover over a capsule to see your fate.
                </p>
            </div>

            {/* HANDS BACKGROUND IMAGE */}
            <div className="absolute bottom-0 left-0 w-full h-[70vh] flex justify-center items-end pointer-events-none z-0 opacity-70 mix-blend-screen animate-[slideUp_2s_ease-out_forwards]">
                <img
                    src="/hand.png"
                    alt="Offering Hands"
                    className="w-full max-w-[1200px] h-auto object-contain filter grayscale contrast-125 translate-y-[10%]"
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>

            {/* 3D INTERACTIVE UI CANVAS OVERLAY */}
            <div className="absolute inset-0 z-20">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={2} />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00ff41" />

                    <Suspense fallback={null}>
                        <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />

                        {/* LEFT PALM: Blue Pill (The Illusion) */}
                        <PillModel
                            position={[-2.0, 0.25, 0.5]}
                            baseRotation={[0.2, 0, -1.6]}
                            color="#0055ff"
                            label="THE ILLUSION\n(Language Sandbox)"
                            tooltip="Stay asleep in the terminal. Enter an isolated environment to practice pure programming language syntax, design theory, and basic algorithms."
                            onClick={() => onSelect('blue')}
                            delay={Math.PI}
                        />

                        {/* RIGHT PALM: Red Pill (The Truth) */}
                        <PillModel
                            position={[2.0, 0.3, 0.5]}
                            baseRotation={[0.2, 0, 1.5]}
                            color="#ff0000"
                            label="THE TRUTH\n(DSA Matrix Mode)"
                            tooltip="Awaken and enter the Matrix. Access the fully functional DSA tracker, solve backend algorithmic problems, and build your actual portfolio streak."
                            onClick={() => onSelect('red')}
                            delay={0}
                        />

                        {/* Grounded shadows directly on the palms */}
                        <ContactShadows position={[0, -0.1, 0.3]} opacity={0.6} scale={15} blur={2} far={4} color="#000" />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>
            </div>

            {/* Decorative Matrix Scanline Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 opacity-30 mix-blend-overlay"></div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { transform: translateY(20%); opacity: 0; }
                    to { transform: translateY(10%); opacity: 0.8; }
                }
            `}} />
        </div>
    );
}
