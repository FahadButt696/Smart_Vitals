import Hero from '../components/custom/Hero'
import CustomNavbar from '../components/custom/Navbar'
import React from 'react'
import { TextParallaxContentExample } from '@/components/TextParalexFeature'
import { CarouselDemo } from '@/components/custom/CarouselSection'

const Home = () => {
  return (
        <div>
            <CustomNavbar/>
            <Hero/>
            <CarouselDemo/>
            <TextParallaxContentExample/>
          
        </div>
  )
}

export default Home
