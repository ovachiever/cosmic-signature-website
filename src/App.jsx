import React, { useState, useEffect } from 'react';
import './App.css';
import Hero from './components/Hero';
import BirthDataForm from './components/BirthDataForm';
import CosmicReport from './components/CosmicReport';
import Footer from './components/Footer';

function App() {
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');

  // Handle form submission
  const handleBirthDataSubmit = (data) => {
    setBirthData(data);
    setIsGenerating(true);
    setCurrentSection('generating');
    
    // Simulate report generation with a delay to show the process
    setTimeout(() => {
      generateReport(data);
      setIsGenerating(false);
      setCurrentSection('report');
    }, 2500);
  };

  // Generate cosmic report based on birth data
  const generateReport = (data) => {
    // This would normally call the astronomy engine to calculate positions
    // For now, we'll create a simulated report
    const sunSign = getSunSign(data.birthDate);
    const moonSign = getMoonSign(data.birthDate, data.birthTime);
    const ascendant = getAscendant(data.birthDate, data.birthTime, data.latitude, data.longitude);
    
    setReport({
      sunSign,
      moonSign,
      ascendant,
      aspects: generateAspects(),
      uniqueInsights: generateUniqueInsights(sunSign, moonSign, ascendant)
    });
  };

  // Helper functions for cosmic calculations
  const getSunSign = (birthDate) => {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified sun sign calculation
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  const getMoonSign = (birthDate, birthTime) => {
    // In a real app, this would use astronomy-engine for accurate calculations
    // For now, we'll return a random moon sign
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(Math.random() * signs.length)];
  };

  const getAscendant = (birthDate, birthTime, latitude, longitude) => {
    // In a real app, this would use astronomy-engine for accurate calculations
    // For now, we'll return a random ascendant
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[Math.floor(Math.random() * signs.length)];
  };

  const generateAspects = () => {
    // Simplified aspects generation
    return [
      { aspect: "Conjunction", planets: "Sun and Mercury", influence: "Enhanced communication and self-expression" },
      { aspect: "Trine", planets: "Moon and Venus", influence: "Emotional harmony and artistic sensitivity" },
      { aspect: "Square", planets: "Mars and Saturn", influence: "Dynamic tension between action and discipline" }
    ];
  };

  const generateUniqueInsights = (sunSign, moonSign, ascendant) => {
    // Generate unique insights based on the combination of signs
    return `Your ${sunSign} sun brings vitality and purpose, while your ${moonSign} moon shapes your emotional landscape. With ${ascendant} rising, you present yourself to the world with ${getAscendantQualities(ascendant)}. This rare combination occurs in only 1 in 1,728 people, making your cosmic signature truly unique.`;
  };

  const getAscendantQualities = (ascendant) => {
    const qualities = {
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
    };
    return qualities[ascendant] || "unique qualities";
  };

  // Reset the form and report
  const handleReset = () => {
    setBirthData(null);
    setReport(null);
    setCurrentSection('hero');
  };

  // Render the appropriate section based on current state
  const renderSection = () => {
    switch (currentSection) {
      case 'hero':
        return <Hero onGetStarted={() => setCurrentSection('form')} />;
      case 'form':
        return <BirthDataForm onSubmit={handleBirthDataSubmit} />;
      case 'generating':
        return (
          <div className="generating-container">
            <div className="cosmic-loader">
              <div className="stars"></div>
              <div className="stars2"></div>
              <div className="stars3"></div>
              <div className="generating-text">Calculating Cosmic Alignments...</div>
            </div>
          </div>
        );
      case 'report':
        return <CosmicReport report={report} birthData={birthData} onReset={handleReset} />;
      default:
        return <Hero onGetStarted={() => setCurrentSection('form')} />;
    }
  };

  return (
    <div className="App">
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      <main className="main-content">
        {renderSection()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
