'use client';
import React, { useState } from "react";
import NavBar from "./Header/Header";
import ScrollTracker from "./ScrollTracker/ScrollTracker";
import HeroMain from "./HeroMain/HeroMainScreen";

export default function UILayout({ children }) {
  const [isAnimationRunning, setIsAnimationRunning] = useState(true);

  return (
    <>
      <ScrollTracker isAnimationRunning={isAnimationRunning} />
      <NavBar isAnimationRunning={isAnimationRunning} />
      <HeroMain isAnimationRunning={isAnimationRunning} setIsAnimationRunning={setIsAnimationRunning} />
      {children}
    </>
  );
}
