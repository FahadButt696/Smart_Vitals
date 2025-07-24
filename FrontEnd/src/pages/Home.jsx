import Hero from '../components/custom/Hero'
import CustomNavbar from '../components/custom/Navbar'
import React from 'react'
import { TextParallaxContentExample } from '@/components/TextParalexFeature'
import { CarouselDemo } from '@/components/custom/CarouselSection'
import Stepper from '@/reactBit_Components/Components/Stepper/Stepper'
import StepperSection from '@/components/StepperSection'
import Features from './Features'
import WhyChooseUsSection from '@/components/custom/WhyChooseUsSection'
import Footer from '@/components/custom/Footer'

const Home = () => {
  return (
        <div>
            <CustomNavbar/>
            <Hero/>
            <CarouselDemo/>
            <TextParallaxContentExample/>
            <Features/>
            <WhyChooseUsSection/>
            <Footer/>
          
        </div>
  )
}

export default Home
