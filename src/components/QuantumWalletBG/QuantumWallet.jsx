"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const CONFIG = {
  DEFAULT_CONTROLS: {
    baseRadius: { value: 0.2 },
    easing: { value: 0.4 },
    color1: "#09536d50",
    color2: "#09536d50",
    color3: "#09536d50",
  },
  LINEART_CONTROLS: {
    baseRadius: { value: 0.2 },
    easing: { value: 0.4 },
    color1: "#ff6b3550",
    color2: "#ff6b3550", 
    color3: "#ff6b3550",
  },
  CIRCLE_COUNT: {
    MAX: 6,
  },
  ANIMATION: {
    LERP_FACTOR: 0.001,
  },
  BLOB_POSITIONS: [
    {
      x: 0.5,
      y: 0.5,
      radiusFactor: 0.,
      colorIndex: 0,
      interactive: false, //MAIN
      opacity: .5,
      animatedX: -0.5, // Starting position when animating from left
    }, // Mouse-following blob
    {
      x: -0.05,
      y: 1.05,
      radiusFactor: 1.0,
      colorIndex: 0,
      interactive: false,
      opacity: 1.0,
      animatedX: -1.5, // Starting position when animating from left
    }, //ACTIVE DENSE BLOB
    // Left side arc blob
    {
      x: -0.1,
      y: 0.3,
      radiusFactor: 0.8,
      colorIndex: 0,
      interactive: false,
      opacity: 0.5,
      isArcBlob: true,
      side: 'left',
      baseY: 0.3,
      amplitude: 0.4,
      frequency: 0.5,
      animatedX: -1.2, // Starting position when animating from left
    },
    {
      x: -0.1,
      y: 0.5,
      radiusFactor: 0.8,
      colorIndex: 0,
      interactive: false,
      opacity: 0.7,
      isArcBlob: true,
      side: 'left',
      baseY: 0.5,
      amplitude: 0.4,
      frequency: 0.7,
      animatedX: -1.2, // Starting position when animating from left
    },
    // Right side arc blob
    {
      x: 1.1,
      y: 0.4,
      radiusFactor: 0.8,
      colorIndex: 0,
      interactive: false,
      opacity: 0.7,
      isArcBlob: true,
      side: 'right',
      baseY: 0.4,
      amplitude: 0.3,
      frequency: 0.6,
      animatedX: 2.2, // Starting position when animating from right
    },
    {
      x: 1.1,
      y: 0.6,
      radiusFactor: 0.8,
      colorIndex: 0,
      interactive: false,
      opacity: 0.7,
      isArcBlob: true,
      side: 'right',
      baseY: 0.6,
      amplitude: 0.3,
      frequency: 0.8,
      animatedX: 2.2, // Starting position when animating from right
    },
  ],
  VIGNETTE: {
    enabled: true,
    intensity: 1.0,
    softness: 0.9,
    asymmetric: true,
    leftIntensity: 0.5,
    rightIntensity: 0.4,
  },
  SPARKLES: {
    COUNT: 50,
    MIN_SIZE: 4,
    MAX_SIZE: 8.5,
    MIN_SPEED: 0.0001,
    MAX_SPEED: 0.0005,
    OPACITY_MIN: 1.0,
    OPACITY_MAX: 1.0,
    TWINKLE_SPEED: 0.005,
  },
};

// ============================================================================
// SHADER SOURCES
// ============================================================================

const SHADERS = {
  vertex: `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(void) {
      v_uv = a_position * 0.5 + 0.5;
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,
  fragment: `
    precision mediump float;
    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform int u_circleCount;
    uniform vec3 u_circlesColor[6];
    uniform vec3 u_circlesPosRad[6];
    uniform float u_circlesOpacity[6];
    uniform float u_opacity;
    uniform float u_vignetteIntensity;
    uniform float u_vignetteSoftness;
    uniform float u_vignetteLeftIntensity;
    uniform float u_vignetteRightIntensity;
    uniform float u_time;
    uniform vec3 u_sparklePositions[50];
    uniform float u_sparkleSizes[50];
    uniform float u_sparkleOpacities[50];

    // Noise function for grainy effect
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

    // Sparkle function
    float sparkle(vec2 pos, vec2 center, float size) {
      float dist = length(pos - center);
      float sparkleRadius = size * 2.0;
      
      if (dist > sparkleRadius) return 0.0;
      
      // Create a soft circular sparkle
      float intensity = 1.0 - smoothstep(0.0, sparkleRadius, dist);
      
      return intensity;
    }

    void main(void) {
      vec2 st = v_uv * u_resolution;

      // Calculate vignette effect with asymmetric intensity
      vec2 center = u_resolution * 0.5;
      float maxDist = length(u_resolution * 0.5);
      float dist = length(st - center);
      float vignette = smoothstep(maxDist * u_vignetteSoftness, maxDist * 0.3, dist);
      
      // Apply asymmetric intensity based on horizontal position
      float normalizedX = st.x / u_resolution.x;
      float intensityMultiplier = mix(u_vignetteLeftIntensity, u_vignetteRightIntensity, normalizedX);
      vignette = 1.0 - (1.0 - vignette) * intensityMultiplier;

      // Calculate blob field
      float fieldSum = 0.0;
      vec3 weightedColorSum = vec3(0.0);

      for (int i = 0; i < 6; i++) {
        if (i >= u_circleCount) { break; }
        vec3 posRad = u_circlesPosRad[i];
        vec2 cPos = vec2(posRad.r, posRad.g);
        float radius = posRad.b;
        float dist = length(st - cPos);
        float sigma = radius * 0.5;
        float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
        float blobOpacity = u_circlesOpacity[i];
        
        fieldSum += val * blobOpacity;
        weightedColorSum += u_circlesColor[i] * val * blobOpacity;
      }

      vec3 finalCirclesColor = fieldSum > 0.0 ? (weightedColorSum / fieldSum) : vec3(0.0);
      float blobIntensity = pow(fieldSum, 1.4);
      
      // Add static grainy noise effect
      vec2 noiseCoord = v_uv * u_resolution * 0.8;
      float grainNoise = noise(noiseCoord) * 0.12;
      
      vec3 blobColor = finalCirclesColor * clamp(blobIntensity, 0.0, 1.0);
      blobColor += grainNoise * blobIntensity * finalCirclesColor;
      
      // Calculate sparkles
      float sparkleIntensity = 0.0;
      for (int i = 0; i < 50; i++) {
        vec2 sparklePos = u_sparklePositions[i].xy;
        float sparkleSize = u_sparkleSizes[i];
        float sparkleOpacity = u_sparkleOpacities[i];
        
        float sparkleValue = sparkle(st, sparklePos, sparkleSize);
        sparkleIntensity += sparkleValue * sparkleOpacity;
      }
      
      // Add sparkles to the final color
      vec3 sparkleColor = finalCirclesColor * sparkleIntensity * 0.6;
      
      // Combine vignette, blob, and sparkles
      vec3 vignetteColor = u_circlesColor[0] * (1.0 - vignette);
      vec3 finalColor = vignetteColor + blobColor + sparkleColor;
      
      // Use combined alpha
      float vignetteAlpha = (1.0 - vignette) * u_opacity;
      float blobAlpha = clamp(blobIntensity, 0.0, 1.0) * u_opacity;
      float sparkleAlpha = clamp(sparkleIntensity, 0.0, 1.0) * u_opacity * 0.5;
      float alpha = max(max(vignetteAlpha, blobAlpha), sparkleAlpha);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function lerp(a, b, factor) {
  return a + (b - a) * factor;
}

function lerpColor(a, b, factor) {
  return [
    lerp(a[0], b[0], factor),
    lerp(a[1], b[1], factor),
    lerp(a[2], b[2], factor),
  ];
}

// ============================================================================
// SPARKLE UTILITIES
// ============================================================================

function initializeSparkles(width, height) {
  const sparkles = [];

  for (let i = 0; i < CONFIG.SPARKLES.COUNT; i++) {
    sparkles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size:
        CONFIG.SPARKLES.MIN_SIZE +
        Math.random() * (CONFIG.SPARKLES.MAX_SIZE - CONFIG.SPARKLES.MIN_SIZE),
      speedX:
        (Math.random() - 0.5) * 2 *
          (CONFIG.SPARKLES.MIN_SPEED + Math.random() * (CONFIG.SPARKLES.MAX_SPEED - CONFIG.SPARKLES.MIN_SPEED)),
      speedY:
        (Math.random() - 0.5) * 2 *
          (CONFIG.SPARKLES.MIN_SPEED + Math.random() * (CONFIG.SPARKLES.MAX_SPEED - CONFIG.SPARKLES.MIN_SPEED)),
      baseOpacity:
        CONFIG.SPARKLES.OPACITY_MIN +
        Math.random() *
          (CONFIG.SPARKLES.OPACITY_MAX - CONFIG.SPARKLES.OPACITY_MIN),
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed:
        CONFIG.SPARKLES.TWINKLE_SPEED +
        Math.random() * CONFIG.SPARKLES.TWINKLE_SPEED,
    });
  }

  return sparkles;
}

function updateSparkles(sparkles, width, height, deltaTime, currentTime) {
  return sparkles.map((sparkle) => {
    // Update position with constant movement speed using deltaTime
    let newX = sparkle.x + sparkle.speedX * width * deltaTime * 100; // Multiply by 60 for more noticeable movement
    let newY = sparkle.y + sparkle.speedY * height * deltaTime * 100;

    // Wrap around screen edges
    if (newX < 0) newX = width;
    if (newX > width) newX = 0;
    if (newY < 0) newY = height;
    if (newY > height) newY = 0;

    // Calculate twinkling opacity using currentTime
    const twinkle =
      Math.sin(currentTime * sparkle.twinkleSpeed + sparkle.twinklePhase) *
        0.5 +
      0.5;
    const opacity = sparkle.baseOpacity * (0.3 + twinkle * 0.7);

    return {
      ...sparkle,
      x: newX,
      y: newY,
      opacity,
    };
  });
}

// ============================================================================
// WEBGL UTILITIES
// ============================================================================

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initializeWebGL(canvas, width, height) {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return null;
  }

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const vertShader = createShader(gl, gl.VERTEX_SHADER, SHADERS.vertex);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, SHADERS.fragment);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  const uniformLocations = {
    u_resolution: gl.getUniformLocation(program, "u_resolution"),
    u_circleCount: gl.getUniformLocation(program, "u_circleCount"),
    u_circlesColor: gl.getUniformLocation(program, "u_circlesColor"),
    u_circlesPosRad: gl.getUniformLocation(program, "u_circlesPosRad"),
    u_circlesOpacity: gl.getUniformLocation(program, "u_circlesOpacity"),
    u_opacity: gl.getUniformLocation(program, "u_opacity"),
    u_vignetteIntensity: gl.getUniformLocation(program, "u_vignetteIntensity"),
    u_vignetteSoftness: gl.getUniformLocation(program, "u_vignetteSoftness"),
    u_vignetteLeftIntensity: gl.getUniformLocation(
      program,
      "u_vignetteLeftIntensity"
    ),
    u_vignetteRightIntensity: gl.getUniformLocation(
      program,
      "u_vignetteRightIntensity"
    ),
    u_time: gl.getUniformLocation(program, "u_time"),
    u_sparklePositions: gl.getUniformLocation(program, "u_sparklePositions"),
    u_sparkleSizes: gl.getUniformLocation(program, "u_sparkleSizes"),
    u_sparkleOpacities: gl.getUniformLocation(program, "u_sparkleOpacities"),
  };

  gl.uniform2f(uniformLocations.u_resolution, width, height);

  return { gl, program, uniformLocations };
}

function initializeCircles(width, height, isAnimateRunning = true) {
  const circles = [];
  const colors = [
    hexToRGB(CONFIG.DEFAULT_CONTROLS.color1),
    hexToRGB(CONFIG.DEFAULT_CONTROLS.color2),
    hexToRGB(CONFIG.DEFAULT_CONTROLS.color3),
  ];

  // Initialize circles based on predefined positions
  CONFIG.BLOB_POSITIONS.forEach((blobConfig, index) => {
    const finalX = blobConfig.x * width;
    const finalY = blobConfig.y * height;
    
    // If animation is not running, start from sides and animate to final position
    let startX = finalX;
    if (!isAnimateRunning) {
      if (blobConfig.animatedX !== undefined) {
        startX = blobConfig.animatedX * width;
      }
    }

    circles.push({
      x: startX,
      y: finalY,
      targetX: finalX,
      targetY: finalY,
      radiusFactor: blobConfig.radiusFactor,
      colorIndex: blobConfig.colorIndex,
      interactive: blobConfig.interactive,
      opacity: blobConfig.opacity,
      initialX: finalX,
      initialY: finalY,
      isArcBlob: blobConfig.isArcBlob || false,
      side: blobConfig.side,
      baseY: blobConfig.baseY,
      amplitude: blobConfig.amplitude,
      frequency: blobConfig.frequency,
      isAnimating: !isAnimateRunning,
    });
  });

  return circles;
}

function updateCirclePositions(
  circles,
  mousePos,
  smoothControls,
  width,
  height,
  time
) {
  const baseRadius = (width + height) * smoothControls.baseRadius;

  return circles.map((circle, index) => {
    if (circle.interactive) {
      // Mouse-following circle
      let targetX = mousePos.x;
      let targetY = mousePos.y;
      
      // If still animating from side, animate to target position first
      if (circle.isAnimating) {
        targetX = circle.targetX;
        targetY = circle.targetY;
        
        // Check if close enough to target to stop animating
        const distToTarget = Math.sqrt(
          Math.pow(circle.x - circle.targetX, 2) + 
          Math.pow(circle.y - circle.targetY, 2)
        );
        
        if (distToTarget < 10) {
          circle.isAnimating = false;
        }
      }
      
      return {
        ...circle,
        x: circle.x + (targetX - circle.x) * smoothControls.easing,
        y: circle.y + (targetY - circle.y) * smoothControls.easing,
        radius: baseRadius * circle.radiusFactor,
      };
    } else if (circle.isArcBlob) {
      // Arc blob that moves up and down on the edges
      const oscillation = Math.sin(time * circle.frequency) * circle.amplitude;
      const newY = (circle.baseY + oscillation) * height;
      
      let targetX = circle.initialX;
      
      // If still animating from side, animate to target position first
      if (circle.isAnimating) {
        // Check if close enough to target to stop animating
        const distToTarget = Math.abs(circle.x - circle.targetX);
        
        if (distToTarget < 10) {
          circle.isAnimating = false;
        }
      }
      
      return {
        ...circle,
        x: circle.isAnimating ? 
          circle.x + (circle.targetX - circle.x) * smoothControls.easing : 
          targetX,
        y: newY,
        radius: baseRadius * circle.radiusFactor,
      };
    } else {
      // Static circles - animate to their configured positions if needed
      let targetX = circle.initialX;
      let targetY = circle.initialY;
      
      // If still animating from side, animate to target position
      if (circle.isAnimating) {
        // Check if close enough to target to stop animating
        const distToTarget = Math.sqrt(
          Math.pow(circle.x - circle.targetX, 2) + 
          Math.pow(circle.y - circle.targetY, 2)
        );
        
        if (distToTarget < 10) {
          circle.isAnimating = false;
        }
        
        targetX = circle.targetX;
        targetY = circle.targetY;
      }
      
      return {
        ...circle,
        x: circle.isAnimating ? 
          circle.x + (targetX - circle.x) * smoothControls.easing : 
          targetX,
        y: circle.isAnimating ? 
          circle.y + (targetY - circle.y) * smoothControls.easing : 
          targetY,
        radius: baseRadius * circle.radiusFactor,
      };
    }
  });
}

const ChromaVignetteEffect = ({ opacity = 1.0, LineArtActive, isAnimateRunning = true }) => {
  const canvasRef = useRef(null);
  const circlesRef = useRef([]);
  const sparklesRef = useRef([]);
  const requestRef = useRef();
  const uniformLocationsRef = useRef({});
  const mousePos = useRef({ x: 0, y: 0 });
  const startTime = useRef(Date.now());
  const lastFrameTime = useRef(Date.now());
  const prevIsAnimateRunning = useRef(isAnimateRunning);

  // Use a single color state that gets animated directly
  const currentColor = useRef(hexToRGB(CONFIG.DEFAULT_CONTROLS.color1));

  const targetControls = useRef({
    baseRadius: CONFIG.DEFAULT_CONTROLS.baseRadius.value,
    easing: CONFIG.DEFAULT_CONTROLS.easing.value,
  });

  const smoothControls = useRef({
    baseRadius: CONFIG.DEFAULT_CONTROLS.baseRadius.value,
    easing: CONFIG.DEFAULT_CONTROLS.easing.value,
  });

  // Handle isAnimateRunning changes
  useEffect(() => {
    if (prevIsAnimateRunning.current !== isAnimateRunning && !isAnimateRunning) {
      // When isAnimateRunning becomes false, reinitialize circles to start from sides
      const canvas = canvasRef.current;
      if (canvas) {
        circlesRef.current = initializeCircles(canvas.width, canvas.height, isAnimateRunning);
      }
    }
    prevIsAnimateRunning.current = isAnimateRunning;
  }, [isAnimateRunning]);

  // Update target controls based on LineArtActive prop using GSAP
  useEffect(() => {
    const controls = LineArtActive ? CONFIG.LINEART_CONTROLS : CONFIG.DEFAULT_CONTROLS;
    const targetColor = hexToRGB(controls.color1);
    
    // Kill any existing color animations to prevent conflicts
    gsap.killTweensOf(currentColor.current);
    
    // Animate the color directly with a smooth transition
    gsap.to(currentColor.current, {
      duration: 1.2,
      ease: "power2.inOut",
      0: targetColor[0], // R
      1: targetColor[1], // G
      2: targetColor[2], // B
    });

    // Animate other properties
    gsap.to(smoothControls.current, {
      duration: 1.0,
      ease: "power2.inOut",
      baseRadius: controls.baseRadius.value,
      easing: controls.easing.value,
    });

    targetControls.current = {
      baseRadius: controls.baseRadius.value,
      easing: controls.easing.value,
    };
  }, [LineArtActive]);

  const getColorPalette = useCallback(() => {
    // Return the same color for all three slots to ensure consistency
    const color = [
      currentColor.current[0],
      currentColor.current[1],
      currentColor.current[2]
    ];
    return [color, color, color];
  }, []);

  const updateSmoothControls = useCallback(() => {
    // GSAP handles all the smooth transitions now
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const { uniformLocations } = uniformLocationsRef.current || {};
    if (!uniformLocations) return;

    const now = Date.now();
    const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
    const currentTime = (now - startTime.current) / 1000;
    lastFrameTime.current = now;

    updateSmoothControls();

    circlesRef.current = updateCirclePositions(
      circlesRef.current,
      mousePos.current,
      smoothControls.current,
      canvas.width,
      canvas.height,
      currentTime
    );

    // Update sparkles with deltaTime for constant speed and currentTime for twinkling
    sparklesRef.current = updateSparkles(
      sparklesRef.current,
      canvas.width,
      canvas.height,
      deltaTime,
      currentTime
    );

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); // Transparent background
    gl.clear(gl.COLOR_BUFFER_BIT);

    const colorPalette = getColorPalette();
    const colorsArray = [];
    const posRadArray = [];
    const opacityArray = [];

    for (let i = 0; i < CONFIG.CIRCLE_COUNT.MAX; i++) {
      if (i < circlesRef.current.length) {
        const circle = circlesRef.current[i];
        const color = colorPalette[0]; // Use the same color for all blobs
        colorsArray.push(color[0], color[1], color[2]);
        posRadArray.push(circle.x, circle.y, circle.radius || 0);
        opacityArray.push(circle.opacity || 1.0);
      } else {
        colorsArray.push(0, 0, 0);
        posRadArray.push(0, 0, 0);
        opacityArray.push(0.0);
      }
    }

    // Prepare sparkle data
    const sparklePositions = [];
    const sparkleSizes = [];
    const sparkleOpacities = [];

    for (let i = 0; i < CONFIG.SPARKLES.COUNT; i++) {
      if (i < sparklesRef.current.length) {
        const sparkle = sparklesRef.current[i];
        sparklePositions.push(sparkle.x, sparkle.y, 0);
        sparkleSizes.push(sparkle.size);
        sparkleOpacities.push(sparkle.opacity);
      } else {
        sparklePositions.push(0, 0, 0);
        sparkleSizes.push(0);
        sparkleOpacities.push(0);
      }
    }

    gl.uniform1i(
      uniformLocations.u_circleCount,
      Math.min(circlesRef.current.length, CONFIG.CIRCLE_COUNT.MAX)
    );
    gl.uniform2f(uniformLocations.u_resolution, canvas.width, canvas.height);
    gl.uniform3fv(
      uniformLocations.u_circlesColor,
      new Float32Array(colorsArray)
    );
    gl.uniform3fv(
      uniformLocations.u_circlesPosRad,
      new Float32Array(posRadArray)
    );
    gl.uniform1fv(
      uniformLocations.u_circlesOpacity,
      new Float32Array(opacityArray)
    );
    gl.uniform1f(uniformLocations.u_opacity, opacity);
    gl.uniform1f(
      uniformLocations.u_vignetteIntensity,
      CONFIG.VIGNETTE.intensity
    );
    gl.uniform1f(uniformLocations.u_vignetteSoftness, CONFIG.VIGNETTE.softness);
    gl.uniform1f(
      uniformLocations.u_vignetteLeftIntensity,
      CONFIG.VIGNETTE.leftIntensity
    );
    gl.uniform1f(
      uniformLocations.u_vignetteRightIntensity,
      CONFIG.VIGNETTE.rightIntensity
    );
    gl.uniform1f(uniformLocations.u_time, currentTime);
    gl.uniform3fv(
      uniformLocations.u_sparklePositions,
      new Float32Array(sparklePositions)
    );
    gl.uniform1fv(
      uniformLocations.u_sparkleSizes,
      new Float32Array(sparkleSizes)
    );
    gl.uniform1fv(
      uniformLocations.u_sparkleOpacities,
      new Float32Array(sparkleOpacities)
    );

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestRef.current = requestAnimationFrame(render);
  }, [updateSmoothControls, getColorPalette, opacity]);

  const handleCursorMove = useCallback((x, y) => {
    mousePos.current = { x, y };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const glContext = initializeWebGL(canvas, canvas.width, canvas.height);
    if (glContext) {
      const { uniformLocations } = glContext;
      uniformLocationsRef.current = { uniformLocations };
      circlesRef.current = initializeCircles(canvas.width, canvas.height, isAnimateRunning);
      sparklesRef.current = initializeSparkles(canvas.width, canvas.height);
      mousePos.current = { x: canvas.width / 2, y: canvas.height / 2 };
      lastFrameTime.current = Date.now(); // Initialize frame time
      requestRef.current = requestAnimationFrame(render);
    }

    const handleMouseMove = (e) => handleCursorMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches?.[0]) {
        handleCursorMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleResize = () => {
      setCanvasSize();
      const gl = canvas.getContext("webgl");
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        circlesRef.current = initializeCircles(canvas.width, canvas.height, isAnimateRunning);
        sparklesRef.current = initializeSparkles(canvas.width, canvas.height);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [render, handleCursorMove, isAnimateRunning]);

  return (
    <>
      
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99]"
      />
    </>
  );
};

export default ChromaVignetteEffect;
