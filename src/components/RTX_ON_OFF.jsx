"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollEffectTransition({
  backgroundImage = "/assets/images/rtx-off.jpg",
  effectImage = "/assets/images/rtx-on.jpg",
}) {
  const containerRef = useRef(null);
  const effectLayerRef = useRef(null);
  const dividerRef = useRef(null);
  const labelLeftRef = useRef(null);
  const labelRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const effectLayer = effectLayerRef.current;
      const divider = dividerRef.current;
      const labelLeft = labelLeftRef.current;
      const labelRight = labelRightRef.current;

      if (!container || !effectLayer || !divider || !labelLeft || !labelRight) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top center",  
          end: "bottom center", 
          scrub: 1,             
        },
      });

      tl.to(
        effectLayer,
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ease: "none",
        },
        0
      );

      tl.to(
        divider,
        {
          left: "100%",
          ease: "none",
        },
        0
      );
      tl.to(
        labelLeft,
        {
          opacity: 0,
          x: -30,
          ease: "power1.out",
        },
        0
      );
      tl.fromTo(
        labelRight,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          ease: "power1.out",
        },
        0.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black">
      <section className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Before Effects
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            Scroll down to see the transformation
          </p>
        </div>
      </section>

      <div
        ref={containerRef}
        className="relative min-h-[200vh]" 
      >
        <div className="sticky top-0 flex items-center justify-center h-screen">
          <div className="relative w-full max-w-7xl mx-auto h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
         
            <div className="absolute inset-0">
              <img
                src={backgroundImage}
                alt="Background without effect"
                className="w-full h-full object-cover"
              />
            </div>

        
            <div
              ref={effectLayerRef}
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)",
              }}
            >
              <img
                src={effectImage}
                alt="Image with effect applied"
                className="w-full h-full object-cover"
              />
            </div>

          
            <div
              ref={dividerRef}
              className="absolute left-0 top-0 bottom-0 w-1 z-10 bg-primary-1"
            />

           
            <div
              ref={labelLeftRef}
              className="absolute top-6 left-6 text-lg md:text-2xl font-bold uppercase border-primary-1 tracking-[3px] px-4 md:px-6 py-2 md:py-3 bg-black bg-opacity-80 rounded-lg z-50 border-2"
            >
              RTX OFF
            </div>

            <div
              ref={labelRightRef}
              className="absolute bottom-6 right-6 text-lg md:text-2xl border-primary-1 font-bold uppercase tracking-[3px] px-4 md:px-6 py-2 md:py-3 bg-black bg-opacity-80 rounded-lg z-50 border-2"
            >
              RTX ON
            </div>
          </div>
        </div>
      </div>

      
      <section className="min-h-screen bg-linear-to-b from-black to-gray-900 flex items-center justify-center px-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            After Effects
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            The transformation is complete
          </p>
        </div>
      </section>
    </div>
  );
}
