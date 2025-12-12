"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, MeshPortalMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import React, { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Scene1() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <boxGeometry args={[1.7, 1.7, 1.7]} />
      <meshStandardMaterial color="aqua" />
    </mesh>
  );
}

function Scene2() {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <>
      <mesh position={[0, -0.8, 0]} ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-3, 0, 0]}>
        <coneGeometry args={[0.8, 1.5, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <torusGeometry args={[0.6, 0.3, 16, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </>
  );
}

function PortalMesh() {
  const meshRef = useRef();
  const scaleRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    gsap.to(scaleRef.current, {
      x: 8,
      y: 8,
      duration: 1,
      ease: "linear",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.x = scaleRef.current.x;
      meshRef.current.scale.y = scaleRef.current.y;
    }
  });

  return (
    //USE SHADER HERE
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <circleGeometry args={[1, 64]} />
      <MeshPortalMaterial
        worldUnits={true}
        transparent
        blur={0.3}
        side={THREE.DoubleSide}
      >
        <color attach="background" args={["#red"]} />
        <Scene2 />
      </MeshPortalMaterial>
    </mesh>
  );
}

export default function BitTransition() {
  return (
    <div className="h-[150vh] w-full relative">
      <div className="h-screen w-full bg-gray-900 sticky top-0">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.3} />
          <Center>
            <Scene1 />
            {/* 🌟 Portal Mesh that renders SCENE 2 inside it */}
            <PortalMesh />
          </Center>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
}
