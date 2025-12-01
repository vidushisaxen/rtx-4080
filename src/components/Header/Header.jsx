import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function NavBar({ isAnimationRunning }) {
  const navRef = useRef(null);

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

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 z-[999] flex items-center justify-between w-full px-[5vw] py-[3vw]"
      style={{ opacity: 0 }}
    >
      <Link href={"/"} className="h-auto w-[10vw] ">
        <Image
          src={"/assets/icons/hyperiux.svg"}
          height={100}
          width={100}
          alt="rtx-logo"
          className="h-full text-white w-full"
        />
      </Link>
      <div className="p-[.9vw] cursor-pointer aspect-square flex items-center justify-center h-fit w-fit bg-[#42424280] rounded-full border border-white/10">
        <Image
          src={"/assets/icons/musicwave.svg"}
          height={100}
          width={100}
          alt="rtx-logo"
          className="h-[1.5vw] text-white w-[1.5vw]"
        />
      </div>
    </nav>
  );
}
