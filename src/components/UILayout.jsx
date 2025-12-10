'use client';
import React, { useState, useEffect } from "react";
import NavBar from "./Header/Header";
import ScrollTracker from "./ScrollTracker/ScrollTracker";
import HeroMain from "./HeroMain/HeroMainScreen";
import ChromaVignetteEffect from "./QuantumWalletBG/QuantumWallet";



export default function UILayout({ children }) {
  const [isAnimationRunning, setIsAnimationRunning] = useState(true);

  // Reload to top function - ensures page always starts from top on reload
  useEffect(() => {
    // Force scroll to top with multiple methods for better reliability
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll on mount
    scrollToTop();

    // Additional scroll after a short delay to handle any async content
    const timeoutId = setTimeout(scrollToTop, 100);

    // Handle page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        scrollToTop();
      }
    };

    // Handle page show event (back/forward navigation)
    const handlePageShow = (event) => {
      scrollToTop();
    };

    // Handle before unload
    const handleBeforeUnload = () => {
      scrollToTop();
    };

    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <ScrollTracker isAnimationRunning={isAnimationRunning} />
      <NavBar isAnimationRunning={isAnimationRunning} />
      <HeroMain isAnimationRunning={isAnimationRunning} setIsAnimationRunning={setIsAnimationRunning} />
      {children}
      <ChromaVignetteEffect/>
      
    </>
  );
}
