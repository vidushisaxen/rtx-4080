import React, { useMemo, Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createFlowingBeamMaterial } from "./FlowingBeamShader";
import { useEnhancedMaterials } from "./MaterialsConfig";
import { degToRad } from "three/src/math/MathUtils";

export default function BeamsModel({ setShowModel, showModel }) {
  const { nodes, materials } = useGLTF("/assets/models/BeamModel.glb");
  console.log(nodes);

  // Refs for shader materials
  const beamMaterial1 = useRef();
  const beamMaterial2 = useRef();

  // Refs to track animation completion
  const animationComplete1 = useRef(false);
  const animationComplete2 = useRef(false);

  // Get enhanced materials with textures
  const enhancedMaterials = useEnhancedMaterials(materials);



  // Create flowing beam shader materials
  const flowingBeamMaterial1 = useMemo(() => createFlowingBeamMaterial(), []);
  const flowingBeamMaterial2 = useMemo(() => createFlowingBeamMaterial(), []);

  // Animation loop for shader uniforms
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;
    const flowSpeed = 0.1; // Should match the uFlowSpeed in shader
    const animationDuration = 4.0 / flowSpeed; // Total time for one complete cycle

    // Update material 1 uniforms only if animation hasn't completed
    if (
      flowingBeamMaterial1 &&
      flowingBeamMaterial1.uniforms &&
      !animationComplete1.current
    ) {
      const totalProgress = currentTime * flowSpeed;
      if (totalProgress >= 4.0) {
        // Animation completed, stop updating
        animationComplete1.current = true;
        flowingBeamMaterial1.uniforms.uTime.value = animationDuration;
      } else {
        flowingBeamMaterial1.uniforms.uTime.value = currentTime;
      }
    }

    // Update material 2 uniforms only if animation hasn't completed
    if (
      flowingBeamMaterial2 &&
      flowingBeamMaterial2.uniforms &&
      !animationComplete2.current
    ) {
      const totalProgress = currentTime * flowSpeed;
      if (totalProgress >= 4.0) {
        // Animation completed, stop updating
        animationComplete2.current = true;
        flowingBeamMaterial2.uniforms.uTime.value = animationDuration;
      } else {
        flowingBeamMaterial2.uniforms.uTime.value = currentTime;
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <group dispose={null}>
        <group
          scale={0.015}
          position={[0, -1.2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          name="Scene"
        >
          {showModel && (
            <mesh
              name="Cube"
              castShadow
              receiveShadow
              geometry={nodes.Cube.geometry}
              material={materials.Material}
            />
          )}
          <group name="Sketchfab_model" rotation={[Math.PI / 2, 0, 0]}>
            <group
              name="2fce4507a0554c6cb5f90f77bc6392b2fbx"
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <group name="Object_2">
                <group name="RootNode">
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}

                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {!showModel && (
                  <group>
                    <group
                      name="BeamCase"
                      position={[-300.001, -180, 0]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    >
                      <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Metal_Case_main_material_0001.geometry}
                        position={[-0.031, -0.011, 0]}
                        scale={152.526}
                        material={flowingBeamMaterial1}
                        ref={beamMaterial1}
                      />
                    </group>
                    <group
                      name="BeamCase2"
                      position={[-300.001, -180, 0]}
                      rotation={[-Math.PI / 2, degToRad(0), degToRad(180)]}
                      scale={100}
                    >
                      <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Metal_Case_main_material_0001.geometry}
                        scale={152.526}
                        material={flowingBeamMaterial2}
                        ref={beamMaterial2}
                      />
                    </group>
                  </group>
                  )}

                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                  {showModel && (
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
                  )}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </Suspense>
  );
}
