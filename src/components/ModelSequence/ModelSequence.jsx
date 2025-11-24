"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useLayoutEffect, useState } from "react";
import { Center, Effects, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ModelExperience from "./ModelExperience";
import FallBackLoader from "./FallBackLoader";
import { degToRad } from "three/src/math/MathUtils";
import FixedGrid from "../Grid/FixedGrid";
import InfoPopup from "../InfoPopup";
import InfoPopupsForSequence from "./InfoPopupsForSequence";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ModelSequence() {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const [cameraAngle, setCameraAngle] = useState({
    x: 0,
    y: 0,
    z: 5,
  });
  const fanRotationRef = useRef(null);
  const [popUpToggler, setPopUpToggler] = useState(false);

  const toggleFanRotation = (value) => {
    if (!fanRotationRef.current) return;

    if (value) {
      // Start continuous rotation
      gsap.to(fanRotationRef.current.rotation, {
        z: "+=12.28", // 2 * Math.PI for full rotation
        duration: 2,
        repeat: -1,
        ease: "none",
      });
    } else {
      // Stop rotation smoothly
      gsap.killTweensOf(fanRotationRef.current.rotation);
      gsap.to(fanRotationRef.current.rotation, {
        z:
          Math.round(fanRotationRef.current.rotation.z / (2 * Math.PI)) *
          (2 * Math.PI),
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      id="model-sequence"
      ref={containerRef}
      className="h-[1400vh] w-full  relative"
    >
      <div className="h-screen w-full bg-black sticky top-0">
        <FixedGrid />
        <InfoPopupsForSequence popUpToggler={popUpToggler} setPopUpToggler={setPopUpToggler} />

        <p className="text-white z-[11] text-[20.4vw] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          GEFORCE
        </p>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
          }}
          camera={{
            position: [0, 0, 15],
            fov: 40,
            near: 0.1,
            far: 1000,
            aspect: window.innerWidth / window.innerHeight,
          }}
          dpr={[1, 2]}
          className="h-screen relative z-[12] w-full"
          shadows
          flat
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <ambientLight intensity={0.5} />
          <Environment
            preset="studio"
            environmentRotation={[-Math.PI / 4, 0, 0]}
            environmentIntensity={1}
          />
          <Suspense fallback={<FallBackLoader />}>
            <Center>
              <ModelExperience
                setPopUpToggler={setPopUpToggler}
                toggleFanRotation={toggleFanRotation}
                cameraAngle={cameraAngle}
                setCameraAngle={setCameraAngle}
                ref={modelRef}
                fanRotationRef={fanRotationRef}
              />
            </Center>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
