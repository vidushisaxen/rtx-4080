"use client"
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ShaderMaterial = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec2 iResolution;
    uniform float iTime;
    
    vec3 _Color = vec3(0.46, 0.72, 0.0);
    vec3 _horizonColor = vec3(0.46, 0.72, 0.0);
    vec3 _haloColor = vec3(0.46, 0.72, 0.0);
    float _flowSpeed = 0.3;
    float _flowDensity = 2.;
    float _flowIntensity = 0.5;
    float _gridSpeed = 0.3;
    float _gridScale = 1.5;
    float _gridLineWidth = 0.015;
    float _gridRingRadius = 0.08;
    float _gridRingHoleRate = 0.8;
    float _girdIntensity = 0.6;
    float _squareSpeed = 0.1;
    float _squareScale = 1.4;
    float _squareIntensity = 0.3;
    float _sparkerForwardSpeed = 0.1;
    float _sparkerForwardScale = 10.;
    float _sparkerForwardIntensity = 0.5;
    float _sparkRiseSpeed = 0.05;
    float _sparkRiseScale = 10.;
    float _sparkRiseIntensity = 0.2;
    float _BGcircleScale = 0.2;
    float _haloBGIntensity = 4.0;
    float _horizontalHight = 0.0;
    float _horizonBGIntensity = 0.3;
    
    varying vec2 vUv;
    
    float remap01(float a, float b, float t) {
      return clamp((t - a) / (b - a), 0., 1.);
    }
    
    float remap(float a, float b, float c, float d, float t) {
      return remap01(a, b, t) * (d - c) + c;
    }
    
    float remapF01(float a, float b, float t) {
      return t * (b - a) + a;
    }
    
    float N21(vec2 p) {
      p = fract(p * vec2(233.34, 851.73));
      p += dot(p, p + 237.45);
      return fract(p.x * p.y);
    }
    
    vec2 N22(vec2 p) {
      float n = N21(p);
      return vec2(n, N21(p + n));
    }
    
    vec2 PerspectiveUV(vec2 uv) {
      float z = 1. / abs(uv.y);
      return vec2(uv.x * z, z);
    }
    
    vec2 GetPos(vec2 id) {
      vec2 n = N22(id) * iTime * .7;
      return sin(n) * .4;
    }
    
    float Circle(vec2 uv, vec2 p, float r, float blur) {
      float d = length(uv - p);
      float c = smoothstep(r, r - blur, d);
      return c;
    }
    
    float Band(float t, float start, float end, float blur) {
      float step1 = smoothstep(start - blur, start + blur, t);
      float step2 = smoothstep(end + blur, end - blur, t);
      return step1 * step2;
    }
    
    float Rectangle(vec2 uv, float left, float right, float bottom, float top, float blur) {
      float band1 = Band(uv.x, left, right, blur);
      float band2 = Band(uv.y, bottom, top, blur);
      return band1 * band2;
    }
    
    float GridLine(vec2 uv, vec2 ouv, float density, float width) {
      float gridLine = 0.0;
      float masky = abs(ouv.y - 0.5);
      ouv = 1. - abs(ouv - 0.5);
      uv *= density;
      uv = fract(uv);
      uv -= 0.5;
      uv = abs(uv);
      float maskx = uv.x;
      uv.x = smoothstep(width, 0.0, uv.x);
      uv.y = smoothstep(ouv.y * ouv.y * width * 5.0, 0.0, uv.y);
      gridLine = max(uv.y, uv.x);
      maskx = smoothstep(0.1, 0.0, maskx);
      masky = smoothstep(0.1, 0.3, masky);
      masky = clamp((masky - maskx), 0., 1.);
      return gridLine * (maskx + masky);
    }
    
    vec2 GridRing(vec2 uv, float density, float radius, float Blur, float holeRadiusRatio) {
      float circle;
      float ring;
      uv *= density;
      uv = fract(uv);
      uv -= 0.5;
      uv = abs(uv);
      circle = Circle(uv, vec2(0., 0.), radius, Blur);
      ring = circle - Circle(uv, vec2(0., 0.), radius * holeRadiusRatio, Blur);
      return vec2(circle, ring);
    }
    
    float GridRingLine(vec2 uv, vec2 ouv, float density, float width, float radius, float Blur, float holeRadiusRatio) {
      float grid = GridLine(uv, ouv, density, width);
      vec2 ring = GridRing(uv, density, radius, Blur, holeRadiusRatio);
      grid *= 1. - ring.x;
      grid += ring.y;
      return grid;
    }
    
    float RandomSquares(vec2 uv, float density) {
      uv *= density;
      vec2 id = floor(uv);
      uv = fract(uv);
      uv -= 0.5;
      vec2 p = N22(id);
      p = vec2(remapF01(-0.5, 0.5, p.x), remapF01(-0.5, 0.5, p.y));
      float s = remapF01(0.02, 0.3, N21(id));
      float f = N21(id + 365.22);
      float rect = Rectangle(uv, p.x - s, p.x + s, p.y - s, p.y + s, 0.02) * f * (sin(iTime * 5. + N21(id + 765.1) * 6.28) + 1.) * 0.5;
      return rect;
    }
    
    float RandomSparkers(vec2 uv, float density, float i) {
      float dots;
      uv *= density;
      vec2 id = floor(uv);
      uv = fract(uv);
      uv -= 0.5;
      float maxR = 0.1;
      vec2 p = N22(id + i);
      p = vec2(remapF01(-0.5 + maxR, 0.5 - maxR, p.x), remapF01(-0.5 + maxR, 0.4 - maxR, p.y));
      vec2 j = (p - uv) * 70.;
      dots = 1. / dot(j, j);
      dots *= sin(iTime * 10. + p.x * 10.) * .5 + .5;
      return dots;
    }
    
    float RandomSparkersForward(vec2 uv, float speed, float scale) {
      float sparkerForward = 0.;
      for(float k = 0.; k < 1.; k += 1. / 4.) {
        float z = fract(k + iTime * speed);
        float size = mix(scale, .5, z);
        float fade = smoothstep(0., 0.5, z) * smoothstep(1., .8, z);
        sparkerForward += RandomSparkers(uv, size, k) * fade;
      }
      return sparkerForward;
    }
    
    float RandomSparkersRise(vec2 uv, float density) {
      float dots;
      uv *= density;
      vec2 id = floor(uv);
      uv = fract(uv);
      uv -= 0.5;
      vec2 p = GetPos(id);
      vec2 j = (p - uv) * 70.;
      dots = 1. / dot(j, j);
      dots *= sin(iTime * 10. + p.x * 10.) * .5 + .9;
      return dots;
    }
    
    float FlowLines(vec2 uv, float resolutionX, float resolutionY) {
      uv.x -= 0.5;
      uv.x = abs(uv.x) * 2.0;
      float hx = uv.x;
      uv.x = 1. - uv.x;
      uv.x *= _flowDensity;
      uv.y = 1. - uv.y;
      uv.y += uv.x;
      float a = fract(tan(resolutionX) * 7.);
      float b = a * 10. * (uv.y) / (mod(a * iResolution.y * (iTime + 60.) * _flowSpeed, iResolution.x) - resolutionY) * uv.y;
      return b;
    }
    
    void main() {
      float t = mod(iTime, 7200.);
      vec2 fragCoord = vUv * iResolution;
      vec2 ouv = fragCoord / iResolution.xy;
      vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.y;
      
      uv.y -= _horizontalHight;
      
      vec2 ouv2 = uv;
      ouv2.x *= iResolution.y / iResolution.x;
      ouv2 += 0.5;
      
      float fade = clamp(remap(0., 0.5, 0.0, 0.8, -uv.y - 0.12), 0., 1.);
      float inversFade = clamp(remap(0., 0.3, 0.0, 0.5, uv.y - (-0.10)), 0., 1.);
      float circleFade = smoothstep(-0.6 + _BGcircleScale, 0.2 + _BGcircleScale, 1. - length((ouv - 0.5) * 2.0));
      vec2 puv = PerspectiveUV(uv);
      float gridRingLine = GridRingLine(vec2(puv.x, puv.y += iTime * _gridSpeed), ouv2, _gridScale, _gridLineWidth, _gridRingRadius, 0.02, _gridRingHoleRate);
      float squares = RandomSquares(vec2(puv.x, puv.y += t * _squareSpeed), _squareScale);
      float sparkerRise = RandomSparkersRise(vec2(uv.x, uv.y - iTime * _sparkRiseSpeed), _sparkRiseScale);
      float sparkerForward = RandomSparkersForward(uv, _sparkerForwardSpeed, _sparkerForwardScale);
      float flowLine = FlowLines(ouv, fragCoord.x, fragCoord.y);
      float maskdown = clamp(squares * _squareIntensity + gridRingLine * _girdIntensity + sparkerForward * _sparkerForwardIntensity, 0., 1.) * fade;
      float maskup = (clamp(sparkerRise * _sparkRiseIntensity, 0., 1.) + clamp(flowLine * _flowIntensity, 0., 1.)) * inversFade;
      float mask = (maskup + maskdown);
      vec3 col = _Color;
      vec3 horizonCol = _horizonColor;
      vec3 haloCol = _haloColor;
      float horizonBG = length(uv * vec2(1., 50.) - vec2(0., -5.));
      horizonBG = (1. / pow(dot(horizonBG, horizonBG), 0.5)) * _horizonBGIntensity;
      float haloBG = length(uv * vec2(1., 10.) - vec2(0., -1.));
      haloBG = (2. / pow(dot(haloBG, haloBG), 1.2)) * _haloBGIntensity;
      horizonCol *= horizonBG;
      haloCol *= haloBG;
      col *= mask * haloCol;
      
      gl_FragColor = vec4((col + horizonCol) * circleFade + vec3(0.0), 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function HeroBackground() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111111', margin: 0, padding: 0, overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 55}} style={{ width: '100%', height: '100%', background:"#111111" }}>
        <ShaderMaterial />
        {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
      </Canvas>
    </div>
  );
}