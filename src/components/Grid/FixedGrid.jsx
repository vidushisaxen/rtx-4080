import React from 'react'

export default function FixedGrid() {
  return (
    <div className="fixed w-screen h-screen left-0 top-0 z-0 overflow-hidden pointer-events-none">
      <div className="w-full h-full grid grid-cols-25">
        {Array.from({ length: 400 }).map((_, index) => (
          <div
            key={index}
            className="border border-white opacity-1 aspect-square"
          ></div>
        ))}
      </div>
    </div>
  )
}
