"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScrambleText from "./h/ScrambleText";
import Image from "next/image";

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
    <div className="relative " id="footer">
      
      <footer
        className="h-screen absolute inset-0 z-[40] flex items-center justify-center max-md:h-fit  max-sm:h-[140vh] w-screen overflow-hidden"
        id="footer"
      >
        <div className="w-full h-full flex max-md:h-fit items-center justify-center relative">
          <div className="w-[90vw] h-[85vh] max-md:h-[120vh] absolute top-1/2  -translate-y-1/2 left-1/2 -translate-x-1/2">
            <svg
              className="h-full w-full"
              width="1772"
              height="845"
              viewBox="0 0 1772 845"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="path-1-outside-1_853_3093"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0.716797"
                width="1772"
                height="845"
                fill="black"
              >
                <rect fill="white" y="0.716797" width="1772" height="845" />
                <path d="M860.287 1.7168C860.848 1.7168 861.377 1.95608 861.793 2.33301V2.33301L945.466 78.2314C947.306 79.9002 949.701 80.8242 952.185 80.8242H1751C1762.05 80.8242 1771 89.7785 1771 100.824V823.862C1771 834.908 1762.05 843.862 1751 843.862H21C9.95431 843.862 1 834.908 1 823.862V21.7168C1 10.6711 9.95431 1.7168 21 1.7168H860.287Z" />
              </mask>
              <path
                d="M945.466 78.2314L944.794 78.9721L944.794 78.9721L945.466 78.2314ZM1751 843.862L1751 844.862L1751 844.862L1751 843.862ZM1 21.7168L0 21.7168V21.7168H1ZM861.793 2.33301L861.121 3.07369L944.794 78.9721L945.466 78.2314L946.138 77.4908L862.465 1.59233L861.793 2.33301ZM945.466 78.2314L944.794 78.9721C946.818 80.8078 949.453 81.8242 952.185 81.8242V80.8242V79.8242C949.949 79.8242 947.793 78.9925 946.138 77.4908L945.466 78.2314ZM952.185 80.8242V81.8242H1751V80.8242V79.8242H952.185V80.8242ZM1771 100.824H1770V823.862H1771H1772V100.824H1771ZM1771 823.862H1770C1770 834.356 1761.49 842.862 1751 842.862L1751 843.862L1751 844.862C1762.6 844.862 1772 835.46 1772 823.862H1771ZM1751 843.862V842.862H21V843.862V844.862H1751V843.862ZM21 843.862V842.862C10.5066 842.862 2 834.356 2 823.862H1H0C0 835.46 9.40202 844.862 21 844.862V843.862ZM1 823.862H2V21.7168H1H0V823.862H1ZM1 21.7168L2 21.7168C2 11.2234 10.5066 2.7168 21 2.7168V1.7168V0.716797C9.40202 0.716797 4.32941e-06 10.1188 0 21.7168L1 21.7168ZM21 1.7168V2.7168H860.287V1.7168V0.716797H21V1.7168ZM1751 80.8242V81.8242C1761.49 81.8242 1770 90.3308 1770 100.824H1771H1772C1772 89.2262 1762.6 79.8242 1751 79.8242V80.8242ZM861.793 2.33301L862.465 1.59233C861.898 1.07786 861.137 0.716797 860.287 0.716797V1.7168V2.7168C860.559 2.7168 860.857 2.83431 861.121 3.07369L861.793 2.33301Z"
                fill="#282828"
                mask="url(#path-1-outside-1_853_3093)"
              />
              <foreignObject x="-20" y="-19.2832" width="1812" height="884.146">
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    backdropFilter: "blur(10px)",
                    clipPath: "url(#bgblur_0_853_3093_clip_path)",
                    height: "100%",
                    width: "100%",
                  }}
                ></div>
              </foreignObject>
              <g data-figma-bg-blur-radius="20">
                <mask
                  id="path-3-outside-2_853_3093"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0.716797"
                  width="1772"
                  height="845"
                  fill="black"
                >
                  <rect fill="white" y="0.716797" width="1772" height="845" />
                  <path d="M860.287 1.7168C860.848 1.7168 861.377 1.95608 861.793 2.33301L945.466 78.2314C947.306 79.9002 949.701 80.8242 952.185 80.8242H1751C1762.05 80.8242 1771 89.7785 1771 100.824V823.862C1771 834.908 1762.05 843.862 1751 843.862H21C9.95431 843.862 1 834.908 1 823.862V21.7168C1 10.6711 9.95431 1.7168 21 1.7168H860.287Z" />
                </mask>
                <path
                  d="M860.287 1.7168C860.848 1.7168 861.377 1.95608 861.793 2.33301L945.466 78.2314C947.306 79.9002 949.701 80.8242 952.185 80.8242H1751C1762.05 80.8242 1771 89.7785 1771 100.824V823.862C1771 834.908 1762.05 843.862 1751 843.862H21C9.95431 843.862 1 834.908 1 823.862V21.7168C1 10.6711 9.95431 1.7168 21 1.7168H860.287Z"
                  fill="url(#paint0_linear_853_3093)"
                  fillOpacity="0.02"
                />
                <path
                  d="M945.466 78.2314L944.794 78.9721L944.794 78.9721L945.466 78.2314ZM1771 823.862H1772H1771ZM1751 843.862V844.862V843.862ZM1 823.862H0H1ZM1 21.7168H0H1ZM21 1.7168V0.716797V1.7168ZM861.793 2.33301L861.121 3.07369L944.794 78.9721L945.466 78.2314L946.138 77.4908L862.465 1.59233L861.793 2.33301ZM945.466 78.2314L944.794 78.9721C946.818 80.8078 949.453 81.8242 952.185 81.8242V80.8242V79.8242C949.949 79.8242 947.793 78.9925 946.138 77.4908L945.466 78.2314ZM952.185 80.8242V81.8242H1751V80.8242V79.8242H952.185V80.8242ZM1771 100.824H1770V823.862H1771H1772V100.824H1771ZM1771 823.862H1770C1770 834.356 1761.49 842.862 1751 842.862V843.862V844.862C1762.6 844.862 1772 835.46 1772 823.862H1771ZM1751 843.862V842.862H21V843.862V844.862H1751V843.862ZM21 843.862V842.862C10.5066 842.862 2 834.356 2 823.862H1H0C1.78814e-07 835.46 9.40202 844.862 21 844.862V843.862ZM1 823.862H2V21.7168H1H0V823.862H1ZM1 21.7168H2C2 11.2234 10.5066 2.7168 21 2.7168V1.7168V0.716797C9.40202 0.716797 4.58956e-06 10.1188 0 21.7168H1ZM21 1.7168V2.7168H860.287V1.7168V0.716797H21V1.7168ZM1751 80.8242V81.8242C1761.49 81.8242 1770 90.3308 1770 100.824H1771H1772C1772 89.2262 1762.6 79.8242 1751 79.8242V80.8242ZM861.793 2.33301L862.465 1.59233C861.898 1.07786 861.137 0.716797 860.287 0.716797V1.7168V2.7168C860.559 2.7168 860.857 2.83431 861.121 3.07369L861.793 2.33301Z"
                  fill="url(#paint1_linear_853_3093)"
                  mask="url(#path-3-outside-2_853_3093)"
                />
              </g>
              <defs>
                <clipPath
                  id="bgblur_0_853_3093_clip_path"
                  transform="translate(20 19.2832)"
                >
                  <path d="M860.287 1.7168C860.848 1.7168 861.377 1.95608 861.793 2.33301L945.466 78.2314C947.306 79.9002 949.701 80.8242 952.185 80.8242H1751C1762.05 80.8242 1771 89.7785 1771 100.824V823.862C1771 834.908 1762.05 843.862 1751 843.862H21C9.95431 843.862 1 834.908 1 823.862V21.7168C1 10.6711 9.95431 1.7168 21 1.7168H860.287Z" />
                </clipPath>
                <linearGradient
                  id="paint0_linear_853_3093"
                  x1="24.3663"
                  y1="24.1518"
                  x2="1752.43"
                  y2="36.2049"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_853_3093"
                  x1="679.118"
                  y1="248.036"
                  x2="543.228"
                  y2="-165.208"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FE6E00" stopOpacity="0" />
                  <stop offset="1" stopColor="#76b900" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="py-[8%] max-md:py-[15%] px-[8vw] z-10 flex items-start justify-between left-0 w-full  flex-col h-full ">
            <div className="h-[90%] relative gap-[10vw]  w-full flex  items-center justify-between ">
              <div className="w-[50%]  z-[100] flex max-md:gap-[10vw] flex-col h-[90%] items-start justify-between">
                <div className="flex justify-between items-center ">
                  <div className="w-[16vw] h-auto fadeupanim flex items-center">
                    <div className="w-[90%] h-auto">
                    <Image src={"/assets/icons/rtx.svg"} height={100} width={100} alt="rtx-logo" className="h-full w-full invert"/>
                    </div>
                    <p className="text-[2.3vw]">RTX-4080</p>
                  </div>
                </div>
                <div className="flex  z-[100]  gap-20 items-start">
                  <div>
                    {links.map((item, index) => (
                      <Link href={item.link} key={index}>
                        <div className="text-white mb-[1vw] text-[1.05vw] font-medium">
                          <div className="flex items-center gap-[.5vw] group justify-start">
                            <div
                              style={{
                                animation: "pulse .5s infinite",
                              }}
                              className="w-[.3vw] h-[0vw] group-hover:h-[1vw] group-hover:bg-orange-500  transition-all duration-200"
                            ></div>
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
              <div className="w-[45%] max-md:gap-[4vw] z-100 text-[#A8A8A8] pb-[5vw] pt-[3vw] flex flex-col h-[80%] items-start justify-between gap-0">
               
                <div className="w-full flex  items-start justify-center flex-col">
                  <a
                    href="#"
                    className="text-[3.125vw] font-display"
                  >
                    <ScrambleText lowercase onHover={true} centerd speed={0.4} className="min-w-[8vw]">
                    {"mail@mail.com"}
                    </ScrambleText>
                   
                  </a>
                  {/* <div className="pt-2 flex  items-start gap-2 fadeupanim">
                    {socials.map((item, index) => (
                      <SocialMediaBtn className="" key={index} href={item.href}>
                        {item.icon}
                      </SocialMediaBtn>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>
            <div className="w-full  z-[100]  h-[10%] max-md:pt-[2vw] flex items-end justify-between  text-[#A8A8A8] text-[1.05vw] max-md:text-[1.7vw]">
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
  );
}

const links = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Solutions",
    link: "/solutions",
  },
  {
    name: "Products",
    link: "/products",
  },
  {
    name: "Resources",
    link: "/blog",
  },
  {
    name: "Contact",
    link: "/contact-us",
  },
];

