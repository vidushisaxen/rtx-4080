"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Customizer({ materialsSetting, setMaterialsSetting }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, { opacity: 0, pointerEvents: "none" , filter: "blur(10px)"});

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#SequenceContainer",
        start: "70% top",
        end: "100% bottom",
        scrub: true,
        onEnter: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 1, 
            ease: "power2.out",
            visibility: "visible",
            pointerEvents: "auto",
            filter: "blur(0px)",
          });
        },
        onLeave: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.in",
            visibility: "hidden",
            pointerEvents: "none",
            filter: "blur(10px)",
          });
        },
        onEnterBack: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            visibility: "visible",
            pointerEvents: "auto",
          });
        },
        onLeaveBack: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            visibility: "hidden",
            ease: "power2.in",
            pointerEvents: "none",
            filter: "blur(10px)",
            });
          },
        },
      });
    }, []);
  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex absolute top-0  left-0 z-[999]"
    >
      <div className="w-1/2 h-full flex p-[5vw] items-start gap-[2vw] justify-end pb-[5vw] flex-col">
        <div className="h-fit w-full space-y-[2vw]">
          <p className="text-[1vw] text-white w-[80%]">CHANGE FRAME MATERIAL</p>
          <div className="flex gap-[1vw]">
            <div 
              onClick={() => setMaterialsSetting(1)} 
              className={`h-[6vw] w-[6vw] border rounded-[1vw] cursor-pointer hover:bg-white/10 duration-300 transition-all flex items-center justify-center border-white ${
                materialsSetting === 1 ? 'bg-white/20 border-white/80' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="none"
              >
                <path
                  fill="#fff"
                  d="M5 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm8 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM5 23a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM7 39a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM2 15a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM2 31a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm10 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
                ></path>
              </svg>
            </div>
            <div 
              onClick={() => setMaterialsSetting(2)} 
              className={`h-[6vw] w-[6vw] border rounded-[1vw] cursor-pointer hover:bg-white/10 duration-300 transition-all flex items-center justify-center border-white ${
                materialsSetting === 2 ? 'bg-white/20 border-white/80' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="none"
              >
                <path
                  fill="#fff"
                  d="M6 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-3 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm2-36a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM22 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm2-36a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM34 5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-7 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm2-36a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm1 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-1 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm7-30a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm-4 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm4 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
                ></path>
              </svg>
            </div>
            <div 
              onClick={() => setMaterialsSetting(3)} 
              className={`h-[6vw] w-[6vw] border rounded-[1vw] cursor-pointer hover:bg-white/10 duration-300 transition-all flex items-center justify-center border-white ${
                materialsSetting === 3 ? 'bg-white/20 border-white/80' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="none"
              >
                <mask
                  id="a"
                  width="38"
                  height="38"
                  x="4"
                  y="4"
                  maskUnits="userSpaceOnUse"
                >
                  <path fill="#C4C4C4" d="M4 4h38v38H4z"></path>
                </mask>
                <g fill="#fff" mask="url(#a)">
                  <path d="m23.707-21.548 1.414 1.414-45.255 45.255-1.414-1.414 45.255-45.255Zm5.657 5.657-1.414-1.414-45.255 45.255 1.414 1.414 45.255-45.255Zm-42.427 48.083 45.255-45.255 1.414 1.415-45.254 45.255-1.415-1.415Zm5.657 5.658-1.414-1.415L36.435-8.82l1.414 1.414L-7.406 37.85ZM40.678-4.577-4.578 40.678l1.414 1.414L42.092-3.163l-1.414-1.414ZM-.335 44.92 44.92-.335l1.414 1.415L1.08 46.334-.335 44.92ZM49.163 3.908 3.908 49.163l1.414 1.414L50.577 5.322l-1.414-1.414ZM8.15 53.406 53.407 8.15l1.414 1.414L9.565 54.82 8.15 53.406Zm49.498-41.013L12.393 57.648l1.414 1.414 45.255-45.255-1.414-1.414ZM16.636 61.89 61.89 16.637l1.414 1.414L18.05 63.305l-1.414-1.414Zm49.497-41.011L20.88 66.133l1.414 1.415 45.255-45.255-1.415-1.414Z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-[5vw] font-head font-bold leading-[1]">
          The Continuum Engine.
        </h2>
        <p className="text-[1vw] text-white/80 w-[80%]">
          A revolutionary quantum-photonic processing unit that transcends
          traditional computational boundaries. Engineered with advanced lattice
          architecture and entropy cooling systems.
        </p>
      </div>
      <div className="w-1/2 h-full "></div>
    </div>
  );
}
