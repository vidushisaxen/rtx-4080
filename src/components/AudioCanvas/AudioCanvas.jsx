"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useBackgroundAudio } from "../SFX/Sounds";

// Utility functions
const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
const deg = (a) => (a * Math.PI) / 180;

const AudioCanvas = () => {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [isHover, setIsHover] = useState(false);

  // Animation state
  const animationState = useRef({
    h: 0,
    amp: 0,
    settings: {
      width: 40,
      height: 6,
      amplitude: -0.18,
      hoverHeight: 1.5,
      hoverAmplitude: -0.1,
      speed: 3.7,
    },
  });

  const canvasState = useRef({
    ctx: null,
    width: 0,
    height: 0,
    devicePixelRatio: 1,
  });

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    canvasState.current = {
      ctx,
      width,
      height,
      devicePixelRatio,
    };
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const { ctx, width, height } = canvasState.current;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  }, []);

  // Draw visualization
  const draw = useCallback((time) => {
    const { ctx, width, height } = canvasState.current;
    const { settings, h, amp } = animationState.current;

    if (!ctx) return;

    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < settings.width; i++) {
      ctx.beginPath();
      const x = width / 2 - (settings.width / 2) * 0.5 + i * 0.5;
      const t = time * settings.speed + i * amp;
      const y = height / 2 + -Math.cos(t) * h;
      ctx.ellipse(x, y, 1, 1, deg(360), 0, deg(360));
      ctx.closePath();
      ctx.fill();
    }
  }, []);

  // Animation loop
  const animate = useCallback(
    (time) => {
      const state = animationState.current;

      let height = isHover ? state.settings.hoverHeight : 0;
      height = isActive ? state.settings.height : height;
      state.h = lerp(state.h, height, 0.04);

      let amplitude = isHover ? state.settings.hoverAmplitude : 0;
      amplitude = isActive ? state.settings.amplitude : amplitude;
      state.amp = lerp(state.amp, amplitude, 0.04);

      clearCanvas();
      draw(time);
    },
    [isActive, isHover, clearCanvas, draw]
  );

  // Get background audio control
  const { PlaySoundBackground, isAudioPlaying, audioRef } = useBackgroundAudio();

  // Sync wave animation with audio state
  useEffect(() => {
    const syncWithAudio = () => {
      const audioPlaying = isAudioPlaying();
      setIsActive(audioPlaying);
    };

    // Check immediately
    syncWithAudio();

    // Set up interval to continuously sync with audio state
    const interval = setInterval(syncWithAudio, 200);

    // Listen for audio events if audioRef is available
    const audio = audioRef?.current;
    if (audio) {
      const handlePlay = () => setIsActive(true);
      const handlePause = () => setIsActive(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        clearInterval(interval);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }

    return () => clearInterval(interval);
  }, [isAudioPlaying, audioRef]);

  // Handle button click
  const handleClick = useCallback(() => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    setIsHover(false);
    
    // Toggle background audio based on active state
    PlaySoundBackground(newActiveState);
  }, [isActive, PlaySoundBackground]);

  // Initialize canvas and start animation loop
  useEffect(() => {
    initCanvas();

    let animationId;
    const raf = () => {
      const time = performance.now() / 1000;
      animate(time);
      animationId = requestAnimationFrame(raf);
    };

    raf();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [initCanvas, animate]);

  return (
    <div className="flex justify-center items-center h-fit w-fit text-white">
      <button
        ref={buttonRef}
        id="switch-audio"
        className={'bg-[#42424280] w-[3vw] cursor-pointer rounded-full h-[3vw] '}
        onClick={handleClick}
      >
        <canvas
          ref={canvasRef}
          id="canvas-audio"
          className="w-full h-full"
        />
      </button>
    </div>
  );
};

export default AudioCanvas;
