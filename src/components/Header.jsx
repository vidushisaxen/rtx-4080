"use client";
import React, { useState, useEffect } from "react";
import ScrambleText from "./HoverEffect/ScrambleText";
import Image from "next/image";
import Link from "next/link";

const links = [
  { name: "About Us", link: "/#" },
  { name: "Projects", link: "/#" },
  { name: "Solutions", link: "/#" },
  { name: "Resources", link: "/#" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 100) {
        setHidden(true);
      } else if (currentY < lastY) {
        setHidden(false);
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <>
      <header
        className={`fixed px-15 py-5 top-0 left-0 w-screen z-[300] transform transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="inner-nav">
          <div className="relative flex items-center justify-center h-full w-full ">
            <div className="flex items-center justify-between w-full h-full relative z-10">
              <div className="h-[5vw] w-[5vw] flex items-center justify-center">
                <Image
                  src={"/assets/icons/rtx.svg"}
                  height={100}
                  width={100}
                  alt="rtx-logo"
                  className="h-full w-full invert"
                />
              </div>
              <nav className="flex items-center justify-between w-[55%] ">
                {links.map((item, index) => (
                  <div key={index} className="relative z-[100]" >
                    <a
                      href={item.link}
                      className="flex items-center group gap-2 justify-start relative z-100 cursor-pointer"
                    >
                      <div className="cursor-pointer text-left relative overflow-hidden">
                        <span className="uppercase text-sm text-white font-medium tracking-wide hover:text-gray-300 transition-colors">
                          <ScrambleText
                            onHover={true}
                            speed={0.5}
                            className="inline-block min-w-[100px] text-center"
                          >
                            {item.name}
                          </ScrambleText>
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
                <div className="w-[80%] h-auto absolute top-[3vw] left-1/2 -translate-x-[52%]">
                  <svg
                    className="w-full h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1353 24"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <clipPath id="nav-clip">
                        <rect width="1353" height="24" x="0" y="0" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#nav-clip)">
                      <g transform="matrix(1,0,0,1,0,0)" opacity="1">
                        <g opacity="1" transform="matrix(1,0,0,1,676.5,11.92)">
                          <path
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            fillOpacity="0"
                            strokeMiterlimit="4"
                            stroke="rgb(255,255,255)"
                            strokeOpacity="0.3"
                            strokeWidth="1"
                            d="M-676.5,-10.92 C-676.5,-10.92 -525.748,-10.92 -525.748,-10.92 C-525.748,-10.92 -503.908,10.92 -503.908,10.92 C-503.908,10.92 -61.814,10.92 -61.814,10.92 C-61.814,10.92 -39.974,-10.92 -39.974,-10.92 C-39.974,-10.92 -0.927,-10.92 -0.927,-10.92 C-0.927,-10.92 0.928,-10.92 0.928,-10.92 C0.928,-10.92 39.975,-10.92 39.975,-10.92 C39.975,-10.92 61.815,10.92 61.815,10.92 C61.815,10.92 503.91,10.92 503.91,10.92 C503.91,10.92 525.75,-10.92 525.75,-10.92 C525.75,-10.92 676.5,-10.92 676.5,-10.92"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
              </nav>
              <div>
                <Link href={"/#"} className="">
                  <div className="h-fit min-w-[9vw] text-sm border text-black border-[#31342f] rounded-lg p-3 text-center">
                    <ScrambleText
                      onHover={true}
                      speed={0.5}
                      className="inline-block min-w-[100px] text-center uppercase"
                    >
                      Contact Us
                    </ScrambleText>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
