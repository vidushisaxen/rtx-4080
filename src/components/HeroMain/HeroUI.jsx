import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function HeroUI({ isAnimationRunning }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!isAnimationRunning) {
      // Show container first
      gsap.set(containerRef.current, { opacity: 1 });

      if (titleRef.current && descriptionRef.current) {
        // Split text into characters
        const titleSplit = new SplitText(titleRef.current, { type: "chars" });
        const descriptionSplit = new SplitText(descriptionRef.current, { type: "chars" });

        // Set initial state - blurred and invisible
        gsap.set([titleSplit.chars, descriptionSplit.chars], {
          opacity: 0,
          scale:1.3,
          filter: "blur(10px)",
    
        });

        // Create timeline for animations
        const tl = gsap.timeline();

        // Animate title characters
        tl.to(titleSplit.chars, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 3,
          scale:1,
          delay: .8,
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
            scale:1,
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
          }
        });

        // Cleanup function
        return () => {
          titleSplit.revert();
          descriptionSplit.revert();
          tl.kill();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
    <div 
      ref={containerRef}
      className="h-screen w-full absolute top-0 flex items-end gap-10 justify-start px-[4vw] pb-[6vw] left-0 z-[200]"
      style={{ opacity: 0 }}
    >
      <h1
        ref={titleRef}
        className="text-[5vw] w-[50%] font-bold leading-[1.1] text-[#E3E3E3]"
      >
        Beyond GPUs. Beyond Quantum.
      </h1>
      <p ref={descriptionRef} className="w-[25vw] text-[#C8C8C8]">
        An artifact engineered for the next era of computation.
      </p>
    </div>
  );
}
