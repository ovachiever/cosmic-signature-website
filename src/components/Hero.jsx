import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="hash-clock-container">
      
      {/* Hash Clock Logo */}
      <div style={{
        marginBottom: '2rem',
        animation: 'float 6s ease-in-out infinite'
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{
          filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))'
        }}>
          <defs>
            <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#6b46c1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          
          {/* Outer ring */}
          <circle cx="60" cy="60" r="55" fill="none" stroke="url(#cosmicGradient)" strokeWidth="2" opacity="0.8" />
          
          {/* Hash grid pattern */}
          <g stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.9">
            <line x1="30" y1="20" x2="30" y2="100" />
            <line x1="60" y1="20" x2="60" y2="100" />
            <line x1="90" y1="20" x2="90" y2="100" />
            <line x1="20" y1="30" x2="100" y2="30" />
            <line x1="20" y1="60" x2="100" y2="60" />
            <line x1="20" y1="90" x2="100" y2="90" />
          </g>
          
          {/* Central point */}
          <circle cx="60" cy="60" r="8" fill="#fbbf24" opacity="1">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          
          {/* Clock hands */}
          <g stroke="#6b46c1" strokeWidth="2" fill="none">
            <line x1="60" y1="60" x2="60" y2="35" transform="rotate(45 60 60)" />
            <line x1="60" y1="60" x2="60" y2="40" transform="rotate(135 60 60)" />
          </g>
        </svg>
      </div>
      
      <h1 style={{
        fontFamily: 'Cormorant, Georgia, serif',
        fontSize: 'clamp(3rem, 10vw, 5rem)',
        fontWeight: '300',
        color: '#fbbf24',
        letterSpacing: '-0.05em',
        marginBottom: '1rem',
        lineHeight: '1',
        textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'
      }}>
        Hash Clock
      </h1>
      
      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
        maxWidth: '700px',
        color: '#cbd5e1',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        Every birth moment creates a unique cosmic hash, a celestial fingerprint that has never existed before and never will again. 
        Discover the sacred geometry of your soul's signature, communing with your highest self.
      </p>
      
      <button 
        onClick={onGetStarted}
        style={{
          backgroundColor: '#fbbf24',
          color: '#000814',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '0.375rem',
          fontWeight: '600',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
          marginBottom: '2rem'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.6)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 0 15px rgba(251, 191, 36, 0.4)';
        }}
      >
        ⟡ Reveal My Cosmic Hash ⟡
      </button>
      
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{
            fontFamily: 'Cormorant, Georgia, serif',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: '0.25rem'
          }}>
            1 in ∞
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Statistical Uniqueness
          </div>
        </div>
        
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{
            fontFamily: 'Cormorant, Georgia, serif',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: '0.25rem'
          }}>
            12
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Dimensional Analysis
          </div>
        </div>
        
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{
            fontFamily: 'Cormorant, Georgia, serif',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: '0.25rem'
          }}>
            ∞
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Cosmic Patterns
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
