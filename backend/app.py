from flask import Flask, request, jsonify
import swisseph as swe
import pytz
from datetime import datetime
import math

app = Flask(__name__)

# Initialize Swiss Ephemeris with ephemeris files path
# In production, you would download the full ephemeris files
swe.set_ephe_path('/usr/share/ephe')  # Default path for ephemeris files

# Constants for zodiac signs
ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Planet constants
SUN = swe.SUN
MOON = swe.MOON
MERCURY = swe.MERCURY
VENUS = swe.VENUS
MARS = swe.MARS
JUPITER = swe.JUPITER
SATURN = swe.SATURN
URANUS = swe.URANUS
NEPTUNE = swe.NEPTUNE
PLUTO = swe.PLUTO

# Aspect constants
CONJUNCTION = 0
SEXTILE = 60
SQUARE = 90
TRINE = 120
OPPOSITION = 180

# Aspect orbs
ASPECT_ORBS = {
    CONJUNCTION: 8,
    SEXTILE: 4,
    SQUARE: 8,
    TRINE: 8,
    OPPOSITION: 8
}

def get_julian_day(date_str, time_str, timezone_str):
    """Convert date, time, and timezone to Julian day."""
    try:
        # Parse the date and time
        date_format = "%Y-%m-%d"
        time_format = "%H:%M"
        
        birth_date = datetime.strptime(date_str, date_format).date()
        birth_time = datetime.strptime(time_str, time_format).time()
        
        # Combine date and time
        birth_datetime = datetime.combine(birth_date, birth_time)
        
        # Apply timezone
        timezone = pytz.timezone(timezone_str)
        birth_datetime = timezone.localize(birth_datetime)
        
        # Convert to UTC
        birth_datetime_utc = birth_datetime.astimezone(pytz.UTC)
        
        # Calculate Julian day
        jd = swe.julday(
            birth_datetime_utc.year,
            birth_datetime_utc.month,
            birth_datetime_utc.day,
            birth_datetime_utc.hour + birth_datetime_utc.minute / 60.0
        )
        
        return jd
    except Exception as e:
        print(f"Error calculating Julian day: {e}")
        return None

def get_zodiac_sign(longitude):
    """Convert longitude to zodiac sign."""
    sign_index = int(longitude / 30) % 12
    return ZODIAC_SIGNS[sign_index]

def calculate_planet_positions(jd):
    """Calculate positions of all planets at given Julian day."""
    planets = {}
    
    for planet in [SUN, MOON, MERCURY, VENUS, MARS, JUPITER, SATURN, URANUS, NEPTUNE, PLUTO]:
        result = swe.calc_ut(jd, planet)
        # Extract longitude from the result tuple
        longitude = result[0][0]  # Fixed: Extract first element from the tuple
        planets[planet] = {
            "longitude": longitude,
            "sign": get_zodiac_sign(longitude)
        }
    
    return planets

def calculate_ascendant(jd, lat, lon):
    """Calculate the ascendant (rising sign) for a given time and location."""
    # Set geographic location
    swe.set_topo(lon, lat, 0)  # longitude, latitude, altitude
    
    # Calculate houses
    houses = swe.houses(jd, lat, lon)
    
    # The ascendant is the first house cusp
    ascendant_longitude = houses[0][0]
    
    return {
        "longitude": ascendant_longitude,
        "sign": get_zodiac_sign(ascendant_longitude)
    }

def calculate_aspects(planets):
    """Calculate major aspects between planets."""
    aspects = []
    planet_list = list(planets.keys())
    
    for i in range(len(planet_list)):
        for j in range(i + 1, len(planet_list)):
            planet1 = planet_list[i]
            planet2 = planet_list[j]
            
            # Calculate the angular difference
            diff = abs(planets[planet1]["longitude"] - planets[planet2]["longitude"])
            if diff > 180:
                diff = 360 - diff
            
            # Check for aspects
            for aspect_type in [CONJUNCTION, SEXTILE, SQUARE, TRINE, OPPOSITION]:
                orb = ASPECT_ORBS[aspect_type]
                if abs(diff - aspect_type) <= orb:
                    aspect_name = get_aspect_name(aspect_type)
                    planet1_name = get_planet_name(planet1)
                    planet2_name = get_planet_name(planet2)
                    
                    aspects.append({
                        "aspect": aspect_name,
                        "planets": f"{planet1_name} and {planet2_name}",
                        "influence": get_aspect_influence(planet1, planet2, aspect_type)
                    })
    
    return aspects

def get_aspect_name(aspect_type):
    """Get the name of an aspect based on its type."""
    if aspect_type == CONJUNCTION:
        return "Conjunction"
    elif aspect_type == SEXTILE:
        return "Sextile"
    elif aspect_type == SQUARE:
        return "Square"
    elif aspect_type == TRINE:
        return "Trine"
    elif aspect_type == OPPOSITION:
        return "Opposition"
    else:
        return "Unknown"

def get_planet_name(planet_id):
    """Get the name of a planet based on its ID."""
    planet_names = {
        SUN: "Sun",
        MOON: "Moon",
        MERCURY: "Mercury",
        VENUS: "Venus",
        MARS: "Mars",
        JUPITER: "Jupiter",
        SATURN: "Saturn",
        URANUS: "Uranus",
        NEPTUNE: "Neptune",
        PLUTO: "Pluto"
    }
    return planet_names.get(planet_id, "Unknown")

def get_aspect_influence(planet1, planet2, aspect_type):
    """Generate a description of the aspect's influence."""
    planet1_name = get_planet_name(planet1)
    planet2_name = get_planet_name(planet2)
    
    # Basic influences based on planets and aspect type
    influences = {
        (SUN, MOON, CONJUNCTION): "Harmonious integration of conscious will and emotional needs",
        (SUN, MOON, SQUARE): "Tension between identity expression and emotional security",
        (SUN, MOON, TRINE): "Natural flow between conscious purpose and emotional responses",
        (SUN, MOON, OPPOSITION): "Balancing act between self-expression and emotional needs",
        
        (SUN, MERCURY, CONJUNCTION): "Enhanced communication and self-expression",
        (SUN, VENUS, CONJUNCTION): "Artistic expression and natural charm",
        (SUN, MARS, CONJUNCTION): "Powerful drive and assertive energy",
        
        (MOON, VENUS, TRINE): "Emotional harmony and artistic sensitivity",
        (MOON, JUPITER, TRINE): "Emotional generosity and optimistic outlook",
        
        (MARS, SATURN, SQUARE): "Dynamic tension between action and discipline",
        (MARS, URANUS, SQUARE): "Unpredictable bursts of energy and innovation",
        
        (JUPITER, SATURN, CONJUNCTION): "Balanced expansion and practical growth",
        (JUPITER, SATURN, OPPOSITION): "Tension between optimism and caution",
        
        (VENUS, MARS, CONJUNCTION): "Passionate creative expression and romantic intensity",
        (VENUS, NEPTUNE, CONJUNCTION): "Idealistic love and artistic inspiration"
    }
    
    # Try to find a specific influence
    for key, value in influences.items():
        if (planet1 == key[0] and planet2 == key[1] and aspect_type == key[2]) or \
           (planet2 == key[0] and planet1 == key[1] and aspect_type == key[2]):
            return value
    
    # Generic influences based on aspect type
    generic_influences = {
        CONJUNCTION: f"Intensified blending of {planet1_name} and {planet2_name} energies",
        SEXTILE: f"Harmonious opportunity between {planet1_name} and {planet2_name}",
        SQUARE: f"Creative tension between {planet1_name} and {planet2_name}",
        TRINE: f"Natural flow between {planet1_name} and {planet2_name} energies",
        OPPOSITION: f"Dynamic balancing of {planet1_name} and {planet2_name}"
    }
    
    return generic_influences.get(aspect_type, "Significant cosmic influence")

def generate_unique_insights(sun_sign, moon_sign, ascendant):
    """Generate unique insights based on the combination of signs."""
    # Personality traits based on sun sign
    sun_traits = {
        "Aries": "fiery initiative and pioneering spirit",
        "Taurus": "grounded determination and sensual appreciation",
        "Gemini": "versatile communication and intellectual curiosity",
        "Cancer": "nurturing sensitivity and emotional depth",
        "Leo": "creative self-expression and natural leadership",
        "Virgo": "analytical precision and practical improvement",
        "Libra": "harmonious relationships and aesthetic appreciation",
        "Scorpio": "transformative intensity and psychological insight",
        "Sagittarius": "expansive vision and philosophical exploration",
        "Capricorn": "disciplined ambition and structural mastery",
        "Aquarius": "innovative thinking and humanitarian vision",
        "Pisces": "compassionate imagination and spiritual connection"
    }
    
    # Emotional landscape based on moon sign
    moon_traits = {
        "Aries": "need for emotional independence and quick emotional responses",
        "Taurus": "emotional security through stability and comfort",
        "Gemini": "emotional processing through communication and variety",
        "Cancer": "deep emotional memory and nurturing instincts",
        "Leo": "emotional warmth and need for recognition",
        "Virgo": "emotional processing through analysis and service",
        "Libra": "emotional balance through harmony in relationships",
        "Scorpio": "emotional intensity and transformative feelings",
        "Sagittarius": "emotional freedom and optimistic outlook",
        "Capricorn": "emotional self-sufficiency and structured feelings",
        "Aquarius": "emotional detachment and unconventional feelings",
        "Pisces": "emotional empathy and spiritual sensitivity"
    }
    
    # Outer persona based on ascendant
    ascendant_traits = {
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
    }
    
    # Generate unique insight based on the combination
    insight = f"Your {sun_sign} sun brings {sun_traits.get(sun_sign, 'unique energy')}, while your {moon_sign} moon shapes your emotional landscape with {moon_traits.get(moon_sign, 'distinctive feelings')}. With {ascendant} rising, you present yourself to the world with {ascendant_traits.get(ascendant, 'special qualities')}. This rare combination occurs in only 1 in 1,728 people, making your cosmic signature truly unique."
    
    # Add additional insight based on element combinations
    elements = {
        "Fire": ["Aries", "Leo", "Sagittarius"],
        "Earth": ["Taurus", "Virgo", "Capricorn"],
        "Air": ["Gemini", "Libra", "Aquarius"],
        "Water": ["Cancer", "Scorpio", "Pisces"]
    }
    
    sun_element = next((e for e, signs in elements.items() if sun_sign in signs), None)
    moon_element = next((e for e, signs in elements.items() if moon_sign in signs), None)
    asc_element = next((e for e, signs in elements.items() if ascendant in signs), None)
    
    if sun_element and moon_element and asc_element:
        if sun_element == moon_element == asc_element:
            insight += f" The triple {sun_element} influence creates a powerful concentration of {sun_element.lower()} energy, giving you exceptional gifts in {get_element_domain(sun_element)}."
        elif sun_element != moon_element and sun_element != asc_element and moon_element != asc_element:
            insight += f" The balance of Fire, Earth, Air, and Water elements in your chart creates a remarkable versatility, allowing you to navigate diverse situations with ease."
    
    return insight

def get_element_domain(element):
    """Get the domain associated with an element."""
    domains = {
        "Fire": "inspiration, action, and creative expression",
        "Earth": "practicality, manifestation, and sensory experience",
        "Air": "communication, social connection, and conceptual thinking",
        "Water": "emotional depth, intuition, and empathic understanding"
    }
    return domains.get(element, "various domains")

@app.route('/api/cosmic-signature', methods=['POST'])
def generate_cosmic_signature():
    try:
        data = request.json
        
        # Extract birth data
        birth_date = data.get('birthDate')
        birth_time = data.get('birthTime')
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        
        # Get timezone based on coordinates (simplified for now)
        # In production, use a proper timezone database
        timezone_str = 'UTC'  # Default to UTC
        
        # Calculate Julian day
        jd = get_julian_day(birth_date, birth_time, timezone_str)
        if not jd:
            return jsonify({"error": "Invalid birth data"}), 400
        
        # Calculate planet positions
        planets = calculate_planet_positions(jd)
        
        # Calculate ascendant
        ascendant = calculate_ascendant(jd, latitude, longitude)
        
        # Calculate aspects
        aspects = calculate_aspects(planets)
        
        # Generate unique insights
        sun_sign = planets[SUN]["sign"]
        moon_sign = planets[MOON]["sign"]
        ascendant_sign = ascendant["sign"]
        unique_insights = generate_unique_insights(sun_sign, moon_sign, ascendant_sign)
        
        # Format birth date for display
        try:
            birth_date_obj = datetime.strptime(birth_date, "%Y-%m-%d")
            formatted_date = birth_date_obj.strftime("%B %-d, %Y")
        except:
            formatted_date = birth_date
        
        # Create response
        response = {
            "sunSign": sun_sign,
            "moonSign": moon_sign,
            "ascendant": ascendant_sign,
            "aspects": aspects,
            "uniqueInsights": unique_insights,
            "formattedBirthDate": formatted_date,
            "formattedBirthTime": birth_time
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error generating cosmic signature: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
