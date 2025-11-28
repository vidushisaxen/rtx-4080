"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, Environment, Stars } from "@react-three/drei";
import BeamLoader from "./BeamLoader";
import ActualModel from "./ActualModel";
import FallBackLoader from "../ModelSequence/FallBackLoader";
import { gsap } from "gsap";
import ReflectiveBase from "./ReflectiveBase";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider } from "@theatre/r3f";

export default function HeroMain() {
  const lenis = useLenis();
  const BeamLoaderRef = useRef();
  const centerGroupRef = useRef();
  const pointLightRef = useRef();
  const [shaderOpacity, setShaderOpacity] = useState(1.0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [pointLightIntensity, setPointLightIntensity] = useState(0);
  const modelRef = useRef(null);
  const fanRotationRef = useRef(null);

  // THEATRE SETUP

  const HeroMainSheet = getProject("HeroMain").sheet("Hero Main Sheet");


  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     if (!centerGroupRef.current) return;

  //     const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
  //     const y = (e.clientY / window.innerHeight - 0.5) * 0.2;

  //     gsap.to(centerGroupRef.current.rotation, {
  //       x: y,
  //       y: x,
  //       duration: 1.5,
  //       ease: "power1.out",
  //     });

  //     if (pointLightRef.current) {
  //       const lightX = (e.clientX / window.innerWidth - 0.5) * 10;
  //       const lightY = -(e.clientY / window.innerHeight - 0.5) * 10;

  //       gsap.to(pointLightRef.current.position, {
  //         x: lightX,
  //         y: lightY,
  //         duration: 1,
  //         ease: "power1.out",
  //       });
  //     }
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     studio.initialize();
  //     studio.extend(extension);
  //   }
  // }, []);

  const handleClickEnterExperience = () => {
    const tl = gsap.timeline();
    tl.to(
      { opacity: shaderOpacity },
      {
        opacity: 0,
        duration: 1.5,

        ease: "power2.out",
        onUpdate: function () {
          setShaderOpacity(this.targets()[0].opacity);
        },
      }
    );
    // INCREASE LIGHT INTENSITY FROM 0 to 4
    tl.to(
      { intensity: lightIntensity },
      {
        intensity: 4,
        duration: 1.5,
        delay: 1.5,
        ease: "power2.out",
        onUpdate: function () {
          setLightIntensity(this.targets()[0].intensity);
        },
      },
      0
    );
    // INCREASE POINT LIGHT INTENSITY FROM 0 to 2
    tl.to(
      { pointIntensity: pointLightIntensity },
      {
        pointIntensity: 0.4,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function () {
          setPointLightIntensity(this.targets()[0].pointIntensity);
        },
      },
      0
    );
    tl.to(
      ".expBtn",
      {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      },
      "<"
    );
  };

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
    <div className="h-screen sticky top-0 w-full bg-black">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        camera={{
          position: [0, 0, 5],
          fov: 40,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        className="h-screen relative z-[12] w-full"
        shadows
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <SheetProvider sheet={HeroMainSheet}>
          <directionalLight
            position={[0, 10, 0]}
            intensity={lightIntensity}
            color="#ffffff"
          />
          <pointLight
            ref={pointLightRef}
            position={[0, 0, 5]}
            intensity={pointLightIntensity}
            color="#ffffff"
            distance={0}
            decay={0.2}
          />

          {/* EXTRAS */}
          {/* <Environment preset="studio" environmentIntensity={1} /> */}
          <Stars
            radius={70}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <Suspense fallback={<FallBackLoader />}>
            <Center>
              <group scale={0.8} ref={centerGroupRef}>
                <group ref={BeamLoaderRef}>
                  <BeamLoader shaderOpacity={shaderOpacity} />
                </group>
                <e.group position={[0, -1.2, 0]} theatreKey="MainModelMesh" ref={modelRef}>
                  <ActualModel
                    toggleFanRotation={toggleFanRotation}
                    fanRotationRef={fanRotationRef}
                  />
                </e.group>
                <ReflectiveBase />
              </group>
            </Center>
          </Suspense>
        </SheetProvider>
      </Canvas>
      <div className="absolute expBtn bottom-20 left-0 w-full h-20   z-999 flex items-center justify-center">
        <p
          onClick={handleClickEnterExperience}
          className="px-8 py-3 bg-white/10 cursor-pointer text-white font-thin uppercase rounded-full text-[.8vw] transition-colors duration-200 hover:bg-white/20"
        >
          Enter Experience
        </p>
      </div>
    </div>
  );
}
