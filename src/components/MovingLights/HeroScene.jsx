"use client";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Environment,
  Stats,
  EnvironmentPortal,
} from "@react-three/drei";
import { getProject, val } from "@theatre/core";
import { SheetProvider } from "@theatre/r3f";
import HeroModel from "./HeroMode";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import ProjectState from "../../theatre/light.json";

export default function HeroScene() {
  const RtxSheet = getProject("RTXHero", { state: ProjectState }).sheet(
    "Hero Sheet"
  );

  const onclickPlay = () => {
    RtxSheet.sequence.play();
  };


  // RtxSheet.onValuesChange(() => {
  //   console.log(
  //     "NEW STATE:",
  //     JSON.stringify(RtxSheet.exportState(), null, 2)
  //   );
  // });

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      studio.initialize();
      studio.extend(extension);

    }
  }, []);

  return (
    <div className="h-screen w-full bg-black" >
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
          {/* <EnvironmentPortal preset="studio" environmentIntensity={.1} /> */}
          {/* <ambientLight intensity={1} /> */}
          <Center>
            <HeroModel />
          </Center>

          {/* <OrbitControls enableZoom={false} target={[0, 0, 0]} /> */}
        </SheetProvider>
      </Canvas>
      <div onClick={onclickPlay}  className="absolute bottom-[3%] cursor-pointer left-1/2 !z-[99999] -translate-x-1/2 bg-black">
        <p className="bg-white/10 backdrop-blur-2xl text-green-500  px-[3vw] py-[1vw] text-[1vw] rounded-full ">
          Enter The Experience
        </p>
      </div>
    </div>
    
  );
}
