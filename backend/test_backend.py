#!/usr/bin/env python3
"""Test script to verify the backend API is working correctly."""

import requests
import json
from datetime import datetime

# Test data
test_data = {
    "birthDate": "1990-01-15",
    "birthTime": "14:30",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York"
}

def test_health_check():
    """Test the health check endpoint."""
    try:
        response = requests.get("http://localhost:5000/health")
        if response.status_code == 200:
            print("✅ Health check passed:", response.json())
            return True
        else:
            print("❌ Health check failed:", response.status_code)
            return False
    except Exception as e:
        print("❌ Health check error:", str(e))
        return False

def test_cosmic_signature():
    """Test the cosmic signature calculation endpoint."""
    try:
        response = requests.post(
            "http://localhost:5000/api/cosmic-signature",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Cosmic signature calculation successful!")
            print(f"   Sun Sign: {data.get('sunSign')}")
            print(f"   Moon Sign: {data.get('moonSign')}")
            print(f"   Ascendant: {data.get('ascendant')}")
            print(f"   Number of aspects: {len(data.get('aspects', []))}")
            return True
        else:
            print("❌ Cosmic signature calculation failed:", response.status_code)
            print("   Response:", response.text)
            return False
    except Exception as e:
        print("❌ Cosmic signature calculation error:", str(e))
        return False

def main():
    """Run all tests."""
    print("Testing Backend API...")
    print("=" * 50)
    
    # Test health check
    health_ok = test_health_check()
    
    if health_ok:
        # Test cosmic signature calculation
        test_cosmic_signature()
    else:
        print("\n⚠️  Backend server is not running!")
        print("Start it with: cd backend && python app.py")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()
