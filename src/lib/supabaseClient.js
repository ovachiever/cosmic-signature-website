import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a production environment, these would be environment variables
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch cosmic terminology from Supabase
export async function getCosmicTerminology() {
  try {
    const { data, error } = await supabase
      .from('cosmic_terminology')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cosmic terminology:', error);
    // Fallback data in case Supabase is not available
    return [
      { id: 1, term: 'Cosmic Signature', description: 'The unique celestial pattern formed at the moment of birth.' },
      { id: 2, term: 'Celestial Blueprint', description: 'The cosmic map that reveals one\'s purpose and potential.' },
      { id: 3, term: 'Astral Resonance', description: 'The vibrational harmony between planetary bodies and human consciousness.' },
      { id: 4, term: 'Galactic Alignment', description: 'A rare configuration of celestial bodies that amplifies cosmic energy.' },
      { id: 5, term: 'Stellar Archetype', description: 'Fundamental cosmic patterns that influence human personality and destiny.' }
    ];
  }
}

// Function to save generated reports to Supabase
export async function saveReport(reportData) {
  try {
    const { data, error } = await supabase
      .from('cosmic_reports')
      .insert([reportData]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving report:', error);
    return null;
  }
}

// Function to fetch report templates from Supabase
export async function getReportTemplates() {
  try {
    const { data, error } = await supabase
      .from('report_templates')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching report templates:', error);
    // Fallback templates in case Supabase is not available
    return [
      {
        id: 1,
        section: 'introduction',
        template: 'Your birth moment created a cosmic fingerprint found in only 1 in {rarity} beings. The celestial bodies aligned in a pattern that speaks to your unique essence and purpose.'
      },
      {
        id: 2,
        section: 'sun_sign',
        template: 'With the Sun in {sign}, you embody the cosmic energy of {element}. This grants you the divine gifts of {qualities}.'
      },
      {
        id: 3,
        section: 'moon_sign',
        template: 'Your Moon in {sign} reveals your emotional landscape is shaped by {qualities}. In moments of reflection, you naturally turn to {activities}.'
      },
      {
        id: 4,
        section: 'rising_sign',
        template: 'Your Ascendant in {sign} creates a cosmic mask of {qualities}. Others perceive your energy as {perception}.'
      },
      {
        id: 5,
        section: 'unique_aspects',
        template: 'The {aspect} between {planet1} and {planet2} is particularly significant in your chart, occurring in only {rarity}% of the population. This creates a unique ability to {ability}.'
      }
    ];
  }
}
