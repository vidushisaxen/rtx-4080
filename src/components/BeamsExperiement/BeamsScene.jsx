"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Environment,
  Stats,
} from "@react-three/drei";
import BeamsModel from "./BeamsModel";

export default function BeamsScene() {
  return (
    <div className="h-screen w-full bg-black">
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
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Center>
          <BeamsModel />
        </Center>
        <OrbitControls enableZoom={true} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
