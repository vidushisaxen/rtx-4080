import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const specifications = [
  {
    label: "Instruction Propagation",
    value: "0.00003",
    unit: "MILLISECONDS",
  },
  {
    label: "Photon Throughput",
    value: "12.9",
    unit: "PetaFlux",
  },

  {
    label: "Quantum Resilience Index",
    value: "98.22",
    unit: "PERCENT",
  },
  {
    label: "Lattice Density",
    value: "4.8B",
    unit: "NODES",
  },

  {
    label: "Entropy Cooling Efficiency",
    value: "127",
    unit: "PERCENT",
  },
  {
    label: "Particle Sync Threshold",
    value: "99.991",
    unit: "PERCENT",
  },
];

export default function Specifications() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !boxRef.current) return;

    // Set initial states
    gsap.set(sectionRef.current, { opacity: 0 });
    gsap.set(boxRef.current, { y: "100%" });

    // Split text into characters
    const titleSplit = new SplitText(titleRef.current, { type: "chars" });

    // Set initial state for characters - blurred and invisible
    gsap.set(titleSplit.chars, {
      opacity: 0,
      scale: 1.3,
      filter: "blur(10px)",
    });

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#SequenceContainer",
        start: "47% top",
        end: "65% bottom",
        scrub: true,
        onEnter: () => {
          gsap.to(titleSplit.chars, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.05,
            ease: "none",
          });
        },
        onLeave: () => {
          gsap.to(titleSplit.chars, {
            opacity: 0,
            scale: 1.3,
            filter: "blur(10px)",
            duration: 1,
            stagger: 0.05,
            ease: "none",
          });
        },
        onEnterBack: () => {
          gsap.to(titleSplit.chars, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.05,
            ease: "none",
          });
        },
        onLeaveBack: () => {
          gsap.to(titleSplit.chars, {
            opacity: 0,
            scale: 1.3,
            filter: "blur(10px)",
            duration: 1,
          
            stagger: 0.05,
            ease: "none",
          });
        },
      },
    });

    // Animate section opacity
    tl.to(sectionRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "none",
    });

    // Animate box translation
    tl.to(boxRef.current, {
      y: "-100%",
      duration: 1.5,
      ease: "none",
    });

    // Cleanup function
    return () => {
      titleSplit.revert();
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const renderSpecificationBox = (spec, index) => {
    return (
      <div
        key={index}
        className="h-fit p-[2vw] relative flex-col flex items-center justify-center w-full"
      >
        <p className="absolute left-[2vw] top-[2vw] text-[.65vw] text-white/50 font-light uppercase">
          [  {spec.label}  ]
        </p>
        <p className="text-[6vw] font-head mt-[1vw] text-white/70 font-bold">
          {spec.value}
        </p>
        <p className="w-full uppercase text-[1vw] tracking-wider text-white/50 text-center">
          {spec.unit}
        </p>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="SpecificationsSection"
      className="h-screen w-full pointer-events-none absolute top-0 flex items-center justify-between left-0 z-[999]"
    >
      <div className="w-full flex items-end p-[5vw] h-full">
        <h2
          ref={titleRef}
          className="text-[5vw] w-[100%] font-bold font-head leading-[1.1] text-white"
        >
          SPECIFICATIONS
        </h2>
      </div>

      <div
        ref={boxRef}
        className="w-full h-fit bg-black/10 border border-white/20 backdrop-blur-xl mr-[10%]"
      >
        <div className="absolute inset-0">
          <div className="w-[3px] h-[3px] bg-white absolute top-[8px] left-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute top-[8px] right-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute bottom-[8px] left-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute bottom-[8px] right-[8px]"></div>
        </div>

        {/* First specification - full width */}
        <div className="border-b border-white/20">
          {renderSpecificationBox(specifications[0], 0)}
        </div>

        {/* Second row - two specifications side by side */}
        <div className="flex items-center justify-between border-b border-white/20 w-full">
          <div className="border-r border-white/20 w-full">
            {renderSpecificationBox(specifications[1], 1)}
          </div>
          <div className="w-full">
            {renderSpecificationBox(specifications[2], 2)}
          </div>
        </div>

        {/* Third row - two specifications side by side */}
        <div className="flex items-center justify-between border-b border-white/20 w-full">
          <div className="border-r border-white/20 w-full">
            {renderSpecificationBox(specifications[3], 3)}
          </div>
          <div className="w-full">
            {renderSpecificationBox(specifications[4], 4)}
          </div>
        </div>

        {/* Last specification - full width with min height */}
        <div className="min-h-[20%] flex items-center justify-center ">
          {renderSpecificationBox(specifications[5], 5)}
        </div>
      </div>
    </section>
  );
}
