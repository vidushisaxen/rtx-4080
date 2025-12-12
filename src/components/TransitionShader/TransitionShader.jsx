function TransitionInnerShader() {
    const meshRef = useRef();
    const progressRef = useRef({ value: 0 });
    const { viewport } = useThree();
  
    const shader = useMemo(() => ({
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec2 uResolution;
        varying vec2 vUv;
  
        // Simple noise function
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
  
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
  
        void main() {
          // Calculate center of screen
          vec2 center = vec2(0.5, 0.5);
          
          // Calculate distance from center
          float dist = distance(vUv, center);
          
          // Maximum distance (corner to center)
          float maxDist = distance(vec2(0.0, 0.0), center);
          
          // Add subtle noise to the edge
          float noiseValue = noise(vUv * 20.0) * 0.03;
          
          // Calculate circle radius based on progress
          float radius = uProgress * maxDist;
          
          // Smooth edge transition
          float edge = smoothstep(radius - 0.05 + noiseValue, radius + 0.05 + noiseValue, dist);
          
          // Output black with alpha mask - inside circle is transparent, outside is opaque
          gl_FragColor = vec4(1.0, 0.0, 0.0, edge);
        }
      `,
    }), []);
  
    useEffect(() => {
      gsap.to(progressRef.current, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
  
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, []);
  
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.material.uniforms.uProgress.value = progressRef.current.value;
      }
    });
  
    return (
      <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={shader.uniforms}
          vertexShader={shader.vertexShader}
          fragmentShader={shader.fragmentShader}
          transparent={true}
        />
      </mesh>
    );
  }