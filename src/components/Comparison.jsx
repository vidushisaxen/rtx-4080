"use client"
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PerformanceChart = () => {
  const sectionRef = useRef(null);
  const barsRef = useRef([]);
  const [activeTab, setActiveTab] = useState('RTX 5090');
  const [hasAnimated, setHasAnimated] = useState(false);

  const gpuModels = [
    'RTX 5090', 'RTX 5080', 'RTX 5070 Ti', 'RTX 5070', 
    'RTX 5060 Ti', 'RTX 5060', 'RTX 5050'
  ];

  const chartData = {
    'RTX 5090': {
      comparison: 'RTX 4090',
      maxScale: 2.6,
      games: [
        { name: 'Resident Evil 4', new: 1.3, old: 1, tech: 'RT' },
        { name: 'Horizon Forbidden West', new: 1.3, old: 1, tech: 'DLSS' },
        { name: 'Frostpunk 2', new: 2.4, old: 1, tech: 'DLSS 4' },
        { name: 'Hogwarts Legacy', new: 1.9, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Star Wars Outlaws™', new: 2.0, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Cyberpunk 2077', new: 2.3, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Indiana Jones and the Great Circle', new: 1.8, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Black Myth: Wukong', new: 2.5, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Alan Wake 2', new: 2.2, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'DaVinci Resolve', new: 1.5, old: 1, tech: '' },
        { name: 'D5 Render', new: 2.6, old: 1, tech: 'DLSS 4' },
        { name: 'Generative AI (Flux.dev)', new: 2.0, old: 1, tech: 'FP4' }
      ]
    },
    'RTX 5080': {
      comparison: 'RTX 4080',
      maxScale: 2.4,
      games: [
        { name: 'Resident Evil 4', new: 1.2, old: 1, tech: 'RT' },
        { name: 'Horizon Forbidden West', new: 1.25, old: 1, tech: 'DLSS' },
        { name: 'Frostpunk 2', new: 1.9, old: 1, tech: 'DLSS 4' },
        { name: 'Hogwarts Legacy', new: 1.7, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Star Wars Outlaws™', new: 1.75, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Cyberpunk 2077', new: 1.9, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Indiana Jones and the Great Circle', new: 1.65, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Black Myth: Wukong', new: 2.05, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Alan Wake 2', new: 1.95, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'DaVinci Resolve', new: 1.35, old: 1, tech: '' },
        { name: 'D5 Render', new: 2.4, old: 1, tech: 'DLSS 4' },
        { name: 'Generative AI (Flux.dev)', new: 2.2, old: 1, tech: 'FP4' }
      ]
    },
    'RTX 5070 Ti': {
      comparison: 'RTX 4070 Ti',
      maxScale: 3.7,
      games: [
        { name: 'Resident Evil 4', new: 1.25, old: 1, tech: 'RT' },
        { name: 'Horizon Forbidden West', new: 1.3, old: 1, tech: 'DLSS' },
        { name: 'Frostpunk 2', new: 2.15, old: 1, tech: 'DLSS 4' },
        { name: 'Hogwarts Legacy', new: 1.9, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Star Wars Outlaws™', new: 1.95, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Cyberpunk 2077', new: 2.2, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Indiana Jones and the Great Circle', new: 2.9, old: 1, tech: 'DLSS 4 + Full RT', highlight: '2.9X' },
        { name: 'Black Myth: Wukong', new: 2.6, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Alan Wake 2', new: 2.7, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'DaVinci Resolve', new: 1.6, old: 1, tech: '' },
        { name: 'D5 Render', new: 3.0, old: 1, tech: 'DLSS 4' },
        { name: 'Generative AI (Flux.dev)', new: 3.7, old: 1, tech: 'FP4', highlight: '3.7X' }
      ]
    },
    'RTX 5070': {
      comparison: 'RTX 4070',
      maxScale: 3.7,
      games: [
        { name: 'Resident Evil 4', new: 1.3, old: 1, tech: 'RT' },
        { name: 'Horizon Forbidden West', new: 1.35, old: 1, tech: 'DLSS' },
        { name: 'Frostpunk 2', new: 2.2, old: 1, tech: 'DLSS 4' },
        { name: 'Hogwarts Legacy', new: 1.9, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Star Wars Outlaws™', new: 1.95, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Cyberpunk 2077', new: 2.05, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Indiana Jones and the Great Circle', new: 1.75, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Black Myth: Wukong', new: 2.4, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'Alan Wake 2', new: 2.05, old: 1, tech: 'DLSS 4 + Full RT' },
        { name: 'DaVinci Resolve', new: 1.3, old: 1, tech: '' },
        { name: 'D5 Render', new: 2.85, old: 1, tech: 'DLSS 4' },
        { name: 'Generative AI (Flux.dev)', new: 3.7, old: 1, tech: 'FP4', highlight: '3.7X' }
      ]
    },
    'RTX 5060 Ti': {
      comparison: ['RTX 4060 Ti', 'RTX 3060 Ti', 'RTX 2060 SUPER'],
      maxScale: 5.8,
      games: [
        { name: 'Alan Wake 2', new: 5.8, med1: 2.8, med2: 1, old: 0.5, tech: 'DLSS 4 + Full RT', highlight: '5.8X' },
        { name: 'Black Myth: Wukong', new: 5.7, med1: 2.6, med2: 1, old: 0.6, tech: 'DLSS 4 + Full RT', highlight: '5.7X' },
        { name: 'Cyberpunk 2077', new: 4.25, med1: 2.05, med2: 1, old: 0.5, tech: 'DLSS 4 + Full RT' },
        { name: 'Hogwarts Legacy', new: 5.1, med1: 2.5, med2: 1, old: 0.6, tech: 'DLSS 4 + RT' },
        { name: 'Avowed', new: 4.3, med1: 1.95, med2: 1, old: 0.7, tech: 'DLSS 4 + RT' },
        { name: 'Marvel Rivals', new: 3.05, med1: 1.6, med2: 1, old: 0.7, tech: 'DLSS 4' },
        { name: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl', new: 3.5, med1: 1.75, med2: 1, old: 0.7, tech: 'DLSS 4' },
        { name: 'Resident Evil 4', new: 1.4, med1: 1.15, med2: 1, old: 0.65, tech: 'RT' }
      ]
    },
    'RTX 5060': {
      comparison: ['RTX 4060', 'RTX 3060', 'RTX 2060'],
      maxScale: 6.3,
      games: [
        { name: 'Alan Wake 2', new: 6.3, med1: 2.8, med2: 1, old: 0.6, tech: 'DLSS 4 + Full RT', highlight: '6.3X' },
        { name: 'Black Myth: Wukong', new: 6.2, med1: 2.7, med2: 1, old: 0.6, tech: 'DLSS 4 + Full RT', highlight: '6.2X' },
        { name: 'Cyberpunk 2077', new: 4.9, med1: 2.2, med2: 1, old: 0.6, tech: 'DLSS 4 + Full RT' },
        { name: 'Hogwarts Legacy', new: 5.6, med1: 2.7, med2: 1, old: 0.6, tech: 'DLSS 4 + RT' },
        { name: 'Avowed', new: 4.8, med1: 2.0, med2: 1, old: 0.7, tech: 'DLSS 4 + RT' },
        { name: 'Marvel Rivals', new: 3.4, med1: 1.7, med2: 1, old: 0.7, tech: 'DLSS 4' },
        { name: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl', new: 4.2, med1: 2.0, med2: 1, old: 0.6, tech: 'DLSS 4' },
        { name: 'Resident Evil 4', new: 1.5, med1: 1.2, med2: 1, old: 0.5, tech: 'RT' }
      ]
    },
    'RTX 5050': {
      comparison: 'RTX 3050',
      maxScale: 4.5,
      games: [
        { name: 'Avowed', new: 4.5, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'Cyberpunk 2077', new: 4.2, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'DOOM: The Dark Ages', new: 3.7, old: 1, tech: 'DLSS 4 + RT' },
        { name: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl', new: 4.35, old: 1, tech: 'DLSS 4' },
        { name: 'Frostpunk 2', new: 4.05, old: 1, tech: 'DLSS 4' },
        { name: 'Marvel Rivals', new: 3.5, old: 1, tech: 'DLSS 4' },
        { name: 'A Plague Tale: Requiem', new: 2.6, old: 1, tech: 'DLSS + RT' },
        { name: 'Apex Legends', new: 1.6, old: 1, tech: '' },
        { name: 'Counter-Strike 2', new: 1.6, old: 1, tech: '' },
        { name: 'Overwatch 2', new: 1.65, old: 1, tech: '' }
      ]
    }
  };

  const currentData = chartData[activeTab];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!hasAnimated) {
        // Initial animations on scroll trigger
        gsap.from('.perf-title', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power3.out'
        });

        gsap.from('.gpu-tab', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          y: -20,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out'
        });

        gsap.from('.legend-item', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          opacity: 0,
          x: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }

      // Animate bars on tab change or initial load
      barsRef.current.forEach((bar, index) => {
        if (bar) {
          gsap.fromTo(bar, 
            { scaleY: 0, transformOrigin: 'bottom' },
            {
              scaleY: 1,
              duration: 0.6,
              delay: hasAnimated ? index * 0.02 : 0.2 + (index * 0.03),
              ease: 'power3.out'
            }
          );
        }
      });

      gsap.fromTo('.game-label',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          delay: hasAnimated ? 0.1 : 0.4,
          ease: 'power2.out'
        }
      );

      gsap.fromTo('.bar-highlight',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          delay: hasAnimated ? 0.3 : 0.6,
          ease: 'back.out(1.7)'
        }
      );

      if (!hasAnimated) setHasAnimated(true);
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab, hasAnimated]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getBarColors = (index) => {
    if (Array.isArray(currentData.comparison)) {
      const colors = ['bg-primary-1', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600'];
      return colors[index];
    }
    return index === 0 ? 'bg-primary-1' : 'bg-gray-500';
  };

  return (
    <section ref={sectionRef} className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="perf-title text-5xl font-bold text-center mb-16">Performance</h1>

        {/* GPU Tabs */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {gpuModels.map((model, index) => (
            <button
              key={model}
              onClick={() => handleTabChange(model)}
              className={`gpu-tab px-6 py-3 text-sm font-semibold cursor-pointer transition-all ${
                activeTab === model
                  ? 'border-b-4 border-primary-1 text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {model}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-6 mb-8 flex-wrap">
          {Array.isArray(currentData.comparison) ? (
            <>
              <div className="legend-item flex items-center gap-2">
                <div className="w-4 h-4 bg-primary-1"></div>
                <span className="text-sm">{activeTab}</span>
              </div>
              {currentData.comparison.map((comp, idx) => (
                <div key={comp} className="legend-item flex items-center gap-2">
                  <div className={`w-4 h-4 ${['bg-gray-400', 'bg-gray-500', 'bg-gray-600'][idx]}`}></div>
                  <span className="text-sm">{comp}</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="legend-item flex items-center gap-2">
                <div className="w-4 h-4 bg-primary-1"></div>
                <span className="text-sm">{activeTab}</span>
              </div>
              <div className="legend-item flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500"></div>
                <span className="text-sm">{currentData.comparison}</span>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-20 flex flex-col justify-between text-sm text-gray-400 font-semibold">
            {currentData.maxScale > 3 && <span>5X</span>}
            {currentData.maxScale > 3 && <span>4X</span>}
            {currentData.maxScale > 3 && <span>3X</span>}
            <span>2X</span>
            <span>1X</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 grid gap-4" style={{ gridTemplateColumns: `repeat(${currentData.games.length}, minmax(0, 1fr))` }}>
            {currentData.games.map((game, gameIndex) => (
              <div key={game.name} className="flex flex-col items-center">
                {/* Bars container */}
                <div className="relative w-full flex items-end justify-center gap-1 mb-4" style={{ height: '320px' }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 border-b border-gray-800"></div>
                  <div className="absolute inset-0 top-1/2 border-b border-gray-800"></div>
                  {currentData.maxScale > 3 && (
                    <>
                      <div className="absolute inset-0 top-[20%] border-b border-gray-800"></div>
                      <div className="absolute inset-0 top-[40%] border-b border-gray-800"></div>
                      <div className="absolute inset-0 top-[60%] border-b border-gray-800"></div>
                      <div className="absolute inset-0 top-[80%] border-b border-gray-800"></div>
                    </>
                  )}
                  
                  {/* Bars based on comparison type */}
                  {Array.isArray(currentData.comparison) ? (
                    <>
                      {/* Old generation bar */}
                      <div
                        ref={el => barsRef.current[gameIndex * 4] = el}
                        className="w-6 bg-gray-600"
                        style={{ height: `${(game.old / currentData.maxScale) * 320}px` }}
                      ></div>
                      
                      {/* Mid 2 bar */}
                      <div
                        ref={el => barsRef.current[gameIndex * 4 + 1] = el}
                        className="w-6 bg-gray-500"
                        style={{ height: `${(game.med2 / currentData.maxScale) * 320}px` }}
                      ></div>
                      
                      {/* Mid 1 bar */}
                      <div
                        ref={el => barsRef.current[gameIndex * 4 + 2] = el}
                        className="w-6 bg-gray-400"
                        style={{ height: `${(game.med1 / currentData.maxScale) * 320}px` }}
                      ></div>
                      
                      {/* New generation bar with highlight */}
                      <div className="relative">
                        <div
                          ref={el => barsRef.current[gameIndex * 4 + 3] = el}
                          className="w-6 bg-primary-1"
                          style={{ height: `${(game.new / currentData.maxScale) * 320}px` }}
                        ></div>
                        {game.highlight && (
                          <div className="bar-highlight absolute -top-8 left-1/2 -translate-x-1/2 bg-primary-1 text-black font-bold text-xs px-2 py-1 rounded whitespace-nowrap">
                            {game.highlight}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Old generation bar */}
                      <div
                        ref={el => barsRef.current[gameIndex * 2] = el}
                        className="w-8 bg-gray-500"
                        style={{ height: `${(game.old / currentData.maxScale) * 320}px` }}
                      ></div>
                      
                      {/* New generation bar with highlight */}
                      <div className="relative">
                        <div
                          ref={el => barsRef.current[gameIndex * 2 + 1] = el}
                          className="w-8 bg-primary-1"
                          style={{ height: `${(game.new / currentData.maxScale) * 320}px` }}
                        ></div>
                        {game.highlight && (
                          <div className="bar-highlight absolute -top-8 left-1/2 -translate-x-1/2 bg-primary-1 text-black font-bold text-xs px-2 py-1 rounded whitespace-nowrap">
                            {game.highlight}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Game label and tech */}
                <div className="game-label text-xs text-gray-300 text-center h-16 flex flex-col items-center justify-start leading-tight">
                  <span className="font-medium">{game.name}</span>
                  {game.tech && <span className="text-primary-1 mt-1">{game.tech}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="h-32"></div>
      </div>
    </section>
  );
};

export default PerformanceChart;