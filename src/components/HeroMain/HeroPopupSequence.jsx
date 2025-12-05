import React, { useEffect, useState } from "react";
import InfoPopup from "../InfoPopup";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroPopupSequence({ toggleFanRotation }) {
  const [firstPopUpToggler, setFirstPopUpToggler] = useState(false);
  const [secondPopUpToggler, setSecondPopUpToggler] = useState(false);
  const [thirdPopUpToggler, setThirdPopUpToggler] = useState(false);
  const [fourthPopUpToggler, setFourthPopUpToggler] = useState(false);

  useEffect(() => {
    const timeline1 = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "7.5% center",
      end: "10% center",
      markers: false,
      onEnter: () => {
        setFirstPopUpToggler(true);
       
      },
      onLeave: () => {
        setFirstPopUpToggler(false);
      },
      onEnterBack: () => {
        setFirstPopUpToggler(true);
      },
      onLeaveBack: () => {
        setFirstPopUpToggler(false);
      },
    });

    const timeline2 = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "17.5% center",
      end: "20% center",
      markers: false,
      onEnter: () => {
        setSecondPopUpToggler(true);
     
      },
      onLeave: () => {
        setSecondPopUpToggler(false);
     
      },
      onEnterBack: () => {
        setSecondPopUpToggler(true);
     
      },
      onLeaveBack: () => {
        setSecondPopUpToggler(false);
      },
    });

    const timeline3 = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "27.5% center",
      end: "30% center",
      markers: false,
      onEnter: () => {
        setThirdPopUpToggler(true);
      },
      onLeave: () => {
        setThirdPopUpToggler(false);
      },
      onEnterBack: () => {
        setThirdPopUpToggler(true);
      },
      onLeaveBack: () => {
        setThirdPopUpToggler(false);
      },
    });

    const timeline4 = ScrollTrigger.create({
      trigger: "#SequenceContainer",
      start: "37.5% center",
      end: "40% center",
      markers: false,
      onEnter: () => {
        setFourthPopUpToggler(true);
      },
      onLeave: () => {
        setFourthPopUpToggler(false);
      },
      onEnterBack: () => {
        setFourthPopUpToggler(true);
      },
      onLeaveBack: () => {
        setFourthPopUpToggler(false);
      },
    });

    return () => {
      timeline1.kill();
      timeline2.kill();
      timeline3.kill();
      timeline4.kill();
    };
  }, []);

  return (
    <>

      {/* POPUP 1 - GPU Core */}
      <div className="h-fit w-fit absolute top-[25%] right-[15%] -translate-x-1/2 -translate-y-1/2 z-200">
        <InfoPopup 
          isOpen={firstPopUpToggler}
          origin="bottom-left"
          title="GPU CORE"
          description="Ada Lovelace architecture with 9,728 CUDA cores delivering exceptional ray tracing and AI performance."
        />
      </div>

      {/* POPUP 2 - Memory System */}
      <div className="h-fit w-fit absolute top-[40%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-200">
        <InfoPopup 
          isOpen={secondPopUpToggler} 
          origin="top-right"
          title="MEMORY SYSTEM"
          description="16GB GDDR6X memory with 716.8 GB/s bandwidth for handling complex scenes and high-resolution textures."
        />
      </div>

      {/* POPUP 3 - Cooling Solution */}
      <div className="h-fit w-fit absolute top-[60%] right-[25%] -translate-x-1/2 -translate-y-1/2 z-200">
        <InfoPopup 
          isOpen={thirdPopUpToggler} 
          origin="bottom-left"
          title="COOLING SOLUTION"
          description="Advanced triple-fan cooling system with optimized airflow design for maximum thermal efficiency."
        />
      </div>

      {/* POPUP 4 - Power Efficiency */}
      <div className="h-fit w-fit absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-200">
        <InfoPopup 
          isOpen={fourthPopUpToggler} 
          origin="top-right"
          title="POWER EFFICIENCY"
          description="320W Total Graphics Power with advanced power management for optimal performance per watt."
        />
      </div>
    </>
  );
}
