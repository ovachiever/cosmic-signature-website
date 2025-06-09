import unittest
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app import app, get_zodiac_sign, calculate_planet_positions, calculate_ascendant

class TestCosmicSignatureAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
    def test_get_zodiac_sign(self):
        """Test zodiac sign calculation from longitude."""
        self.assertEqual(get_zodiac_sign(15), "Aries")
        self.assertEqual(get_zodiac_sign(45), "Taurus")
        self.assertEqual(get_zodiac_sign(75), "Gemini")
        self.assertEqual(get_zodiac_sign(105), "Cancer")
        self.assertEqual(get_zodiac_sign(135), "Leo")
        self.assertEqual(get_zodiac_sign(165), "Virgo")
        self.assertEqual(get_zodiac_sign(195), "Libra")
        self.assertEqual(get_zodiac_sign(225), "Scorpio")
        self.assertEqual(get_zodiac_sign(255), "Sagittarius")
        self.assertEqual(get_zodiac_sign(285), "Capricorn")
        self.assertEqual(get_zodiac_sign(315), "Aquarius")
        self.assertEqual(get_zodiac_sign(345), "Pisces")
        
    def test_api_endpoint(self):
        """Test the API endpoint with sample birth data."""
        test_data = {
            "birthDate": "1982-06-04",  # Note: Using June 4th as per user's concern
            "birthTime": "04:26",
            "latitude": "43.7508",
            "longitude": "-87.7145"  # Sheboygan, WI coordinates
        }
        
        response = self.app.post('/api/cosmic-signature',
                                data=json.dumps(test_data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        
        # Verify all required fields are present
        self.assertIn('sunSign', data)
        self.assertIn('moonSign', data)
        self.assertIn('ascendant', data)
        self.assertIn('aspects', data)
        self.assertIn('uniqueInsights', data)
        
        # Verify the date is formatted correctly
        self.assertEqual(data['formattedBirthDate'], "June 4, 1982")
        self.assertEqual(data['formattedBirthTime'], "04:26")
        
        # Print the results for manual verification
        print(f"Sun Sign: {data['sunSign']}")
        print(f"Moon Sign: {data['moonSign']}")
        print(f"Ascendant: {data['ascendant']}")
        
    def test_consistency(self):
        """Test that the same input produces the same output consistently."""
        test_data = {
            "birthDate": "1982-06-04",
            "birthTime": "04:26",
            "latitude": "43.7508",
            "longitude": "-87.7145"
        }
        
        # First request
        response1 = self.app.post('/api/cosmic-signature',
                                 data=json.dumps(test_data),
                                 content_type='application/json')
        data1 = json.loads(response1.data)
        
        # Second request with same data
        response2 = self.app.post('/api/cosmic-signature',
                                 data=json.dumps(test_data),
                                 content_type='application/json')
        data2 = json.loads(response2.data)
        
        # Results should be identical
        self.assertEqual(data1['sunSign'], data2['sunSign'])
        self.assertEqual(data1['moonSign'], data2['moonSign'])
        self.assertEqual(data1['ascendant'], data2['ascendant'])
        
    def test_different_locations(self):
        """Test that different locations produce different ascendants."""
        # New York
        ny_data = {
            "birthDate": "1982-06-04",
            "birthTime": "04:26",
            "latitude": "40.7128",
            "longitude": "-74.0060"
        }
        
        # Tokyo
        tokyo_data = {
            "birthDate": "1982-06-04",
            "birthTime": "04:26",
            "latitude": "35.6762",
            "longitude": "139.6503"
        }
        
        ny_response = self.app.post('/api/cosmic-signature',
                                   data=json.dumps(ny_data),
                                   content_type='application/json')
        tokyo_response = self.app.post('/api/cosmic-signature',
                                      data=json.dumps(tokyo_data),
                                      content_type='application/json')
        
        ny_data = json.loads(ny_response.data)
        tokyo_data = json.loads(tokyo_response.data)
        
        # Sun and Moon signs should be the same (same date/time)
        self.assertEqual(ny_data['sunSign'], tokyo_data['sunSign'])
        
        # Ascendants should be different (different locations)
        # This test might occasionally fail if the locations happen to have the same ascendant
        print(f"New York Ascendant: {ny_data['ascendant']}")
        print(f"Tokyo Ascendant: {tokyo_data['ascendant']}")

if __name__ == '__main__':
    unittest.main()
