import React from 'react'
import Hero from './Hero'
import HeroCopy from './HeroCopy'

const HeroWrapper = () => {
  return (
  <section className='h-full w-full flex items-center justify-between'>
    <HeroCopy/>
<Hero/>
  </section>
  )
}

export default HeroWrapper