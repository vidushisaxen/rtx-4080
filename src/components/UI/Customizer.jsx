"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Customizer({ materialsSetting, setMaterialsSetting }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const labelRef = useRef(null);
  const boxesRef = useRef([]);

  const initializeContainer = () => {
    gsap.set(containerRef.current, {
      opacity: 0,
      pointerEvents: "none",
      filter: "blur(10px)",
      oncomplete: () => {
        gsap.set(containerRef.current, {
          visibility: "hidden",
        });
      },
    });
  };

  const showContainer = () => {
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      pointerEvents: "auto",
      filter: "blur(0px)",
      oncomplete: () => {
        gsap.set(containerRef.current, {
          visibility: "visible",
        });
      },
    });
  };

  const hideContainer = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      filter: "blur(10px)",
      ease: "power2.out",
      pointerEvents: "none",
    //   oncomplete: () => {
    //     gsap.set(containerRef.current, {
    //       visibility: "hidden",
    //     });
    //   },
    });
  };

  const animateTextElements = () => {
    if (!titleRef.current || !descriptionRef.current || !labelRef.current)
      return;

    // Split text into characters
    const titleSplit = new SplitText(titleRef.current, { type: "chars" });
    const descriptionSplit = new SplitText(descriptionRef.current, {
      type: "chars",
    });
    const labelSplit = new SplitText(labelRef.current, { type: "chars" });

    // Set initial state - blurred and invisible
    gsap.set([titleSplit.chars, descriptionSplit.chars, labelSplit.chars], {
      opacity: 0,
      scale: 1.3,
      filter: "blur(10px)",
    });

    // Set initial state for boxes
    gsap.set(boxesRef.current, {
      opacity: 0,
    });

    // Create timeline for animations
    const timeline = gsap.timeline();

    // Animate label characters first
    timeline.to(labelSplit.chars, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 2,
      scale: 1,
      delay: 0.3,
      stagger: 0.03,
      ease: "power2.out",
    });

    // Animate boxes
    timeline.to(
      boxesRef.current,
      {
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      },
      "<0.5"
    );

    // Animate title characters
    timeline.to(
      titleSplit.chars,
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 2,
        scale: 1,
        stagger: 0.04,
        ease: "power2.out",
      },
      "<0.2"
    );

    // Animate description characters with slight delay
    timeline.to(
      descriptionSplit.chars,
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        scale: 1,
        stagger: 0.01,
        ease: "power2.out",
      },
      "<0.4"
    );
  };

  const handleScrollEnter = () => {
    showContainer();
    // animateTextElements();
  };

  const handleScrollLeaveBack = () => {
    hideContainer();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    initializeContainer();

    // Create scroll trigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "92% top",
      end: "100% bottom",
      onEnter: handleScrollEnter,
      onLeaveBack: handleScrollLeaveBack,
    });

  }, []);

  return (
    <footer
      ref={containerRef}
      style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
      className="h-screen w-full flex fixed top-0 left-0 z-[999]"
    >
      <div className="w-1/2 h-full flex p-[5vw] items-start gap-[2vw] justify-end pb-[5vw] flex-col">
        <div className="h-fit w-full space-y-[2vw]">
          <p ref={labelRef} className="text-[1vw] text-white w-[80%]">
            CHANGE FRAME MATERIAL
          </p>
          <div className="flex gap-[1vw]">
            <div
              ref={(el) => (boxesRef.current[0] = el)}
              onClick={() => setMaterialsSetting(1)}
              className={`h-[6vw] w-[6vw] border rounded-[1vw] bg-black/10 backdrop-blur-xl cursor-pointer  flex items-center justify-center border-white/20 ${
                materialsSetting === 1 ? "border-white/80" : ""
              }`}
            >
              <span className="text-white text-[1vw]">C1</span>
            </div>
            <div
              ref={(el) => (boxesRef.current[1] = el)}
              onClick={() => setMaterialsSetting(2)}
              className={`h-[6vw] w-[6vw] border rounded-[1vw] bg-black/10 backdrop-blur-xl cursor-pointer  flex items-center justify-center border-white/20 ${
                materialsSetting === 2 ? "border-white/80" : ""
              }`}
            >
              <span className="text-white text-[1vw]">C2</span>
            </div>
            <div
              ref={(el) => (boxesRef.current[2] = el)}
              onClick={() => setMaterialsSetting(3)}
              className={`h-[6vw] w-[6vw] border rounded-[1vw] bg-black/10 backdrop-blur-xl cursor-pointer  flex items-center justify-center border-white/20 ${
                materialsSetting === 3 ? "border-white/80" : ""
              }`}
            >
              <span className="text-white text-[1vw]">C3</span>
            </div>
          </div>
        </div>
        <h2
          ref={titleRef}
          className="text-[5vw] font-head font-bold leading-[1]"
        >
          The Continuum Engine.
        </h2>
        <p ref={descriptionRef} className="text-[1vw] text-white/80 w-[80%]">
          A revolutionary quantum-photonic processing unit that transcends
          traditional computational boundaries. Engineered with advanced lattice
          architecture and entropy cooling systems.
        </p>
      </div>
      <div className="w-1/2 h-full gap-[0vw] flex-col flex items-end p-[5vw] justify-end">
        <Link href="/credits" className="text-[1vw] font-head text-white/80">
          By Hyperiux
        </Link>
        <Link href="/credits" className="text-[1vw] font-head text-white/80">
          Credits
        </Link>
      </div>
    </footer>
  );
}
