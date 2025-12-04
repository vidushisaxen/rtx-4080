import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Stats from "../UI/Stats";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function HeroUI({ isAnimationRunning }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const containerRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isAnimationRunning) {
      // Show container first
      gsap.set(containerRef.current, { opacity: 1 });

      if (titleRef.current && descriptionRef.current) {
        // Split text into characters
        const titleSplit = new SplitText(titleRef.current, { type: "chars" });
        const descriptionSplit = new SplitText(descriptionRef.current, {
          type: "chars",
        });

        // Set initial state - blurred and invisible
        gsap.set([titleSplit.chars, descriptionSplit.chars], {
          opacity: 0,
          scale: 1.3,
          filter: "blur(10px)",
        });

        // Create timeline for animations
        const tl = gsap.timeline();

        // Animate title characters
        tl.to(titleSplit.chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 3,
          scale: 1,
          delay: 0.8,
          stagger: 0.04,
          ease: "power2.out",
        });

        // Animate description characters with slight delay
        tl.to(
          descriptionSplit.chars,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 2.5,
            scale: 1,
            stagger: 0.03,
            ease: "power2.out",
          },
          "<.2"
        );

        // Create scroll trigger for fade out with blur
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const opacity = 1 - progress;
            const blur = progress * 20; // Increase blur as we scroll

            gsap.to(containerRef.current, {
              opacity: opacity,
              filter: `blur(${blur}px)`,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        // Cleanup function
        return () => {
          titleSplit.revert();
          descriptionSplit.revert();
          tl.kill();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      }
    } else {
      // Hide container when animation is running
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.in",
      });
    }
  }, [isAnimationRunning]);


  return (
    <>
      <div
        ref={containerRef}
        className="h-screen w-full absolute top-0  left-0 z-[999]"
        style={{ opacity: 0 }}
      >
        <div className="h-full w-full absolute flex items-end px-[4vw] pb-[6vw] gap-10 justify-start  top-0 left-0 z-[2">
          <div className="w-[50%] ">
            <h1
              ref={titleRef}
              className="text-[5vw] w-[100%] font-bold font-head leading-[1.1] text-white"
              style={{
                maskImage:
                  "linear-gradient(to right, black 0%, black 20%, black 0%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, black 0%, black 20%, black 0%, transparent 100%)",
              }}
            >
              Beyond GPUs. <br /> Beyond Quantum.
            </h1>
          </div>
          <p
            ref={descriptionRef}
            className="w-[21vw] text-[1vw] text-[#C8C8C8]"
          >
            An artifact engineered for the next era of computation.
          </p>
        </div>
      </div>
      <Stats ref={statsRef} />
    </>
  );
}
