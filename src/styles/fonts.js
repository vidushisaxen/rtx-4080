import localFont from "next/font/local";

export const alphamono = localFont({
  src: [
    {
      path: "../app/fonts/HMAlphaMono-Medium.woff2",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-body",
  display: "swap",
  fallback: [
    "system-ui", 
    "-apple-system", 
    "BlinkMacSystemFont", 
    "georgia", 
    "Times New Roman", 
    "serif"
  ],
  preload: true,
});


export const arame = localFont({
  src: [
    {
      path: "../app/fonts/Arame-Thin.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: [
    "system-ui", 
    "-apple-system", 
    "BlinkMacSystemFont", 
    "georgia", 
    "Times New Roman", 
    "serif"
  ],
  preload: true,
});

// Font class names for direct usage
export const fontClassNames = {
  body: alphamono.className,
  display: arame.className,
  variables: `${alphamono.variable} ${arame.variable}`,
};

// CSS custom properties (for Tailwind/CSS usage)
export const fontVariables = {
  body: alphamono.variable,
  display: arame.variable,
  combined: `${alphamono.variable} ${arame.variable}`,
};