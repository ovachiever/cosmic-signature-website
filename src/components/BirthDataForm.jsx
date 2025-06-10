import React, { useState, useEffect, useRef } from 'react';
import { geocodeLocation } from '../lib/geocoding';

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
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const totalSteps = 3;
  
  // Popular cities for quick selection
  const popularCities = [
    { name: 'Sheboygan, WI', value: 'sheboygan, wi' },
    { name: 'New York, NY', value: 'new york' },
    { name: 'Los Angeles, CA', value: 'los angeles' },
    { name: 'Chicago, IL', value: 'chicago' },
    { name: 'Houston, TX', value: 'houston' },
    { name: 'Phoenix, AZ', value: 'phoenix' },
    { name: 'Philadelphia, PA', value: 'philadelphia' },
    { name: 'San Antonio, TX', value: 'san antonio' },
    { name: 'San Diego, CA', value: 'san diego' },
    { name: 'Dallas, TX', value: 'dallas' },
    { name: 'San Francisco, CA', value: 'san francisco' },
    { name: 'Seattle, WA', value: 'seattle' },
    { name: 'Miami, FL', value: 'miami' },
    { name: 'Boston, MA', value: 'boston' },
    { name: 'Denver, CO', value: 'denver' },
    { name: 'Milwaukee, WI', value: 'milwaukee' },
    { name: 'Madison, WI', value: 'madison' },
    { name: 'Green Bay, WI', value: 'green bay' },
    { name: 'Minneapolis, MN', value: 'minneapolis' },
    { name: 'Detroit, MI', value: 'detroit' },
    { name: 'Toronto, Canada', value: 'toronto' },
    { name: 'London, UK', value: 'london' },
    { name: 'Paris, France', value: 'paris' },
    { name: 'Tokyo, Japan', value: 'tokyo' },
    { name: 'Sydney, Australia', value: 'sydney' }
  ];
  
  const handleCitySelect = async (cityValue) => {
    setFormData(prevData => ({
      ...prevData,
      birthPlace: cityValue
    }));
    
    // Automatically geocode the selected city
    try {
      const result = await geocodeLocation(cityValue);
      if (result) {
        setFormData(prevData => ({
          ...prevData,
          latitude: result.lat,
          longitude: result.lng,
          birthPlace: result.displayName || cityValue
        }));
      }
    } catch (error) {
      console.error('Error geocoding city:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleGeocodeLocation = async () => {
    if (!formData.birthPlace || isGeocoding) return;
    
    setIsGeocoding(true);
    try {
      const result = await geocodeLocation(formData.birthPlace);
      if (result) {
        setFormData(prevData => ({
          ...prevData,
          latitude: result.lat,
          longitude: result.lng,
          birthPlace: result.displayName || formData.birthPlace
        }));
      } else {
        // If no result found, show a helpful message
        alert('Location not found. Please try:\n- Check spelling\n- Add state/country (e.g., "Sheboygan, WI")\n- Use manual coordinate entry');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error looking up location. Please use manual coordinate entry.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const nextStep = () => {
    const newStep = Math.min(currentStep + 1, totalSteps);
    console.log('[DEBUG] BirthDataForm: Moving from step', currentStep, 'to step', newStep);
    setCurrentStep(newStep);
  };

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 1);
    console.log('[DEBUG] BirthDataForm: Moving back from step', currentStep, 'to step', newStep);
    console.log('[DEBUG] Current formData:', formData);
    setCurrentStep(newStep);
  };

  // Add defensive check to ensure valid step
  useEffect(() => {
    console.log('[DEBUG] BirthDataForm mounted/updated. Current step:', currentStep);
    if (currentStep < 1 || currentStep > totalSteps) {
      console.error('[ERROR] Invalid step detected:', currentStep, 'Resetting to step 1');
      setCurrentStep(1);
    }
  }, [currentStep]);

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
              
              {/* Quick city selector */}
              <div style={{ marginBottom: '10px' }}>
                <select
                  className="form-input"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleCitySelect(e.target.value);
                    }
                  }}
                  style={{ marginBottom: '5px' }}
                >
                  <option value="">Select a popular city...</option>
                  {popularCities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  Or type your city below
                </div>
              </div>
              
              <div className="location-input-container" style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  className="form-input"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  placeholder="City, Country"
                  autoComplete="off"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGeocodeLocation();
                    }
                  }}
                />
                {formData.birthPlace && !formData.latitude && (
                  <button
                    type="button"
                    onClick={handleGeocodeLocation}
                    disabled={isGeocoding}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '5px 10px',
                      fontSize: '12px',
                      backgroundColor: '#6b46c1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isGeocoding ? 'wait' : 'pointer',
                      opacity: isGeocoding ? 0.7 : 1
                    }}
                  >
                    {isGeocoding ? 'Looking up...' : 'Look up'}
                  </button>
                )}
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="form-link"
                  onClick={() => setShowManualCoords(!showManualCoords)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#6b46c1', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '14px'
                  }}
                >
                  {showManualCoords ? 'Hide' : 'Enter'} coordinates manually
                </button>
              </div>
              
              {showManualCoords && (
                <div className="manual-coords" style={{ marginTop: '15px' }}>
                  <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" htmlFor="latitude">Latitude</label>
                      <input
                        type="number"
                        id="latitude"
                        name="latitude"
                        className="form-input"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="e.g., 43.7315"
                        step="0.0001"
                        min="-90"
                        max="90"
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" htmlFor="longitude">Longitude</label>
                      <input
                        type="number"
                        id="longitude"
                        name="longitude"
                        className="form-input"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="e.g., -87.7523"
                        step="0.0001"
                        min="-180"
                        max="180"
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    <a 
                      href="https://www.latlong.net/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#6b46c1' }}
                    >
                      Find coordinates for any location →
                    </a>
                  </div>
                </div>
              )}
              
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
        
        {/* Fallback render if no step matches */}
        {currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && (
          <div className="form-step">
            <p style={{ color: 'red', textAlign: 'center' }}>
              Error: Invalid form step ({currentStep}). 
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)}
                style={{ marginLeft: '10px', color: '#6b46c1', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Start Over
              </button>
            </p>
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
      
      {/* Debug info - remove in production */}
      <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '5px 10px', fontSize: '12px', borderRadius: '4px' }}>
        Step: {currentStep} | Has Coords: {formData.latitude && formData.longitude ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default BirthDataForm;
