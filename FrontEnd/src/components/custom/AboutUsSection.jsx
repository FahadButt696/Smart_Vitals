"use client";
import TiltedCard from '../../reactBit_Components/Components/TiltedCard/TiltedCard';
import { motion } from "framer-motion";
// import aboutImage from "@/assets/aboutus.jpg"; // Replace with your image path
import { About } from "@/assets/Assets";
import SpotlightCard from "@/reactBit_Components/Components/SpotlightCard/SpotlightCard";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 flex items-center justify-center px-4 md:px-10">
      <div className="max-w-screen w-full flex flex-col lg:flex-row items-center gap-12 py-16">
        
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2"
        >

            

<TiltedCard
  imageSrc={About}
  altText=""
  captionText=""
  containerHeight="100%"
  containerWidth="100%"
  imageHeight="400px"
  imageWidth="500px"
  rotateAmplitude={12}
  scaleOnHover={1.2}
  showMobileWarning={false}
  showTooltip={true}
  displayOverlayContent={true}
  overlayContent={''
  }
/>
        
                
            
          
        </motion.div>

        {/* Right Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 text-white space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            About <span className="text-cyan-400">Smart Vitals</span>
          </h2>
          <p className="text-lg text-neutral-300">
            Smart Vitals is an all-in-one health and fitness companion designed to support a smarter, healthier lifestyle. We blend AI-powered tools and simple user experience to make tracking meals, workouts, sleep, water intake, and emotional wellness effortless.
          </p>
          <p className="text-neutral-400">
            Our mission is to give individuals control over their health using technology. Whether you're just starting your fitness journey or optimizing your routine, Smart Vitals adapts to your needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
