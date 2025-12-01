"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrambleText from "./HoverEffect/ScrambleText";
import Image from "next/image";
import HeroBackground from '@/components/HeroWrapper/HeroBackground'


export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (globalThis.innerWidth > 640) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [isMobile]);
  return (
    <>
       <HeroBackground/>
    <div className="relative " id="footer">
      
      <footer
        className="h-fit absolute inset-0 z-[40] flex items-center justify-center max-md:h-fit  max-sm:h-[140vh] w-screen   overflow-hidden py-3"
        id="footer"
      >
        <div className="w-full h-full flex max-md:h-fit items-center justify-center relative">
          <div className="w-[97vw] max-h-[60vh] h-auto ">
           <svg className="h-full w-full backdrop-blur-xs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1100"><path fill="#11111122" stroke="#31342f" strokeWidth="1" fillRule="evenodd" d="M1200 91.5c0-28.3 0-42.4-8.8-51.2s-22.9-8.8-51.2-8.8H948.2c-7.4 0-11.2 0-14.7-.8-3.6-.9-7-2.4-10.1-4.5-2.9-2-5.4-4.8-10.4-10.4-4.9-5.6-7.4-8.4-10.4-10.4-3-2.1-6.5-3.7-10.1-4.5-3.3-.9-7-.9-14.5-.9H60C31.7 0 17.6 0 8.8 8.8S0 31.7 0 60v1040h1200V91.5z" clipRule="evenodd"/></svg>
          </div>
          <div className="px-30 pb-10 z-10 flex items-start justify-between left-0 w-full  flex-col h-full absolute">
            <div className="h-[90%] relative gap-[10vw]  w-full flex  items-center justify-between ">
              <div className="w-[50%]  z-[100] flex max-md:gap-[10vw] flex-col h-[90%] items-start justify-between">
                <div className="flex justify-between items-center ">
                  <div className="w-[40vw] h-auto flex items-center">
                    <div className="w-[40%] h-auto">
                    <Image src={"/assets/icons/rtx.svg"} height={100} width={100} alt="rtx-logo" className="h-full w-full invert"/>
                    </div>
                  </div>
                </div>
                <div className="flex z-100 gap-20 items-start">
                  <div>
                    {links.map((item, index) => (
                      <Link href={item.link} key={index}>
                        <div className="text-white mb-[1vw] text-[1.05vw] font-medium">
                          <div className="flex items-center gap-[.5vw] group justify-start">
                            <div className="flex flex-col cursor-pointer relative items-start justify-start overflow-hidden  w-[7.5vw] ">
                              <span className="text-[#A8A8A8] uppercase text-[1vw] ">
                                <ScrambleText onHover={true} centerd speed={0.5} className="min-w-[8vw]">
                                  {item.name}
                                </ScrambleText>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full  z-100  h-[10%] max-md:pt-[2vw] flex items-end justify-between  text-[#A8A8A8] text-[1.05vw] max-md:text-[1.7vw]">
              <div className="w-[20vw] max-md:w-[50%]">
                <p className="">Copyright © RTX-4080</p>
              </div>
              <div className="w-fit max-md:w-[50%] max-md:flex max-md:justify-end">
                <div className="">
                  By :{" "}
                  <a href={"https://weareenigma.com/"} target="_blank">
                    <span className="link-line">Enigma Digital</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

const links = [
    { name: "About Us", link: "/#" },
    { name: "Projects", link: "/#" },
    { name: "Solutions", link: "/#" },
    { name: "Resources", link: "/#" },
];

