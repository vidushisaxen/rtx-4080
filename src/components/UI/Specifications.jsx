import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

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
        trigger: '#SequenceContainer',
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
            delay: -2,
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
    },);

    // Cleanup function
    return () => {
      titleSplit.revert();
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
          SPECIFICTIONS
        </h2>
      </div>
      
      <div 
        ref={boxRef}
        className="w-full h-[150%] bg-black/10 border border-white/20 backdrop-blur-xl p-[2vw] mr-[10%]"
      >
        <div className="absolute inset-0">
          <div className="w-[3px] h-[3px] bg-white absolute top-[8px] left-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute top-[8px] right-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute bottom-[8px] left-[8px]"></div>
          <div className="w-[3px] h-[3px] bg-white absolute bottom-[8px] right-[8px]"></div>
        </div>
      </div>
    </section>
  );
}
