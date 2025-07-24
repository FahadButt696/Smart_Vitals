// src/sections/StepperSection.jsx
import Stepper, { Step } from '../reactBit_Components/Components/Stepper/Stepper';
import React, { useState } from 'react';

const StepperSection = () => {
  const [name, setName] = useState('');

  return (
    <div className="w-full lg:w-[50%] mx-auto px-4 py-10">
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <Step>
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Smart Vitals</h2>
          <p className="text-neutral-300">Track and improve your health step by step.</p>
        </Step>
        <Step>
          <h2 className="text-2xl font-semibold text-white mb-2">AI Suggestions</h2>
          <img
            style={{
              height: '100px',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center -70px',
              borderRadius: '15px',
              marginTop: '1em'
            }}
            src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
            alt="fun"
          />
          <p className="text-neutral-300">We analyze your data and provide smart suggestions.</p>
        </Step>
        <Step>
          <h2 className="text-2xl font-semibold text-white mb-2">Your Details</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-md px-4 py-2 mt-2 text-black"
          />
        </Step>
        <Step>
          <h2 className="text-2xl font-semibold text-white mb-2">You're all set!</h2>
          <p className="text-neutral-300">Welcome aboard, {name || 'user'}!</p>
        </Step>
      </Stepper>
    </div>
  );
};

export default StepperSection;
