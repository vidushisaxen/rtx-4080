import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createFlowingBeamMaterial } from "./FlowingBeamShader";
import { degToRad } from "three/src/math/MathUtils";

export default function BeamLoader({ 
  BeamLoaderRef, 
  shaderOpacity = 1.0, 
  isModelLoaded = false,
  progress = 0,
  loaded = 0,
  total = 0
}) {
  const { nodes } = useGLTF("/assets/models/BeamModel.glb");

  // Refs for shader materials
  const beamMaterial1 = useRef();
  const beamMaterial2 = useRef();

  // Create flowing beam shader materials
  const flowingBeamMaterial1 = useMemo(() => createFlowingBeamMaterial(), []);
  const flowingBeamMaterial2 = useMemo(() => createFlowingBeamMaterial(), []);

  // Animation loop for shader uniforms - only run when model is loaded
  useFrame((state) => {
    // Only start shader animation after model is fully loaded (progress = 100%)
    if (progress < 100) return;

    const currentTime = state.clock.elapsedTime;

    // Update material 1 uniforms
    if (flowingBeamMaterial1 && flowingBeamMaterial1.uniforms) {
      flowingBeamMaterial1.uniforms.uTime.value = currentTime;
      flowingBeamMaterial1.uniforms.uOpacity.value = shaderOpacity;
    }

    // Update material 2 uniforms
    if (flowingBeamMaterial2 && flowingBeamMaterial2.uniforms) {
      flowingBeamMaterial2.uniforms.uTime.value = currentTime;
      flowingBeamMaterial2.uniforms.uOpacity.value = shaderOpacity;
    }

    // Set materials as transparent
    if (flowingBeamMaterial1) {
      flowingBeamMaterial1.transparent = true;
    }
    if (flowingBeamMaterial2) {
      flowingBeamMaterial2.transparent = true;
    }
  });

  return (
    <group ref={BeamLoaderRef} dispose={null}>
      <group
        scale={0.015 * 1.0}
        position={[0, -1.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        name="BeamLoaderScene"
      >
        <group name="Sketchfab_model" rotation={[Math.PI / 2, 0, 0]}>
          <group
            name="2fce4507a0554c6cb5f90f77bc6392b2fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                {/* Beam Case 1 */}
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
                
                {/* Beam Case 2 */}
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
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
