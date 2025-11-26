import BodyFrame from "@/components/BodyFrame";
import Footer from "@/components/Footer";
import FixedGrid from "@/components/Grid/FixedGrid";
import Header from "@/components/Header";
import HeroWrapper from "@/components/HeroWrapper";
import InfoPopup from "@/components/InfoPopup";
import ModelSequence from "@/components/ModelSequence/ModelSequence";
import RTXONOFF from "@/components/RTX_ON_OFF";
import React from "react";

const page = () => {
  return (
    <>
      {/* <BodyFrame/> */}
      <Header />
     <HeroWrapper/>
      <ModelSequence />
      <RTXONOFF />
      {/* <Footer /> */}
      {/* <PerformanceChart/> */}
      {/* <PerformanceChart/> */}
    </>
  );
};

export default page;
