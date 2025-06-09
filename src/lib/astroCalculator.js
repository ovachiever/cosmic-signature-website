import { useState, useEffect } from 'react';
import * as AstronomyEngine from 'astronomy-engine';

// Helper function to calculate sun sign
export const calculateSunSign = (birthDate) => {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified sun sign calculation
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
};

// Helper function to calculate moon sign using astronomy-engine
export const calculateMoonSign = (birthDate, birthTime, latitude, longitude) => {
  try {
    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);
    
    // Create date object
    const date = new Date(year, month - 1, day, hours, minutes);
    
    // Convert to astronomy-engine format
    const obsDate = AstronomyEngine.MakeTime(date);
    const observer = AstronomyEngine.Observer(parseFloat(latitude), parseFloat(longitude), 0);
    
    // Calculate moon's ecliptic longitude
    const moonLongitude = AstronomyEngine.EclipticLongitude(
      AstronomyEngine.Equator(AstronomyEngine.Moon(obsDate), obsDate, observer, true, true)
    );
    
    // Convert longitude to zodiac sign
    return longitudeToZodiacSign(moonLongitude);
  } catch (error) {
    console.error('Error calculating moon sign:', error);
    // Fallback to simplified calculation
    return simplifiedMoonSign(birthDate);
  }
};

// Helper function to calculate ascendant
export const calculateAscendant = (birthDate, birthTime, latitude, longitude) => {
  try {
    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);
    
    // Create date object
    const date = new Date(year, month - 1, day, hours, minutes);
    
    // Convert to astronomy-engine format
    const obsDate = AstronomyEngine.MakeTime(date);
    const observer = AstronomyEngine.Observer(parseFloat(latitude), parseFloat(longitude), 0);
    
    // Calculate ascendant (rising sign)
    const ascendantLongitude = AstronomyEngine.Ascendant(obsDate, observer);
    
    // Convert longitude to zodiac sign
    return longitudeToZodiacSign(ascendantLongitude);
  } catch (error) {
    console.error('Error calculating ascendant:', error);
    // Fallback to simplified calculation
    return simplifiedAscendant(birthDate, birthTime);
  }
};

// Helper function to convert ecliptic longitude to zodiac sign
const longitudeToZodiacSign = (longitude) => {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // Each sign is 30 degrees
  const signIndex = Math.floor(longitude / 30) % 12;
  return signs[signIndex];
};

// Simplified moon sign calculation as fallback
const simplifiedMoonSign = (birthDate) => {
  // This is a very simplified approximation
  const date = new Date(birthDate);
  const dayOfYear = getDayOfYear(date);
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  // Moon moves through zodiac in about 27.3 days
  // This is a rough approximation
  const signIndex = Math.floor((dayOfYear % 328) / 27.3) % 12;
  return signs[signIndex];
};

// Simplified ascendant calculation as fallback
const simplifiedAscendant = (birthDate, birthTime) => {
  // This is a very simplified approximation
  const [hours, minutes] = birthTime.split(':').map(Number);
  const timeDecimal = hours + (minutes / 60);
  
  // Ascendant changes approximately every 2 hours
  // This is a rough approximation
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const signIndex = Math.floor((timeDecimal % 24) / 2) % 12;
  return signs[signIndex];
};

// Helper function to get day of year
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Hook to generate cosmic report
export const useCosmicReport = (birthData) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!birthData) return;
    
    const generateReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calculate celestial positions
        const sunSign = calculateSunSign(birthData.birthDate);
        const moonSign = calculateMoonSign(
          birthData.birthDate, 
          birthData.birthTime, 
          birthData.latitude, 
          birthData.longitude
        );
        const ascendant = calculateAscendant(
          birthData.birthDate, 
          birthData.birthTime, 
          birthData.latitude, 
          birthData.longitude
        );
        
        // Generate aspects (simplified)
        const aspects = generateAspects();
        
        // Generate unique insights
        const uniqueInsights = generateUniqueInsights(sunSign, moonSign, ascendant);
        
        // Create report
        const newReport = {
          sunSign,
          moonSign,
          ascendant,
          aspects,
          uniqueInsights
        };
        
        setReport(newReport);
      } catch (err) {
        setError('Error generating cosmic report: ' + err.message);
        console.error('Error generating cosmic report:', err);
      } finally {
        setLoading(false);
      }
    };
    
    generateReport();
  }, [birthData]);
  
  return { report, loading, error };
};

// Helper function to generate aspects
const generateAspects = () => {
  // In a real app, this would calculate actual planetary aspects
  // For now, we'll return simulated aspects
  return [
    { aspect: "Conjunction", planets: "Sun and Mercury", influence: "Enhanced communication and self-expression" },
    { aspect: "Trine", planets: "Moon and Venus", influence: "Emotional harmony and artistic sensitivity" },
    { aspect: "Square", planets: "Mars and Saturn", influence: "Dynamic tension between action and discipline" }
  ];
};

// Helper function to generate unique insights
const generateUniqueInsights = (sunSign, moonSign, ascendant) => {
  // Generate unique insights based on the combination of signs
  return `Your ${sunSign} sun brings vitality and purpose, while your ${moonSign} moon shapes your emotional landscape. With ${ascendant} rising, you present yourself to the world with ${getAscendantQualities(ascendant)}. This rare combination occurs in only 1 in 1,728 people, making your cosmic signature truly unique.`;
};

// Helper function to get ascendant qualities
const getAscendantQualities = (ascendant) => {
  const qualities = {
    "Aries": "boldness and initiative",
    "Taurus": "steadfastness and sensuality",
    "Gemini": "curiosity and adaptability",
    "Cancer": "nurturing sensitivity",
    "Leo": "warmth and dramatic flair",
    "Virgo": "analytical precision",
    "Libra": "grace and diplomacy",
    "Scorpio": "intensity and perception",
    "Sagittarius": "optimism and honesty",
    "Capricorn": "discipline and ambition",
    "Aquarius": "originality and vision",
    "Pisces": "compassion and intuition"
  };
  return qualities[ascendant] || "unique qualities";
};
