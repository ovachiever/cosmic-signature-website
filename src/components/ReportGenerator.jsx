import { useState } from 'react';
import { calculateSunSign, calculateMoonSign, calculateAscendant, calculateAspects, calculateRarity, generateSacredGeometry, generateGalacticMission } from '../lib/astroCalculator';
import { getCosmicTerminology, getReportTemplates, saveReport } from '../lib/supabaseClient';

const ReportGenerator = ({ birthData, onReportGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const { birthDate, birthTime, latitude, longitude } = birthData;

      // Calculate astrological data
      const sunSign = calculateSunSign(birthDate);
      const moonSign = calculateMoonSign(birthDate, birthTime);
      const ascendant = calculateAscendant(birthDate, birthTime, latitude, longitude);
      const aspects = calculateAspects(birthDate, birthTime);
      const rarity = calculateRarity(aspects);
      const sacredGeometry = generateSacredGeometry(birthDate, birthTime);
      const galacticMission = generateGalacticMission(sunSign, moonSign, ascendant, aspects);

      // Get cosmic terminology and report templates from Supabase
      const [terminology, templates] = await Promise.all([
        getCosmicTerminology(),
        getReportTemplates()
      ]);

      // Generate report sections
      const reportSections = {
        introduction: generateIntroduction(templates, rarity),
        sunSign: generateSunSignSection(templates, sunSign),
        moonSign: generateMoonSignSection(templates, moonSign),
        ascendant: generateAscendantSection(templates, ascendant),
        uniqueAspects: generateUniqueAspectsSection(templates, aspects.slice(0, 3)),
        sacredGeometry: sacredGeometry,
        galacticMission: galacticMission,
        terminology: terminology
      };

      // Save report to Supabase
      const reportData = {
        birth_date: birthDate,
        birth_time: birthTime || '12:00:00',
        latitude,
        longitude,
        sun_sign: sunSign.name,
        moon_sign: moonSign.name,
        ascendant: ascendant.name,
        report_content: JSON.stringify(reportSections),
        created_at: new Date().toISOString()
      };

      await saveReport(reportData);

      // Return the generated report
      onReportGenerated(reportSections);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('There was an error generating your cosmic report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to generate introduction section
  const generateIntroduction = (templates, rarity) => {
    const template = templates.find(t => t.section === 'introduction')?.template || 
      'Your birth moment created a cosmic fingerprint found in only 1 in {rarity} beings.';
    
    return template.replace('{rarity}', rarity);
  };

  // Helper function to generate sun sign section
  const generateSunSignSection = (templates, sunSign) => {
    const template = templates.find(t => t.section === 'sun_sign')?.template || 
      'With the Sun in {sign}, you embody the cosmic energy of {element}.';
    
    return template
      .replace('{sign}', sunSign.name)
      .replace('{element}', sunSign.element)
      .replace('{qualities}', sunSign.qualities);
  };

  // Helper function to generate moon sign section
  const generateMoonSignSection = (templates, moonSign) => {
    const template = templates.find(t => t.section === 'moon_sign')?.template || 
      'Your Moon in {sign} reveals your emotional landscape.';
    
    const activities = {
      'Fire': 'physical activity and creative expression',
      'Earth': 'connecting with nature and practical tasks',
      'Air': 'intellectual stimulation and social connection',
      'Water': 'emotional processing and intuitive practices'
    };
    
    return template
      .replace('{sign}', moonSign.name)
      .replace('{qualities}', moonSign.qualities)
      .replace('{activities}', activities[moonSign.element]);
  };

  // Helper function to generate ascendant section
  const generateAscendantSection = (templates, ascendant) => {
    const template = templates.find(t => t.section === 'rising_sign')?.template || 
      'Your Ascendant in {sign} creates a cosmic mask.';
    
    const perceptions = {
      'Aries': 'bold and pioneering',
      'Taurus': 'grounded and reliable',
      'Gemini': 'curious and communicative',
      'Cancer': 'nurturing and protective',
      'Leo': 'charismatic and confident',
      'Virgo': 'analytical and helpful',
      'Libra': 'harmonious and diplomatic',
      'Scorpio': 'intense and mysterious',
      'Sagittarius': 'optimistic and adventurous',
      'Capricorn': 'disciplined and ambitious',
      'Aquarius': 'innovative and independent',
      'Pisces': 'compassionate and dreamy'
    };
    
    return template
      .replace('{sign}', ascendant.name)
      .replace('{qualities}', ascendant.qualities)
      .replace('{perception}', perceptions[ascendant.name]);
  };

  // Helper function to generate unique aspects section
  const generateUniqueAspectsSection = (templates, aspects) => {
    const template = templates.find(t => t.section === 'unique_aspects')?.template || 
      'The {aspect} between {planet1} and {planet2} is particularly significant.';
    
    const abilities = {
      'Conjunction': 'blend different energies into a powerful focus',
      'Opposition': 'balance opposing forces with remarkable clarity',
      'Trine': 'effortlessly channel creative flow between different areas of life',
      'Square': 'transform tension into productive growth and achievement',
      'Sextile': 'find opportunities where others see obstacles',
      'Quincunx': 'adapt to unexpected circumstances with unusual flexibility',
      'Semi-Square': 'navigate subtle challenges with heightened awareness',
      'Sesquiquadrate': 'restructure complex situations into workable solutions',
      'Quintile': 'access unique creative talents that seem almost magical to others',
      'Bi-Quintile': 'perceive patterns and connections invisible to most people',
      'Semi-Sextile': 'integrate seemingly unrelated skills into innovative approaches',
      'Septile': 'access mystical insights and spiritual wisdom beyond rational understanding',
      'Novile': 'complete karmic cycles and initiate spiritual evolution'
    };
    
    return aspects.map(aspect => {
      const rarityPercent = aspect.rarity === 'very rare' ? '2' : 
                           aspect.rarity === 'rare' ? '5' : 
                           aspect.rarity === 'uncommon' ? '15' : '30';
      
      return template
        .replace('{aspect}', aspect.aspect)
        .replace('{planet1}', aspect.planet1)
        .replace('{planet2}', aspect.planet2)
        .replace('{rarity}', rarityPercent)
        .replace('{ability}', abilities[aspect.aspect] || 'connect with cosmic energies in a unique way');
    }).join('\n\n');
  };

  return (
    <div className="mt-8">
      <button
        onClick={generateReport}
        disabled={isGenerating}
        className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-70"
      >
        {isGenerating ? 'Calculating your celestial coordinates...' : 'Reveal My Cosmic Blueprint'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
