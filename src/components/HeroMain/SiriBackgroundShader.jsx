"use client";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SiriBackgroundShader = ({ 
  opacity = 0.8, 
  color = "#76b900", // NVIDIA signature green
  intensity = 1.0,
  gridSize = 25.0,
  gridThickness = 0.02,
  gridIntensity = 0.05,
  gridFadeDistance = 1.5,
  position = [0, 0, -15],
  scale = [40, 40, 1],
  planeSegments = 64,
  // Dot configuration
  dotCount = 8.0, // Total number of dots across entire grid
  dotSize = 0.02,
  dotSpeed = 0.15,
  dotIntensity = .1
}) => {
  const meshRef = useRef();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uOpacity: { value: opacity },
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        // Grid uniforms
        uGridSize: { value: gridSize },
        uGridThickness: { value: gridThickness },
        uGridIntensity: { value: gridIntensity },
        uGridFadeDistance: { value: gridFadeDistance },
        // Dot uniforms
        uDotCount: { value: dotCount },
        uDotSize: { value: dotSize },
        uDotSpeed: { value: dotSpeed },
        uDotIntensity: { value: dotIntensity },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying float vDistance;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vDistance = distance(worldPosition.xyz, cameraPosition);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 uResolution;
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform vec2 uMousePos;
        uniform float uTime;
        uniform float uGridSize;
        uniform float uGridThickness;
        uniform float uGridIntensity;
        uniform float uGridFadeDistance;
        uniform float uDotCount;
        uniform float uDotSize;
        uniform float uDotSpeed;
        uniform float uDotIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        varying float vDistance;
        
        // NVIDIA color palette
        #define NVIDIA_BLACK vec3(0.008, 0.012, 0.018)
        #define NVIDIA_DARK_GRAY vec3(0.025, 0.03, 0.035)
        #define NVIDIA_GREEN vec3(0.463, 0.725, 0.0)
        #define NVIDIA_BRIGHT_GREEN vec3(0.6, 0.9, 0.1)
        #define NVIDIA_CYAN vec3(0.0, 0.7, 0.5)
        
        // Grid pattern function
        vec2 gridPattern(vec2 uv, float size) {
          vec2 grid = abs(fract(uv * size) - 0.5);
          return grid;
        }
        
        // Static grid lines
        float staticGrid(vec2 uv) {
          vec2 grid = gridPattern(uv, uGridSize);
          
          // Create grid lines
          float gridLines = min(grid.x, grid.y);
          gridLines = 1.0 - smoothstep(0.0, uGridThickness, gridLines);
          
          return gridLines;
        }
        
        // Distance-based fade
        float distanceFade(vec2 uv) {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(uv, center);
          return 1.0 - smoothstep(0.0, uGridFadeDistance, dist);
        }
        
        // Mouse interaction effect
        float mouseEffect(vec2 uv, vec2 mousePos) {
          float mouseDist = distance(uv, mousePos);
          float mouseInfluence = 1.0 - smoothstep(0.0, 0.3, mouseDist);
          return mouseInfluence * 0.5 + 0.5;
        }
        
        // Flowing dots on grid edges
        float flowingDots(vec2 uv) {
          float dots = 0.0;
          
          // Calculate grid lines position
          vec2 scaledUV = uv * uGridSize;
          vec2 gridUV = fract(scaledUV);
          vec2 grid = abs(gridUV - 0.5) * 2.0; // Distance from center of cell to edges
          
          // Check if we're near a grid line
          float nearHorizontal = 1.0 - smoothstep(0.0, uGridThickness * 2.0, grid.y);
          float nearVertical = 1.0 - smoothstep(0.0, uGridThickness * 2.0, grid.x);
          float onGridLine = max(nearHorizontal, nearVertical);
          
          // Only calculate dots if we're on a grid line
          if(onGridLine > 0.1) {
            for(float i = 0.0; i < 20.0; i++) {
              if(i >= uDotCount) break;
              
              // Create unique position for each dot
              float dotId = i / uDotCount;
              float time = uTime * uDotSpeed + dotId * 6.28318; // Different phase for each dot
              
              // Determine if dot is on horizontal or vertical line
              float isHorizontal = step(0.5, fract(dotId * 2.0));
              
              vec2 dotPos;
              if(isHorizontal > 0.5) {
                // Horizontal line - move along X axis
                float xPos = fract(time * 0.5 + dotId * 0.7);
                dotPos = vec2(xPos, 0.5); // Stay at center of horizontal line
              } else {
                // Vertical line - move along Y axis
                float yPos = fract(time * 0.5 + dotId * 0.7);
                dotPos = vec2(0.5, yPos); // Stay at center of vertical line
              }
              
              // Calculate distance from current position to dot
              float dist = distance(gridUV, dotPos);
              
              // Create dot with glow
              float dotCore = 1.0 - smoothstep(0.0, uDotSize, dist);
              float dotGlow = (1.0 - smoothstep(0.0, uDotSize * 4.0, dist)) * 0.3;
              
              dots += (dotCore + dotGlow) * onGridLine;
            }
          }
          
          return clamp(dots * uDotIntensity, 0.0, 1.0);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Generate static grid
          float grid = staticGrid(uv);
          
          // Generate flowing dots
          float dots = flowingDots(uv);
          
          // Apply distance fade
          float fade = distanceFade(uv);
          
          // Apply mouse interaction
          float mouseInfluence = mouseEffect(uv, uMousePos);
          
          // Combine effects
          float finalGrid = grid * fade * mouseInfluence * uGridIntensity;
          
          // Color composition
          vec3 backgroundColor = NVIDIA_BLACK;
          vec3 gridColor = NVIDIA_GREEN;
          vec3 accentColor = NVIDIA_CYAN;
          vec3 brightColor = NVIDIA_BRIGHT_GREEN;
          
          // Static color mixing
          vec3 dynamicGridColor = mix(gridColor, brightColor, finalGrid * 0.3);
          dynamicGridColor = mix(dynamicGridColor, accentColor, 0.2);
          
          // Final color
          vec3 finalColor = backgroundColor;
          finalColor = mix(finalColor, NVIDIA_DARK_GRAY, 0.1); // Subtle ambient
          finalColor = mix(finalColor, dynamicGridColor, finalGrid * uIntensity);
          
          // Add flowing dots
          vec3 dotColor = mix(brightColor, accentColor, 0.5);
          finalColor = mix(finalColor, dotColor, dots * fade * 0.8);
          
          // Add subtle glow effect
          float glow = finalGrid * 0.3 + dots * 0.5;
          finalColor += dynamicGridColor * glow;
          
          // Calculate alpha
          float alpha = uOpacity * (0.4 + 0.6 * fade);
          alpha *= (0.5 + 0.5 * finalGrid);
          alpha = clamp(alpha, 0.0, 1.0);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });
  }, [
    opacity, color, intensity,
    gridSize, gridThickness, gridIntensity,
    gridFadeDistance
  ]);

  // Frame updates for resolution and time
  useFrame((state) => {
    if (meshRef.current && shaderMaterial) {
      if (typeof window !== 'undefined') {
        shaderMaterial.uniforms.uResolution.value.set(
          window.innerWidth || 1920,
          window.innerHeight || 1080
        );
      }
      // Update time for dot animation
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Mouse interaction
  React.useEffect(() => {
    let targetMousePos = { x: 0.5, y: 0.5 };
    let currentMousePos = { x: 0.5, y: 0.5 };
    
    const handleMouseMove = (event) => {
      if (typeof window !== 'undefined') {
        targetMousePos.x = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
        targetMousePos.y = Math.max(0, Math.min(1, 1.0 - (event.clientY / window.innerHeight)));
      }
    };
    
    const updateMousePos = () => {
      const lerp = 0.08;
      currentMousePos.x += (targetMousePos.x - currentMousePos.x) * lerp;
      currentMousePos.y += (targetMousePos.y - currentMousePos.y) * lerp;
      
      if (shaderMaterial) {
        shaderMaterial.uniforms.uMousePos.value.set(currentMousePos.x, currentMousePos.y);
      }
      
      requestAnimationFrame(updateMousePos);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      updateMousePos();
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [shaderMaterial]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} renderOrder={-1}>
      <planeGeometry args={[1, 1, planeSegments, planeSegments]} />
      <primitive object={shaderMaterial} />
    </mesh>
  );
};

export default SiriBackgroundShader;