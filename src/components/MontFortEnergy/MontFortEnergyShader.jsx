"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  MeshReflectorMaterial,
  OrbitControls,
  Sparkles,
  Stats,
  useTexture,
} from "@react-three/drei";
import ExperienceMF from "./ExperienceMF";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "../FluidDistortion";
import { BlendFunction } from "postprocessing";
import ReflectiveBase from "../HeroMain/ReflectiveBase";
import CustomSparkles from "./CustomSparkles";
import { degToRad } from "three/src/math/MathUtils";

export default function MontFortEnergyShader() {
  return (
    <div
      className="bg-black relative h-screen w-full"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="absolute pointer-events-none top-0 left-0 w-full h-full z-[10]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,.5) 100%)",
        }}
      >
        {" "}
      </div>
      <Canvas
        className="bg-black absolute top-0 left-0 w-full h-full"
        flat
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
          toneMapping: "LinearToneMapping",
        }}
        camera={{
          position: [0, 0, -20],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <Stats />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ExperienceMF
          shaderConfig1={{
            color: "#87CEEB",
            numLines: 35.0,
            flowSpeed: 0.3,
            flowIntensity: 1.5,
            baselineIntensity: 0.4,
            baseLineColor: "#87CEEB",
          }}
          shaderConfig2={{
            color: "#87CEEB",
            numLines: 20.0,
            flowSpeed: 0.3,
            flowIntensity: 1.5,
            baselineIntensity: 0.4,
            baseLineColor: "#87CEEB",
          }}
        />
        {/* <EffectComposer>
          <Fluid
            fluidColor="#07251e"
            blend={0.3}
            backgroundColor="#000000"
            rgbShiftIntensity={0.03}
            intensity={0.1}
            force={0.8}
            radius={0.7}
            pressure={0.9}
            densityDissipation={0.91}
            distortion={0.3}
            velocityDissipation={1.0}
            rgbShiftRadius={0.2}
            rgbShiftDirection={{ x: 1.0, y: 0.5 }}
            blendFunction={BlendFunction.DIFFERENCE}
            enableRandomMovement={true}
            randomMovementIdleThreshold={200}
          />
        </EffectComposer> */}
        {/* <EffectComposer>
            <Bloom/>
        </EffectComposer> */}

        <CustomSparkles
          rotation={[degToRad(90), degToRad(0), degToRad(0)]}
          position={[-30, 20, 0]}
          count={100}
          size={3}
          scale={80}
          speed={1}
          color="#87CEEB"
          noise={[15, 15, 15]}
        />

        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
