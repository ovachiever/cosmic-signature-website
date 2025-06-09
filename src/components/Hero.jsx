import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="hero-container">
      <h1 className="hero-title">Discover Your Cosmic Signature</h1>
      <p className="hero-subtitle">
        Your birth moment created a unique celestial blueprint found in only 1 in 1,728 beings. 
        Uncover the cosmic forces that shape your essence and purpose.
      </p>
      <button className="hero-cta" onClick={onGetStarted}>
        Reveal Your Cosmic Signature
      </button>
    </div>
  );
};

export default Hero;
