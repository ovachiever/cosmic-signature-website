import React from 'react';

const SacredGeometry = ({ planets, aspects, sunSign, moonSign, ascendant, ascendantData }) => {
  const width = 600;
  const height = 600;
  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) / 2 - 60;
  const innerRadius = radius * 0.8;
  
  // Zodiac wheel setup
  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', start: 0 },
    { name: 'Taurus', symbol: '♉', start: 30 },
    { name: 'Gemini', symbol: '♊', start: 60 },
    { name: 'Cancer', symbol: '♋', start: 90 },
    { name: 'Leo', symbol: '♌', start: 120 },
    { name: 'Virgo', symbol: '♍', start: 150 },
    { name: 'Libra', symbol: '♎', start: 180 },
    { name: 'Scorpio', symbol: '♏', start: 210 },
    { name: 'Sagittarius', symbol: '♐', start: 240 },
    { name: 'Capricorn', symbol: '♑', start: 270 },
    { name: 'Aquarius', symbol: '♒', start: 300 },
    { name: 'Pisces', symbol: '♓', start: 330 }
  ];

  // Planet symbols
  const planetSymbols = {
    Sun: '☉',
    Moon: '☽',
    Mercury: '☿',
    Venus: '♀',
    Mars: '♂',
    Jupiter: '♃',
    Saturn: '♄',
    Uranus: '♅',
    Neptune: '♆',
    Pluto: '♇'
  };

  // Convert degrees to radians for SVG positioning
  const degreesToRadians = (degrees) => {
    return (degrees - 90) * (Math.PI / 180);
  };

  // Get position on the wheel based on zodiac longitude
  const getPlanetPosition = (longitude, radiusOffset = 0) => {
    const angle = degreesToRadians(longitude);
    const r = innerRadius - radiusOffset;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    };
  };

  // Get zodiac sign position for labels
  const getZodiacPosition = (degrees) => {
    const angle = degreesToRadians(degrees + 15); // Center of sign
    const r = radius - 25;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    };
  };

  // Create aspect lines with appropriate styling
  const createAspectLine = (aspect) => {
    if (!planets || !planets[aspect.planet1] || !planets[aspect.planet2]) return null;
    
    const pos1 = getPlanetPosition(planets[aspect.planet1].longitude);
    const pos2 = getPlanetPosition(planets[aspect.planet2].longitude);
    
    // Different colors for different aspects
    const aspectColors = {
      'Conjunction': 'rgba(255, 215, 0, 0.6)',  // Gold
      'Sextile': 'rgba(100, 200, 255, 0.5)',   // Light blue
      'Square': 'rgba(255, 100, 100, 0.5)',    // Red
      'Trine': 'rgba(100, 255, 100, 0.5)',     // Green
      'Opposition': 'rgba(255, 150, 255, 0.5)' // Purple
    };
    
    const color = aspectColors[aspect.aspect] || 'rgba(255, 255, 255, 0.3)';
    
    return (
      <line
        key={`${aspect.planet1}-${aspect.planet2}`}
        x1={pos1.x}
        y1={pos1.y}
        x2={pos2.x}
        y2={pos2.y}
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={aspect.aspect === 'Square' ? '5,5' : '0'}
      />
    );
  };

  // Create zodiac wheel divisions
  const createZodiacWheel = () => {
    const divisions = [];
    
    // Create 12 divisions for zodiac signs
    for (let i = 0; i < 12; i++) {
      const startAngle = i * 30;
      const endAngle = (i + 1) * 30;
      const startRad = degreesToRadians(startAngle);
      const endRad = degreesToRadians(endAngle);
      
      // Create arc path
      const x1 = center.x + radius * Math.cos(startRad);
      const y1 = center.y + radius * Math.sin(startRad);
      const x2 = center.x + radius * Math.cos(endRad);
      const y2 = center.y + radius * Math.sin(endRad);
      
      const x1Inner = center.x + innerRadius * Math.cos(startRad);
      const y1Inner = center.y + innerRadius * Math.sin(startRad);
      const x2Inner = center.x + innerRadius * Math.cos(endRad);
      const y2Inner = center.y + innerRadius * Math.sin(endRad);
      
      // Create division lines
      divisions.push(
        <line
          key={`division-${i}`}
          x1={x1}
          y1={y1}
          x2={x1Inner}
          y2={y1Inner}
          stroke="rgba(251, 191, 36, 0.3)"
          strokeWidth="1"
        />
      );
      
      // Add zodiac sign symbol
      const signPos = getZodiacPosition(startAngle);
      divisions.push(
        <text
          key={`sign-${i}`}
          x={signPos.x}
          y={signPos.y}
          fill="rgba(251, 191, 36, 0.8)"
          fontSize="16"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {zodiacSigns[i].symbol}
        </text>
      );
    }
    
    return divisions;
  };

  // Create planet markers
  const createPlanetMarkers = () => {
    if (!planets) return null;
    
    return Object.entries(planets).map(([planetName, planetData]) => {
      if (!planetData || typeof planetData.longitude !== 'number') return null;
      
      const pos = getPlanetPosition(planetData.longitude, 20);
      const symbol = planetSymbols[planetName] || planetName[0];
      
      // Highlight personal planets
      const isPersonal = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].includes(planetName);
      const size = isPersonal ? 18 : 14;
      const color = isPersonal ? 'rgba(251, 191, 36, 1)' : 'rgba(251, 191, 36, 0.7)';
      
      return (
        <g key={planetName}>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={size / 2}
            fill="rgba(31, 41, 55, 0.8)"
            stroke={color}
            strokeWidth="1.5"
          />
          <text
            x={pos.x}
            y={pos.y}
            fill={color}
            fontSize={size}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="serif"
          >
            {symbol}
          </text>
        </g>
      );
    });
  };

  // Create ascendant marker
  const createAscendantMarker = () => {
    if (!ascendantData || typeof ascendantData.longitude !== 'number') return null;
    
    const pos = getPlanetPosition(ascendantData.longitude);
    const outerPos = getPlanetPosition(ascendantData.longitude, -20);
    
    return (
      <g>
        <line
          x1={pos.x}
          y1={pos.y}
          x2={outerPos.x}
          y2={outerPos.y}
          stroke="rgba(168, 85, 247, 0.8)"
          strokeWidth="2"
        />
        <text
          x={outerPos.x}
          y={outerPos.y - 10}
          fill="rgba(168, 85, 247, 0.9)"
          fontSize="12"
          textAnchor="middle"
        >
          ASC
        </text>
      </g>
    );
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '500px', margin: '0 auto', display: 'block' }}>
      <defs>
        <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
          <stop offset="50%" stopColor="rgba(107, 70, 193, 0.05)" />
          <stop offset="100%" stopColor="rgba(107, 70, 193, 0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background glow */}
      <circle cx={center.x} cy={center.y} r={radius} fill="url(#cosmicGlow)" />
      
      {/* Outer circle */}
      <circle 
        cx={center.x} 
        cy={center.y} 
        r={radius} 
        fill="transparent" 
        stroke="rgba(251, 191, 36, 0.3)" 
        strokeWidth="2" 
      />
      
      {/* Inner circle */}
      <circle 
        cx={center.x} 
        cy={center.y} 
        r={innerRadius} 
        fill="transparent" 
        stroke="rgba(251, 191, 36, 0.2)" 
        strokeWidth="1" 
      />
      
      {/* Zodiac wheel divisions */}
      {createZodiacWheel()}
      
      {/* Aspect lines */}
      <g filter="url(#glow)">
        {aspects && aspects.map(createAspectLine)}
      </g>
      
      {/* Ascendant marker */}
      {createAscendantMarker()}
      
      {/* Planet markers */}
      {createPlanetMarkers()}
      
      {/* Center point */}
      <circle 
        cx={center.x} 
        cy={center.y} 
        r="3" 
        fill="rgba(251, 191, 36, 0.8)" 
      />
    </svg>
  );
};

export default SacredGeometry;
