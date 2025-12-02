import React, { useRef, useEffect } from 'react';

// export default function PlayTickSound() {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     audioRef.current = new Audio("/sounds/tick.mp3");
//   }, []);

  

//   const playSound = () => {
//     try {
//       if (audioRef.current) {
//         audioRef.current.currentTime = 0;
//         const playPromise = audioRef.current.play();
//         audioRef.current.volume = 1.0;
//         if (playPromise !== undefined) {
//           playPromise.catch(error => {
//             console.log("Audio playback failed:", error);
//           });
//         }
//       }
//     } catch (err) {
//       console.log("Error playing audio:", err);
//     }
//   };

//   return { playSound };
// }
// export function PlayHoverSound() {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     audioRef.current = new Audio("/sounds/hover.mp3");
//   }, []);

//   const playSoundHover = () => {
//     try {
//       if (audioRef.current) {
//         audioRef.current.currentTime = 0;
//         const playPromise = audioRef.current.play();
//         if (playPromise !== undefined) {
//           playPromise.catch(error => {
//             console.log("Audio playback failed:", error);
//           });
//         }
//       }
//     } catch (err) {
//       console.log("Error playing audio:", err);
//     }
//   };

//   return { playSoundHover };
// }

// export const PlayEnterSound = () => {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     audioRef.current = new Audio("/sounds/transition.mp3");
    
//   }, []);

//   const playSoundEnter = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }
//   };

//   return { playSoundEnter };
// };

let audioRefGlobal = null;
let wasPlayingBeforeHidden = false;

export const useBackgroundAudio = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      if (!audioRefGlobal) {
        audioRefGlobal = new Audio("/assets/sfx/bg.mp3");
        audioRefGlobal.loop = true;
        audioRefGlobal.volume = 0.1; // optional
      }
      audioRef.current = audioRefGlobal;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforeHidden = true;
        audioRef.current.pause();
      } else if (!document.hidden && audioRef.current && wasPlayingBeforeHidden) {
        audioRef.current.play().catch((err) =>
          console.warn("Audio resume failed", err)
        );
        wasPlayingBeforeHidden = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const PlaySoundBackground = (toggle) => {
    if (!audioRef.current) return;

    if (toggle) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) =>
        console.warn("Audio play failed", err)
      );
    } else {
      audioRef.current.pause();
    }
  };

  const isAudioPlaying = () => {
    return audioRef.current && !audioRef.current.paused;
  };

  return { PlaySoundBackground, isAudioPlaying, audioRef };
};

