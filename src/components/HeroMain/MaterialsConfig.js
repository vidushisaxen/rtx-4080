import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

// Texture paths configuration
export const TEXTURE_PATHS = {
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
};

// Texture configuration function
export const configureTexture = (texture, isColorSpace = false) => {
  if (!texture) return;
  
  if (isColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.flipY = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
};

// Hook to load and configure all textures
export const useConfiguredTextures = () => {
  const textures = useTexture(TEXTURE_PATHS);

  // Configure texture properties
  useMemo(() => {
    if (!textures) return;

    // Configure main material textures
    configureTexture(textures.mainBaseColor, true);
    configureTexture(textures.mainEmissive, true);
    configureTexture(textures.mainMetallicRoughness);
    configureTexture(textures.mainNormal);

    // Configure radiator 1 textures
    configureTexture(textures.radiator1BaseColor, true);
    configureTexture(textures.radiator1MetallicRoughness);
    configureTexture(textures.radiator1Normal);

    // Configure radiator 2 textures
    configureTexture(textures.radiator2BaseColor, true);
    configureTexture(textures.radiator2MetallicRoughness);
    configureTexture(textures.radiator2Normal);

    // Configure radiator 3 textures
    configureTexture(textures.radiator3BaseColor, true);
    configureTexture(textures.radiator3MetallicRoughness);
    configureTexture(textures.radiator3Normal);
  }, [textures]);

  return textures;
};

// Enhanced materials creation
export const createEnhancedMaterials = (materials, textures) => {
  if (!textures || !materials) return {};

  const newMaterials = {};

  // Enhanced main material
  if (materials.main_material && textures.mainBaseColor) {
    newMaterials.main_material = new THREE.MeshStandardMaterial({
      name: "enhanced_main_material",
      map: textures.mainBaseColor,
      emissiveMap: textures.mainEmissive,
      metalnessMap: textures.mainMetallicRoughness,
      roughnessMap: textures.mainMetallicRoughness,
      normalMap: textures.mainNormal,
      aoMap: textures.mainMetallicRoughness,
      metalness: 1.0,
      roughness: 1.0,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.0,
      normalScale: new THREE.Vector2(1, 1),
      aoMapIntensity: 1.0,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }

  // Enhanced radiator 1 material
  if (materials.radiator_1 && textures.radiator1BaseColor) {
    newMaterials.radiator_1 = new THREE.MeshStandardMaterial({
      name: "enhanced_radiator_1",
      map: textures.radiator1BaseColor,
      metalnessMap: textures.radiator1MetallicRoughness,
      roughnessMap: textures.radiator1MetallicRoughness,
      normalMap: textures.radiator1Normal,
      aoMap: textures.radiator1MetallicRoughness,
      metalness: 1.0,
      roughness: 1.0,
      normalScale: new THREE.Vector2(1, 1),
      aoMapIntensity: 1.0,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }

  // Enhanced radiator 2 material
  if (materials.radiator_2 && textures.radiator2BaseColor) {
    newMaterials.radiator_2 = new THREE.MeshStandardMaterial({
      name: "enhanced_radiator_2",
      map: textures.radiator2BaseColor,
      metalnessMap: textures.radiator2MetallicRoughness,
      roughnessMap: textures.radiator2MetallicRoughness,
      normalMap: textures.radiator2Normal,
      aoMap: textures.radiator2MetallicRoughness,
      metalness: 1.0,
      roughness: 1.0,
      normalScale: new THREE.Vector2(1, 1),
      aoMapIntensity: 1.0,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }

  // Enhanced radiator 3 material
  if (materials.radiator_3 && textures.radiator3BaseColor) {
    newMaterials.radiator_3 = new THREE.MeshStandardMaterial({
      name: "enhanced_radiator_3",
      map: textures.radiator3BaseColor,
      metalnessMap: textures.radiator3MetallicRoughness,
      roughnessMap: textures.radiator3MetallicRoughness,
      normalMap: textures.radiator3Normal,
      aoMap: textures.radiator3MetallicRoughness,
      metalness: 1.0,
      roughness: 1.0,
      normalScale: new THREE.Vector2(1, 1),
      aoMapIntensity: 1.0,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }

  return newMaterials;
};

// Hook to get enhanced materials
export const useEnhancedMaterials = (materials) => {
  const textures = useConfiguredTextures();
  
  const enhancedMaterials = useMemo(() => {
    return createEnhancedMaterials(materials, textures);
  }, [materials, textures]);

  return enhancedMaterials;
};
