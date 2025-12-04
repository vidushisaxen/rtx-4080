import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function Stats() {
  useEffect(() => {
    // Create ScrollTrigger for enter and exit animations
    ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "95% top",
      end: "bottom top",
      markers: false,
      onEnter: () => {
        // Create timeline for enter animation
        const enterTl = gsap.timeline();

        // Main section fade in animation
        enterTl.to("#StatsSection", {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        });

        // First stats section animation - comes from left perspective
        enterTl.fromTo("#FIRST_STATS_SECTION", 
          {
            xPercent: -50,
            z: "50%",
            opacity: 0,
          },
          {
            xPercent: 0,
            z: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<"
        );

        // Second stats section animation - comes from right perspective
        enterTl.fromTo("#SECOND_STATS_SECTION", 
          {
            xPercent: 50,
            z: "50%",
            opacity: 0,
          },
          {
            xPercent: 0,
            z: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<"
        );
      },
      onLeave: () => {
        // Create timeline for exit animation (opposite of enter)
        const exitTl = gsap.timeline();

        // First stats section animation - goes back to left perspective
        exitTl.to("#FIRST_STATS_SECTION", {
          xPercent: -50,
          z: "50%",
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        });

        // Second stats section animation - goes back to right perspective
        exitTl.to("#SECOND_STATS_SECTION", {
          xPercent: 50,
          z: "50%",
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        }, "<");

        // Main section fade out animation
        exitTl.to("#StatsSection", {
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        }, "<");
      },
      onEnterBack: () => {
        // Create timeline for enter back animation (same as enter)
        const enterBackTl = gsap.timeline();

        // Main section fade in animation
        enterBackTl.to("#StatsSection", {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        });

        // First stats section animation - comes from left perspective
        enterBackTl.fromTo("#FIRST_STATS_SECTION", 
          {
            xPercent: -50,
            z: "50%",
            opacity: 0,
          },
          {
            xPercent: 0,
            z: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<"
        );

        // Second stats section animation - comes from right perspective
        enterBackTl.fromTo("#SECOND_STATS_SECTION", 
          {
            xPercent: 50,
            z: "50%",
            opacity: 0,
          },
          {
            xPercent: 0,
            z: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "<"
        );
      },
      onLeaveBack: () => {
        // Create timeline for leave back animation (opposite of enter)
        const leaveBackTl = gsap.timeline();

        // First stats section animation - goes back to left perspective
        leaveBackTl.to("#FIRST_STATS_SECTION", {
          xPercent: -50,
          z: "50%",
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        });

        // Second stats section animation - goes back to right perspective
        leaveBackTl.to("#SECOND_STATS_SECTION", {
          xPercent: 50,
          z: "50%",
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
        }, "<");

        // Main section fade out animation
        leaveBackTl.to("#StatsSection", {
          opacity: 0,
          duration: 1,
          ease: "power2.in",
        }, "<");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <section
      id="StatsSection"
      style={{
        perspective: "1000px",
      }}
      className="h-screen opacity-0 w-full absolute top-0 p-[5vw] py-[10vw] flex items-center justify-between left-0  z-[999]"
    >
      <div 
      id="FIRST_STATS_SECTION"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(50deg)",
        }}
        className="w-[17%] flex  items-start justify-between flex-col gap-[.7vw] h-fit"
      >
        <h2 className="flex w-full justify-between text-[1vw] items-center ">
          POWERUP S TO A{" "}
        </h2>
        <span className="block h-fit">
          {" "}
          <svg width="100%" height="2" className="my-[.5vw]">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          </svg>
        </span>
        {robots.map((robot, index) => (
          <div
            key={index}
            className="bg-white/10 border border-white/10 backdrop-blur-[10px] bg-black/10  flex items-center gap-[1vw]  w-full p-[1vw] h-fit"
          >
            <div className="h-[2vw] w-[2vw] aspect-square bg-white"></div>
            <div className="">
              <p className="font-head text-[1.vw]">{robot.name}</p>
              <p className="font-body text-[.7vw]">{robot.model}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        id="SECOND_STATS_SECTION"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-50deg)",
        }}
        className="w-[17%]   items-start justify-between flex flex-col gap-[1vw] h-fit"
      >
        <div>
          <p className="font-head text-[1.7vw]">DESTROYER</p>
          <p className="font-body text-[1vw]">Feature 1</p>
        </div>
        <div className="w-full h-fit my-[1vw] space-y-[1vw]">
          {stats.map((stat, index) => (
            <div key={index} className="w-[80%] space-y-[.5vw]">
              <div className="flex items-center text-[.9vw] justify-between">
                <p>{stat.label}</p>
                <p>{stat.value}</p>
              </div>
              <div className="h-[.1vw] bg-white/20 w-full rounded-full relative">
                <span
                  className="h-[200%] bg-white absolute top-1/2 translate-y-[-50%] rounded-full left-0"
                  style={{ width: `${stat.percentage}%` }}
                ></span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[1vw] space-y-[1vw]">
          <p className="font-head text-[1.5vw]">SKILLS</p>
          <div className="flex items-center gap-[1vw]">
            <div className="h-[3vw] w-[3vw] aspect-square bg-white/10 border-white/10 border backdrop-blur-sm"></div>
            <div className="h-[3vw] w-[3vw] aspect-square bg-white/10 border-white/10 border backdrop-blur-sm"></div>
            <div className="h-[3vw] w-[3vw] aspect-square bg-white/10 border-white/10 border backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const robots = [
  { name: "BESERK", model: "Robot 2300.10" },
  { name: "DESTROYER", model: "Robot 2300.10" },
  { name: "RAMPAGE", model: "Robot 2300.10" },
  { name: "METEOR", model: "Robot 2300.10" },
];

const stats = [
  { label: "POWER", value: 50, percentage: 50 },
  { label: "SPEED", value: 75, percentage: 75 },
  { label: "ARMOR", value: 90, percentage: 90 },
  { label: "ENERGY", value: 30, percentage: 30 },
];
