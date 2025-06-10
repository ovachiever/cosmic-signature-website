import { generateCosmicReport } from './openaiClient.js';

export async function generateAiReport(chartData) {
  try {
    // Use AI-powered cosmic report generation
    const aiReport = await generateCosmicReport(chartData);
    
    // If we have a cosmic report, parse it to extract sections
    if (aiReport && aiReport.cosmicReport) {
      const reportText = aiReport.cosmicReport;
      
      // Try to extract sections from the AI-generated text
      const sections = extractSectionsFromReport(reportText);
      
      return {
        overview: sections.overview || generateFallbackOverview(chartData),
        strengths: sections.strengths || generateFallbackStrengths(chartData),
        challenges: sections.challenges || generateFallbackChallenges(chartData),
        opportunities: sections.opportunities || generateFallbackOpportunities(chartData),
        cosmicAdvice: sections.cosmicAdvice || generateFallbackAdvice(chartData),
        fullReport: reportText // Keep the full report for reference
      };
    }
    
    // If AI report structure is different, fall back to defaults
    return generateFallbackReport(chartData);
  } catch (error) {
    console.error('Error generating AI report:', error);
    
    // Fallback to structured placeholder report
    return generateFallbackReport(chartData);
  }
}

function extractSectionsFromReport(reportText) {
  // Simple extraction based on common patterns in the AI response
  const sections = {
    overview: '',
    strengths: [],
    challenges: [],
    opportunities: [],
    cosmicAdvice: ''
  };
  
  // Extract overview - usually the first substantive paragraph
  const overviewMatch = reportText.match(/## (?:Foundational Cosmic Identity|Your Cosmic Identity|Overview)([\s\S]*?)(?=##|$)/i);
  if (overviewMatch) {
    sections.overview = overviewMatch[1].trim().split('\n')[0];
  }
  
  // For now, use the fallback content structure
  // In a production app, you'd parse the AI response more sophisticatedly
  return sections;
}

function generateFallbackReport(chartData) {
  return {
    overview: generateFallbackOverview(chartData),
    strengths: generateFallbackStrengths(chartData),
    challenges: generateFallbackChallenges(chartData),
    opportunities: generateFallbackOpportunities(chartData),
    cosmicAdvice: generateFallbackAdvice(chartData)
  };
}

function generateFallbackOverview(chartData) {
  const { sunSign, moonSign, ascendant, elements, uniqueInsights } = chartData;
  // Use the unique insights from backend if available, otherwise generate fallback
  if (uniqueInsights) {
    return uniqueInsights;
  }
  return `You emerge as a ${sunSign} Sun with the emotional depths of a ${moonSign} Moon, anchored through a ${ascendant} Rising. This trinity forms your cosmic signature—a unique frequency in the symphony of existence. Your ${elements?.dominant || 'balanced'} elemental dominance reveals the primary energy through which you interface with reality. This configuration appears in only 1 in 1728 births, marking you as a rare cosmic expression.`;
}

function generateFallbackStrengths(chartData) {
  const { sunSign, moonSign, ascendant, elements, modalities } = chartData;
  return [
    `${sunSign} solar power brings ${getSignStrength(sunSign)} to your core identity`,
    `${moonSign} lunar wisdom provides ${getSignStrength(moonSign)} in emotional intelligence`,
    `${ascendant} rising energy creates ${getSignStrength(ascendant)} in first impressions`,
    `${elements?.dominant || 'Balanced'} elemental dominance grants natural ${getElementalGift(elements?.dominant)}`,
    `${modalities?.dominant || 'Balanced'} modality focus enables ${getModalityPower(modalities?.dominant)}`
  ];
}

function generateFallbackChallenges(chartData) {
  const { sunSign, moonSign, elements } = chartData;
  return [
    `Balancing ${sunSign} ego needs with ${moonSign} emotional requirements`,
    `Integrating opposing elemental forces when ${elements?.dominant} energy dominates`,
    `Navigating the shadow aspects of your ${sunSign} solar nature`,
    `Harmonizing inner ${moonSign} feelings with outer expression`,
    `Transcending the limitations of your dominant ${elements?.dominant || 'elemental'} pattern`
  ];
}

function generateFallbackOpportunities(chartData) {
  const { sunSign, moonSign, ascendant, aspects } = chartData;
  return [
    `Leverage your ${sunSign}-${moonSign} combination for unique creative expression`,
    `Use ${ascendant} rising sign magnetism to attract aligned opportunities`,
    `Transform challenging aspects into sources of strength and wisdom`,
    `Develop untapped potential in your less dominant elements`,
    `Align with cosmic cycles that amplify your ${sunSign} solar gifts`
  ];
}

function generateFallbackAdvice(chartData) {
  const { sunSign, moonSign, ascendant } = chartData;
  return `Your birth moment captures a specific harmonic in the cosmic web—one that occurs roughly 1 in 1728 times. This statistical rarity suggests you carry encoded instructions for evolutionary leaps in consciousness. Trust the unique combination of ${sunSign} will, ${moonSign} intuition, and ${ascendant} presence. Your cosmic signature is not just rare—it's necessary. The universe needs exactly what you came here to express.`;
}

function getSignStrength(sign) {
  const strengths = {
    "Aries": "pioneering courage and leadership",
    "Taurus": "steadfast determination and sensuality",
    "Gemini": "versatile communication and curiosity",
    "Cancer": "nurturing intuition and protection",
    "Leo": "radiant creativity and confidence",
    "Virgo": "precise analysis and service",
    "Libra": "harmonious balance and diplomacy",
    "Scorpio": "transformative depth and power",
    "Sagittarius": "expansive wisdom and adventure",
    "Capricorn": "ambitious mastery and structure",
    "Aquarius": "innovative vision and humanity",
    "Pisces": "mystical compassion and imagination",
    "Unknown": "mysterious potential and discovery"
  };
  return strengths[sign] || "unique gifts";
}

function getElementalGift(element) {
  const gifts = {
    "fire": "inspiration and dynamic action",
    "earth": "manifestation and practical wisdom",
    "air": "intellectual brilliance and communication",
    "water": "emotional depth and psychic sensitivity"
  };
  return gifts[element] || "elemental mastery";
}

function getModalityPower(modality) {
  const powers = {
    "cardinal": "powerful initiation and leadership",
    "fixed": "unwavering determination and loyalty",
    "mutable": "adaptive flexibility and evolution"
  };
  return powers[modality] || "dynamic expression";
}

function generateFallbackSections(chartData) {
  const { sunSign, moonSign, ascendant, aspects, elements, rarity } = chartData;
  
  return {
    cosmicIdentity: `You emerge as a ${sunSign} Sun with the emotional depths of a ${moonSign} Moon, anchored through a ${ascendant} Rising. This trinity forms your cosmic signature—a unique frequency in the symphony of existence. Your ${elements?.dominant || 'balanced'} elemental dominance reveals the primary energy through which you interface with reality.`,
    
    soulEvolution: `Your birth moment captures a specific harmonic in the cosmic web—one that occurs roughly 1 in ${rarity} times. This statistical rarity suggests you carry encoded instructions for evolutionary leaps in consciousness. The planetary aspects in your chart create a unique timing mechanism for your soul's unfoldment.`,
    
    relationalMatrix: `Your relationship patterns are encoded in the geometric dance between Venus, Mars, and your 7th house dynamics. The cosmic web of connections reveals how you mirror and are mirrored by others in the grand choreography of consciousness evolution.`,
    
    multiDimensionalGeometry: `The angles between your planets create a unique resonance pattern—a cosmic fingerprint that has never existed before and never will again. This sacred geometry is your soul's blueprint for manifestation, revealing optimal timing for key life transitions.`,
    
    harmonicResonance: `Your natal chart resonates at specific harmonic frequencies that align with galactic rhythms. These cosmic chords reveal your unique gifts and the particular note you contribute to the universal symphony of awakening consciousness.`,
    
    predictiveMastery: `The timeline of your existence unfolds according to celestial clockwork. Current transits activate dormant potentials in your natal blueprint, creating windows of opportunity for quantum leaps in awareness and manifestation.`,
    
    specializedLifeDomains: `Your cosmic signature reveals specific potentials across all life domains. Career paths that align with your planetary patterns, financial flows that follow your Venus-Jupiter dynamics, and health patterns connected to your elemental balance.`,
    
    cosmicDeepDive: `Beyond the classical planets, your connection to fixed stars, galactic center alignments, and asteroid signatures reveals deeper layers of cosmic purpose. These stellar connections activate ancient memory codes and future potential pathways.`,
    
    alternativeReferenceFrames: `Viewed through different cosmic perspectives—heliocentric, sidereal, and galactic coordinate systems—your chart reveals multiple layers of meaning. Each frame of reference unlocks different aspects of your multidimensional nature.`,
    
    esotericDimensions: `Your chart maps the soul's evolutionary journey across multiple incarnations. It reveals karmic patterns to integrate, spiritual gifts to develop, and the specific lessons your soul chose to master in this lifetime.`,
    
    crossSystemIntegration: `Your cosmic signature interfaces with multiple wisdom traditions—Human Design, Gene Keys, I Ching, and sacred geometry. Each system provides a unique lens for understanding your multifaceted spiritual blueprint.`,
    
    statisticalUniqueness: `The combination of your ${sunSign} Sun, ${moonSign} Moon, and ${ascendant} Ascendant creates a configuration found in less than 0.8% of the population. This rarity indicates you carry specific evolutionary codes for consciousness expansion.`
  };
}

export default generateAiReport;
