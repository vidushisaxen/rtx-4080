import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CustomSparkles = ({
  count = 200,
  size = 25,
  scale = 350,
  speed = 1,
  color = "#87CEEB",
  noise = [0.1, 0.1, 0.1],
  ...props
}) => {
  const pointsRef = useRef();
  const materialRef = useRef();

  // Generate random positions and attributes for each sparkle
  const { positions, sizes, speeds, offsets, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const scaleArray = Array.isArray(scale) ? scale : [scale, scale, scale];
    const noiseArray = Array.isArray(noise) ? noise : [noise, noise, noise];

    for (let i = 0; i < count; i++) {
      // Random position within scaled bounds
      positions[i * 3] = (Math.random() - 0.5) * scaleArray[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * scaleArray[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * scaleArray[2];

      // Random size variation
      sizes[i] = size * (0.5 + Math.random() * 0.5);

      // Random speed variation
      speeds[i] = speed * (0.5 + Math.random() * 1.5);

      // Random noise offsets for each axis
      offsets[i * 3] = Math.random() * noiseArray[0];
      offsets[i * 3 + 1] = Math.random() * noiseArray[1];
      offsets[i * 3 + 2] = Math.random() * noiseArray[2];

      // Random velocities for continuous movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, sizes, speeds, offsets, velocities };
  }, [count, size, scale, speed, noise]);

  // Update animation and movement
  useFrame((state) => {
    if (pointsRef.current && materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update positions for continuous movement
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const scaleArray = Array.isArray(scale) ? scale : [scale, scale, scale];
      
      for (let i = 0; i < count; i++) {
        // Apply velocity-based movement
        positionAttribute.array[i * 3] += velocities[i * 3] * speed;
        positionAttribute.array[i * 3 + 1] += velocities[i * 3 + 1] * speed;
        positionAttribute.array[i * 3 + 2] += velocities[i * 3 + 2] * speed;
        
        // Wrap around boundaries to keep sparkles within bounds
        if (Math.abs(positionAttribute.array[i * 3]) > scaleArray[0] / 2) {
          positionAttribute.array[i * 3] = (Math.random() - 0.5) * scaleArray[0];
        }
        if (Math.abs(positionAttribute.array[i * 3 + 1]) > scaleArray[1] / 2) {
          positionAttribute.array[i * 3 + 1] = (Math.random() - 0.5) * scaleArray[1];
        }
        if (Math.abs(positionAttribute.array[i * 3 + 2]) > scaleArray[2] / 2) {
          positionAttribute.array[i * 3 + 2] = (Math.random() - 0.5) * scaleArray[2];
        }
      }
      
      positionAttribute.needsUpdate = true;
    }
  });

  const sparkleColor = new THREE.Color(color);

  return (
    <points ref={pointsRef} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={count}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-offset"
          count={count}
          array={offsets}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: sparkleColor },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        }}
        vertexShader={`
          attribute float size;
          attribute float speed;
          attribute vec3 offset;
          
          uniform float uTime;
          uniform float uPixelRatio;
          
          varying vec3 vColor;
          varying float vOpacity;
          
          float random(vec3 st) {
            return fract(sin(dot(st.xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
          }
          
          float noise(vec3 st) {
            vec3 i = floor(st);
            vec3 f = fract(st);
            
            float a = random(i);
            float b = random(i + vec3(1.0, 0.0, 0.0));
            float c = random(i + vec3(0.0, 1.0, 0.0));
            float d = random(i + vec3(1.0, 1.0, 0.0));
            float e = random(i + vec3(0.0, 0.0, 1.0));
            float f_val = random(i + vec3(1.0, 0.0, 1.0));
            float g = random(i + vec3(0.0, 1.0, 1.0));
            float h = random(i + vec3(1.0, 1.0, 1.0));
            
            vec3 u = f * f * (3.0 - 2.0 * f);
            
            return mix(
              mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
              mix(mix(e, f_val, u.x), mix(g, h, u.x), u.y),
              u.z
            );
          }
          
          void main() {
            vec3 pos = position;
            
            // Apply additional noise-based movement for floating effect
            vec3 noisePos = pos * 0.01 + offset + uTime * speed * 0.1;
            vec3 noiseOffset = vec3(
              noise(noisePos),
              noise(noisePos + vec3(100.0)),
              noise(noisePos + vec3(200.0))
            );
            
            // Add subtle floating movement
            pos += noiseOffset * offset * 5.0;
            
            // Add gentle wave motion
            pos.y += sin(uTime * 0.5 + pos.x * 0.01) * 2.0;
            pos.x += cos(uTime * 0.3 + pos.z * 0.01) * 1.5;
            
            // Constant opacity - no twinkling
            vOpacity = 1.0;
            
            // Color variation
            float colorVariation = random(pos) * 0.3;
            vColor = vec3(1.0 + colorVariation, 1.0 + colorVariation, 1.0);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec3 vColor;
          varying float vOpacity;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            // Create soft circular glow
            float glow = exp(-distanceToCenter * 10.0);
            
            vec3 finalColor = uColor * vColor * glow;
            gl_FragColor = vec4(finalColor, alpha * vOpacity);
          }
        `}
      />
    </points>
  );
};

export default CustomSparkles;
