"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const SparkleBtn = ({
  children = "Explore",
  onClick = () => {},
  className = "",
  disabled = false,
  colorTheme = "orange", // New color theme prop
}) => {
  const buttonRef = useRef(null);
  const wrapperRef = useRef(null);
  const particlesRef = useRef(null);
  const textRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [globalMouse, setGlobalMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const currentPos = useRef({ x: 0, y: 0 });
  const particleInterval = useRef(null);
  const animationFrame = useRef(null);

  // Color theme configurations
  const colorThemes = {
    orange: {
      primary: "rgba(255, 69, 0, 0.15)",
      secondary: "rgba(255, 140, 0, 0.15)",
      tertiary: "rgba(255, 215, 0, 0.1)",
      border: "rgba(255, 140, 0, 0.4)",
      borderHover: "rgba(255, 165, 0, 0.7)",
      textShadow: "rgba(255, 140, 0, 0.5)",
      particle: "rgba(255, 215, 0, 1)",
      particleSecondary: "rgba(255, 140, 0, 0.8)",
      glow: "rgba(255, 165, 0, 0.9)",
      glowSecondary: "rgba(255, 140, 0, 0.6)",
      boxShadow: "rgba(255, 69, 0, 0.4)",
      boxShadowSecondary: "rgba(255, 140, 0, 0.3)",
      boxShadowTertiary: "rgba(255, 165, 0, 0.2)",
      insetShadow: "rgba(255, 215, 0, 0.1)",
      bgGradient:
        "linear-gradient(135deg, rgba(255, 69, 0, 0.15), rgba(255, 140, 0, 0.15), rgba(255, 215, 0, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 140, 0, 0.2) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(255, 215, 0, 1), rgba(255, 140, 0, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(255, 215, 0, 0.7), rgba(255, 140, 0, 0.5))",
    },
    blue: {
      primary: "rgba(0, 123, 255, 0.15)",
      secondary: "rgba(0, 162, 255, 0.15)",
      tertiary: "rgba(135, 206, 250, 0.1)",
      border: "rgba(0, 162, 255, 0.4)",
      borderHover: "rgba(30, 144, 255, 0.7)",
      textShadow: "rgba(0, 162, 255, 0.5)",
      particle: "rgba(135, 206, 250, 1)",
      particleSecondary: "rgba(0, 162, 255, 0.8)",
      glow: "rgba(30, 144, 255, 0.9)",
      glowSecondary: "rgba(0, 162, 255, 0.6)",
      boxShadow: "rgba(0, 123, 255, 0.4)",
      boxShadowSecondary: "rgba(0, 162, 255, 0.3)",
      boxShadowTertiary: "rgba(30, 144, 255, 0.2)",
      insetShadow: "rgba(135, 206, 250, 0.1)",
      bgGradient:
        "linear-gradient(135deg, rgba(0, 123, 255, 0.15), rgba(0, 162, 255, 0.15), rgba(135, 206, 250, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(135, 206, 250, 0.3) 0%, rgba(0, 162, 255, 0.2) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(135, 206, 250, 1), rgba(0, 162, 255, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(135, 206, 250, 0.7), rgba(0, 162, 255, 0.5))",
    },
    green: {
      primary: "rgba(34, 197, 94, 0.15)",
      secondary: "rgba(16, 185, 129, 0.15)",
      tertiary: "rgba(110, 231, 183, 0.1)",
      border: "rgba(16, 185, 129, 0.4)",
      borderHover: "rgba(34, 197, 94, 0.7)",
      textShadow: "rgba(16, 185, 129, 0.5)",
      particle: "rgba(110, 231, 183, 1)",
      particleSecondary: "rgba(16, 185, 129, 0.8)",
      glow: "rgba(34, 197, 94, 0.9)",
      glowSecondary: "rgba(16, 185, 129, 0.6)",
      boxShadow: "rgba(34, 197, 94, 0.4)",
      boxShadowSecondary: "rgba(16, 185, 129, 0.3)",
      boxShadowTertiary: "rgba(34, 197, 94, 0.2)",
      insetShadow: "rgba(110, 231, 183, 0.1)",
      bgGradient:
        "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15), rgba(110, 231, 183, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(110, 231, 183, 0.3) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(110, 231, 183, 1), rgba(16, 185, 129, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(110, 231, 183, 0.7), rgba(16, 185, 129, 0.5))",
    },
    purple: {
      primary: "rgba(147, 51, 234, 0.15)",
      secondary: "rgba(168, 85, 247, 0.15)",
      tertiary: "rgba(196, 181, 253, 0.1)",
      border: "rgba(168, 85, 247, 0.4)",
      borderHover: "rgba(147, 51, 234, 0.7)",
      textShadow: "rgba(168, 85, 247, 0.5)",
      particle: "rgba(196, 181, 253, 1)",
      particleSecondary: "rgba(168, 85, 247, 0.8)",
      glow: "rgba(147, 51, 234, 0.9)",
      glowSecondary: "rgba(168, 85, 247, 0.6)",
      boxShadow: "rgba(147, 51, 234, 0.4)",
      boxShadowSecondary: "rgba(168, 85, 247, 0.3)",
      boxShadowTertiary: "rgba(147, 51, 234, 0.2)",
      insetShadow: "rgba(196, 181, 253, 0.1)",
      bgGradient:
        "linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(168, 85, 247, 0.15), rgba(196, 181, 253, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(196, 181, 253, 0.3) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(196, 181, 253, 1), rgba(168, 85, 247, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(196, 181, 253, 0.7), rgba(168, 85, 247, 0.5))",
    },
    red: {
      primary: "rgba(239, 68, 68, 0.15)",
      secondary: "rgba(248, 113, 113, 0.15)",
      tertiary: "rgba(252, 165, 165, 0.1)",
      border: "rgba(248, 113, 113, 0.4)",
      borderHover: "rgba(239, 68, 68, 0.7)",
      textShadow: "rgba(248, 113, 113, 0.5)",
      particle: "rgba(252, 165, 165, 1)",
      particleSecondary: "rgba(248, 113, 113, 0.8)",
      glow: "rgba(239, 68, 68, 0.9)",
      glowSecondary: "rgba(248, 113, 113, 0.6)",
      boxShadow: "rgba(239, 68, 68, 0.4)",
      boxShadowSecondary: "rgba(248, 113, 113, 0.3)",
      boxShadowTertiary: "rgba(239, 68, 68, 0.2)",
      insetShadow: "rgba(252, 165, 165, 0.1)",
      bgGradient:
        "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.15), rgba(252, 165, 165, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(252, 165, 165, 0.3) 0%, rgba(248, 113, 113, 0.2) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(252, 165, 165, 1), rgba(248, 113, 113, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(252, 165, 165, 0.7), rgba(248, 113, 113, 0.5))",
    },
    white: {
      primary: "rgba(255, 255, 255, 0.15)",
      secondary: "rgba(255, 255, 255, 0)",
      tertiary: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(255, 255, 255, 0.5)",
      textShadow: "rgba(255, 255, 255, 0.5)",
      particle: "rgba(255, 255, 255, 1)",
      particleSecondary: "rgba(255, 255, 255, 0.8)",
      glow: "rgba(255, 255, 255, 0.9)",
      glowSecondary: "rgba(255, 255, 255, 0.6)",
      boxShadow: "rgba(255, 255, 255, 0.1)",
      boxShadowSecondary: "rgba(255, 255, 255, 0.1)",
      boxShadowTertiary: "rgba(255, 255, 255, .1)",
      insetShadow: "rgba(255, 255, 255, .1)",
      bgGradient:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1))",
      shineGradient:
        "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)",
      particleGradient:
        "radial-gradient(circle, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8))",
      rippleGradient:
        "radial-gradient(circle, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))",
    },
  };

  const currentTheme = colorThemes[colorTheme] || colorThemes.orange;

  // Global mouse tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setGlobalMouse({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    return () =>
      document.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Magnetic effect animation
  useEffect(() => {
    const animateMagnetic = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = globalMouse.x - centerX;
      const deltaY = globalMouse.y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 150) {
        const strength = (150 - distance) / 150;
        currentPos.current.x +=
          (deltaX * strength * 0.15 - currentPos.current.x) * 0.2;
        currentPos.current.y +=
          (deltaY * strength * 0.15 - currentPos.current.y) * 0.2;

        gsap.to(wrapperRef.current, {
          duration: 0.3,
          x: currentPos.current.x,
          y: currentPos.current.y,
          ease: "power2.out",
        });
      } else {
        currentPos.current.x += (0 - currentPos.current.x) * 0.2;
        currentPos.current.y += (0 - currentPos.current.y) * 0.2;

        gsap.to(wrapperRef.current, {
          duration: 0.3,
          x: currentPos.current.x,
          y: currentPos.current.y,
          ease: "power2.out",
        });
      }

      animationFrame.current = requestAnimationFrame(animateMagnetic);
    };

    animateMagnetic();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [globalMouse]);

  // Particle creation
  const createParticle = () => {
    if (!isHovering || !buttonRef.current || !particlesRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const relativeX = mousePos.x - centerX;
    const relativeY = mousePos.y - centerY;

    const particle = document.createElement("span");
    particle.className = "sparkle-particle";
    particlesRef.current.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 80;
    const targetX = relativeX + Math.cos(angle) * distance;
    const targetY = relativeY + Math.sin(angle) * distance;

    gsap.set(particle, {
      x: relativeX,
      y: relativeY,
      opacity: 0,
      scale: 0,
    });

    gsap.to(particle, {
      duration: 0.8 + Math.random() * 0.4,
      x: targetX,
      y: targetY,
      opacity: 1,
      scale: 1,
      ease: "power2.out",
      onUpdate: function () {
        const progress = this.progress();
        if (progress > 0.5) {
          gsap.set(particle, {
            opacity: 1 - (progress - 0.5) * 2,
          });
        }
      },
      onComplete: function () {
        particle.remove();
      },
    });
  };

  // Hover effects
  useEffect(() => {
    if (isHovering) {
      particleInterval.current = setInterval(createParticle, 10);
    } else {
      if (particleInterval.current) {
        clearInterval(particleInterval.current);
        particleInterval.current = null;
      }
    }

    return () => {
      if (particleInterval.current) {
        clearInterval(particleInterval.current);
      }
    };
  }, [isHovering, mousePos]);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = (e) => {
    if (disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "sparkle-ripple";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    buttonRef.current.appendChild(ripple);

    gsap.fromTo(
      ripple,
      {
        scale: 0,
        opacity: 0.6,
      },
      {
        duration: 0.6,
        scale: 20,
        opacity: 0,
        ease: "power2.out",
        onComplete: function () {
          ripple.remove();
        },
      }
    );

    onClick(e);
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={`relative transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`}
      >
        <button
          ref={buttonRef}
          className={`
            relative px-10 py-2 text-base font-medium tracking-wider uppercase text-white
            border-2 rounded-lg cursor-pointer overflow-hidden
            transition-all duration-300 ease-in-out
            backdrop-blur-md z-10
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:-translate-y-0.5 active:translate-y-0"
            }
          `}
          style={{
            background: currentTheme.bgGradient,
            borderColor: currentTheme.border,
            boxShadow: isHovering
              ? `
              0 10px 40px ${currentTheme.boxShadow},
              0 0 40px ${currentTheme.boxShadowSecondary},
              0 0 60px ${currentTheme.boxShadowTertiary},
              inset 0 0 25px ${currentTheme.insetShadow}
            `
              : "none",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          disabled={disabled}
        >
          <span
            ref={textRef}
            className="relative z-30 inline-block transition-transform duration-300 ease-in-out text-[0.8vw]"
            style={{
              textShadow: `0 0 10px ${currentTheme.textShadow}`,
            }}
          >
            {children}
          </span>

          <span
            className={`
              absolute -top-1/2 -left-1/2 w-[200%] h-[200%] 
              transition-opacity duration-300 ease-in-out z-20
              ${isHovering ? "opacity-100" : "opacity-0"}
            `}
            style={{
              background: currentTheme.shineGradient,
            }}
          />

          <div
            ref={particlesRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible"
          />
        </button>
      </div>

      <style jsx global>{`
        /* Reset and normalize */
        * {
          box-sizing: border-box;
        }

        .sparkle-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${currentTheme.particleGradient};
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 12px ${currentTheme.glow},
            0 0 20px ${currentTheme.glowSecondary};
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .sparkle-ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${currentTheme.rippleGradient};
          transform: translate(-50%, -50%);
          pointer-events: none;
          box-shadow: 0 0 20px ${currentTheme.glowSecondary};
        }

        button:hover {
          border-color: ${currentTheme.borderHover} !important;
        }
      `}</style>
    </>
  );
};

export default SparkleBtn;
