"use client";

import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

extend({ EffectComposer, RenderPass, ShaderPass });

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uContainerSize;
  uniform vec2 uImageSize;
  uniform sampler2D uDisplacement;
  float PI = 3.14159265358979323846;

  vec2 cover(vec2 uv, vec2 containerSize, vec2 imageSize) {
    float containerRatio = containerSize.x / containerSize.y;
    float imageRatio = imageSize.x / imageSize.y;
    vec2 scale;
    vec2 offset;
    if(imageRatio > containerRatio) {
      scale = vec2(containerSize.y / imageSize.y);
      offset = vec2((containerSize.x - imageSize.x * scale.x) * 0.5, 0.0);
    } else {
      scale = vec2(containerSize.x / imageSize.x);
      offset = vec2(0.0, (containerSize.y - imageSize.y * scale.y) * 0.5);
    }
    vec2 adjustedUV = (uv * containerSize - offset) / (imageSize * scale);
    return adjustedUV;
  }
  
  void main() {
    vec2 uv = cover(vUv, uContainerSize, uImageSize);
    vec4 displacement = texture2D(uDisplacement, vUv);
    float theta = displacement.r * 2.0 * PI;
    vec2 dir = vec2(sin(theta), cos(theta));

    vec2 uv2 = uv + dir * displacement.r * 0.1;
    vec4 color = texture2D(uTexture, uv2);
    gl_FragColor = color;
  }
`;

function FluidImage({ src, bounds, index, displacementTexture }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "";
    loader.load(src, (loadedTexture) => {
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.generateMipmaps = true;
      setTexture(loadedTexture);
    });
  }, [src]);

  const material = useMemo(() => {
    if (!texture) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uDisplacement: { value: displacementTexture },
        uContainerSize: {
          value: new THREE.Vector2(bounds.width, bounds.height),
        },
        uImageSize: {
          value: new THREE.Vector2(
            texture.image?.naturalWidth || 1,
            texture.image?.naturalHeight || 1
          ),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: true,
      depthTest: true,
    });
  }, [texture, bounds, displacementTexture]);

  useFrame((state) => {
    if (meshRef.current && material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uDisplacement.value = displacementTexture;
    }
  });

  if (!material) return null;

  return (
    <mesh
      ref={meshRef}
      position={[
        bounds.left -
          (typeof window !== "undefined" ? window.innerWidth : 1920) / 2 +
          bounds.width / 2,
        -bounds.top +
          (typeof window !== "undefined" ? window.innerHeight : 1080) / 2 -
          bounds.height / 2,
        0,
      ]}
      material={material}
    >
      <planeGeometry args={[bounds.width, bounds.height, 100, 100]} />
    </mesh>
  );
}

function FluidText({ element, bounds }) {
  const textRef = useRef();
  const computedStyle =
    typeof window !== "undefined" ? window.getComputedStyle(element) : null;
  const fontSize = computedStyle ? parseFloat(computedStyle.fontSize) : 16;
  const colorAttr = element.getAttribute("data-color") || "#FFFFFF";

  return (
    <Text
      ref={textRef}
      text={element.textContent}
      font="/cursor/Satoshi-Regular.ttf"
      fontSize={fontSize}
      color={colorAttr}
      position={[
        bounds.left -
          (typeof window !== "undefined" ? window.innerWidth : 1920) / 2,
        (typeof window !== "undefined" ? window.innerHeight : 1080) / 2 -
          bounds.top,
        0,
      ]}
      anchorX="left"
      maxWidth={bounds.width}
    />
  );
}

function CursorTrail({ onDisplacementUpdate }) {
  const { scene, camera, gl } = useThree();
  const meshesRef = useRef([]);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const prevMouseRef = useRef(new THREE.Vector2(0, 0));
  const currentWaveRef = useRef(0);
  const maxParticles = 200;
  const trailSceneRef = useRef(new THREE.Scene());
  const renderTargetRef = useRef();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create render target for displacement
    renderTargetRef.current = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }
    );

    // Create cursor trail particles
    const geometry = new THREE.PlaneGeometry(64, 64, 1, 1);
    const meshes = [];

    for (let i = 0; i < maxParticles; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/brush.webp"),
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.rotation.z = Math.random() * 2 * Math.PI;
      trailSceneRef.current.add(mesh);
      meshes.push(mesh);
    }

    meshesRef.current = meshes;

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      renderTargetRef.current?.dispose();
    };
  }, []);

  const trackMouse = () => {
    if (
      Math.abs(mouseRef.current.x - prevMouseRef.current.x) < 0.01 &&
      Math.abs(mouseRef.current.y - prevMouseRef.current.y) < 0.01
    ) {
      return;
    }

    const mesh = meshesRef.current[currentWaveRef.current];
    if (mesh) {
      mesh.visible = true;
      mesh.position.x = mouseRef.current.x * (window.innerWidth / 2);
      mesh.position.y = mouseRef.current.y * (window.innerHeight / 2);
      mesh.position.z = -1;
      mesh.material.opacity = 1;
      mesh.scale.set(1, 1, 1);
    }

    currentWaveRef.current = (currentWaveRef.current + 1) % maxParticles;
    prevMouseRef.current.copy(mouseRef.current);
  };

  useFrame(() => {
    trackMouse();

    // Animate particles
    meshesRef.current.forEach((mesh) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.01;
        mesh.material.opacity *= 0.96;
        mesh.scale.x = 0.982 * mesh.scale.x + 0.108;
        mesh.scale.y = mesh.scale.x;
        if (mesh.material.opacity < 0.02) {
          mesh.visible = false;
        }
      }
    });

    // Render trail to displacement texture
    if (renderTargetRef.current) {
      gl.setRenderTarget(renderTargetRef.current);
      gl.clear();
      gl.render(trailSceneRef.current, camera);
      gl.setRenderTarget(null);

      // Update displacement texture for images
      if (onDisplacementUpdate) {
        onDisplacementUpdate(renderTargetRef.current.texture);
      }
    }
  });

  return null;
}

export function FluidScene() {
  const { size } = useThree();
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [displacementTexture, setDisplacementTexture] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateElements = () => {
      const imageElements = document.querySelectorAll(".fluid img");
      const textElements = document.querySelectorAll(".fluid-text");

      const imageData = Array.from(imageElements).map((img, index) => ({
        src: img.src,
        bounds: img.getBoundingClientRect(),
        index,
      }));

      const textData = Array.from(textElements).map((text) => ({
        element: text,
        bounds: text.getBoundingClientRect(),
      }));

      setImages(imageData);
      setTexts(textData);
    };

    updateElements();

    const handleResize = () => {
      updateElements();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDisplacementUpdate = (texture) => {
    setDisplacementTexture(texture);
  };

  return (
    <>
      <CursorTrail onDisplacementUpdate={handleDisplacementUpdate} />
      {images.map((img) => (
        <FluidImage
          key={img.index}
          src={img.src}
          bounds={img.bounds}
          index={img.index}
          displacementTexture={displacementTexture}
        />
      ))}
      {texts.map((text, index) => (
        <FluidText key={index} element={text.element} bounds={text.bounds} />
      ))}
    </>
  );
}

export default function FluidCursor() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const distance = 500;
  const fov = 2 * Math.atan(dimensions.height / 2 / distance) * (180 / Math.PI);

  return (
    <>
      <div
        id="page1"
        className="h-screen w-full relative bg-black flex justify-center items-center gap-[5vw]"
      >
        {/* <div id="img1" className="h-[100%] absolute top-0 left-0 w-full fluid">
          <img
            src="https://images.unsplash.com/photo-1546188994-07c34f6e5e1b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full h-full object-cover opacity-0"
          />
        </div> */}
        <Canvas
          className=" w-full fluid h-full pointer-events-none"
          camera={{
            fov: fov,
            aspect: dimensions.width / dimensions.height,
            near: 0.1,
            far: 1000,
            position: [0, 0, distance],
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <FluidScene />
        </Canvas>
      </div>
    </>
  );
}
