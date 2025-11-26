import React, { useEffect, useRef, useMemo, Suspense } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import * as THREE from "three";

export default function ModelExperience({
  cameraAngle,
  setCameraAngle,
  fanRotationRef,
  toggleFanRotation,
  ...props
}) {
  const groupRef = useRef();
  gsap.registerPlugin(ScrollTrigger);
  const { nodes, materials } = useGLTF("/assets/models/model-compressed.glb");
  console.log(nodes, nodes.Plastic_Cover_main_material_0.geometry);

  const { camera } = useThree();

  // Load all textures
  const textures = useTexture({
    // Main material textures
    mainBaseColor: "/assets/models/textures/main_material_baseColorEdited.png",
    mainEmissive: "/assets/models/textures/main_material_emissiveEdited.png",
    mainMetallicRoughness: "/assets/models/textures/main_material_metallicRoughnessEdited.png",
    mainNormal: "/assets/models/textures/main_material_normal.png",
    
    // Radiator 1 textures
    radiator1BaseColor: "/assets/models/textures/radiator_1_baseColor.png",
    radiator1MetallicRoughness: "/assets/models/textures/radiator_1_metallicRoughness.png",
    radiator1Normal: "/assets/models/textures/radiator_1_normal.png",
    
    // Radiator 2 textures
    radiator2BaseColor: "/assets/models/textures/radiator_2_baseColor.png",
    radiator2MetallicRoughness: "/assets/models/textures/radiator_2_metallicRoughness.png",
    radiator2Normal: "/assets/models/textures/radiator_2_normal.png",
    
    // Radiator 3 textures
    radiator3BaseColor: "/assets/models/textures/radiator_3_baseColor.png",
    radiator3MetallicRoughness: "/assets/models/textures/radiator_3_metallicRoughness.png",
    radiator3Normal: "/assets/models/textures/radiator_3_normal.png",
  });
  // Configure texture properties
  useMemo(() => {
    if (!textures) return;

    // Configure main material textures
    if (textures.mainBaseColor) {
      textures.mainBaseColor.colorSpace = THREE.SRGBColorSpace;
      textures.mainBaseColor.flipY = false;
      textures.mainBaseColor.wrapS = THREE.RepeatWrapping;
      textures.mainBaseColor.wrapT = THREE.RepeatWrapping;
      textures.mainBaseColor.magFilter = THREE.LinearFilter;
      textures.mainBaseColor.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.mainEmissive) {
      textures.mainEmissive.colorSpace = THREE.SRGBColorSpace;
      textures.mainEmissive.flipY = false;
      textures.mainEmissive.wrapS = THREE.RepeatWrapping;
      textures.mainEmissive.wrapT = THREE.RepeatWrapping;
      textures.mainEmissive.magFilter = THREE.LinearFilter;
      textures.mainEmissive.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.mainMetallicRoughness) {
      textures.mainMetallicRoughness.flipY = false;
      textures.mainMetallicRoughness.wrapS = THREE.RepeatWrapping;
      textures.mainMetallicRoughness.wrapT = THREE.RepeatWrapping;
      textures.mainMetallicRoughness.magFilter = THREE.LinearFilter;
      textures.mainMetallicRoughness.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.mainNormal) {
      textures.mainNormal.flipY = false;
      textures.mainNormal.wrapS = THREE.RepeatWrapping;
      textures.mainNormal.wrapT = THREE.RepeatWrapping;
      textures.mainNormal.magFilter = THREE.LinearFilter;
      textures.mainNormal.minFilter = THREE.LinearMipmapLinearFilter;
    }

    // Configure radiator 1 textures
    if (textures.radiator1BaseColor) {
      textures.radiator1BaseColor.colorSpace = THREE.SRGBColorSpace;
      textures.radiator1BaseColor.flipY = false;
      textures.radiator1BaseColor.wrapS = THREE.RepeatWrapping;
      textures.radiator1BaseColor.wrapT = THREE.RepeatWrapping;
      textures.radiator1BaseColor.magFilter = THREE.LinearFilter;
      textures.radiator1BaseColor.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator1MetallicRoughness) {
      textures.radiator1MetallicRoughness.flipY = false;
      textures.radiator1MetallicRoughness.wrapS = THREE.RepeatWrapping;
      textures.radiator1MetallicRoughness.wrapT = THREE.RepeatWrapping;
      textures.radiator1MetallicRoughness.magFilter = THREE.LinearFilter;
      textures.radiator1MetallicRoughness.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator1Normal) {
      textures.radiator1Normal.flipY = false;
      textures.radiator1Normal.wrapS = THREE.RepeatWrapping;
      textures.radiator1Normal.wrapT = THREE.RepeatWrapping;
      textures.radiator1Normal.magFilter = THREE.LinearFilter;
      textures.radiator1Normal.minFilter = THREE.LinearMipmapLinearFilter;
    }

    // Configure radiator 2 textures
    if (textures.radiator2BaseColor) {
      textures.radiator2BaseColor.colorSpace = THREE.SRGBColorSpace;
      textures.radiator2BaseColor.flipY = false;
      textures.radiator2BaseColor.wrapS = THREE.RepeatWrapping;
      textures.radiator2BaseColor.wrapT = THREE.RepeatWrapping;
      textures.radiator2BaseColor.magFilter = THREE.LinearFilter;
      textures.radiator2BaseColor.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator2MetallicRoughness) {
      textures.radiator2MetallicRoughness.flipY = false;
      textures.radiator2MetallicRoughness.wrapS = THREE.RepeatWrapping;
      textures.radiator2MetallicRoughness.wrapT = THREE.RepeatWrapping;
      textures.radiator2MetallicRoughness.magFilter = THREE.LinearFilter;
      textures.radiator2MetallicRoughness.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator2Normal) {
      textures.radiator2Normal.flipY = false;
      textures.radiator2Normal.wrapS = THREE.RepeatWrapping;
      textures.radiator2Normal.wrapT = THREE.RepeatWrapping;
      textures.radiator2Normal.magFilter = THREE.LinearFilter;
      textures.radiator2Normal.minFilter = THREE.LinearMipmapLinearFilter;
    }

    // Configure radiator 3 textures
    if (textures.radiator3BaseColor) {
      textures.radiator3BaseColor.colorSpace = THREE.SRGBColorSpace;
      textures.radiator3BaseColor.flipY = false;
      textures.radiator3BaseColor.wrapS = THREE.RepeatWrapping;
      textures.radiator3BaseColor.wrapT = THREE.RepeatWrapping;
      textures.radiator3BaseColor.magFilter = THREE.LinearFilter;
      textures.radiator3BaseColor.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator3MetallicRoughness) {
      textures.radiator3MetallicRoughness.flipY = false;
      textures.radiator3MetallicRoughness.wrapS = THREE.RepeatWrapping;
      textures.radiator3MetallicRoughness.wrapT = THREE.RepeatWrapping;
      textures.radiator3MetallicRoughness.magFilter = THREE.LinearFilter;
      textures.radiator3MetallicRoughness.minFilter = THREE.LinearMipmapLinearFilter;
    }
    if (textures.radiator3Normal) {
      textures.radiator3Normal.flipY = false;
      textures.radiator3Normal.wrapS = THREE.RepeatWrapping;
      textures.radiator3Normal.wrapT = THREE.RepeatWrapping;
      textures.radiator3Normal.magFilter = THREE.LinearFilter;
      textures.radiator3Normal.minFilter = THREE.LinearMipmapLinearFilter;
    }
  }, [textures]);

  // Create enhanced materials with textures
  const enhancedMaterials = useMemo(() => {
    if (!textures || !materials) return {};
    
    const newMaterials = {};

    // Enhanced main material
    if (materials.main_material && textures.mainBaseColor) {
      newMaterials.main_material = new THREE.MeshStandardMaterial({
        name: 'enhanced_main_material',
        map: textures.mainBaseColor,
        emissiveMap: textures.mainEmissive,
        metalnessMap: textures.mainMetallicRoughness,
        roughnessMap: textures.mainMetallicRoughness,
        normalMap: textures.mainNormal,
        aoMap: textures.mainMetallicRoughness, // Use as occlusion map
        // Set default material properties from GLTF
        metalness: 1.0, // Use texture values
        roughness: 1.0, // Use texture values
        emissive: new THREE.Color(0xffffff), // White emissive as per GLTF
        emissiveIntensity: 1.0,
        normalScale: new THREE.Vector2(1, 1),
        aoMapIntensity: 1.0,
        // Match GLTF properties
        side: THREE.DoubleSide,
        transparent: false,
      });
    }

    // Enhanced radiator 1 material
    if (materials.radiator_1 && textures.radiator1BaseColor) {
      newMaterials.radiator_1 = new THREE.MeshStandardMaterial({
        name: 'enhanced_radiator_1',
        map: textures.radiator1BaseColor,
        metalnessMap: textures.radiator1MetallicRoughness,
        roughnessMap: textures.radiator1MetallicRoughness,
        normalMap: textures.radiator1Normal,
        aoMap: textures.radiator1MetallicRoughness, // Use as occlusion map
        metalness: 1.0, // Use texture values
        roughness: 1.0, // Use texture values
        normalScale: new THREE.Vector2(1, 1),
        aoMapIntensity: 1.0,
        side: THREE.DoubleSide,
        transparent: false,
      });
    }

    // Enhanced radiator 2 material
    if (materials.radiator_2 && textures.radiator2BaseColor) {
      newMaterials.radiator_2 = new THREE.MeshStandardMaterial({
        name: 'enhanced_radiator_2',
        map: textures.radiator2BaseColor,
        metalnessMap: textures.radiator2MetallicRoughness,
        roughnessMap: textures.radiator2MetallicRoughness,
        normalMap: textures.radiator2Normal,
        aoMap: textures.radiator2MetallicRoughness, // Use as occlusion map
        metalness: 1.0, // Use texture values
        roughness: 1.0, // Use texture values
        normalScale: new THREE.Vector2(1, 1),
        aoMapIntensity: 1.0,
        side: THREE.DoubleSide,
        transparent: false,
      });
    }

    // Enhanced radiator 3 material
    if (materials.radiator_3 && textures.radiator3BaseColor) {
      newMaterials.radiator_3 = new THREE.MeshStandardMaterial({
        name: 'enhanced_radiator_3',
        map: textures.radiator3BaseColor,
        metalnessMap: textures.radiator3MetallicRoughness,
        roughnessMap: textures.radiator3MetallicRoughness,
        normalMap: textures.radiator3Normal,
        aoMap: textures.radiator3MetallicRoughness, // Use as occlusion map
        metalness: 1.0, // Use texture values
        roughness: 1.0, // Use texture values
        normalScale: new THREE.Vector2(1, 1),
        aoMapIntensity: 1.0,
        side: THREE.DoubleSide,
        transparent: false,
      });
    }

    console.log("Enhanced materials created:", newMaterials);
    return newMaterials;
  }, [materials, textures]);

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
    <Suspense fallback={null}>
      <group {...props} dispose={null}>
        <group scale={0.025} position={[0, -0.9, 0]} ref={groupRef} name="Scene">
        <mesh
          name="Cube"
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
        />
        <group name="Sketchfab_model" rotation={[Math.PI / 2, 0, 0]}>
          <group
            name="2fce4507a0554c6cb5f90f77bc6392b2fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Fan_Back"
                  ref={fanRotationRef}
                  position={[8739.012, -2660, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={100}
                >
                  <mesh
                    name="Fan_Back_main_material_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Fan_Back_main_material_0.geometry}
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
                    position={[-0.031, -0.011, 0]}
                    scale={152.526}
                  />
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
                    position={[-2.437, 0, -24.912]}
                    scale={61.654}
                  />
                  <mesh
                    name="Plastic_Cover_main_material_0001"
                    castShadow
                    receiveShadow
                    geometry={nodes.Plastic_Cover_main_material_0001.geometry}
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
                    material={enhancedMaterials.radiator_1 || materials.radiator_1}
                    position={[-1.722, 0, 1.366]}
                    scale={147.126}
                  />
                  <mesh
                    name="Radiator_radiator_2_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Radiator_radiator_2_0.geometry}
                    material={enhancedMaterials.radiator_2 || materials.radiator_2}
                    position={[78.487, 0, 0]}
                    scale={67.892}
                  />
                  <mesh
                    name="Radiator_radiator_3_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Radiator_radiator_3_0.geometry}
                    material={enhancedMaterials.radiator_3 || materials.radiator_3}
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
                    material={enhancedMaterials.main_material || materials.main_material}
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
