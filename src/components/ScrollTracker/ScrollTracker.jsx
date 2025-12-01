"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTracker({ isAnimationRunning }) {
  const progressBarRef = useRef(null);
  const finalStopperRef = useRef(null);

  useEffect(() => {
    if (!isAnimationRunning) {
      gsap.to("#ScrollTracker", {
        opacity: 1,
        duration: 0.8,
        delay: .5,
        ease: "power2.out",
      });
    }
  
  }, [isAnimationRunning])
  

  useEffect(() => {
    const progressBar = progressBarRef.current;
    const finalStopper = finalStopperRef.current;

    if (!progressBar || !finalStopper) return;

    if (isAnimationRunning) {
      gsap.to(progressBarRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    // Animate progress bar height based on scroll
    gsap.fromTo(
      progressBar,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      }
    );

    // Show final stopper when scroll is complete
    gsap.fromTo(
      finalStopper,
      { opacity: 0 },
      {
        opacity: 1,
        markers: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "body",
          start: "99.5% bottom",
          end: "bottom bottom",
          scrub: .3,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div id="ScrollTracker" className="w-fit opacity-0 h-screen min-w-[10vw] pointer-events-none fixed top-0 right-0 flex items-center justify-center z-[999]">
      <div className="w-[1.5px] h-[50vh] relative rounded-full bg-[#494949]">
        <div className="w-[.7vw] h-[.7vw] absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full"></div>
        <div 
          ref={progressBarRef}
          className="w-[3px] h-0 absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full"
        ></div>
        <div 
          ref={finalStopperRef}
          className="w-[.7vw] h-[.7vw] absolute bottom-0 left-1/2 -translate-x-1/2 bg-white opacity-0 rounded-full"
        ></div>
      </div>
    </div>
  );
}
