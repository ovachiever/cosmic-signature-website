#!/usr/bin/env python3
"""
astrology_core.py: The Source of Truth for Astrological Calculations.

This module contains the pure, unadulterated Swiss Ephemeris logic.
It is completely decoupled from the Flask API, ensuring that the core
calculations are robust, verifiable, and free from web-related side effects.

Principle: This module takes a precise Julian Day (UT) and geographic
coordinates and returns a single, comprehensive JSON-like object with all
necessary astrological data. It does one thing, and it does it perfectly.
"""

import swisseph as swe
import os
from datetime import datetime

# --- Constants and Configuration ---

# Ensure the ephemeris path is set correctly
# This assumes the 'ephe' directory is in the same directory as this script.
EPHE_PATH = os.path.join(os.path.dirname(__file__), 'ephe')
swe.set_ephe_path(EPHE_PATH)

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", 
    "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANET_IDS = {
    'Sun': swe.SUN,
    'Moon': swe.MOON,
    'Mercury': swe.MERCURY,
    'Venus': swe.VENUS,
    'Mars': swe.MARS,
    'Jupiter': swe.JUPITER,
    'Saturn': swe.SATURN,
    'Uranus': swe.URANUS,
    'Neptune': swe.NEPTUNE,
    'Pluto': swe.PLUTO
}

# --- Helper Functions ---

def get_zodiac_sign(longitude):
    """Converts a celestial longitude to its corresponding zodiac sign."""
    if not isinstance(longitude, (int, float)):
        return "Unknown"
    return ZODIAC_SIGNS[int(longitude / 30) % 12]

def get_zodiac_degree(longitude):
    """Calculates the degree of a celestial body within its zodiac sign."""
    return longitude % 30

def calculate_aspect_angle(lon1, lon2):
    """Calculate the angle between two celestial longitudes."""
    angle = abs(lon1 - lon2)
    # Always take the shorter arc
    if angle > 180:
        angle = 360 - angle
    return angle

def get_aspect_name(angle, orb=8):
    """Determine aspect name based on angle with specified orb."""
    aspects = [
        (0, "Conjunction"),
        (60, "Sextile"),
        (90, "Square"),
        (120, "Trine"),
        (180, "Opposition")
    ]
    
    for target_angle, name in aspects:
        if abs(angle - target_angle) <= orb:
            return name
    return None

def calculate_aspects(planets_data):
    """Calculate major aspects between planets."""
    aspects = []
    planet_names = list(planets_data.keys())
    
    for i, planet1 in enumerate(planet_names):
        for planet2 in planet_names[i+1:]:
            lon1 = planets_data[planet1]['longitude']
            lon2 = planets_data[planet2]['longitude']
            
            angle = calculate_aspect_angle(lon1, lon2)
            aspect_name = get_aspect_name(angle)
            
            if aspect_name:
                aspects.append({
                    "planet1": planet1,
                    "planet2": planet2,
                    "aspect": aspect_name,
                    "angle": round(angle, 2),
                    "planets": f"{planet1} {aspect_name} {planet2}",
                    "influence": f"{planet1} forms a {aspect_name.lower()} with {planet2}"
                })
    
    return aspects

# --- Core Calculation Functions ---

def calculate_all_planetary_positions(jd_ut):
    """
    Calculates the positions of all planets for a given Julian Day.
    
    Args:
        jd_ut (float): The Julian Day in Universal Time.
        
    Returns:
        dict: A dictionary containing data for each planet.
    """
    planets_data = {}
    for name, planet_id in PLANET_IDS.items():
        # swe.calc_ut returns a tuple of values; we need the first element which contains position info
        result = swe.calc_ut(jd_ut, planet_id)
        longitude = result[0][0]
        latitude = result[0][1]
        distance = result[0][2]
        
        planets_data[name] = {
            "longitude": longitude,
            "latitude": latitude,
            "distance_au": distance,
            "sign": get_zodiac_sign(longitude),
            "degree": get_zodiac_degree(longitude)
        }
    return planets_data

def calculate_houses_and_angles(jd_ut, lat, lon):
    """
    Calculates house cusps and major angles (Ascendant, Midheaven).
    
    Args:
        jd_ut (float): The Julian Day in Universal Time.
        lat (float): Latitude of the birth location.
        lon (float): Longitude of the birth location.
        
    Returns:
        dict: A dictionary containing house cusps and angle data.
    """
    # Using Placidus house system, as is standard.
    cusps, ascmc = swe.houses(jd_ut, lat, lon, b'P')
    
    ascendant_lon = ascmc[0]
    midheaven_lon = ascmc[1]
    
    angles_data = {
        "ascendant": {
            "longitude": ascendant_lon,
            "sign": get_zodiac_sign(ascendant_lon),
            "degree": get_zodiac_degree(ascendant_lon)
        },
        "midheaven": {
            "longitude": midheaven_lon,
            "sign": get_zodiac_sign(midheaven_lon),
            "degree": get_zodiac_degree(midheaven_lon)
        }
    }
    
    house_data = {
        "cusps": list(cusps),
        "angles": angles_data
    }
    
    return house_data

# --- Master Function ---

def get_astrological_data(jd_ut, lat, lon):
    """
    The main function to get a complete astrological chart.
    This is the single entry point for all calculations.
    
    Args:
        jd_ut (float): The Julian Day in Universal Time.
        lat (float): Latitude of the birth location.
        lon (float): Longitude of the birth location.
        
    Returns:
        dict: A comprehensive dictionary of all astrological data.
    """
    if not ephe_path_exists():
        raise FileNotFoundError(f"Ephemeris data not found at configured path: {EPHE_PATH}")

    planets = calculate_all_planetary_positions(jd_ut)
    houses = calculate_houses_and_angles(jd_ut, lat, lon)
    aspects = calculate_aspects(planets)
    
    # Combine all data into a single, clean object
    chart_data = {
        "planets": planets,
        "houses": houses['cusps'],
        "ascendant": houses['angles']['ascendant'],
        "midheaven": houses['angles']['midheaven'],
        "aspects": aspects
    }
    
    return chart_data

def ephe_path_exists():
    """Checks if the configured ephemeris path is valid."""
    return os.path.exists(EPHE_PATH)

# --- Self-Test Block ---
if __name__ == '__main__':
    print("--- Running Self-Test for astrology_core.py ---")
    
    if not ephe_path_exists():
        print(f"ERROR: Ephemeris path not found at '{EPHE_PATH}'. Please run download_ephemeris.py")
    else:
        # Test case: Erik's birth data (June 3, 1982, 4:26 AM CDT, Sheboygan, WI)
        # Converted to UTC: 1982-06-03 09:26:00 UTC
        year, month, day = 1982, 6, 3
        hour = 9 + 26/60.0
        jd_test = swe.julday(year, month, day, hour)
        lat_test, lon_test = 43.7508, -87.7145
        
        print(f"\nTest Case: Julian Day {jd_test} at ({lat_test}, {lon_test})")
        
        chart = get_astrological_data(jd_test, lat_test, lon_test)
        
        print("\n--- Planetary Positions ---")
        for name, data in chart['planets'].items():
            print(f"{name:8s}: {data['sign']:12s} {data['degree']:.2f}°")
            
        print("\n--- Angles ---")
        print(f"Ascendant: {chart['ascendant']['sign']} {chart['ascendant']['degree']:.2f}°")
        print(f"Midheaven: {chart['midheaven']['sign']} {chart['midheaven']['degree']:.2f}°")
        
        # Verification against known correct values
        print("\n--- Verification ---")
        assert chart['planets']['Sun']['sign'] == "Gemini"
        assert chart['planets']['Moon']['sign'] == "Scorpio"
        assert chart['ascendant']['sign'] == "Taurus"
        print("Sun, Moon, and Ascendant signs match expected values. ✓")
        print("\nSelf-test completed successfully.")
