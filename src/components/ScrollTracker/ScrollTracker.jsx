"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTracker({ isAnimationRunning }) {
  const progressBarRef = useRef(null);
  const finalStopperRef = useRef(null);
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
    const finalStopper = finalStopperRef.current;

    if (!progressBar || !finalStopper || isAnimationRunning) return;

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

    // Show final stopper when scroll is complete
    const stopperTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "99.5% bottom",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(finalStopper, { opacity: self.progress });
      },
    });

    return () => {
      progressTrigger.kill();
      stopperTrigger.kill();
    };
  }, [isAnimationRunning]);

  return (
    <div 
      ref={scrollTrackerRef}
      id="ScrollTracker" 
      className="w-fit opacity-0 h-screen min-w-[10vw] pointer-events-none fixed top-0 right-0 flex items-center justify-center z-[999]"
    >
      <div className="w-[1.5px] h-[50vh] relative rounded-full bg-[#494949]">
        <div 
          ref={progressBarRef}
          className="w-full h-0 absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full"
        ></div>
        <div 
          ref={finalStopperRef}
          className="w-[.7vw] h-[.7vw] absolute bottom-0 left-1/2 -translate-x-1/2 bg-white opacity-0 rounded-full"
        ></div>
      </div>
    </div>
  );
}
