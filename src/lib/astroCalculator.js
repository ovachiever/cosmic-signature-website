import { useState, useEffect } from 'react';
import * as AstronomyEngine from 'astronomy-engine';

// Function to calculate Sun sign based on birth date
export function calculateSunSign(birthDate) {
  const date = new Date(birthDate);
  
  // Get the Sun's ecliptic longitude on the birth date
  const sunInfo = AstronomyEngine.SunPosition(date);
  const longitude = sunInfo.elon;
  
  // Determine the zodiac sign based on the longitude
  return getZodiacSignFromLongitude(longitude);
}

// Function to calculate Moon sign based on birth date and time
export function calculateMoonSign(birthDate, birthTime) {
  const dateTimeStr = `${birthDate}T${birthTime || '12:00:00'}`;
  const date = new Date(dateTimeStr);
  
  // Get the Moon's ecliptic longitude on the birth date and time
  const moonInfo = AstronomyEngine.MoonPosition(date);
  const longitude = moonInfo.elon;
  
  // Determine the zodiac sign based on the longitude
  return getZodiacSignFromLongitude(longitude);
}

// Function to calculate Ascendant (Rising sign) based on birth date, time, and location
export function calculateAscendant(birthDate, birthTime, latitude, longitude) {
  // Default to noon if time is not provided
  const dateTimeStr = `${birthDate}T${birthTime || '12:00:00'}`;
  const date = new Date(dateTimeStr);
  
  // Calculate the sidereal time at Greenwich
  const siderealTime = AstronomyEngine.SiderealTime(date);
  
  // Adjust for the local longitude
  const localSiderealTime = (siderealTime + longitude / 15) % 24;
  
  // Convert to degrees
  const ascendantLongitude = (localSiderealTime * 15) % 360;
  
  // Determine the zodiac sign based on the longitude
  return getZodiacSignFromLongitude(ascendantLongitude);
}

// Function to calculate aspects between planets
export function calculateAspects(birthDate, birthTime) {
  const dateTimeStr = `${birthDate}T${birthTime || '12:00:00'}`;
  const date = new Date(dateTimeStr);
  
  // Get positions of major planets
  const sunInfo = AstronomyEngine.SunPosition(date);
  const moonInfo = AstronomyEngine.MoonPosition(date);
  const mercuryInfo = AstronomyEngine.MercuryPosition(date);
  const venusInfo = AstronomyEngine.VenusPosition(date);
  const marsInfo = AstronomyEngine.MarsPosition(date);
  const jupiterInfo = AstronomyEngine.JupiterPosition(date);
  const saturnInfo = AstronomyEngine.SaturnPosition(date);
  
  const planets = [
    { name: 'Sun', longitude: sunInfo.elon },
    { name: 'Moon', longitude: moonInfo.elon },
    { name: 'Mercury', longitude: mercuryInfo.elon },
    { name: 'Venus', longitude: venusInfo.elon },
    { name: 'Mars', longitude: marsInfo.elon },
    { name: 'Jupiter', longitude: jupiterInfo.elon },
    { name: 'Saturn', longitude: saturnInfo.elon }
  ];
  
  const aspects = [];
  
  // Calculate aspects between all planets
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate the angular difference
      let diff = Math.abs(planet1.longitude - planet2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      // Check for major aspects with orbs
      const aspect = getAspectType(diff);
      if (aspect) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: aspect.name,
          angle: diff,
          orb: Math.abs(diff - aspect.angle),
          rarity: aspect.rarity
        });
      }
    }
  }
  
  // Sort aspects by orb (closest aspects first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

// Function to calculate statistical rarity of the birth chart
export function calculateRarity(aspects) {
  // This is a simplified calculation for demonstration
  // In a real application, this would be more sophisticated
  
  // Base rarity value
  let rarityValue = 10000; // 1 in 10,000 as a starting point
  
  // Adjust based on aspects
  aspects.forEach(aspect => {
    // Rare aspects increase rarity
    if (aspect.rarity === 'very rare') {
      rarityValue = rarityValue * 10;
    } else if (aspect.rarity === 'rare') {
      rarityValue = rarityValue * 3;
    } else if (aspect.rarity === 'uncommon') {
      rarityValue = rarityValue * 1.5;
    }
    
    // Very tight orbs increase rarity
    if (aspect.orb < 1) {
      rarityValue = rarityValue * 2;
    }
  });
  
  // Format the result
  return Math.round(rarityValue).toLocaleString();
}

// Helper function to get zodiac sign from longitude
function getZodiacSignFromLongitude(longitude) {
  const signs = [
    { name: 'Aries', symbol: '♈', element: 'Fire', qualities: 'courage, determination, confidence', startDegree: 0 },
    { name: 'Taurus', symbol: '♉', element: 'Earth', qualities: 'reliability, patience, practicality', startDegree: 30 },
    { name: 'Gemini', symbol: '♊', element: 'Air', qualities: 'adaptability, curiosity, expressiveness', startDegree: 60 },
    { name: 'Cancer', symbol: '♋', element: 'Water', qualities: 'intuition, emotional depth, nurturing', startDegree: 90 },
    { name: 'Leo', symbol: '♌', element: 'Fire', qualities: 'creativity, generosity, warmth', startDegree: 120 },
    { name: 'Virgo', symbol: '♍', element: 'Earth', qualities: 'analytical thinking, precision, service', startDegree: 150 },
    { name: 'Libra', symbol: '♎', element: 'Air', qualities: 'harmony, diplomacy, fairness', startDegree: 180 },
    { name: 'Scorpio', symbol: '♏', element: 'Water', qualities: 'passion, resourcefulness, mystery', startDegree: 210 },
    { name: 'Sagittarius', symbol: '♐', element: 'Fire', qualities: 'optimism, freedom, exploration', startDegree: 240 },
    { name: 'Capricorn', symbol: '♑', element: 'Earth', qualities: 'discipline, responsibility, ambition', startDegree: 270 },
    { name: 'Aquarius', symbol: '♒', element: 'Air', qualities: 'innovation, independence, humanitarianism', startDegree: 300 },
    { name: 'Pisces', symbol: '♓', element: 'Water', qualities: 'compassion, artistic sensitivity, spirituality', startDegree: 330 }
  ];
  
  // Normalize the longitude to 0-360 range
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  
  // Find the sign
  for (let i = 0; i < signs.length; i++) {
    const currentSign = signs[i];
    const nextSign = signs[(i + 1) % signs.length];
    
    if (
      (i < signs.length - 1 && normalizedLongitude >= currentSign.startDegree && normalizedLongitude < nextSign.startDegree) ||
      (i === signs.length - 1 && normalizedLongitude >= currentSign.startDegree)
    ) {
      return currentSign;
    }
  }
  
  // Default fallback
  return signs[0];
}

// Helper function to determine aspect type based on angle
function getAspectType(angle) {
  const aspects = [
    { name: 'Conjunction', angle: 0, orb: 8, rarity: 'common' },
    { name: 'Opposition', angle: 180, orb: 8, rarity: 'common' },
    { name: 'Trine', angle: 120, orb: 8, rarity: 'common' },
    { name: 'Square', angle: 90, orb: 8, rarity: 'common' },
    { name: 'Sextile', angle: 60, orb: 6, rarity: 'common' },
    { name: 'Quincunx', angle: 150, orb: 5, rarity: 'uncommon' },
    { name: 'Semi-Square', angle: 45, orb: 4, rarity: 'uncommon' },
    { name: 'Sesquiquadrate', angle: 135, orb: 4, rarity: 'uncommon' },
    { name: 'Quintile', angle: 72, orb: 3, rarity: 'rare' },
    { name: 'Bi-Quintile', angle: 144, orb: 3, rarity: 'rare' },
    { name: 'Semi-Sextile', angle: 30, orb: 3, rarity: 'uncommon' },
    { name: 'Septile', angle: 51.43, orb: 2, rarity: 'very rare' },
    { name: 'Novile', angle: 40, orb: 2, rarity: 'rare' }
  ];
  
  for (const aspect of aspects) {
    if (Math.abs(angle - aspect.angle) <= aspect.orb) {
      return aspect;
    }
  }
  
  return null;
}

// Function to generate sacred geometry pattern based on birth chart
export function generateSacredGeometry(birthDate, birthTime) {
  const dateTimeStr = `${birthDate}T${birthTime || '12:00:00'}`;
  const date = new Date(dateTimeStr);
  
  // Get positions of major planets
  const sunInfo = AstronomyEngine.SunPosition(date);
  const moonInfo = AstronomyEngine.MoonPosition(date);
  const mercuryInfo = AstronomyEngine.MercuryPosition(date);
  const venusInfo = AstronomyEngine.VenusPosition(date);
  const marsInfo = AstronomyEngine.MarsPosition(date);
  const jupiterInfo = AstronomyEngine.JupiterPosition(date);
  const saturnInfo = AstronomyEngine.SaturnPosition(date);
  
  const planets = [
    { name: 'Sun', longitude: sunInfo.elon },
    { name: 'Moon', longitude: moonInfo.elon },
    { name: 'Mercury', longitude: mercuryInfo.elon },
    { name: 'Venus', longitude: venusInfo.elon },
    { name: 'Mars', longitude: marsInfo.elon },
    { name: 'Jupiter', longitude: jupiterInfo.elon },
    { name: 'Saturn', longitude: saturnInfo.elon }
  ];
  
  // Determine the dominant sacred geometry pattern
  const angles = planets.map(planet => planet.longitude);
  
  // Check for patterns
  const patterns = [
    { name: 'Grand Trine', description: 'A perfect triangle of cosmic harmony, connecting three points of your chart in flowing grace. This sacred formation channels creative energy effortlessly through your being.' },
    { name: 'Star Tetrahedron', description: 'The interlocking triangles of masculine and feminine energy create perfect balance in your cosmic signature. This sacred geometry pattern represents the harmony of opposites within you.' },
    { name: 'Mystic Rectangle', description: 'Four points of your chart connect in a dynamic rectangle of opportunity and balance. This sacred pattern grants you the ability to transform challenges into opportunities with grace.' },
    { name: 'Golden Ratio Spiral', description: 'The divine proportion of the golden ratio spirals through your chart, connecting your planets in perfect mathematical harmony. This sacred pattern aligns you with the fundamental growth patterns of the universe.' },
    { name: 'Merkaba', description: 'The counter-rotating energy fields in your chart form the vehicle of light known as the Merkaba. This sacred geometry pattern enables multidimensional awareness and spiritual transformation.' }
  ];
  
  // Simplified selection based on birth date
  const dayOfYear = getDayOfYear(date);
  const patternIndex = dayOfYear % patterns.length;
  
  return patterns[patternIndex];
}

// Helper function to get day of year
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Function to generate galactic mission statement
export function generateGalacticMission(sunSign, moonSign, ascendant, aspects) {
  const missions = [
    `As a cosmic being with ${sunSign.name} Sun, ${moonSign.name} Moon, and ${ascendant.name} Rising, your galactic mission is to illuminate paths of ${sunSign.qualities} while nurturing the ${moonSign.qualities} within yourself and others. Your unique perspective allows you to bridge worlds and transform consciousness through your presence.`,
    `Your cosmic blueprint reveals a galactic mission of healing and transformation. With your ${sunSign.name} determination, ${moonSign.name} intuition, and ${ascendant.name} expression, you are here to catalyze evolutionary change in those you encounter.`,
    `The celestial configuration at your birth moment indicates a galactic mission of innovation and leadership. Your ${sunSign.name} Sun empowers you to pioneer new paths, while your ${moonSign.name} Moon gives you the emotional intelligence to guide others with compassion.`,
    `Your galactic mission involves being a cosmic translator—bridging the seen and unseen realms. Your ${sunSign.name} Sun, ${moonSign.name} Moon, and ${ascendant.name} Rising create a unique lens through which universal wisdom flows into practical application.`,
    `With your cosmic signature, you are designed to be a keeper of ancient wisdom. Your ${sunSign.name} focus, ${moonSign.name} receptivity, and ${ascendant.name} presence allow you to access and share timeless knowledge in ways that awaken others to their own divine potential.`
  ];
  
  // Select mission based on the most significant aspect
  const significantAspect = aspects[0];
  const missionIndex = Math.floor((significantAspect?.angle || 0) / 72) % missions.length;
  
  return missions[missionIndex];
}
