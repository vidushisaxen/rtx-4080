import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AudioCanvas from "../AudioCanvas/AudioCanvas";

export default function NavBar({ isAnimationRunning , LineArtActive }) {
  const navRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;

    if (!isAnimationRunning) {
      // Animate navbar appearance with blur filter
      gsap.fromTo(
        navRef.current,
        {
          opacity: 0,
          y: -50,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
        }
      );
    } else {
      // Hide navbar when animation is running
      gsap.to(navRef.current, {
        opacity: 0,
        y: -50,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.in",
      });
    }
  }, [isAnimationRunning]);

  // Handle theme changes based on LineArtActive
  useEffect(() => {
    if (!logoRef.current) return;

    // Animate logo color change
    gsap.to(logoRef.current, {
      filter: LineArtActive ? "invert(1)" : "invert(0)",
      duration: .5,
      ease: "power2.inOut",
    });
  }, [LineArtActive]);

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 !z-[99999] flex items-center justify-between w-full px-[5vw] py-[3vw]"
      style={{ opacity: 0 }}
    >
      <Link href={"/"} className="h-auto w-[10vw] ">
        <Image
          ref={logoRef}
          src={"/assets/icons/Hyperiux.svg"}
          height={100}
          width={100}
          alt="rtx-logo"
          className="h-full text-white w-full transition-all duration-1000"
        />
      </Link>
    <AudioCanvas LineArtActive={LineArtActive} />
    </nav>
  );
}
