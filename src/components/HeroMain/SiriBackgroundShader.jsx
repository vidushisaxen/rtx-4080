"use client";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SiriBackgroundShader = ({ 
  opacity = 0.3, 
  color = "#ffffff", 
  intensity = 1.0,
  speed = 1.0,
  rippleCount = 3,
  // New config values
  noiseScale = 8.0,
  noiseIntensity = 0.1,
  noiseSpeed = 0.5,
  attenuationDistance = 1.2,
  attenuationPower = 0.8,
  rimLightPower = 2.0,
  rimLightIntensity = 0.5,
  lightingIntensity = 0.3,
  lightingBase = 0.7,
  depthGradientIntensity = 0.3,
  rippleThickness = 0.25,
  secondaryRippleFrequency = 15.0,
  secondaryRipplePower = 3.0,
  secondaryRippleIntensity = 0.6,
  distanceSoftnessRange = 0.9,
  distanceSoftnessMin = 0.2,
  distanceSoftnessMax = 0.8,
  modulationSpeed1 = 1.0,
  modulationSpeed2 = 0.6,
  modulationIntensity1 = 0.2,
  modulationIntensity2 = 0.15,
  modulationBase1 = 0.8,
  modulationBase2 = 0.85,
  // Sparkle config values
  sparkleCount = 50.0,
  sparkleSize = 0.02,
  sparkleIntensity = 1.5,
  sparkleSpeed = 2.0,
  sparkleFlickerSpeed = 8.0,
  sparkleThreshold = 0.98,
  position = [0, 0, -10],
  scale = [20, 20, 1],
  planeSegments = 32
}) => {
  const meshRef = useRef();
  const timeRef = useRef(0);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uOpacity: { value: opacity },
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uSpeed: { value: speed },
        uRippleCount: { value: rippleCount },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        // New uniforms for config values
        uNoiseScale: { value: noiseScale },
        uNoiseIntensity: { value: noiseIntensity },
        uNoiseSpeed: { value: noiseSpeed },
        uAttenuationDistance: { value: attenuationDistance },
        uAttenuationPower: { value: attenuationPower },
        uRimLightPower: { value: rimLightPower },
        uRimLightIntensity: { value: rimLightIntensity },
        uLightingIntensity: { value: lightingIntensity },
        uLightingBase: { value: lightingBase },
        uDepthGradientIntensity: { value: depthGradientIntensity },
        uRippleThickness: { value: rippleThickness },
        uSecondaryRippleFrequency: { value: secondaryRippleFrequency },
        uSecondaryRipplePower: { value: secondaryRipplePower },
        uSecondaryRippleIntensity: { value: secondaryRippleIntensity },
        uDistanceSoftnessRange: { value: distanceSoftnessRange },
        uDistanceSoftnessMin: { value: distanceSoftnessMin },
        uDistanceSoftnessMax: { value: distanceSoftnessMax },
        uModulationSpeed1: { value: modulationSpeed1 },
        uModulationSpeed2: { value: modulationSpeed2 },
        uModulationIntensity1: { value: modulationIntensity1 },
        uModulationIntensity2: { value: modulationIntensity2 },
        uModulationBase1: { value: modulationBase1 },
        uModulationBase2: { value: modulationBase2 },
        // Sparkle uniforms
        uSparkleCount: { value: sparkleCount },
        uSparkleSize: { value: sparkleSize },
        uSparkleIntensity: { value: sparkleIntensity },
        uSparkleSpeed: { value: sparkleSpeed },
        uSparkleFlickerSpeed: { value: sparkleFlickerSpeed },
        uSparkleThreshold: { value: sparkleThreshold },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uSpeed;
        uniform float uRippleCount;
        uniform vec2 uMousePos;
        uniform float uNoiseScale;
        uniform float uNoiseIntensity;
        uniform float uNoiseSpeed;
        uniform float uAttenuationDistance;
        uniform float uAttenuationPower;
        uniform float uRimLightPower;
        uniform float uRimLightIntensity;
        uniform float uLightingIntensity;
        uniform float uLightingBase;
        uniform float uDepthGradientIntensity;
        uniform float uRippleThickness;
        uniform float uSecondaryRippleFrequency;
        uniform float uSecondaryRipplePower;
        uniform float uSecondaryRippleIntensity;
        uniform float uDistanceSoftnessRange;
        uniform float uDistanceSoftnessMin;
        uniform float uDistanceSoftnessMax;
        uniform float uModulationSpeed1;
        uniform float uModulationSpeed2;
        uniform float uModulationIntensity1;
        uniform float uModulationIntensity2;
        uniform float uModulationBase1;
        uniform float uModulationBase2;
        uniform float uSparkleCount;
        uniform float uSparkleSize;
        uniform float uSparkleIntensity;
        uniform float uSparkleSpeed;
        uniform float uSparkleFlickerSpeed;
        uniform float uSparkleThreshold;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        // Noise function for organic variation
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Smooth noise
        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        // Random function for sparkles
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Generate sparkles
        float generateSparkles(vec2 uv, float time) {
          float sparkles = 0.0;
          
          // Create grid for sparkle positions
          vec2 grid = floor(uv * uSparkleCount);
          vec2 gridUv = fract(uv * uSparkleCount);
          
          // Random position within each grid cell
          vec2 sparklePos = vec2(
            random(grid + vec2(0.0, 0.0)),
            random(grid + vec2(1.0, 0.0))
          );
          
          // Distance from sparkle center
          float dist = distance(gridUv, sparklePos);
          
          // Create sparkle with size control
          float sparkle = 1.0 - smoothstep(0.0, uSparkleSize, dist);
          
          // Add flickering animation
          float flicker = sin(time * uSparkleFlickerSpeed + random(grid) * 6.28) * 0.5 + 0.5;
          flicker = pow(flicker, 3.0); // Make flicker more dramatic
          
          // Add movement animation
          float movement = sin(time * uSparkleSpeed + random(grid + vec2(2.0, 3.0)) * 6.28) * 0.5 + 0.5;
          
          // Threshold for sparkle visibility
          float visibility = step(uSparkleThreshold, random(grid + vec2(4.0, 5.0)));
          
          sparkles += sparkle * flicker * movement * visibility * uSparkleIntensity;
          
          return sparkles;
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 center = vec2(0.5, 0.5);
          
          // Distance from center
          float centerDist = distance(uv, center);
          
          // Add noise for organic variation (configurable)
          float noiseValue = smoothNoise(uv * uNoiseScale + uTime * uNoiseSpeed) * uNoiseIntensity;
          centerDist += noiseValue;
          
          // Create soft expanding ripples from center
          float ripples = 0.0;
          
          // Multiple ripple frequencies with softer transitions
          float ripple1 = sin(centerDist * 25.0 - uTime * uSpeed * 4.0);
          float ripple2 = sin(centerDist * 18.0 - uTime * uSpeed * 3.2) * 0.8;
          float ripple3 = sin(centerDist * 35.0 - uTime * uSpeed * 5.5) * 0.6;
          float ripple4 = sin(centerDist * 12.0 - uTime * uSpeed * 2.5) * 0.9;
          
          // Add phase-shifted ripples for smoother animation
          float ripple5 = sin(centerDist * 22.0 - uTime * uSpeed * 3.8 + 1.57) * 0.7;
          float ripple6 = sin(centerDist * 28.0 - uTime * uSpeed * 4.8 + 3.14) * 0.5;
          
          // Combine ripples with softer blending
          ripples = (ripple1 + ripple2 + ripple3 + ripple4 + ripple5 + ripple6) / 6.0;
          
          // Add smooth amplitude modulation for organic feel (configurable)
          float modulation1 = sin(uTime * uSpeed * uModulationSpeed1) * uModulationIntensity1 + uModulationBase1;
          float modulation2 = sin(uTime * uSpeed * uModulationSpeed2 + 2.1) * uModulationIntensity2 + uModulationBase2;
          ripples *= modulation1 * modulation2;
          
          // Create soft distance-based attenuation (configurable)
          float attenuation = 1.0 - smoothstep(0.0, uAttenuationDistance, centerDist);
          attenuation = pow(attenuation, uAttenuationPower); // Configurable falloff
          
          // Apply intensity and attenuation
          float finalIntensity = (ripples * 0.5 + 0.5) * attenuation * uIntensity;
          finalIntensity = clamp(finalIntensity, 0.0, 1.0);
          
          // Create 3D depth effect using normal-based lighting
          vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
          float NdotL = max(dot(vNormal, lightDir), 0.0);
          
          // Add rim lighting for 3D effect (configurable)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float rimLight = 1.0 - max(dot(vNormal, viewDir), 0.0);
          rimLight = pow(rimLight, uRimLightPower) * uRimLightIntensity;
          
          vec3 backgroundColor = vec3(0.0, 0.0, 0.0); // #000000
          vec3 rippleColor = vec3(0.0, 1.0, 0.5); // Green-cyan
          vec3 rimColor = vec3(0.2, 1.0, 0.6); // Light green for rim
          
          // Use smoothstep for softer edges
          float softRipple = smoothstep(0.3, 0.7, finalIntensity);
          
          // Add secondary soft ripples (configurable)
          float secondaryRipple = smoothstep(0.1, 0.9, abs(sin(finalIntensity * uSecondaryRippleFrequency)));
          secondaryRipple = pow(secondaryRipple, uSecondaryRipplePower) * uSecondaryRippleIntensity;
          
          // Combine ripples with soft blending
          float combinedRipple = max(softRipple, secondaryRipple);
          
          // Apply distance-based softness (configurable)
          float distanceSoftness = 1.0 - smoothstep(0.0, uDistanceSoftnessRange, centerDist);
          combinedRipple *= (uDistanceSoftnessMin + uDistanceSoftnessMax * distanceSoftness);
          
          // Add 3D lighting effects (configurable)
          float lightingEffect = NdotL * uLightingIntensity + uLightingBase;
          combinedRipple *= lightingEffect;
          
          // Generate sparkles
          float sparkles = generateSparkles(uv, uTime);
          
          // Mix colors with 3D effects
          vec3 finalRippleColor = mix(rippleColor, rimColor, rimLight);
          vec3 finalColor = mix(backgroundColor, finalRippleColor, combinedRipple);
          
          // Add sparkles to the final color
          vec3 sparkleColor = vec3(1.0, 1.0, 1.0); // White sparkles
          finalColor = mix(finalColor, sparkleColor, sparkles * attenuation);
          
          // Add subtle depth gradient (configurable)
          float depthGradient = 1.0 - centerDist * uDepthGradientIntensity;
          finalColor *= depthGradient;
          
          // Apply opacity with soft edges
          float alpha = uOpacity * (0.5 + 0.5 * attenuation);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, // Changed to additive for softer blending
    });
  }, [
    opacity, color, intensity, speed, rippleCount,
    noiseScale, noiseIntensity, noiseSpeed,
    attenuationDistance, attenuationPower,
    rimLightPower, rimLightIntensity,
    lightingIntensity, lightingBase,
    depthGradientIntensity, rippleThickness,
    secondaryRippleFrequency, secondaryRipplePower, secondaryRippleIntensity,
    distanceSoftnessRange, distanceSoftnessMin, distanceSoftnessMax,
    modulationSpeed1, modulationSpeed2,
    modulationIntensity1, modulationIntensity2,
    modulationBase1, modulationBase2,
    sparkleCount, sparkleSize, sparkleIntensity,
    sparkleSpeed, sparkleFlickerSpeed, sparkleThreshold
  ]);

  // Update uniforms on each frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta;
      shaderMaterial.uniforms.uTime.value = timeRef.current;
      
      // Update resolution if window size changes
      shaderMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  });

  // Handle mouse movement for interactive effects
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      if (shaderMaterial) {
        const x = event.clientX / window.innerWidth;
        const y = 1.0 - (event.clientY / window.innerHeight); // Flip Y coordinate
        shaderMaterial.uniforms.uMousePos.value.set(x, y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shaderMaterial]);

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1, planeSegments, planeSegments]} />
      <primitive object={shaderMaterial} />
    </mesh>
  );
};

export default SiriBackgroundShader;
