import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to fetch cosmic terminology
export const fetchCosmicTerminology = async () => {
  try {
    const { data, error } = await supabase
      .from('cosmic_terminology')
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cosmic terminology:', error);
    // Fallback data if Supabase connection fails
    return [
      { term: 'Cosmic Signature', description: 'The unique celestial pattern formed at the moment of birth.' },
      { term: 'Celestial Blueprint', description: 'The cosmic map that reveals one\'s purpose and potential.' },
      { term: 'Astral Resonance', description: 'The vibrational harmony between planetary bodies and human consciousness.' }
    ];
  }
};

// Helper function to fetch report templates
export const fetchReportTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('report_templates')
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching report templates:', error);
    // Fallback templates if Supabase connection fails
    return [
      { 
        section: 'sun_sign', 
        template: 'Your Sun in {sign} reveals your core essence and conscious self-expression. This placement illuminates your path toward self-realization and shapes how you radiate your unique energy into the world.' 
      },
      { 
        section: 'moon_sign', 
        template: 'Your Moon in {sign} reflects your emotional nature and subconscious patterns. This placement reveals how you process feelings, what brings you comfort, and your intuitive responses to life\'s ebb and flow.' 
      },
      { 
        section: 'ascendant', 
        template: 'Your Ascendant in {sign} shapes your outer persona and how others perceive you. This cosmic mask represents your natural approach to new situations and the energy you project into the world.' 
      }
    ];
  }
};

// Helper function to save generated report
export const saveCosmicReport = async (reportData) => {
  try {
    const { data, error } = await supabase
      .from('cosmic_reports')
      .insert([reportData])
      .select();
      
    if (error) throw error;
    return data[0] || null;
  } catch (error) {
    console.error('Error saving cosmic report:', error);
    return null;
  }
};

export default supabase;
