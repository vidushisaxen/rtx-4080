"use client";
import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import {
  Center,
  Effects,
  Environment,
  OrbitControls,
  Sparkles,
  Stats,
} from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ModelExperience from "./ModelExperience";
import FallBackLoader from "./FallBackLoader";
import InfoPopupsForSequence from "./InfoPopupsForSequence";
import DirectionalLightComponent from "./DirectionalLightComponent";
gsap.registerPlugin(ScrollTrigger);


export default function ModelSequence({ colorTheme = "#5cffa3" }) {
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const [cameraAngle, setCameraAngle] = useState({
    x: 0,
    y: 0,
    z: 5,
  });
  const fanRotationRef = useRef(null);
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
      className="h-[2500vh] w-full  relative"
    >
      <div className="h-screen w-full bg-black sticky top-0">
        <InfoPopupsForSequence colorTheme={colorTheme} />
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: 0,
            toneMappingExposure: 1,
          }}
          camera={{
            position: [0, 0, 15],
            fov: 40,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
          className="h-screen relative z-[12] w-full"
          shadows
          flat
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <Stats showPanel={0} />
          <Sparkles
            count={100}
            scale={[15, 15, 1]}
            size={10}
            speed={0.4}
            opacity={0.3}
            color={colorTheme}
            position={[0, 0, 0]}
          />
          {/* <ambientLight intensity={15} color={"#ffffff"} />
          <Environment
            preset="studio"
            environmentRotation={[-Math.PI / 4, 0, 0]}
            environmentIntensity={0.1}
          /> */}

          <Suspense fallback={<FallBackLoader />}>
            <Center>
              <ModelExperience
                toggleFanRotation={toggleFanRotation}
                cameraAngle={cameraAngle}
                setCameraAngle={setCameraAngle}
                ref={modelRef}
                fanRotationRef={fanRotationRef}
              />
            </Center>
          </Suspense>
          <OrbitControls enableZoom={false} />
          {/* MAINLIGHT */}
          <DirectionalLightComponent colorTheme={colorTheme} />
        </Canvas>
      </div>
    </div>
  );
}
