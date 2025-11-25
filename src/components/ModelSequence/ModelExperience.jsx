import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function ModelExperience({
  cameraAngle,
  setCameraAngle,
  fanRotationRef,
  toggleFanRotation,
  ...props
}) {
  const groupRef = useRef();
  gsap.registerPlugin(ScrollTrigger);
  const { nodes, materials } = useGLTF("/assets/models/model.glb");
  console.log(nodes, nodes.Plastic_Cover_main_material_0.geometry);

  const { camera } = useThree();

  // Add a camera control effect to maintain proper lookAt behavior
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCameraUpdate = () => {
      // Smoothly update camera lookAt to prevent stretching
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    // Create a simple throttle function since gsap.utils.throttle might not be available
    let lastCall = 0;
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastCall >= 16) {
        // 60fps throttle
        handleCameraUpdate();
        lastCall = now;
      }
    };

    ScrollTrigger.addEventListener("refresh", throttledUpdate);

    return () => {
      ScrollTrigger.removeEventListener("refresh", throttledUpdate);
    };
  }, [camera]);

  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "top top",
        end: "5% top",
        scrub: true,
        markers: false,

        onEnter: () => {
          toggleFanRotation(true);
        },
        onleave: () => {
          toggleFanRotation(false);
        },
      },
    });

    timeline1.to(groupRef.current.rotation, {
      x: degToRad(30),
      y: degToRad(-15),
      ease: "power1.inOut",
    });

    return () => {
      timeline1.kill();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "5% top",
        end: "28.5% top",
        scrub: true,
        markers: false,
      },
    });

    // Animate camera position smoothly
    timeline2.to(camera.position, {
      x: 0,
      y: 0,
      z: 3.5,
      ease: "power1.inOut",
    });

    // Animate model rotation with slight delay to prevent stretching
    timeline2.to(
      groupRef.current.rotation,
      {
        x: degToRad(33),
        y: degToRad(37),
        ease: "power1.inOut",
      },
      0.1
    );

    // Animate model position with same timing
    timeline2.to(
      groupRef.current.position,
      {
        x: 1.55,
        ease: "power1.inOut",
      },
      0.1
    );

    return () => {
      timeline2.kill();
    };
  }, [camera]);
  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline3 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "28.5% top",
        end: "42.8% top",
        scrub: true,
        markers: false,
      },
    });

    // Animate camera position smoothly
    timeline3.to(camera.position, {
      x: 0,
      y: 0,
      z: 5.5,
      ease: "power1.inOut",
    });

    // Animate model rotation with slight delay
    timeline3.to(
      groupRef.current.rotation,
      {
        x: degToRad(37),
        y: degToRad(-30),
        z: degToRad(-10),
        ease: "power1.inOut",
      },
      0.1
    );

    // Animate model position with same timing
    timeline3.to(
      groupRef.current.position,
      {
        x: -1.7,
        y: -0.5,
        z: 0.35,
        ease: "power1.inOut",
      },
      0.1
    );

    return () => {
      timeline3.kill();
    };
  }, [camera]);
  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline4 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "42.8% top",
        end: "57.1% top",
        scrub: true,
        markers: false,
      },
    });

    // Animate camera position smoothly
    timeline4.to(camera.position, {
      z: 4.5,
      ease: "power1.inOut",
    });

    // Animate model rotation with slight delay
    timeline4.to(
      groupRef.current.rotation,
      {
        y: degToRad(-140),
        z: 0,
        x: degToRad(38),
        ease: "power1.inOut",
      },
      0.1
    );

    // Animate model position with same timing
    timeline4.to(
      groupRef.current.position,
      {
        x: -0.7,
        y: -1.2,
        z: 0.35,
        ease: "power1.inOut",
      },
      0.1
    );

    return () => {
      timeline4.kill();
    };
  }, [camera]);

  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline5 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "57.1% top",
        end: "71.4% top",
        scrub: true,
        markers: false,
      },
    });
    // Animate model rotation with slight delay
    timeline5.to(
      groupRef.current.rotation,
      {
        y: degToRad(-100),
        x: degToRad(30),
        Z: degToRad(80),
        ease: "power1.inOut",
      },
      0.1
    );

    // Animate model position with same timing
    timeline5.to(
      groupRef.current.position,
      {
        x: -2,
        y: -1.8,
        ease: "power1.inOut",
      },
      0.1
    );

    return () => {
      timeline5.kill();
    };
  }, [camera]);

  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline6 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "71.4% top",
        end: "85.7% top",
        scrub: true,
        markers: false,
        onLeave: () => {
          toggleFanRotation(false);
        },
        onEnterBack: () => {
          toggleFanRotation(true);
        },
      },
    });
    // Animate model rotation with slight delay
    timeline6.to(
      groupRef.current.rotation,
      {
        y: degToRad(-20),
        x: degToRad(30),
        z: degToRad(-10),
        ease: "power1.inOut",
      },
      0.1
    );
    timeline6.to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 6,
        ease: "power1.inOut",
      },
      0.1
    );
    // Animate model position with same timing
    timeline6.to(
      groupRef.current.position,
      {
        x: -3,
        y: 0.2,
        ease: "power1.inOut",
      },
      0.1
    );

    return () => {
      timeline6.kill();
    };
  }, [camera]);

  useEffect(() => {
    if (typeof window === "undefined" || !groupRef.current) return;

    const timeline6 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "85.7% top",
        end: "100% bottom",
        scrub: true,
        markers: false,
      },
    });

    // Reset camera position to normal
    timeline6.to(
      camera.position,
      {
        x: 0,
        y: 0,
        z: 15,
        ease: "power1.inOut",
      },
      0
    );

    // Reset camera rotation to normal
    timeline6.to(
      camera.rotation,
      {
        x: 0,
        y: 0,
        z: 0,
        ease: "power1.inOut",
      },
      0
    );

    // Reset model rotation to normal
    timeline6.to(
      groupRef.current.rotation,
      {
        x: 0,
        y: 0,
        z: 0,
        ease: "power1.inOut",
      },
      0
    );

    // Reset model position to normal
    timeline6.to(
      groupRef.current.position,
      {
        x: 0,
        y: -1,
        z: 0,
        ease: "power1.inOut",
      },
      0
    );

    return () => {
      timeline6.kill();
    };
  }, [camera]);

  return (
    <group
      {...props}
      ref={groupRef}
      dispose={null}
      scale={0.025}
      position={[0, -1, 0]}
    >
      <group rotation={[Math.PI / 2, degToRad(0), degToRad(0)]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group>
            <group>
             
              <group
                position={[-300, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.IO_Plate_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-300, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Ports_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                ref={fanRotationRef}
                position={[8739.012, -2660, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Fan_Back_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-300.001, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Plastic_Cover_main_material_0.geometry}
                  material={materials.main_material}
                ></mesh>
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Plastic_Cover_main_material_0001.geometry}
                  material={materials.main_material}
                ></mesh>
              </group>
              <group
                position={[-300.001, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Metal_Case_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-9373.76, 2660, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Fan_Front_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-300.001, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Radiator_radiator_1_0.geometry}
                  material={materials.radiator_1}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Radiator_radiator_2_0.geometry}
                  material={materials.radiator_2}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Radiator_radiator_3_0.geometry}
                  material={materials.radiator_3}
                />
              </group>


              {/* EXTRAS */}
              <group
                position={[-300, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Pin_Connector_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-300.001, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Fan_Holders_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>


               <group
                position={[-300, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.PCB_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
              <group
                position={[-300, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              >
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.VRM_main_material_0.geometry}
                  material={materials.main_material}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
