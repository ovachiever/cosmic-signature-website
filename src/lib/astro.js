// Simplified astronomical calculations for Hash Clock
// Following KISS principle - ship tonight, refine later

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Sun sign calculation based on birth date
export function getSunSign(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified zodiac date ranges
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
  
  return "Aries"; // Fallback
}

// Moon sign - simplified calculation based on birth date + time
export function getMoonSign(date) {
  // Moon moves roughly 13 degrees per day, completing the zodiac in ~28 days
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const moonCycle = (dayOfYear + date.getHours() / 24) % 28;
  const signIndex = Math.floor((moonCycle / 28) * 12);
  
  return ZODIAC_SIGNS[signIndex];
}

// Ascendant (Rising) sign based on birth time and location
export function getAscendantSign(date, latitude, longitude) {
  if (!latitude || !longitude) {
    return "Unknown";
  }
  
  // Simplified rising sign calculation
  // Rising sign changes roughly every 2 hours
  const hour = date.getHours();
  const sunSign = getSunSign(date);
  const sunSignIndex = ZODIAC_SIGNS.indexOf(sunSign);
  
  // Rough approximation: rising sign based on hour and sun sign
  const hourOffset = Math.floor(hour / 2);
  const risingIndex = (sunSignIndex + hourOffset + Math.floor(latitude / 30)) % 12;
  
  return ZODIAC_SIGNS[risingIndex];
}

// Planetary aspects - simplified for initial version
export function getPlanetaryAspects(date, latitude, longitude) {
  const sunSign = getSunSign(date);
  const moonSign = getMoonSign(date);
  const ascendant = getAscendantSign(date, latitude, longitude);
  
  const aspects = [];
  
  // Generate meaningful aspects based on the signs
  if (sunSign === moonSign) {
    aspects.push({
      aspect: 'New Moon Conjunction',
      planets: 'Sun ☉ Moon ☽',
      orb: '0°',
      influence: 'A powerful union of conscious will and emotional nature. Your inner and outer selves are in perfect harmony.',
      type: 'major'
    });
  }
  
  // Element-based aspects
  const elements = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
  };
  
  const sunElement = elements[sunSign];
  const moonElement = elements[moonSign];
  
  if (sunElement === moonElement) {
    aspects.push({
      aspect: 'Elemental Harmony',
      planets: `Sun ☉ (${sunSign}) Moon ☽ (${moonSign})`,
      orb: 'Same Element',
      influence: `Your ${sunElement.toLowerCase()} nature flows consistently through both personality and emotions.`,
      type: 'harmonic'
    });
  }
  
  // Rising aspects
  if (sunSign === ascendant) {
    aspects.push({
      aspect: 'Identity Conjunction',
      planets: `Sun ☉ Ascendant ↗`,
      orb: 'Same Sign',
      influence: 'Your authentic self and public persona are perfectly aligned. What you see is what you get.',
      type: 'major'
    });
  }
  
  // Add some calculated tension aspects for interest
  const signDifference = Math.abs(ZODIAC_SIGNS.indexOf(sunSign) - ZODIAC_SIGNS.indexOf(moonSign));
  if (signDifference === 6) {
    aspects.push({
      aspect: 'Opposition',
      planets: `Sun ☉ ${sunSign} Opposition Moon ☽ ${moonSign}`,
      orb: '180°',
      influence: 'A dynamic tension between your conscious will and emotional needs creates internal dialogue and growth.',
      type: 'challenging'
    });
  } else if (signDifference === 3 || signDifference === 9) {
    aspects.push({
      aspect: 'Square',
      planets: `Sun ☉ ${sunSign} Square Moon ☽ ${moonSign}`,
      orb: '90°',
      influence: 'Creative friction between your solar identity and lunar emotions drives innovation and breakthroughs.',
      type: 'dynamic'
    });
  } else if (signDifference === 4 || signDifference === 8) {
    aspects.push({
      aspect: 'Trine',
      planets: `Sun ☉ ${sunSign} Trine Moon ☽ ${moonSign}`,
      orb: '120°',
      influence: 'Harmonious flow between your conscious purpose and emotional wisdom creates natural talent.',
      type: 'flowing'
    });
  }
  
  return aspects;
}

// Generate cosmic timing based on birth data
export function getCosmicTiming(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  if (hour >= 5 && hour < 7) return "Dawn - The awakening hour";
  if (hour >= 7 && hour < 12) return "Morning - The building hour";
  if (hour >= 12 && hour < 17) return "Afternoon - The peak hour";
  if (hour >= 17 && hour < 20) return "Evening - The reflection hour";
  if (hour >= 20 && hour < 23) return "Night - The mystery hour";
  return "Deep Night - The transformation hour";
}

// Calculate harmonic patterns
export function getHarmonicPattern(birthData) {
  const date = new Date(birthData.birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  // Generate harmonic number based on birth data
  const harmonic = ((day + month) % 12) + 1;
  
  const patterns = {
    1: "Unity - The monad pattern of wholeness",
    2: "Duality - The polarity pattern of balance",
    3: "Trinity - The creative pattern of manifestation",
    4: "Foundation - The material pattern of structure",
    5: "Pentagram - The human pattern of experience",
    6: "Hexagram - The harmony pattern of beauty",
    7: "Septenary - The mystical pattern of wisdom",
    8: "Octave - The power pattern of mastery",
    9: "Ennead - The completion pattern of fulfillment",
    10: "Decimal - The perfection pattern of cycles",
    11: "Hendecagon - The transcendence pattern of breakthrough",
    12: "Zodiac - The cosmic pattern of totality"
  };
  
  return {
    number: harmonic,
    name: patterns[harmonic],
    frequency: `${harmonic * 111}Hz`,
    geometry: `${harmonic}-pointed star`
  };
}

export default {
  getSunSign,
  getMoonSign,
  getAscendantSign,
  getPlanetaryAspects,
  getCosmicTiming,
  getHarmonicPattern
};
