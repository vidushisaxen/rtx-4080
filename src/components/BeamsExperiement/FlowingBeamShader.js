import * as THREE from "three";

export const createFlowingBeamMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uFlowSpeed: { value: 0.1 },
      uFlowIntensity: { value: 2.0 },
      uLightColor: { value: new THREE.Color(0xffffff) }, // Cyan beam color
      uOpacity: { value: 1.0 },
      uTrailLength: { value: 0.2 }, // Length of the trailing effect
      uFillProgress: { value: 0.0 }, // How much of the surface is filled
      uStartPoint: { value: new THREE.Vector2(0.0, 0.0) }, // Starting point of the flow
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uFlowSpeed;
      uniform float uFlowIntensity;
      uniform vec3 uLightColor;
      uniform float uOpacity;
      uniform float uTrailLength;
      uniform float uFillProgress;
      uniform vec2 uStartPoint;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vec2 flowUv = vUv;
        
        // Calculate distance from start point
        float distFromStart = distance(flowUv, uStartPoint);
        
        // Create a circular flow pattern that expands from the start point
        float maxDistance = sqrt(2.0); // Maximum possible distance in UV space
        float normalizedDist = distFromStart / maxDistance;
        
        // Create a one-time progress that goes from 0 to 4 (0-2 for outward flow, 2-4 for return flow)
        float totalProgress = uTime * uFlowSpeed;
        float cycleProgress = clamp(totalProgress, 0.0, 4.0);
        
        // Outward flow phase (0-2)
        float outwardProgress = clamp(cycleProgress, 0.0, 2.0) / 2.0;
        
        // Return flow phase (2-4) 
        float returnProgress = clamp((cycleProgress - 2.0), 0.0, 2.0) / 2.0;
        
        // Trail head position for outward flow
        float outwardTrailHead = outwardProgress;
        float outwardTrailTail = max(0.0, outwardTrailHead - uTrailLength);
        
        // Trail head position for return flow (goes from 1 back to 0)
        float returnTrailHead = 1.0 - returnProgress;
        float returnTrailTail = min(1.0, returnTrailHead + uTrailLength);
        
        // Create outward trail mask
        float outwardTrailMask = smoothstep(outwardTrailTail - 0.05, outwardTrailTail, normalizedDist) * 
                                (1.0 - smoothstep(outwardTrailHead, outwardTrailHead + 0.05, normalizedDist));
        
        // Create return trail mask
        float returnTrailMask = smoothstep(returnTrailTail + 0.05, returnTrailTail, normalizedDist) * 
                               (1.0 - smoothstep(returnTrailHead - 0.05, returnTrailHead, normalizedDist));
        
        // Fill effect - areas that have been passed by the outward trail stay lit
        float fillMask = step(normalizedDist, outwardProgress);
        
        // Combine trail effects
        float trailIntensity = 0.0;
        
        // Only animate if we haven't completed the full cycle
        if (totalProgress < 4.0) {
          // Outward trail (bright moving trail)
          if (cycleProgress <= 2.0) {
            trailIntensity = outwardTrailMask * 2.0;
          }
          // Return trail (dimmer trail that "collects" the fill)
          else {
            trailIntensity = returnTrailMask * 1.5;
            // Reduce fill intensity as return trail passes
            fillMask *= step(returnTrailHead, normalizedDist);
          }
        }
        // After animation completes, keep surface dark/transparent
        else {
          fillMask = 0.0;
          trailIntensity = 0.0;
        }
        
        // Add pulsing effect to trail head
        float headPulse = sin(uTime * 10.0) * 0.2 + 0.8;
        trailIntensity *= headPulse;
        
        // Combine trail and fill
        float finalIntensity = max(trailIntensity, fillMask * 0.6);
        
        // Add some subtle noise for organic feel
        float noise = sin(distFromStart * 15.0 + uTime * 2.0) * 0.1 + 0.9;
        finalIntensity *= noise;
        
        // Apply flow intensity
        finalIntensity *= uFlowIntensity;
        
        // Create the final color
        vec3 finalColor = uLightColor * finalIntensity;
        
        // Add extra brightness to the active trail
        if (trailIntensity > 0.1) {
          finalColor += uLightColor * 0.3;
        }
        
        // Final output with opacity
        float alpha = uOpacity * clamp(finalIntensity, 0.0, 1.0);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
};
