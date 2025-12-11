"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const Transition = ({ runAnimation = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const programRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const [transitionRunning, setTransitionRunning] = useState(false);
  const containerRef = useRef(null);
 

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    if (!runAnimation) {
      // Smooth fade out with scale effect when not running
      gsap.to(container, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          canvas.style.display = "none";
          gsap.set(container, { scale: 1 }); // Reset scale
        }
      });
      return;
    }

    // Reset and smooth fade in with enhanced effect when running
    canvas.style.display = "block";
    gsap.set(container, { scale: 1, opacity: 0 });
    
    // Create timeline for smooth, enhanced transition
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" }
    });
    
    // Fade in with subtle scale for depth
    tl.fromTo(container, 
      { 
        opacity: 0,
        scale: 0.98
      },
      { 
        opacity: 1,
        scale: 1,
        duration: 0.6
      }
    );
    
    // Subtle pulse effect during transition for more dynamic feel
    tl.to(container, {
      scale: 1.01,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut"
    }, "-=0.2");

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader source (the provided shader code)
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;

      vec4 hash42(vec2 p){
        vec4 p4 = fract(vec4(p.xyxy) * vec4(443.8975,397.2973, 491.1871, 470.7827));
        p4 += dot(p4.wzxy, p4+19.19);
        return fract(vec4(p4.x * p4.y, p4.x*p4.z, p4.y*p4.w, p4.x*p4.w));
      }

      float hash( float n ){
        return fract(sin(n)*43758.5453123);
      }

      float n( in vec3 x ){
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f*f*(3.0-2.0*f);
        float n = p.x + p.y*57.0 + 113.0*p.z;
        float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                            mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                        mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                            mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
        return res;
      }

      float nn(vec2 p){
        float y = p.y;
        float s = iTime*2.;
        
        float v = (n( vec3(y*.01 +s, 1., 1.0) ) + .0)
                 *(n( vec3(y*.011+1000.0+s, 1., 1.0) ) + .0) 
                 *(n( vec3(y*.51+421.0+s, 1., 1.0) ) + .0);
        v*= hash42(vec2(p.x +iTime*0.01, p.y) ).x +.3 ;
        
        v = pow(v+.3, 1.);
        if(v<.7) v = 0.;
        return v;
      }

      void main(){
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = fragCoord.xy / iResolution.xy;

        float linesN = 240.;
        float one_y = iResolution.y / linesN;
        uv = floor(uv*iResolution.xy/one_y)*one_y;

        float col = nn(uv);
        
        gl_FragColor = vec4(vec3(col), 1.0);
      }
    `;

    // Create shader function
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    // Create program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "iResolution");
    const timeLocation = gl.getUniformLocation(program, "iTime");

    // Reset start time for new animation
    startTimeRef.current = Date.now();

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    // Render function - runs infinitely while runAnimation is true
    const render = () => {
      resizeCanvas();
      
      const currentTime = (Date.now() - startTimeRef.current) / 1000;
      
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationRef.current = requestAnimationFrame(render);
    };

    // Start infinite animation
    render();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, [runAnimation]);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full !z-[999999] pointer-events-none"
      style={{ opacity: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          width: "100vw",
          height: "100vh",
          display: "none",
        }}
      />
    </div>
  );
};

export default Transition;
