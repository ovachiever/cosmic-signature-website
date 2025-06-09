import React, { useState } from 'react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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

  // Placeholder function for location search
  const handleLocationSearch = () => {
    // In a real app, this would use a geocoding API
    if (formData.birthPlace.toLowerCase() === 'new york') {
      setFormData(prev => ({
        ...prev,
        latitude: '40.7128',
        longitude: '-74.0060'
      }));
    } else if (formData.birthPlace.toLowerCase() === 'london') {
      setFormData(prev => ({
        ...prev,
        latitude: '51.5074',
        longitude: '-0.1278'
      }));
    } else if (formData.birthPlace.toLowerCase() === 'tokyo') {
      setFormData(prev => ({
        ...prev,
        latitude: '35.6762',
        longitude: '139.6503'
      }));
    }
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
              <div className="input-with-button">
                <input
                  type="text"
                  id="birthPlace"
                  name="birthPlace"
                  className="form-input"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  required
                  placeholder="City, Country"
                />
                <button 
                  type="button" 
                  className="location-button"
                  onClick={handleLocationSearch}
                >
                  Find
                </button>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="form-button secondary" onClick={prevStep}>
                Back
              </button>
              <button type="button" className="form-button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label" htmlFor="latitude">Latitude</label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                className="form-input"
                value={formData.latitude}
                onChange={handleChange}
                required
                placeholder="e.g. 40.7128"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="longitude">Longitude</label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                className="form-input"
                value={formData.longitude}
                onChange={handleChange}
                required
                placeholder="e.g. -74.0060"
              />
            </div>
            
            <div className="form-note">
              <p>Your cosmic signature requires precise coordinates for accurate celestial calculations.</p>
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
