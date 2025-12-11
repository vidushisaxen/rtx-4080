"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import NavBar from "./Header/Header";
import ScrollTracker from "./ScrollTracker/ScrollTracker";
import HeroMain from "./HeroMain/HeroMainScreen";
import ChromaVignetteEffect from "./QuantumWalletBG/QuantumWallet";
import Transition from "./TransitionShader/Transition";
import { useLenis } from "lenis/react";

export default function UILayout({ children }) {
  const [isAnimationRunning, setIsAnimationRunning] = useState(true);
  const [LineArtActive, setLineArtActive] = useState(false);
  const borderRefs = useRef([]);
  const textRefs = useRef([]);
  const [transitionRunning, setTransitionRunning] = useState(false);
  const transitionRunningRef = useRef(false);
  const lenis = useLenis();
  useEffect(() => {
    // Force scroll to top with multiple methods for better reliability
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // GSAP theme transition effect
  useEffect(() => {
    const duration = 0.5;
    const ease = "power2.inOut";

    // Animate border elements
    borderRefs.current.forEach((border) => {
      if (border) {
        gsap.to(border, {
          borderColor: LineArtActive ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.1)",
          duration,
          ease,
        });
      }
    });

    // Animate text elements
    textRefs.current.forEach((text) => {
      if (text) {
        gsap.to(text, {
          color: LineArtActive ? "rgba(0, 0, 0, .2)" : "rgba(255, 255, 255, 0.15)",
          duration,
          ease,
        });
      }
    });
  }, [LineArtActive]);

  // Sync ref with state
  useEffect(() => {
    transitionRunningRef.current = transitionRunning;
  }, [transitionRunning]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (transitionRunningRef.current) return;
      
  //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //     const windowHeight = window.innerHeight;
  //     const documentHeight = document.documentElement.scrollHeight;
      
  //     // Check if user has scrolled to the bottom
  //     if (scrollTop + windowHeight >= documentHeight * 0.995) {
  //       infiniteLoop();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
    
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [lenis]);

  // const infiniteLoop = () => {
  //   // Prevent multiple simultaneous transitions
  //   if (transitionRunningRef.current) return;
  //   transitionRunningRef.current = true;
    
  //   // Stop lenis immediately
  //   if (lenis) {
  //     lenis.stop();
  //   }
    
  //   // Get current scroll position
  //   const startScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    
  //   // Create a GSAP timeline for smooth, coordinated animations
  //   const scrollObject = { y: startScroll };
  //   const tl = gsap.timeline({
  //     defaults: { ease: "power2.inOut" },
  //     onComplete: () => {
  //       // Ensure we're at the top
  //       window.scrollTo({ top: 0, behavior: "instant" });
  //       document.documentElement.scrollTop = 0;
  //       document.body.scrollTop = 0;
        
  //       // Restart lenis smoothly after transition
  //       if (lenis) {
  //         setTimeout(() => {
  //           lenis.start();
  //         }, 100);
  //       }
  //     }
  //   });

  //   // Start transition effect immediately
  //   setTransitionRunning(true);
    
  //   // Phase 1: Smooth fade in of transition (0.0s - 0.6s)
  //   // Phase 2: Smooth scroll to top during transition peak (0.5s - 1.5s)
  //   // This creates a merged, seamless effect where scroll happens as transition is at peak
  //   tl.to(scrollObject, {
  //     y: 0,
  //     duration: 1.2,
  //     ease: "power3.inOut",
  //     onUpdate: () => {
  //       const scrollY = Math.max(0, scrollObject.y);
        
  //       // Since Lenis is stopped, manually update scroll position
  //       // This ensures smooth scrolling during the transition
  //       window.scrollTo(0, scrollY);
  //       document.documentElement.scrollTop = scrollY;
  //       document.body.scrollTop = scrollY;
        
  //       // Update Lenis scroll position to keep it in sync
  //       if (lenis && lenis.scrollTo) {
  //         try {
  //           lenis.scrollTo(scrollY, { immediate: true });
  //         } catch (e) {
  //           // Fallback if scrollTo fails
  //           console.warn('Lenis scrollTo error:', e);
  //         }
  //       }
  //     }
  //   }, 0.5); // Start scroll slightly after transition begins for perfect merge
    
  //   // Phase 3: Hold transition for full effect visibility (total 2.2s)
  //   // Phase 4: Smooth fade out (automatically handled by Transition component)
  //   tl.to({}, {
  //     duration: 0.5,
  //     onComplete: () => {
  //       setTransitionRunning(false);
  //       transitionRunningRef.current = false;
  //     }
  //   }, 1.7);
  // }

  return (
    <>
      <ScrollTracker
        isAnimationRunning={isAnimationRunning}
        LineArtActive={LineArtActive}
      />
      <NavBar
        isAnimationRunning={isAnimationRunning}
        LineArtActive={LineArtActive}
      />
      <HeroMain
        isAnimationRunning={isAnimationRunning}
        setIsAnimationRunning={setIsAnimationRunning}
        setLineArtActive={setLineArtActive}
        LineArtActive={LineArtActive}
      />
      {children}
      <ChromaVignetteEffect isAnimationRunning={isAnimationRunning} LineArtActive={LineArtActive} />
      {/* <Transition runAnimation={transitionRunning}/> */}

      <div className="fixed top-0 items-center justify-center left-0 w-full h-full flex flex-col z-[99] !pointer-events-none">
        <div 
          ref={(el) => (borderRefs.current[0] = el)}
          className="w-full h-[25%] border-b border-t relative border-white/10"
        >
          <p 
            ref={(el) => (textRefs.current[0] = el)}
            className="absolute top-[-1.5vw] left-[1vw] text-white/15 text-[.7vw]"
          >
            HYPERIUX 1000" TPS
          </p>
          <p 
            ref={(el) => (textRefs.current[1] = el)}
            className="absolute bottom-[.5vw] left-[1vw] text-white/15 text-[.7vw]"
          >
            ハイペリウクス システム
          </p>
        </div>
        <div 
          ref={(el) => (borderRefs.current[1] = el)}
          className="w-full h-[25%] border-b relative border-white/10"
        >
          <p 
            ref={(el) => (textRefs.current[2] = el)}
            className="absolute bottom-[.5vw] left-[1vw] text-white/15 text-[.7vw]"
          >
            1 DOGE = 1000 HYPERIUX
          </p>
        </div>
      </div>
    </>
  );
}
