import BodyFrame from "@/components/BodyFrame";
import Footer from "@/components/Footer";
import FixedGrid from "@/components/Grid/FixedGrid";
import Header from "@/components/Header";
import HeroWrapper from "@/components/HeroWrapper";
import InfoPopup from "@/components/InfoPopup";
import ModelSequence from "@/components/ModelSequence/ModelSequence";
import OpeningScene from "@/components/HeroScene/HeroScene";
import RTXONOFF from "@/components/RTX_ON_OFF";
import React from "react";
import HeroMain from "@/components/HeroMain/HeroMainScreen";

const page = () => {
  return (
    <>
      <div className="bg-black h-screen w-full flex items-center justify-center">
        <div className="w-[95%] h-[92%] border-[1px] relative border-white/15 overflow-hidden rounded-[1vw]">
          <HeroMain />
        </div>
      </div>
    </>
  );
};

export default page;
