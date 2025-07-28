import Hero from '../components/custom/Hero';
import CustomNavbar from '../components/custom/Navbar';
import React from 'react';
import { TextParallaxContentExample } from '@/components/TextParalexFeature';
import { CarouselDemo } from '@/components/custom/CarouselSection';
import Stepper from '@/reactBit_Components/Components/Stepper/Stepper';
import StepperSection from '@/components/StepperSection';
import Features from './Features';
import WhyChooseUsSection from '@/components/custom/WhyChooseUsSection';
import Footer from '@/components/custom/Footer';
// import FeatureCard from '@/components/custom/FeatureCard_1'
import ScrollToTop from '@/components/custom/ScrollToTop';

const Home = () => {
  return (
    <div>
      <Hero />
      <CarouselDemo />
      <TextParallaxContentExample />
      {/* <FeatureCard/> */}
      <WhyChooseUsSection />
      <ScrollToTop />
    </div>
  );
};

export default Home;
