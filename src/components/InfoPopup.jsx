"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function InfoPopup({
  isOpen = true,
  origin = "top-right", // "top-left", "top-right", "bottom-left", "bottom-right"
  title = "HUD DESIGN",
  description = "HUDs are closely linked to the presence of Ledger. They serve as the visual representation and extension of the brand.",
}) {
  const containerRef = useRef(null);
  const textWrapperRef = useRef(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const getTransformOrigin = () => {
    switch (origin) {
      case "top-left":
        return "top left";
      case "top-right":
        return "top right";
      case "bottom-left":
        return "bottom left";
      case "bottom-right":
      default:
        return "bottom right";
    }
  };

  const animateOpen = () => {
    if (!containerRef.current || !textWrapperRef.current) return;

    const tl = gsap.timeline();

    // Set initial states
    gsap.set(containerRef.current, {
      scale: 0,
      transformOrigin: getTransformOrigin(),
    });
    gsap.set(textWrapperRef.current, {
      opacity: 0,
    });

    // Animate container scale with smoother easing
    tl.to(containerRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate text wrapper with smooth fade and slide
    tl.to(textWrapperRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.5,
    }, "-=0.4");

    setInternalOpen(true);
  };

  const animateClose = () => {
    if (!containerRef.current || !textWrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setInternalOpen(false),
    });

    // Animate text wrapper with smooth fade and slide
    tl.to(textWrapperRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      delay: 0.5,
    });

    // Animate container scale with smoother easing
    tl.to(
      containerRef.current,
      {
        scale: 0,
        duration: 0.5,
        ease: "power2.in",
        transformOrigin: getTransformOrigin(),
      },
      "-=0.2"
    );
  };

  // Handle prop-based animation
  useEffect(() => {
    if (isOpen && !internalOpen) {
      animateOpen();
    } else if (!isOpen && internalOpen) {
      animateClose();
    }
  }, [isOpen, internalOpen]);

  return (
    <div
      ref={containerRef}
      className="relative w-[25vw] h-fit min-h-[10vh] bg-white/20 border border-white/20 backdrop-blur-sm z-[200]"
      style={{ scale: 0 }}
    >
      <div className="absolute inset-0">
        <div className="w-[3px] h-[3px] bg-white absolute top-[4px] left-[4px]"></div>
        <div className="w-[3px] h-[3px] bg-white absolute top-[4px] right-[4px]"></div>
        <div className="w-[3px] h-[3px] bg-white absolute bottom-[4px] left-[4px]"></div>
        <div className="w-[3px] h-[3px] bg-white absolute bottom-[4px] right-[4px]"></div>
      </div>
      <div
        ref={textWrapperRef}
        className="relative z-[2] h-full w-full bg-primary-1/10 p-[2vw] space-y-[1vw]"
        style={{ opacity: 0 }}
      >
        <p className="text-[4vw] leading-[1]" >{title}</p>
        <p className="text-[1vw] text-white/70">{description}</p>
      </div>
    </div>
  );
}
