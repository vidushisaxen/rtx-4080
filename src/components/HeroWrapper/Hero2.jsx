"use client"
import React, { Suspense, useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

function Model({ spotLightRef, ...props }) {
  const groupRef = useRef();
  const fanRotationRef = useRef();
  gsap.registerPlugin(ScrollTrigger);
  const { nodes, materials } = useGLTF("/assets/models/model.glb");
  
  // Make materials more metallic with better visibility
  useEffect(() => {
    if (materials.main_material) {
      materials.main_material.metalness = 0.75;
      materials.main_material.roughness = 0.25;
      materials.main_material.color.setHex(0x404040);
    }
    if (materials.radiator_1) {
      materials.radiator_1.metalness = 0.7;
      materials.radiator_1.roughness = 0.3;
    }
    if (materials.radiator_2) {
      materials.radiator_2.metalness = 0.7;
      materials.radiator_2.roughness = 0.3;
    }
    if (materials.radiator_3) {
      materials.radiator_3.metalness = 0.7;
      materials.radiator_3.roughness = 0.3;
    }
  }, [materials]);
  
  return (
    <group
      {...props}
      ref={groupRef}
      dispose={null}
      scale={0.02}
      position={[2.5, -1, 0]}
    >
      <group rotation={[Math.PI, -Math.PI/4, 0]}>
        <group rotation={[Math.PI / 2.2, 0, 0]} scale={0.01}>
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
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Plastic_Cover_main_material_0001.geometry}
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

function Scene() {
  const spotLightRef = useRef();
  const targetRef = useRef();
  const { camera } = useThree();
  const targetCameraX = useRef(5);
  const currentCameraX = useRef(5);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update spotlight position based on mouse
      if (spotLightRef.current) {
        spotLightRef.current.position.x = x * 8;
        spotLightRef.current.position.y = y * 6 + 3;
        spotLightRef.current.position.z = 8;
      }

      // Update target camera position (only X axis)
      targetCameraX.current = 5 + x * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Lerp animation for smooth camera movement
  useEffect(() => {
    const animate = () => {
      // Lerp factor for smoothness (0.05 = slow, 0.1 = medium, 0.2 = fast)
      const lerpFactor = 0.08;
      
      // Smoothly interpolate current position to target
      currentCameraX.current += (targetCameraX.current - currentCameraX.current) * lerpFactor;
      
      if (camera) {
        camera.position.x = currentCameraX.current;
        camera.lookAt(0, 0, 0);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [camera]);

  useEffect(() => {
    if (spotLightRef.current && targetRef.current) {
      spotLightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
      
      {/* Enhanced ambient light for better visibility */}
      <ambientLight intensity={1.5} />
      
      {/* Main spotlight that follows mouse */}
      <spotLight
        ref={spotLightRef}
        position={[0, 8, 8]}
        angle={0.6}
        penumbra={0.8}
        intensity={120}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#ffffff"
        distance={100}
        target-position={[0, 0, 0]}
      />
      
      {/* Additional directional lights for better visibility */}
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, 5]} intensity={1.5} />
      
      {/* Target object for spotlight */}
      <object3D ref={targetRef} position={[0, 0, 0]} />
      
      {/* Stronger rim lights for depth and visibility */}
      <pointLight position={[-5, 2, -5]} intensity={20} color="#5a9fd4" />
      <pointLight position={[5, -2, -5]} intensity={15} color="#3a5a7e" />
      
      <Suspense fallback={null}>
        <Model spotLightRef={spotLightRef} />
      </Suspense>
    </>
  );
}

export default function Hero2() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <Canvas className="h-full w-full" shadows>
        <Scene />
      </Canvas>
    </div>
  );
}