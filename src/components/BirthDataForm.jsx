import React, { useState, useEffect, useRef } from 'react';

const BirthDataForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: '',
    longitude: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // For location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Sample location data with coordinates
  const locationDatabase = [
    { name: "New York, NY, USA", latitude: "40.7128", longitude: "-74.0060" },
    { name: "Los Angeles, CA, USA", latitude: "34.0522", longitude: "-118.2437" },
    { name: "Chicago, IL, USA", latitude: "41.8781", longitude: "-87.6298" },
    { name: "Houston, TX, USA", latitude: "29.7604", longitude: "-95.3698" },
    { name: "Phoenix, AZ, USA", latitude: "33.4484", longitude: "-112.0740" },
    { name: "Philadelphia, PA, USA", latitude: "39.9526", longitude: "-75.1652" },
    { name: "San Antonio, TX, USA", latitude: "29.4241", longitude: "-98.4936" },
    { name: "San Diego, CA, USA", latitude: "32.7157", longitude: "-117.1611" },
    { name: "Dallas, TX, USA", latitude: "32.7767", longitude: "-96.7970" },
    { name: "San Francisco, CA, USA", latitude: "37.7749", longitude: "-122.4194" },
    { name: "Austin, TX, USA", latitude: "30.2672", longitude: "-97.7431" },
    { name: "Seattle, WA, USA", latitude: "47.6062", longitude: "-122.3321" },
    { name: "Denver, CO, USA", latitude: "39.7392", longitude: "-104.9903" },
    { name: "Boston, MA, USA", latitude: "42.3601", longitude: "-71.0589" },
    { name: "Nashville, TN, USA", latitude: "36.1627", longitude: "-86.7816" },
    { name: "Portland, OR, USA", latitude: "45.5051", longitude: "-122.6750" },
    { name: "Las Vegas, NV, USA", latitude: "36.1699", longitude: "-115.1398" },
    { name: "Miami, FL, USA", latitude: "25.7617", longitude: "-80.1918" },
    { name: "London, UK", latitude: "51.5074", longitude: "-0.1278" },
    { name: "Paris, France", latitude: "48.8566", longitude: "2.3522" },
    { name: "Tokyo, Japan", latitude: "35.6762", longitude: "139.6503" },
    { name: "Sydney, Australia", latitude: "-33.8688", longitude: "151.2093" },
    { name: "Berlin, Germany", latitude: "52.5200", longitude: "13.4050" },
    { name: "Rome, Italy", latitude: "41.9028", longitude: "12.4964" },
    { name: "Madrid, Spain", latitude: "40.4168", longitude: "-3.7038" },
    { name: "Toronto, Canada", latitude: "43.6532", longitude: "-79.3832" },
    { name: "Moscow, Russia", latitude: "55.7558", longitude: "37.6173" },
    { name: "Beijing, China", latitude: "39.9042", longitude: "116.4074" },
    { name: "Cairo, Egypt", latitude: "30.0444", longitude: "31.2357" },
    { name: "Sheboygan, WI, USA", latitude: "43.7508", longitude: "-87.7145" }
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Handle location input with autocomplete
    if (name === 'birthPlace') {
      handleLocationInput(value);
    }
  };

  const handleLocationInput = (input) => {
    if (input.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filteredLocations = locationDatabase.filter(location => 
      location.name.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
    
    setLocationSuggestions(filteredLocations);
    setShowSuggestions(filteredLocations.length > 0);
  };

  const handleSelectLocation = (location) => {
    setFormData(prevData => ({
      ...prevData,
      birthPlace: location.name,
      latitude: location.latitude,
      longitude: location.longitude
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Your Cosmic Origins</h2>
      
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="birthDate">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="form-input"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="form-button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label" htmlFor="birthTime">Birth Time (as precise as possible)</label>
              <input
                type="time"
                id="birthTime"
                name="birthTime"
                className="form-input"
                value={formData.birthTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="birthPlace">Birth Place</label>
              <div className="location-input-container">
                <input
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  className="form-input"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  required
                  placeholder="City, Country"
                  autoComplete="off"
                />
                
                {showSuggestions && (
                  <div className="location-suggestions" ref={suggestionsRef}>
                    {locationSuggestions.map((location, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => handleSelectLocation(location)}
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {formData.latitude && formData.longitude && (
                <div className="coordinates-display">
                  <span className="coordinates-text">
                    Coordinates: {formData.latitude}, {formData.longitude}
                  </span>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="button" className="form-button secondary" onClick={prevStep}>
                Back
              </button>
              <button 
                type="button" 
                className="form-button" 
                onClick={nextStep}
                disabled={!formData.birthPlace || !formData.latitude || !formData.longitude}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="form-step">
            <div className="form-summary">
              <h3 className="summary-title">Cosmic Data Summary</h3>
              
              <div className="summary-item">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{formData.name}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Birth Date:</span>
                <span className="summary-value">{formData.birthDate}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Birth Time:</span>
                <span className="summary-value">{formData.birthTime}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Birth Place:</span>
                <span className="summary-value">{formData.birthPlace}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Coordinates:</span>
                <span className="summary-value">{formData.latitude}, {formData.longitude}</span>
              </div>
            </div>
            
            <div className="form-note">
              <p>Your cosmic signature will be calculated using these precise celestial coordinates.</p>
            </div>
            
            <div className="form-actions">
              <button type="button" className="form-button secondary" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="form-submit">
                Generate Cosmic Signature
              </button>
            </div>
          </div>
        )}
        
        <div className="form-progress">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`progress-dot ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default BirthDataForm;
