import BodyFrame from "@/components/BodyFrame";
// import PerformanceChart from "@/components/ComparisonLine";
import PerformanceChart from "@/components/Comparison";
import Footer from "@/components/Footer";
import FixedGrid from "@/components/Grid/FixedGrid";
import Header from "@/components/Header";
import HeroBackground from "@/components/HeroBackground";
import HeroCopy from "@/components/HeroCopy";
import InfoPopup from "@/components/InfoPopup";
import ModelSequence from "@/components/ModelSequence/ModelSequence";
import RTXONOFF from "@/components/RTX_ON_OFF";
import React from "react";

const page = () => {
  return (
    <>
      {/* <BodyFrame/> */}
      <Header/>
      {/* <HeroCopy/> */}
      {/* <HeroBackground/> */}
      {/* <Footer/> */}
      <ModelSequence />
      {/* <RTXONOFF/> */}
      {/* <PerformanceChart/> */}
      {/* <PerformanceChart/> */}
    </>
  );
};

export default page;
