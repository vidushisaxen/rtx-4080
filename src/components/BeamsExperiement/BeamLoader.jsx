import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createFlowingBeamMaterial } from "./FlowingBeamShader";
import { degToRad } from "three/src/math/MathUtils";

export default function BeamLoader({ onAnimationComplete }) {
  const { nodes } = useGLTF("/assets/models/BeamModel.glb");

  // Refs for shader materials
  const beamMaterial1 = useRef();
  const beamMaterial2 = useRef();

  // Refs to track animation completion
  const animationComplete1 = useRef(false);
  const animationComplete2 = useRef(false);

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
        
        // Call callback when first animation completes
        if (animationComplete2.current && onAnimationComplete) {
          onAnimationComplete();
        }
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
        
        // Call callback when both animations complete
        if (animationComplete1.current && onAnimationComplete) {
          onAnimationComplete();
        }
      } else {
        flowingBeamMaterial2.uniforms.uTime.value = currentTime;
      }
    }
  });

  return (
    <group dispose={null}>
      <group
        scale={0.015}
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
