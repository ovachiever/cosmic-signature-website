import React from 'react';

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0a0e27] overflow-hidden">
        <div className="stars-container absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6b46c1]/10 to-[#0a0e27]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">Cosmic Signature</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Every soul carries a unique cosmic signature. Unlock the celestial blueprint that was written in the stars at the moment of your birth.
        </p>
        
        <button 
          onClick={() => {
            const formElement = document.getElementById('birth-form-section');
            formElement.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-4 text-lg font-semibold rounded-lg bg-[#6b46c1] text-white hover:bg-[#5a3aa8] transition-colors shadow-lg hover:shadow-xl"
        >
          Reveal My Cosmic Blueprint
        </button>
        
        <div className="mt-16 flex justify-center">
          <div className="animate-bounce w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
