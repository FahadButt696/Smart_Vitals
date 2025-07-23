import Hero from '../components/custom/Hero'
import CustomNavbar from '../components/custom/Navbar'
import React from 'react'
import FeatureSection from '../components/custom/FeatureSection'
// import ChromaGrid from '@/reactBit_Components/Components/ChromaGrid/ChromaGrid'
import { TextParallaxContentExample } from '@/components/TextParalexFeature'

const Home = () => {
  return (
        <div>
            <CustomNavbar/>
            <Hero/>
            <FeatureSection/>
            <TextParallaxContentExample/>
          
        </div>
  )
}

export default Home
