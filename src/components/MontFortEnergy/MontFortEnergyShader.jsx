"use client";
import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import ExperienceMF from "./ExperienceMF";
import CustomSparkles from "./CustomSparkles";
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// Component to configure renderer for procedural shaders
function RendererConfig() {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Get max anisotropic filtering support from WebGL context
    let maxAnisotropy = 1;
    try {
      // Access WebGL context through the renderer's domElement
      const canvas = gl.domElement;
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (context) {
        const ext = context.getExtension('EXT_texture_filter_anisotropic');
        if (ext) {
          maxAnisotropy = context.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1;
        }
      }
    } catch (e) {
      // Fallback to default if extension not supported
      maxAnisotropy = 1;
    }
    
    // Helper function to configure texture for procedural shaders
    const configureTexture = (texture) => {
      if (texture && texture.isTexture) {
        // Disable mipmapping - critical for procedural shaders
        texture.generateMipmaps = false;
        // Use linear filtering for clean sampling
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Enable anisotropic filtering for better quality
        if (maxAnisotropy > 1) {
          texture.anisotropy = Math.min(16, maxAnisotropy);
        }
        
        texture.needsUpdate = true;
      }
    };
    
    // Helper function to configure render target textures (framebuffers)
    const configureRenderTarget = (renderTarget) => {
      if (renderTarget && renderTarget.isWebGLRenderTarget) {
        // Disable mipmap generation on render target textures - critical for procedural shaders
        if (renderTarget.texture) {
          renderTarget.texture.generateMipmaps = false;
          renderTarget.texture.minFilter = THREE.LinearFilter;
          renderTarget.texture.magFilter = THREE.LinearFilter;
          renderTarget.texture.needsUpdate = true;
        }
      }
    };
    
    // Patch WebGLRenderTarget to auto-disable mipmaps for all new instances
    if (!THREE.WebGLRenderTarget._mipmapPatchApplied) {
      const OriginalWebGLRenderTarget = THREE.WebGLRenderTarget;
      const originalSetSize = OriginalWebGLRenderTarget.prototype.setSize;
      
      // Override setSize to ensure mipmaps are disabled
      OriginalWebGLRenderTarget.prototype.setSize = function(width, height, depth) {
        originalSetSize.call(this, width, height, depth);
        if (this.texture) {
          this.texture.generateMipmaps = false;
          this.texture.minFilter = THREE.LinearFilter;
          this.texture.magFilter = THREE.LinearFilter;
        }
      };
      
      THREE.WebGLRenderTarget._mipmapPatchApplied = true;
    }
    
    // Configure all existing textures and render targets in the scene
    scene.traverse((object) => {
      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        
        materials.forEach((material) => {
          // Configure textures in material properties
          for (const key in material) {
            const value = material[key];
            configureTexture(value);
          }
          
          // Configure textures in uniforms (for shader materials)
          if (material.uniforms) {
            Object.values(material.uniforms).forEach((uniform) => {
              if (uniform && uniform.value) {
                configureTexture(uniform.value);
              }
            });
          }
        });
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, [gl, scene]);

  return null;
}

export default function MontFortEnergyShader() {
  return (
    <div
      className="bg-black relative h-screen w-full"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="absolute pointer-events-none top-0 left-0 w-full h-full z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,.5) 100%)",
        }}
      >
        {" "}
      </div>
      <Canvas
        className="bg-black absolute top-0 left-0 w-full h-full"
        flat
        dpr={[2, 3]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{
          fov: 70,
          position: [0, 0, -15],
          near: 0.1,
          far: 45,
        }}
        onCreated={({ gl }) => {
          // Configure renderer for procedural shaders
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          
          // Ensure anisotropic filtering extension is available
          // Access WebGL context through the renderer's domElement
          try {
            const canvas = gl.domElement;
            const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (context) {
              context.getExtension("EXT_texture_filter_anisotropic");
            }
          } catch (e) {
            // Extension might not be available, that's okay
          }
        }}
      >
        <RendererConfig />
        <Stats />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ExperienceMF
          shaderConfig1={{
            color: "#87CEEB",
            numLines: 25.0,
            flowSpeed: 0.3,
            flowIntensity: 1.5,
            baselineIntensity: 0.6,
            baseLineColor: "#87CEEB",
          }}
          shaderConfig2={{
            color: "#87CEEB",
            numLines: 15.0,
            flowSpeed: 0.3,
            flowIntensity: 1.5,
            baselineIntensity: 0.6,
            baseLineColor: "#87CEEB",
          }}
        />
        {/* <EffectComposer>
          <Fluid
            fluidColor="#07251e"
            blend={0.3}
            backgroundColor="#000000"
            rgbShiftIntensity={0.03}
            intensity={0.1}
            force={0.8}
            radius={0.7}
            pressure={0.9}
            densityDissipation={0.91}
            distortion={0.3}
            velocityDissipation={1.0}
            rgbShiftRadius={0.2}
            rgbShiftDirection={{ x: 1.0, y: 0.5 }}
            blendFunction={BlendFunction.DIFFERENCE}
            enableRandomMovement={true}
            randomMovementIdleThreshold={200}
          />
        </EffectComposer> */}
        {/* <EffectComposer>
            <Bloom/>
        </EffectComposer> */}

        <CustomSparkles
          rotation={[degToRad(90), degToRad(0), degToRad(0)]}
          position={[-30, 20, 0]}
          count={100}
          size={3}
          scale={80}
          speed={1}
          color="#87CEEB"
          noise={[15, 15, 15]}
        />

        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
