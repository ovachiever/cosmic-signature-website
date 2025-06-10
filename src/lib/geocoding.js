// Geocoding service with multiple fallback options

// Common city coordinates for quick lookup
const COMMON_CITIES = {
  'sheboygan, wi': { lat: 43.7508, lng: -87.7145 },
  'sheboygan': { lat: 43.7508, lng: -87.7145 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'new york city': { lat: 40.7128, lng: -74.0060 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'san antonio': { lat: 29.4241, lng: -98.4936 },
  'san diego': { lat: 32.7157, lng: -117.1611 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'barcelona': { lat: 41.3851, lng: 2.1734 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'boston': { lat: 42.3601, lng: -71.0589 },
  'denver': { lat: 39.7392, lng: -104.9903 },
  'milwaukee': { lat: 43.0389, lng: -87.9065 },
  'madison': { lat: 43.0731, lng: -89.4012 },
  'green bay': { lat: 44.5133, lng: -88.0133 },
  'minneapolis': { lat: 44.9778, lng: -93.2650 },
  'detroit': { lat: 42.3314, lng: -83.0458 }
};

// Geocode using OpenStreetMap Nominatim API (free, no key required)
export async function geocodeWithNominatim(query) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Hash Clock Cosmic Signature App'
        }
      }
    );
    
    if (!response.ok) throw new Error('Nominatim API error');
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Nominatim geocoding error:', error);
    return null;
  }
}

// Try to geocode a location using multiple methods
export async function geocodeLocation(query) {
  if (!query || query.trim().length === 0) return null;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // First, check common cities for instant results
  if (COMMON_CITIES[normalizedQuery]) {
    return {
      ...COMMON_CITIES[normalizedQuery],
      displayName: query,
      source: 'local'
    };
  }
  
  // Try Nominatim as fallback
  const nominatimResult = await geocodeWithNominatim(query);
  if (nominatimResult) {
    return {
      ...nominatimResult,
      source: 'nominatim'
    };
  }
  
  return null;
}

// US State coordinates for fallback
export const US_STATES = {
  'AL': { name: 'Alabama', lat: 33.0, lng: -86.8 },
  'AK': { name: 'Alaska', lat: 65.0, lng: -153.0 },
  'AZ': { name: 'Arizona', lat: 34.3, lng: -111.7 },
  'AR': { name: 'Arkansas', lat: 34.8, lng: -92.4 },
  'CA': { name: 'California', lat: 37.2, lng: -119.4 },
  'CO': { name: 'Colorado', lat: 39.0, lng: -105.5 },
  'CT': { name: 'Connecticut', lat: 41.6, lng: -72.7 },
  'DE': { name: 'Delaware', lat: 39.0, lng: -75.5 },
  'FL': { name: 'Florida', lat: 28.6, lng: -82.4 },
  'GA': { name: 'Georgia', lat: 32.7, lng: -83.4 },
  'HI': { name: 'Hawaii', lat: 20.3, lng: -156.4 },
  'ID': { name: 'Idaho', lat: 44.4, lng: -114.6 },
  'IL': { name: 'Illinois', lat: 40.0, lng: -89.2 },
  'IN': { name: 'Indiana', lat: 39.9, lng: -86.3 },
  'IA': { name: 'Iowa', lat: 42.0, lng: -93.5 },
  'KS': { name: 'Kansas', lat: 38.5, lng: -98.4 },
  'KY': { name: 'Kentucky', lat: 37.5, lng: -85.3 },
  'LA': { name: 'Louisiana', lat: 31.1, lng: -91.9 },
  'ME': { name: 'Maine', lat: 45.4, lng: -69.2 },
  'MD': { name: 'Maryland', lat: 39.0, lng: -76.8 },
  'MA': { name: 'Massachusetts', lat: 42.3, lng: -71.8 },
  'MI': { name: 'Michigan', lat: 44.3, lng: -85.4 },
  'MN': { name: 'Minnesota', lat: 46.3, lng: -94.3 },
  'MS': { name: 'Mississippi', lat: 32.7, lng: -89.7 },
  'MO': { name: 'Missouri', lat: 38.4, lng: -92.5 },
  'MT': { name: 'Montana', lat: 47.0, lng: -109.6 },
  'NE': { name: 'Nebraska', lat: 41.5, lng: -99.8 },
  'NV': { name: 'Nevada', lat: 39.5, lng: -116.9 },
  'NH': { name: 'New Hampshire', lat: 43.7, lng: -71.6 },
  'NJ': { name: 'New Jersey', lat: 40.2, lng: -74.7 },
  'NM': { name: 'New Mexico', lat: 34.5, lng: -106.1 },
  'NY': { name: 'New York', lat: 42.8, lng: -75.5 },
  'NC': { name: 'North Carolina', lat: 35.5, lng: -79.8 },
  'ND': { name: 'North Dakota', lat: 47.5, lng: -100.5 },
  'OH': { name: 'Ohio', lat: 40.3, lng: -82.8 },
  'OK': { name: 'Oklahoma', lat: 35.5, lng: -97.5 },
  'OR': { name: 'Oregon', lat: 43.9, lng: -120.6 },
  'PA': { name: 'Pennsylvania', lat: 40.9, lng: -77.8 },
  'RI': { name: 'Rhode Island', lat: 41.7, lng: -71.5 },
  'SC': { name: 'South Carolina', lat: 34.0, lng: -80.9 },
  'SD': { name: 'South Dakota', lat: 44.4, lng: -100.2 },
  'TN': { name: 'Tennessee', lat: 35.9, lng: -86.4 },
  'TX': { name: 'Texas', lat: 31.5, lng: -98.5 },
  'UT': { name: 'Utah', lat: 39.3, lng: -111.7 },
  'VT': { name: 'Vermont', lat: 44.1, lng: -72.6 },
  'VA': { name: 'Virginia', lat: 37.5, lng: -78.9 },
  'WA': { name: 'Washington', lat: 47.4, lng: -120.5 },
  'WV': { name: 'West Virginia', lat: 38.6, lng: -80.6 },
  'WI': { name: 'Wisconsin', lat: 44.6, lng: -90.0 },
  'WY': { name: 'Wyoming', lat: 43.0, lng: -107.5 }
};
