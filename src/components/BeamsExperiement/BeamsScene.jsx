"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Stars } from "@react-three/drei";
import BeamLoader from "./BeamLoader";
import ActualModel from "./ActualModel";
import FallBackLoader from "../ModelSequence/FallBackLoader";
import { gsap } from "gsap";

export default function BeamsScene() {
  const modelRef = useRef();
  const beamLoaderRef = useRef();
  const actualModelRef = useRef();
  const [showModel, setShowModel] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterExperience = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (beamLoaderRef.current) {
      gsap.to(beamLoaderRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power2.inOut",
      });

    }
    
    setTimeout(() => {
      setShowModel(true);
      
      if (actualModelRef.current) {
        gsap.set(actualModelRef.current.scale, { x: 0, y: 0, z: 0 });
        
        gsap.to(actualModelRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: 0.2,
        });
        
    
      }
    }, 1000);
  };

  useEffect(() => {
    if(!showModel) return;
    const handleMouseMove = (e) => {
      if (!modelRef.current || isTransitioning) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.2;

      gsap.to(modelRef.current.rotation, {
        x: y,
        y: x,
        duration: 1.5,
        ease: "power1.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showModel, isTransitioning]);

  return (
    <div className="h-screen w-full bg-black">
      <div
        className="h-full w-full absolute inset-0 z-[11] opacity-10"
        style={{
          background: `radial-gradient(circle, transparent 30%, #ffffff 100%)`,
        }}
      ></div>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        className="h-full w-full"
        shadows
      >
        <directionalLight position={[0, 10, 0]} intensity={4} color="#ffffff" />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <Suspense fallback={<FallBackLoader />}>
          <Center>
            <group ref={modelRef}>
              {/* Always render both components for preloading, but control visibility */}
              <group ref={beamLoaderRef} visible={!showModel}>
                <BeamLoader onAnimationComplete={() => {
                  // Optional: Auto-transition after beam animation completes
                  // setTimeout(() => handleEnterExperience(), 2000);
                }} />
              </group>
              <group ref={actualModelRef} visible={showModel}>
                <ActualModel />
              </group>
            </group>
          </Center>
        </Suspense>
      </Canvas>
    
      <div 
        onClick={handleEnterExperience} 
        className={`absolute bottom-[5%] cursor-pointer left-1/2 !z-[99999] -translate-x-1/2 bg-black transition-opacity duration-300 ${
          isTransitioning ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <p className="bg-white/10 backdrop-blur-2xl text-white px-[3vw] py-[1vw] text-[1vw] rounded-full">
          {isTransitioning ? 'Loading...' : 'Enter The Experience'}
        </p>
      </div>
    </div>
  );
}
