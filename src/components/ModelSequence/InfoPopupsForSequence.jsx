import React, { useEffect, useState } from "react";
import InfoPopup from "../InfoPopup";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InfoPopupsForSequence() {
  const [popUpToggler, setPopUpToggler] = useState(false);
  const [secondPopUpToggler, setSecondPopUpToggler] = useState(false);
  const [thirdPopUpToggler, setThirdPopUpToggler] = useState(false);
  const [fourthPopUpToggler, setFourthPopUpToggler] = useState(false);
  const [fifthPopUpToggler, setFifthPopUpToggler] = useState(false);
  
  useEffect(() => {
    const timeline1 = ScrollTrigger.create({
      trigger: "#model-sequence",
      start: "27.5% center",
      end: "30% center",
      markers: false,
      onEnter: () => {
        setPopUpToggler(true);
      },
      onLeave: () => {
        setPopUpToggler(false);
      },
      onEnterBack: () => {
        setPopUpToggler(true);
      },
      onLeaveBack: () => {
        setPopUpToggler(false);
      },
    });

    const timeline2 = ScrollTrigger.create({
      trigger: "#model-sequence",
      start: "42.8% center",
      end: "44.3% center",
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
      trigger: "#model-sequence",
      start: "57.1% center",
      end: "58.6% center",
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
      trigger: "#model-sequence",
      start: "71.4% center",
      end: "72.9% center",
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

    const timeline5 = ScrollTrigger.create({
      trigger: "#model-sequence",
      start: "85.7% center",
      end: "88.2% bottom",
      markers: false,
      onEnter: () => {
        setFifthPopUpToggler(true);
      },
      onLeave: () => {
        setFifthPopUpToggler(false);
      },
      onEnterBack: () => {
        setFifthPopUpToggler(true);
      },
      onLeaveBack: () => {
        setFifthPopUpToggler(false);
      },
    });

    return () => {
      timeline1.kill();
      timeline2.kill();
      timeline3.kill();
      timeline4.kill();
      timeline5.kill();
    };
  }, [setPopUpToggler, setSecondPopUpToggler, setThirdPopUpToggler, setFourthPopUpToggler, setFifthPopUpToggler]);

  return (
    <>
      <div className="h-full w-full absolute bg-[#5cffa3]  inset-0 opacity-15 z-[10]">
        <Image
          src={"/assets/img/sequenceOverlay.png"}
          alt="sequenceOverlay"
          height={1000}
          width={1000}
          className="object-cover  h-full w-full opacity-100 "
        />
      </div>
      <div
        className="h-full w-full absolute inset-0 z-[11] opacity-20"
        style={{
          background: "radial-gradient(circle, transparent 30%, #5cffa3 100%)",
        }}
      ></div>
      <p className="text-[#5cffa3]/100 z-[11] text-[20.4vw] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(92,255,163,0.3)] [text-shadow:0_0_25px_rgba(92,255,163,0.3),0_0_25px_rgba(92,255,163,0.3)]">
        GEFORCE
      </p>

      {/* POPPUP 1 */}
      <div className="h-fit w-fit absolute top-[70%] right-[10%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup isOpen={popUpToggler} />
      </div>
      {/* SECOND POPUP */}
      <div className="h-fit w-fit absolute top-[30%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup 
          isOpen={secondPopUpToggler} 
          origin="top-right"
          title="COOLING FANS"
          description="Advanced ray tracing and AI-powered graphics deliver unprecedented visual fidelity and performance."
        />
      </div>
      {/* THIRD POPUP */}
      <div className="h-fit w-fit absolute top-[20%] right-[20%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup 
          isOpen={thirdPopUpToggler} 
          origin="bottom-left"
          title="MEMORY MODULES"
          description="24GB GDDR6X memory provides massive bandwidth for handling complex textures and large datasets."
        />
      </div>
      {/* FOURTH POPUP */}
      <div className="h-fit w-fit absolute top-[70%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup 
          isOpen={fourthPopUpToggler} 
          origin="top-left"
          title="POWER PORTS"
          description="Dual 8-pin power connectors deliver stable power for maximum performance under heavy loads."
        />
      </div>
      {/* FIFTH POPUP */}
      <div className="h-fit w-fit absolute top-[70%] right-[0%] -translate-x-1/2 -translate-y-1/2 z-[200]">
        <InfoPopup 
          isOpen={fifthPopUpToggler} 
          origin="top-left"
          title="HYPERIUX"
          description="Engineered by hyperiux - Premium output interfaces delivering crystal-clear signals to multiple high-resolution displays simultaneously."
        />
      </div>
    </>
  );
}
