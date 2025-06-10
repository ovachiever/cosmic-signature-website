import React, { useState, useEffect } from 'react';
import './App.css';
import Hero from './components/Hero';
import BirthDataForm from './components/BirthDataForm';
import CosmicReport from './components/CosmicReport';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { getSunSign, getMoonSign, getAscendantSign, getPlanetaryAspects } from './lib/astro';
import { generateAiReport } from './lib/reportGenerator';
import { fetchCosmicSignature, checkBackendHealth } from './lib/apiClient';

function App() {
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [geometryPattern, setGeometryPattern] = useState('default');

  // Add debug logging for state changes
  useEffect(() => {
    console.log('[DEBUG] Current section changed to:', currentSection);
  }, [currentSection]);

  // Handle form submission
  const handleBirthDataSubmit = (data) => {
    console.log('[DEBUG] Form submitted with data:', data);
    setBirthData(data);
    setIsGenerating(true);
    setCurrentSection('generating');
    
    // Generate report after a delay to show the loading animation
    setTimeout(() => {
      generateReport(data);
    }, 2500);
  };

  // Generate cosmic report based on birth data
  const generateReport = async (data) => {
    console.log('[DEBUG] Starting report generation with data:', data);
    try {
      // Format the birth date and time for display
      const birthDate = new Date(data.birthDate);
      const formattedBirthDate = birthDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      let sunSign, moonSign, ascendant, aspects, uniqueInsights, planets, ascendantData;
      let usingBackend = false;
      
      // Try to use the backend API first
      console.log('[DEBUG] Checking backend health...');
      const backendHealthy = await checkBackendHealth();
      console.log('[DEBUG] Backend healthy:', backendHealthy);
      
      if (backendHealthy) {
        console.log('[DEBUG] Fetching cosmic signature from backend...');
        const apiResult = await fetchCosmicSignature(data);
        console.log('[DEBUG] Backend API result:', apiResult);
        
        if (apiResult.success) {
          // Use backend results
          const backendData = apiResult.data;
          sunSign = backendData.sunSign;
          moonSign = backendData.moonSign;
          ascendant = backendData.ascendant;
          aspects = backendData.aspects;
          uniqueInsights = backendData.uniqueInsights;
          planets = backendData.planets;
          ascendantData = backendData.ascendantData;
          usingBackend = true;
          console.log('Using accurate Swiss Ephemeris calculations from backend');
        }
      }
      
      // Fallback to JavaScript calculations if backend is unavailable
      if (!usingBackend) {
        console.log('Backend unavailable, using simplified JavaScript calculations');
        const birthDateTime = new Date(`${data.birthDate}T${data.birthTime || '12:00:00'}`);
        sunSign = getSunSign(birthDateTime);
        moonSign = getMoonSign(birthDateTime);
        ascendant = getAscendantSign(birthDateTime, data.latitude, data.longitude);
        aspects = getPlanetaryAspects(birthDateTime, data.latitude, data.longitude);
        uniqueInsights = `Your ${sunSign} sun, ${moonSign} moon, and ${ascendant} rising create a unique cosmic signature.`;
      }
      
      // Calculate additional chart data
      const elements = calculateElementalBalance(sunSign, moonSign, ascendant);
      const modalities = calculateModalityBalance(sunSign, moonSign, ascendant);
      const rarity = calculateRarity(sunSign, moonSign, ascendant);
      
      // Generate a unique sacred geometry pattern based on the birth data
      const pattern = generateSacredGeometryPattern(data);
      setGeometryPattern(pattern);
      
      // Create chart data for AI report
      const chartData = {
        sunSign,
        moonSign,
        ascendant,
        aspects,
        elements,
        modalities,
        rarity,
        birthData: data,
        uniqueInsights,
        planets,
        ascendantData,
        usingBackend
      };
      
      // Generate AI-powered report
      let reportData = {};
      try {
        console.log('[DEBUG] Generating AI report with chart data:', chartData);
        reportData = await generateAiReport(chartData);
        console.log('[DEBUG] AI report data received:', reportData);
      } catch (aiError) {
        console.error('AI report generation failed, using fallback:', aiError);
        // Provide fallback content if AI generation fails
        reportData = {
          overview: `Welcome ${data.name || "Hash Clock Explorer"}, your cosmic signature reveals a unique celestial pattern. With your ${sunSign} sun illuminating your core essence, ${moonSign} moon governing your emotional landscape, and ${ascendant} rising shaping how you interact with the world, you embody a rare cosmic configuration.`,
          strengths: [
            `Natural ${elements.dominant} elemental affinity brings ${elements.dominant === 'fire' ? 'passion and leadership' : elements.dominant === 'earth' ? 'stability and practicality' : elements.dominant === 'air' ? 'intellectual curiosity and communication' : 'emotional depth and intuition'}`,
            `${modalities.dominant} modality dominance provides ${modalities.dominant === 'cardinal' ? 'initiative and pioneering spirit' : modalities.dominant === 'fixed' ? 'determination and reliability' : 'adaptability and versatility'}`,
            `The combination of ${sunSign} and ${moonSign} creates a powerful balance between ${sunSign === moonSign ? 'unified purpose and emotional clarity' : 'diverse perspectives and internal richness'}`
          ],
          challenges: [
            `Balancing the ${elements.dominant} elemental energy with other aspects of life`,
            `Navigating the tension between ${sunSign} solar expression and ${moonSign} lunar needs`,
            `Integrating the ${ascendant} rising sign's external approach with inner authenticity`
          ],
          opportunities: [
            `Harness your unique ${sunSign}-${moonSign}-${ascendant} combination for creative expression`,
            `Use your ${modalities.dominant} energy to ${modalities.dominant === 'cardinal' ? 'initiate new ventures' : modalities.dominant === 'fixed' ? 'build lasting foundations' : 'adapt to changing circumstances'}`,
            `Develop the underrepresented elements in your chart for greater balance`
          ],
          cosmicAdvice: `Your cosmic signature of ${sunSign} sun, ${moonSign} moon, and ${ascendant} rising appears in only 1 in ${rarity} births, making you truly unique. Embrace this rarity as a gift—your particular blend of energies offers perspectives and abilities that the world needs. Trust in your cosmic design and let your authentic self shine.`
        };
      }
      
      const finalReport = {
        name: data.name || "Hash Clock Explorer",
        formattedBirthDate,
        formattedTime: formatTime(data.birthTime),
        birthPlace: data.birthPlace || "Earth",
        coordinates: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : "Unknown",
        sunSign,
        moonSign,
        ascendant,
        ascendantData,
        planets,
        elements,
        modalities,
        aspects,
        rarity,
        uniqueInsights,
        calculationMethod: usingBackend ? 'Swiss Ephemeris (Accurate)' : 'JavaScript (Simplified)',
        ...reportData
      };
      
      console.log('[DEBUG] Final report object:', finalReport);
      setReport(finalReport);
      
      // Successfully generated report, show it
      setIsGenerating(false);
      setCurrentSection('report');
      console.log('[DEBUG] Report generation completed successfully');
    } catch (error) {
      console.error('Critical error generating report:', error);
      console.error('Error details:', error.message, error.stack);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response);
      }
      
      alert(`Sorry, there was an error generating your cosmic report: ${error.message}. Please check the console for more details.`);
      setIsGenerating(false);
      setCurrentSection('hero'); // Return to hero instead of form
    }
  };

  // Format time from 24h to 12h format
  const formatTime = (timeString) => {
    if (!timeString) return 'unknown time';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper functions for cosmic calculations
  const calculateElementalBalance = (sunSign, moonSign, ascendant) => {
    const elements = {
      fire: 0,
      earth: 0,
      air: 0,
      water: 0
    };
    
    // Map zodiac signs to elements
    const elementMap = {
      "Aries": "fire", "Leo": "fire", "Sagittarius": "fire",
      "Taurus": "earth", "Virgo": "earth", "Capricorn": "earth",
      "Gemini": "air", "Libra": "air", "Aquarius": "air",
      "Cancer": "water", "Scorpio": "water", "Pisces": "water"
    };
    
    // Count each element (sun has more weight)
    if (elementMap[sunSign]) elements[elementMap[sunSign]] += 3;
    if (elementMap[moonSign]) elements[elementMap[moonSign]] += 2;
    if (ascendant !== "Unknown" && elementMap[ascendant]) elements[elementMap[ascendant]] += 2;
    
    // Calculate percentages
    const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
    
    return {
      fire: Math.round((elements.fire / total) * 100),
      earth: Math.round((elements.earth / total) * 100),
      air: Math.round((elements.air / total) * 100),
      water: Math.round((elements.water / total) * 100),
      dominant: Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b)
    };
  };

  const calculateModalityBalance = (sunSign, moonSign, ascendant) => {
    const modalities = {
      cardinal: 0,
      fixed: 0,
      mutable: 0
    };
    
    // Map zodiac signs to modalities
    const modalityMap = {
      "Aries": "cardinal", "Cancer": "cardinal", "Libra": "cardinal", "Capricorn": "cardinal",
      "Taurus": "fixed", "Leo": "fixed", "Scorpio": "fixed", "Aquarius": "fixed",
      "Gemini": "mutable", "Virgo": "mutable", "Sagittarius": "mutable", "Pisces": "mutable"
    };
    
    // Count each modality (sun has more weight)
    if (modalityMap[sunSign]) modalities[modalityMap[sunSign]] += 3;
    if (modalityMap[moonSign]) modalities[modalityMap[moonSign]] += 2;
    if (ascendant !== "Unknown" && modalityMap[ascendant]) modalities[modalityMap[ascendant]] += 2;
    
    // Calculate percentages
    const total = Object.values(modalities).reduce((sum, val) => sum + val, 0);
    
    return {
      cardinal: Math.round((modalities.cardinal / total) * 100),
      fixed: Math.round((modalities.fixed / total) * 100),
      mutable: Math.round((modalities.mutable / total) * 100),
      dominant: Object.keys(modalities).reduce((a, b) => modalities[a] > modalities[b] ? a : b)
    };
  };

  const calculateRarity = (sunSign, moonSign, ascendant) => {
    // Calculate statistical rarity of the configuration
    // In reality, this would be based on actual astronomical probabilities
    
    // Base rarity for any combination
    let rarityFactor = 1728; // 12 sun signs × 12 moon signs × 12 rising signs
    
    // Adjust for special combinations
    if (sunSign === moonSign) {
      rarityFactor = Math.floor(rarityFactor * 0.8); // More common
    }
    
    if (sunSign === ascendant) {
      rarityFactor = Math.floor(rarityFactor * 0.9); // More common
    }
    
    // Some sign combinations are statistically less common
    const uncommonCombos = [
      ["Aries", "Scorpio"], ["Taurus", "Aquarius"], ["Gemini", "Capricorn"],
      ["Cancer", "Sagittarius"], ["Leo", "Pisces"], ["Virgo", "Aries"]
    ];
    
    for (const combo of uncommonCombos) {
      if ((sunSign === combo[0] && moonSign === combo[1]) || 
          (sunSign === combo[1] && moonSign === combo[0])) {
        rarityFactor = Math.floor(rarityFactor * 1.2); // Less common
        break;
      }
    }
    
    return rarityFactor;
  };

  const generateSacredGeometryPattern = (data) => {
    // Generate a unique pattern identifier based on birth data
    
    const date = new Date(data.birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Calculate a pattern ID (1-12) based on birth data
    const patternBase = ((day + month + (year % 100)) % 12) + 1;
    
    // Add variation based on time if available
    let variation = 'a';
    if (data.birthTime) {
      const [hours] = data.birthTime.split(':').map(Number);
      variation = String.fromCharCode(97 + (hours % 4)); // a, b, c, or d
    }
    
    return `pattern-${patternBase}${variation}`;
  };

  // Reset the form and report
  const handleReset = () => {
    setBirthData(null);
    setReport(null);
    setIsGenerating(false);
    setCurrentSection('hero');
  };

  return (
    <div className="App">
      {/* Starfield Background */}
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="main-content">
        {currentSection === 'hero' && (
          <Hero onGetStarted={() => setCurrentSection('form')} />
        )}
        
        {currentSection === 'form' && (
          <BirthDataForm onSubmit={handleBirthDataSubmit} />
        )}
        
        {currentSection === 'generating' && (
          <div className="generating-container">
            <div className="cosmic-loader"></div>
            <p className="generating-text">Calculating your celestial coordinates...</p>
          </div>
        )}
        
        {currentSection === 'report' && report && (
          <CosmicReport 
            report={report} 
            onReset={handleReset}
            geometryPattern={geometryPattern}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
