"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, Sparkles, useProgress } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import BeamLoader from "./BeamLoader";
import ActualModel from "./ActualModel";
import FallBackLoader from "./FallBackLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ReflectiveBase from "./ReflectiveBase";
import HeroPopupSequence from "./HeroPopupSequence";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider } from "@theatre/r3f";
import SequenceAnim from "../../theatre/AnimFinal2.json";
import SparkleBtn from "../BtnComponent/SparkleBtn";
import HeroUI from "../UI/HeroUI";
import { useBackgroundAudio } from "../SFX/Sounds";
import { Fluid } from "../FluidDistortion";
import { BlendFunction } from "postprocessing";
import ChromaVignetteEffect from "../QuantumWalletBG/QuantumWallet";

gsap.registerPlugin(ScrollTrigger);

export default function HeroMain({
  isAnimationRunning,
  setIsAnimationRunning,
}) {
  const lenis = useLenis();
  const BeamLoaderRef = useRef();
  const centerGroupRef = useRef();
  const pointLightRef = useRef();
  const buttonRef = useRef();
  const [shaderOpacity, setShaderOpacity] = useState(1.0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [pointLightIntensity, setPointLightIntensity] = useState(0);
  const [environmentIntensity, setEnvironmentIntensity] = useState(0);
  const [rippleOpacity, setRippleOpacity] = useState(0.05);
  const [rippleIntensity, setRippleIntensity] = useState(0.2);
  const modelRef = useRef(null);
  const fanRotationRef = useRef(null);
  const { progress, loaded, total } = useProgress();
  const isModelLoaded = progress === 100;
  const HeroMainSheet = getProject("HeroMain", { state: SequenceAnim }).sheet(
    "Hero Main Sheet"
  );
  const [materialsSetting, setMaterialsSetting] = useState(1);

  // Get background audio control
  const { PlaySoundBackground } = useBackgroundAudio();

  // Show button smoothly when model is loaded
  useEffect(() => {
    if (isModelLoaded && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          visibility: "hidden",
          y: 20,
        },
        {
          opacity: 1,
          visibility: "visible",
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 2,
        }
      );
    }
  }, [isModelLoaded]);

  // MOUSE MOVEMENT
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!centerGroupRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.2;

      gsap.to(centerGroupRef.current.rotation, {
        x: y,
        y: x,
        duration: 4,
        ease: "power1.out",
      });

      if (pointLightRef.current) {
        const lightX = (e.clientX / window.innerWidth - 0.5) * 10;
        const lightY = -(e.clientY / window.innerHeight - 0.5) * 10;

        gsap.to(pointLightRef.current.position, {
          x: lightX,
          y: lightY,
          duration: 1,
          ease: "power1.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  // LENIS
  useEffect(() => {
    if (lenis) {
      lenis.stop();
    }
  }, [lenis]);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     studio.initialize();
  //     studio.extend(extension);
  //   }
  // }, []);

  // SEQUENCE SCROLL
  useEffect(() => {
    if (typeof window === "undefined" || !HeroMainSheet) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "top top",
      end: "100% bottom",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        const animationTime = self.progress * 26.08;
        HeroMainSheet.sequence.position = animationTime;
      },
      onEnter: () => {
        toggleFanRotation(true);
      },
      onLeave: () => {
        toggleFanRotation(false);
      },
      onEnterBack: () => {
        toggleFanRotation(true);
      },
      onLeaveBack: () => {
        toggleFanRotation(false);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [HeroMainSheet]);

  // ENTER EXPERIENCE BUTTON
  const handleClickEnterExperience = () => {
    // Start background audio when entering the experience
    PlaySoundBackground(true);

    const tl = gsap.timeline();

    // Fade out beam loader shader
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

    // Smoothly animate ripple background appearance
    tl.to(
      { rippleOp: rippleOpacity },
      {
        rippleOp: 1.0,
        duration: 2.0,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: function () {
          setRippleOpacity(this.targets()[0].rippleOp);
        },
      },
      0
    );

    // Animate ripple intensity
    tl.to(
      { rippleInt: rippleIntensity },
      {
        rippleInt: 1.2,
        duration: 2.5,
        delay: 0.8,
        ease: "power2.inOut",
        onUpdate: function () {
          setRippleIntensity(this.targets()[0].rippleInt);
        },
      },
      0
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

    // ANIMATE ENVIRONMENT LIGHT INTENSITY FROM 0 to 5
    tl.to(
      { envIntensity: environmentIntensity },
      {
        envIntensity: 5,
        duration: 2.0,
        delay: 1.0,
        ease: "power2.out",
        onUpdate: function () {
          setEnvironmentIntensity(this.targets()[0].envIntensity);
        },
      },
      0
    );

    // Fade out button
    tl.to(
      ".expBtn",
      {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          setIsAnimationRunning(false);
          lenis.start();
        },
      },
      "<"
    );
  };

  // FAN ROTATION
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

  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key === 'Enter') {
        handleClickEnterExperience();
      }
    };

    document.addEventListener('keydown', handleEnter);

    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [handleClickEnterExperience])
  
  return (
    <>
    <HeroUI
    isAnimationRunning={isAnimationRunning}
    materialsSetting={materialsSetting}
    setMaterialsSetting={setMaterialsSetting}
  />
    <div id="SequenceContainer" className="h-[4200vh] bg-black w-full relative">
      <div className="h-screen sticky top-0 z-[100] w-full ">
      
        {/* <Stats /> */}

        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
          }}
          camera={{
            position: [0, 0, 5],
            fov: 40,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 1.5]}
          className="h-screen relative z-12 w-full"
          shadows
          flat
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          <Environment
            preset="forest"
            environmentIntensity={environmentIntensity}
          />

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

            {/* POINT LIGHT FOR THE EXPERIENCE */}
            <e.pointLight
              theatreKey="PointLight"              
              theatreX={10}
              theatreY={10}
              theatreZ={5}
              intensity={100}
              color="#ffffff"
            />

            <Suspense fallback={<FallBackLoader />}>
              <Center>
                <group scale={0.8} ref={centerGroupRef}>
                  <group ref={BeamLoaderRef}>
                    <BeamLoader
                      shaderOpacity={shaderOpacity}
                      isModelLoaded={isModelLoaded}
                      progress={progress}
                      loaded={loaded}
                      total={total}
                    />
                  </group>
                  <e.group
                    position={[0, -1.2, 0]}
                    theatreKey="MainModelMesh"
                    ref={modelRef}
                  >
                    <ActualModel
                      setMaterialsSetting={setMaterialsSetting}
                      materialsSetting={materialsSetting}
                      toggleFanRotation={toggleFanRotation}
                      fanRotationRef={fanRotationRef}
                    />
                  </e.group>
                  <ReflectiveBase />
                </group>
              </Center>
            </Suspense>

            <EffectComposer>
              <Fluid
                fluidColor="#07251e"
                blend={0.3}
                // backgroundColor="#000000"
                showBackground={false}
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
                // enableBloom={true}
              />
            </EffectComposer>
          </SheetProvider>
        </Canvas>
        <HeroPopupSequence toggleFanRotation={toggleFanRotation} />

        {isModelLoaded && (
          <div
            ref={buttonRef}
            className="absolute expBtn bottom-15 left-0 w-full h-20 z-[9999] flex items-center justify-center opacity-0"
          >
            <SparkleBtn
              colorTheme="white"
              onClick={handleClickEnterExperience}
              children="Enter the Experience"
            />
          </div>
        )}
      </div>
    </div>
    </>

  );
}
