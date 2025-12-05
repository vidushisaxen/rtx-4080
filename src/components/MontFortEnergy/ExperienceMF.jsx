import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";
import CustomSparkles from "./CustomSparkles";

const EnergyShaderMaterial = ({ config = {} }) => {
  const materialRef = useRef();

  // Default configuration
  const defaultConfig = {
    timeMultiplier: 0.5,
    color: "#87CEEB",
    baseLineColor: "#87CEEB",
    numLines: 15.0, // Reduced from 25
    flowSpeed: 0.4,
    flowIntensity: 1.5,
    baselineIntensity: 0.3,
    lineWidth: 0.03,
    glowIntensity: 0.1,
    turbulence: 0,
  };

  // Merge default config with passed config
  const finalConfig = { ...defaultConfig, ...config };

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime * finalConfig.timeMultiplier;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      depthTest={true}
      polygonOffset
      polygonOffsetFactor={1}
      polygonOffsetUnits={1}
      uniforms={{
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(finalConfig.color) },
        uBaseLineColor: { value: new THREE.Color(finalConfig.baseLineColor) },
        uNumLines: { value: finalConfig.numLines },
        uFlowSpeed: { value: finalConfig.flowSpeed },
        uFlowIntensity: { value: finalConfig.flowIntensity },
        uBaselineIntensity: { value: finalConfig.baselineIntensity },
        uLineWidth: { value: finalConfig.lineWidth },
        uGlowIntensity: { value: finalConfig.glowIntensity },
        uTurbulence: { value: finalConfig.turbulence },
      }}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uBaseLineColor;
        uniform float uNumLines;
        uniform float uFlowSpeed;
        uniform float uFlowIntensity;
        uniform float uBaselineIntensity;
        uniform float uLineWidth;
        uniform float uGlowIntensity;
        uniform float uTurbulence;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main() {
          float linePosition = fract(vUv.x * uNumLines);
          float lineIndex = floor(vUv.x * uNumLines);
          
          // Simplified turbulence
          float turbulence = noise(vec2(lineIndex * 0.1, vUv.y * 2.0 + uTime * 0.2)) * uTurbulence;
          float adjustedLinePos = linePosition + turbulence;
          
          // Create line
          float lineCenter = 0.5;
          float halfWidth = uLineWidth * 0.5;
          float distanceFromCenter = abs(adjustedLinePos - lineCenter);
          float baseLine = 1.0 - smoothstep(halfWidth - 0.01, halfWidth + 0.01, distanceFromCenter);
          
          // Simplified flow with only 2 particles instead of 3
          float randomSeed1 = random(vec2(lineIndex, 1.0));
          float randomSeed2 = random(vec2(lineIndex, 2.0));
          
          float randomSpeed1 = 0.3 + randomSeed1 * 1.2;
          float randomSpeed2 = 0.4 + randomSeed2 * 0.8;
          
          float phaseOffset1 = randomSeed1 * 6.28318;
          float phaseOffset2 = randomSeed2 * 6.28318;
          
          float flow1 = fract(vUv.y + uTime * uFlowSpeed * randomSpeed1 + phaseOffset1);
          float flow2 = fract(vUv.y + uTime * uFlowSpeed * randomSpeed2 + phaseOffset2);
          
          // Simplified particles
          float intensity1 = 0.6 + randomSeed1 * 0.8;
          float intensity2 = 0.5 + randomSeed2 * 0.6;
          
          float particleSize1 = 0.03 + randomSeed1 * 0.02;
          float particleSize2 = 0.025 + randomSeed2 * 0.015;
          
          float particle1 = exp(-pow((flow1 - 0.95) / particleSize1, 2.0)) * intensity1;
          float particle2 = exp(-pow((flow2 - 0.92) / particleSize2, 2.0)) * intensity2;
          
          // Simplified trails
          float trail1 = 0.0;
          float trail2 = 0.0;
          
          if (flow1 < 0.95) {
            float trailPos = (0.95 - flow1) / 0.4;
            trail1 = exp(-trailPos * 3.0) * smoothstep(1.0, 0.0, trailPos) * intensity1 * 0.6;
          }
          
          if (flow2 < 0.92) {
            float trailPos = (0.92 - flow2) / 0.35;
            trail2 = exp(-trailPos * 2.5) * smoothstep(1.0, 0.0, trailPos) * intensity2 * 0.5;
          }
          
          float energyFlow = (particle1 + trail1) + (particle2 + trail2);
          float flowingLine = baseLine * energyFlow * uFlowIntensity;
          float staticLine = baseLine * uBaselineIntensity;
          float finalLine = staticLine + flowingLine;
          
          // Simplified glow
          float glowRadius = uLineWidth * 3.0;
          float glowFalloff = 1.0 - smoothstep(0.0, glowRadius, distanceFromCenter);
          float glow = energyFlow * glowFalloff * uGlowIntensity;
          
          // Vertical fade
          float bottomFade = smoothstep(0.0, 0.15, vUv.y);
          float topFade = smoothstep(1.0, 0.85, vUv.y);
          float verticalFade = bottomFade * topFade;
          
          // Simplified fresnel
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.0);
          
          // Final color
          vec3 staticColor = uBaseLineColor * staticLine;
          vec3 flowingColor = uColor * flowingLine;
          vec3 glowColorFinal = uColor * 1.5 * glow * 0.4;
          
          vec3 finalColor = staticColor + flowingColor + glowColorFinal;
          float alpha = (finalLine * 0.8 + glow * 0.6) * verticalFade * (0.7 + fresnel * 0.3);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `}
    />
  );
};

const AuroraSkyShaderMaterial = ({ config = {} }) => {
  const defaultConfig = {
    primaryColor: "#87CEEB",
    secondaryColor: "#4169E1",
    tertiaryColor: "#1E90FF",
    intensity: 1.0,
    scale: 2.0,
    opacity: 1.0,
  };

  const finalConfig = { ...defaultConfig, ...config };

  return (
    <shaderMaterial
      transparent
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      depthTest={true}
      uniforms={{
        uPrimaryColor: { value: new THREE.Color(finalConfig.primaryColor) },
        uSecondaryColor: { value: new THREE.Color(finalConfig.secondaryColor) },
        uTertiaryColor: { value: new THREE.Color(finalConfig.tertiaryColor) },
        uIntensity: { value: finalConfig.intensity },
        uScale: { value: finalConfig.scale },
        uOpacity: { value: finalConfig.opacity },
      }}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform vec3 uPrimaryColor;
        uniform vec3 uSecondaryColor;
        uniform vec3 uTertiaryColor;
        uniform float uIntensity;
        uniform float uScale;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          
          // Reduced from 6 to 3 iterations
          for (int i = 0; i < 3; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 scaledUv = vUv * uScale;
          
          // Reduced to 2 aurora layers instead of 3
          float aurora1 = fbm(scaledUv + vec2(0.5, 0.2));
          float aurora2 = fbm(scaledUv * 1.5 + vec2(0.8, 0.6));
          
          float band1 = sin(scaledUv.x * 3.14159 + aurora1 * 2.0) * 0.5 + 0.5;
          float band2 = sin(scaledUv.x * 2.5 + aurora2 * 1.5) * 0.5 + 0.5;
          
          float verticalGradient = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          
          vec3 color1 = uPrimaryColor * band1 * aurora1;
          vec3 color2 = uSecondaryColor * band2 * aurora2;
          
          vec3 finalColor = (color1 + color2) * verticalGradient * uIntensity;
          
          float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
          float auroraIntensity = (aurora1 + aurora2) * 0.5;
          
          float alpha = auroraIntensity * verticalGradient * edgeFade * uOpacity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `}
    />
  );
};

export default function ExperienceMF({
  shaderConfig1,
  shaderConfig2,
  auroraConfig,
  ...props
}) {
  const { nodes } = useGLTF("/fort-energy.glb");

  return (
    <>
      <group
        {...props}
        rotation={[degToRad(0), Math.PI, 0]}
        scale={0.05}
        dispose={null}
      >
        <group scale={3.5}>
          <mesh
            scale={[1, 3, 1]}
            castShadow
            receiveShadow
            geometry={nodes.EnergyBackGround.geometry}
            renderOrder={0}
            position={[0, -65.224, -0]}
          >
            <AuroraSkyShaderMaterial config={auroraConfig} />
          </mesh>
        
        </group>
        <group position={[0, -50, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.EnergyCylinder.geometry}
            position={[0, 4.21, 0]}
            renderOrder={2}
          >
            <EnergyShaderMaterial config={shaderConfig1} />
          </mesh>

          <mesh
            castShadow
            receiveShadow
            rotation={[0, degToRad(0), 0]}
            geometry={nodes.EnergyCone.geometry}
            position={[0, 4.21, 0]}
            renderOrder={1}
          >
            <EnergyShaderMaterial config={shaderConfig2} />
          </mesh>
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/fort-energy.glb");
