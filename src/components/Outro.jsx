"use client"
import React, { Suspense, useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera, SoftShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function Model({...props }) {
  const groupRef = useRef();
  const fanRotationRef = useRef();

  const { nodes, materials } = useGLTF("/assets/models/model.glb");
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
      scale={0.025}
      position={[1, -2, 0]}
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
  return (
    <>
      <PerspectiveCamera makeDefault position={[0,0,10]} fov={75} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, 5]} intensity={1.5} />
      {/* <object3D position={[0, 0, 0]} /> */}
      <pointLight position={[-5, 2, -5]} intensity={20} color="#5a9fd4" />
      <pointLight position={[5, -2, -5]} intensity={15} color="#3a5a7e" />
      <Suspense fallback={null}>
        <Model/>
      </Suspense>
      <SoftShadows samples={3}/>
    </>
  );
}

export default function Outro() {
  return (
    <div className="h-screen w-full bg-black overflow-visible!">
      <Canvas className="h-full w-full" shadows>
        <Scene />
      </Canvas>
    </div>
  );
}