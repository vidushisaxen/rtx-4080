"use client";
import React, { useRef, useEffect } from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DirectionalLightComponent({ colorTheme = "#5cffa3" }) {
  const lightRef = useRef();
  
  // Show helper for debugging (can be removed in production)
  useHelper(lightRef, DirectionalLightHelper, 1, colorTheme);

  // Timeline 1: Initial light movement (0% - 5%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "top top",
        end: "5% top",
        scrub: true,
        markers: false,
      },
    });

    timeline1.to(lightRef.current.position, {
      x: 0,
      y: 4,
      z: 2,
      ease: "power1.inOut",
    });

    timeline1.to(lightRef.current.rotation, {
      x: 0.2,
      y: -0.3,
      z: 0.1,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline1.kill();
    };
  }, []);

  // Timeline 2: Light follows model movement (5% - 28.5%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "5% top",
        end: "28.5% top",
        scrub: true,
        markers: false,
      },
    });

    timeline2.to(lightRef.current.position, {
      x: -1,
      y: 0,
      z: 14,
      ease: "power1.inOut",
    });

    // timeline2.to(lightRef.current.rotation, {
    //   x: 0.1,
    //   y: 0.4,
    //   z: 0,
    //   ease: "power1.inOut",
    // }, 0);

    return () => {
      timeline2.kill();
    };
  }, []);

  // Timeline 3: Light repositions for side view (28.5% - 42.8%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline3 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "28.5% top",
        end: "42.8% top",
        scrub: true,
        markers: false,
      },
    });

    timeline3.to(lightRef.current.position, {
      x: 12,
      y: 15,
      z: 3,
      ease: "power1.inOut",
    });

    timeline3.to(lightRef.current.rotation, {
      x: 0.3,
      y: -0.6,
      z: -0.2,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline3.kill();
    };
  }, []);

  // Timeline 4: Light adjusts for back view (42.8% - 57.1%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline4 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "42.8% top",
        end: "57.1% top",
        scrub: true,
        markers: false,
      },
    });

    timeline4.to(lightRef.current.position, {
      x: 8,
      y: 20,
      z: -5,
      ease: "power1.inOut",
    });

    timeline4.to(lightRef.current.rotation, {
      x: -0.4,
      y: 0.8,
      z: 0.3,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline4.kill();
    };
  }, []);

  // Timeline 5: Light follows model rotation (57.1% - 71.4%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline5 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "57.1% top",
        end: "71.4% top",
        scrub: true,
        markers: false,
      },
    });

    timeline5.to(lightRef.current.position, {
      x: 15,
      y: 12,
      z: -2,
      ease: "power1.inOut",
    });

    timeline5.to(lightRef.current.rotation, {
      x: 0.2,
      y: -1.2,
      z: 0.5,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline5.kill();
    };
  }, []);

  // Timeline 6: Light dramatic positioning (71.4% - 85.7%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline6 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "71.4% top",
        end: "85.7% top",
        scrub: true,
        markers: false,
      },
    });

    timeline6.to(lightRef.current.position, {
      x: 20,
      y: 8,
      z: 6,
      ease: "power1.inOut",
    });

    timeline6.to(lightRef.current.rotation, {
      x: 0.6,
      y: -0.8,
      z: -0.3,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline6.kill();
    };
  }, []);

  // Timeline 7: Reset to original position (85.7% - 100%)
  useEffect(() => {
    if (typeof window === "undefined" || !lightRef.current) return;

    const timeline7 = gsap.timeline({
      scrollTrigger: {
        trigger: "#model-sequence",
        start: "85.7% top",
        end: "100% bottom",
        scrub: true,
        markers: false,
      },
    });

    // Reset to original position
    timeline7.to(lightRef.current.position, {
      x: 0,
      y: -5,
      z: 10,
      ease: "power1.inOut",
    });

    timeline7.to(lightRef.current.rotation, {
      x: 0,
      y: 0,
      z: 0,
      ease: "power1.inOut",
    }, 0);

    return () => {
      timeline7.kill();
    };
  }, []);

  return (
    <directionalLight
      ref={lightRef}
      position={[0, -5, 10]}
      rotation={[0, 0, 0]}
      intensity={1}
      color={colorTheme}
      target-position={[0, 0, 0]}
    />
  );
}
