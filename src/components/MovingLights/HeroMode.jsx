import { useRef, useEffect } from "react";
import { editable as e } from "@theatre/r3f";
import { gsap } from "gsap";

const { useGLTF } = require("@react-three/drei");

export default function HeroModel({
  modelPath = "/assets/models/model-compressed.glb",
  ...props
}) {
  const group = useRef();
  const { nodes, materials } = useGLTF(modelPath);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!group.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.2;

      gsap.to(group.current.rotation, {
        x: y,
        y: x,
        duration: 1.5,
        ease: "power1.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <e.group
      theatreKey="HeroModel"
      scale={0.015}
      ref={group}
      {...props}
      position={[0, 0, 0]}
      dispose={null}
    >
      <e.pointLight
        theatreKey="PointLight"
        theatreX={10}
        theatreY={10}
        theatreZ={5}
        intensity={1}
        color="#ffffff"
      />
      <e.pointLight
        theatreKey="PointLight2"
        theatreX={10}
        theatreY={10}
        theatreZ={5}
        intensity={1}
        color="#ffffff"
      />
      <group name="Scene">
        <mesh
          name="Cube"
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
        />
        <group name="Sketchfab_model" rotation={[Math.PI, 0, 0]}>
          <group
            name="2fce4507a0554c6cb5f90f77bc6392b2fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
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
                    material={materials.main_material}
                    position={[0, 0, 6.099]}
                    scale={58}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[0, 0, -6.099]}
                    scale={58}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-0.174, 0, 0]}
                    scale={113.581}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-158.797, -29.509, 1.815]}
                    scale={62.427}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-0.031, -0.011, 0]}
                    scale={152.526}
                  >
                    <meshStandardMaterial
                      {...materials.main_material}
                      metalness={1.0}
                      roughness={0}
                      color={"white"}
                      envMapIntensity={5.0}
                      reflectivity={1.0}
                    />
                  </mesh>
                </group>
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
                    material={materials.main_material}
                    position={[-24.918, -7.336, -23.665]}
                    scale={77.693}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[22.714, 54.086, -17.65]}
                    scale={9.552}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-2.437, 0, -24.912]}
                    scale={61.654}
                  />
                  <mesh
                    name="Plastic_Cover_main_material_0001"
                    castShadow
                    receiveShadow
                    geometry={nodes.Plastic_Cover_main_material_0001.geometry}
                    material={materials.main_material}
                    position={[-78.441, 0, -26.05]}
                    scale={69.1}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-145.8, -16.404, -19.823]}
                    scale={42.181}
                  />
                </group>
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
                    material={materials.radiator_1}
                    position={[-1.722, 0, 1.366]}
                    scale={147.126}
                  />
                  <mesh
                    name="Radiator_radiator_2_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Radiator_radiator_2_0.geometry}
                    material={materials.radiator_2}
                    position={[78.487, 0, 0]}
                    scale={67.892}
                  />
                  <mesh
                    name="Radiator_radiator_3_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Radiator_radiator_3_0.geometry}
                    material={materials.radiator_3}
                    position={[-81.388, 0, 5.565]}
                    scale={70.651}
                  />
                </group>
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
                    material={materials.main_material}
                    position={[-8.384, -4.999, -21.152]}
                    scale={53.408}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </e.group>
  );
}
