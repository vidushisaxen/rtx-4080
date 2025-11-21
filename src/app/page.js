import DragableVideo from "@/components/DragableVideo/DragableVideo";
import FixedGrid from "@/components/Grid/FixedGrid";
import BodyFrame from '@/components/BodyFrame'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import HeroBackground from '@/components/HeroBackground'
import HeroCopy from '@/components/HeroCopy'
import React from "react";

const page = () => {
  return (
   <>
   <BodyFrame/>
   <FixedGrid/>
   <Header/>
   <HeroCopy/>
   <HeroBackground/>
   <DragableVideo/>
   <Footer/>
   </>
  )
}

export default page;
