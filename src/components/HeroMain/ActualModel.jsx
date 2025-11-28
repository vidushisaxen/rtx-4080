import React, { Suspense, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useEnhancedMaterials } from "./MaterialsConfig";
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { gsap } from "gsap";
gsap.registerPlugin(ScrollTrigger);

export default function ActualModel() {
  const { nodes, materials } = useGLTF("/assets/models/BeamModel.glb");
  const enhancedMaterials = useEnhancedMaterials(materials);
  const { camera } = useThree();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCameraUpdate = () => {
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

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

  return (
    <Suspense fallback={null}>
      <group dispose={null}>
        <group
          scale={0.015}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          name="ActualModelScene"
        >
          <group name="Sketchfab_model" rotation={[Math.PI / 2, 0, 0]}>
            <group
              name="2fce4507a0554c6cb5f90f77bc6392b2fbx"
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <group name="Object_2">
                <group name="RootNode">
                  {/* Fan Back */}
                  <group
                    name="Fan_Back"
                    position={[8739.012, -2660, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Fan_Back_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Fan_Back_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[0, 0, 6.099]}
                      scale={58}
                    />
                  </group>

                  {/* Fan Front */}
                  <group
                    name="Fan_Front"
                    position={[-9373.76, 2660, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Fan_Front_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Fan_Front_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[0, 0, -6.099]}
                      scale={58}
                    />
                  </group>

                  {/* Fan Holders */}
                  <group
                    name="Fan_Holders"
                    position={[-300.001, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Fan_Holders_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Fan_Holders_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-0.174, 0, 0]}
                      scale={113.581}
                    />
                  </group>

                  {/* IO Plate */}
                  <group
                    name="IO_Plate"
                    position={[-300, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="IO_Plate_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.IO_Plate_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-158.797, -29.509, 1.815]}
                      scale={62.427}
                    />
                  </group>

                  {/* Metal Case */}
                  <group
                    name="Metal_Case"
                    position={[-300.001, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Metal_Case_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Metal_Case_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-0.031, -0.011, 0]}
                      scale={152.526}
                    />
                  </group>

                  {/* PCB */}
                  <group
                    name="PCB"
                    position={[-300, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="PCB_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.PCB_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-24.918, -7.336, -23.665]}
                      scale={77.693}
                    />
                  </group>

                  {/* Pin Connector */}
                  <group
                    name="Pin_Connector"
                    position={[-300, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Pin_Connector_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Pin_Connector_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[22.714, 54.086, -17.65]}
                      scale={9.552}
                    />
                  </group>

                  {/* Plastic Cover */}
                  <group
                    name="Plastic_Cover"
                    position={[-300.001, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Plastic_Cover_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Plastic_Cover_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-2.437, 0, -24.912]}
                      scale={61.654}
                    />
                    <mesh
                      name="Plastic_Cover_main_material_0001"
                      castShadow
                      receiveShadow
                      geometry={nodes.Plastic_Cover_main_material_0001.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-78.441, 0, -26.05]}
                      scale={69.1}
                    />
                  </group>

                  {/* Ports */}
                  <group
                    name="Ports"
                    position={[-300, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Ports_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Ports_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-145.8, -16.404, -19.823]}
                      scale={42.181}
                    />
                  </group>

                  {/* Radiator */}
                  <group
                    name="Radiator"
                    position={[-300.001, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="Radiator_radiator_1_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Radiator_radiator_1_0.geometry}
                      material={
                        enhancedMaterials.radiator_1 || materials.radiator_1
                      }
                      position={[-1.722, 0, 1.366]}
                      scale={147.126}
                    />
                    <mesh
                      name="Radiator_radiator_2_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Radiator_radiator_2_0.geometry}
                      material={
                        enhancedMaterials.radiator_2 || materials.radiator_2
                      }
                      position={[78.487, 0, 0]}
                      scale={67.892}
                    />
                    <mesh
                      name="Radiator_radiator_3_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Radiator_radiator_3_0.geometry}
                      material={
                        enhancedMaterials.radiator_3 || materials.radiator_3
                      }
                      position={[-81.388, 0, 5.565]}
                      scale={70.651}
                    />
                  </group>

                  {/* VRM */}
                  <group
                    name="VRM"
                    position={[-300, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                  >
                    <mesh
                      name="VRM_main_material_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.VRM_main_material_0.geometry}
                      material={
                        enhancedMaterials.main_material ||
                        materials.main_material
                      }
                      position={[-8.384, -4.999, -21.152]}
                      scale={53.408}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </Suspense>
  );
}
