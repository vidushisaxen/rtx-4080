"use client";

import React, { forwardRef, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Use CSS module or define these classes in your CSS for fidelity!
const classNames = {
  container: "scramble-container",
  centered: "centered",
  absoluteText: "absolute-text",
  realText: "real-text",
  charLowercase: "charLowercase", // match the compiled output exactly!
};

gsap.registerPlugin(ScrambleTextPlugin, SplitText);

const charTypes = {
  lowerCase: "lowerCase",
  upperCase: "upperCase",
  upperAndLowerCase: "upperAndLowerCase",
};
const getCharType = (lowercase, uppercase) =>
  lowercase ? charTypes.lowerCase : uppercase ? charTypes.upperCase : charTypes.upperAndLowerCase;

// The main ScrambleText component
const ScrambleText = forwardRef(
  (
    {
      children: n,
      from: e = "",
      timescale: t = 1,
      delay: r = 0,
      onHover: i = false,
      onInit: o = false,
      lowercase: s = false,
      uppercase: l = false,
      scramble: a = true,
      centered: u = false,
      speed: d = 0.6,
      color: h = "",
      className: D = "",
    },
    g
  ) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const splitRef = useRef(null);

    // For on-hover effect
    const { contextSafe } = useGSAP({ scope: containerRef });

    // Create animation timeline
    const createAnimation = () => {
      const tl = gsap.timeline({ paused: true });
      if (!textRef.current) return tl;

      if (splitRef.current) splitRef.current.revert();

      // Set the text content
      textRef.current.textContent = e || n;

      // Match class for lowercase, exactly as site code
      splitRef.current = new SplitText(textRef.current, {
        type: "chars",
        charsClass: l ? "" : classNames.charLowercase,
      });

      // For scramble, k = original non-space chars
      const originalChars = (e || n).split("").filter((T) => T !== " ");
      const chars = splitRef.current.chars; // All elements, includes spaces

      // Parameters from site code:
      const L = 0.03;
      const fadeDuration = chars.length * L;

      // Fade out all chars
      tl.to(chars, {
        opacity: 0.3,
        duration: fadeDuration,
        stagger: 0.03,
        ease: "power2.out",
        color: h || "inherit",
      }, 0);

      // Fade in all chars (slightly longer stagger)
      tl.to(chars, {
        opacity: 1,
        duration: fadeDuration,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "color",
      }, fadeDuration);

      // Scramble in place for each char (not spaces)
      if (a) {
        let nonSpaceIdx = 0;
        chars.forEach((T, K) => {
          // The original k array has only non-space chars
          if (T.textContent !== " ") {
            tl.to(
              T,
              {
                scrambleText: {
                  text: originalChars[nonSpaceIdx],
                  speed: d,
                  chars: getCharType(s, l),
                },
                duration: 0.7,
                ease: "none",
              },
              K * L + 0.05
            );
            nonSpaceIdx++;
          }
        });
      }

      return tl.restart();
    };

    // Animate on hover/request/init
    const animationRef = useRef(null);

    const animate = contextSafe(() => {
      if (textRef.current) {
        // Kill any existing tweens on textRef.current to prevent overlapping animations
        gsap.killTweensOf(textRef.current);

        if (!animationRef.current) {
          animationRef.current = gsap
            .timeline({ paused: true })
            .timeScale(t)
            .add(createAnimation(), r);
        }
        animationRef.current.restart();
      }
    });

    useEffect(() => {
      if (o) animate();
    }, [animate, o, n, e, t, r, s, l, a, d, h]);

    return (
      <div
        ref={containerRef}
        className={[
          classNames.container,
          u ? classNames.centered : "",
          D,
        ].join(" ")}
        onMouseEnter={i ? animate : undefined}
        style={{
          position: "relative",
          display: "inline-block"
        }}
      >
        <span
          ref={textRef}
          className={`${classNames.realText} text-white/80`}
          style={{ display: "inline-block" }}
        >
          {n}
        </span>
      </div>
    );
  }
);

ScrambleText.displayName = "ScrambleText";

export default ScrambleText;
