import localFont from "next/font/local";

export const NeueMachina = localFont({
  src: [
    {
      path: "../app/fonts/NeueMachina-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/NeueMachina-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/NeueMachina-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "georgia",
    "Times New Roman",
    "serif",
  ],
  preload: true,
});

// Font class names for direct usage
export const fontClassNames = {
  body: NeueMachina.className,
  variables: `${NeueMachina.variable}`,
};

// Font variables for layout usage
export const fontVariables = {
  combined: `${NeueMachina.variable}`,
};
