import Image from 'next/image'
import React from 'react'

const BodyFrame = () => {
  return (
    <>
    <div className="relative z-9999 w-screen h-full">
      {/* Fixed full-screen image background */}
      <div className='w-full h-full'>
      <Image
        src="/assets/icons/body-frame.svg"
        alt="Background"
        className="fixed top-0 left-0 w-full h-full p-4"
        height={1000}
        width={1000}
      />
      </div>

    </div>
    </>
  )
}

export default BodyFrame