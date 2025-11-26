"use client";
import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, Environment, Stats } from "@react-three/drei";
import { getProject } from "@theatre/core";
import { SheetProvider } from "@theatre/r3f";
import HeroModel from "./HeroMode";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";

studio.extend(extension);
export default function HeroScene() {
  const RtxSheet = getProject("RTXHero").sheet("Hero Sheet");
  studio.initialize();

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
        <SheetProvider sheet={RtxSheet}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Environment preset="studio" />
          <Center>
            <HeroModel />
          </Center>

          <OrbitControls enableZoom={false} target={[0, 0, 0]} />
        </SheetProvider>
      </Canvas>
    </div>
  );
}
