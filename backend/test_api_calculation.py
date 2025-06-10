#!/usr/bin/env python3
"""
Test the backend API calculation to debug why it's giving wrong results.
"""

import requests
import json

# Test the API with the same birth data
api_url = "http://localhost:5000/api/cosmic-signature"

birth_data = {
    "birthDate": "1982-06-03",
    "birthTime": "04:26",
    "latitude": 43.7508,
    "longitude": -87.7145,
    "timezone": "America/Chicago"  # This should be detected automatically
}

print("Testing API with birth data:")
print(json.dumps(birth_data, indent=2))
print("\nSending request to API...")

try:
    response = requests.post(api_url, json=birth_data)
    if response.status_code == 200:
        result = response.json()
        print("\nAPI Response:")
        print(f"Sun Sign: {result.get('sunSign')}")
        print(f"Moon Sign: {result.get('moonSign')}")
        print(f"Ascendant: {result.get('ascendant')}")
        print(f"Timezone used: {result.get('timezone')}")
        print(f"Formatted date: {result.get('formattedBirthDate')}")
        
        # Check planet positions
        if 'planets' in result:
            print("\nPlanet Positions from API:")
            for planet, data in result['planets'].items():
                print(f"{planet:10} {data['longitude']:7.3f}° = {data['sign']} {data['degree']:5.2f}°")
        
        # Check ascendant data
        if 'ascendantData' in result:
            asc_data = result['ascendantData']
            print(f"\nAscendant Details: {asc_data['longitude']:.3f}° = {asc_data['sign']} {asc_data['degree']:.2f}°")
            
    else:
        print(f"API Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error calling API: {e}")

# Now let's trace through the backend logic manually
print("\n" + "="*50)
print("MANUAL CALCULATION CHECK:")
print("="*50)

import sys
sys.path.append('.')
from app import get_julian_day, get_timezone_from_coordinates
import swisseph as swe

# Check timezone detection
tz = get_timezone_from_coordinates(43.7508, -87.7145)
print(f"Detected timezone: {tz}")

# Check Julian day calculation
jd = get_julian_day("1982-06-03", "04:26", tz)
print(f"Julian Day calculated: {jd}")

# Compare with expected JD
expected_jd = 2445123.8930555554  # From our direct test
print(f"Expected Julian Day: {expected_jd}")
print(f"Difference: {jd - expected_jd} days = {(jd - expected_jd) * 24} hours")
