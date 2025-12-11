"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTracker({ isAnimationRunning, LineArtActive }) {
  const progressBarRef = useRef(null);
  const scrollTrackerRef = useRef(null);

  useEffect(() => {
    if (!scrollTrackerRef.current) return;

    if (!isAnimationRunning) {
      gsap.to(scrollTrackerRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(scrollTrackerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      });
    }
  }, [isAnimationRunning]);

  useEffect(() => {
    const progressBar = progressBarRef.current;
    const scrollTracker = scrollTrackerRef.current;

    if (!progressBar || !scrollTracker || isAnimationRunning) return;

    // Update colors based on LineArtActive state
    const trackColor = LineArtActive ? "#e5e5e5" : "#494949";
    const progressColor = LineArtActive ? "#000000" : "#ffffff";

    gsap.to(scrollTracker.querySelector('.scroll-track'), {
      backgroundColor: trackColor,
      duration: .5,
      ease: "power2.inOut",
    });

    gsap.to(progressBar, {
      backgroundColor: progressColor,
      duration: .5,
      ease: "power2.inOut",
    });

    // Animate progress bar height based on scroll
    const progressTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(progressBar, { height: `${self.progress * 100}%` });
      },
    });

    return () => {
      progressTrigger.kill();
    };
  }, [isAnimationRunning, LineArtActive]);

  return (
    <div 
      ref={scrollTrackerRef}
      id="ScrollTracker" 
      className="w-fit opacity-0 h-screen min-w-[10vw] pointer-events-none fixed top-0 right-0 flex items-center justify-center z-[89999]"
    >
      <div className="scroll-track w-[1.5px] h-[50vh] relative rounded-full bg-[#494949]">
        <div 
          ref={progressBarRef}
          className="w-full h-0 absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full"
        ></div>
      </div>
    </div>
  );
}
