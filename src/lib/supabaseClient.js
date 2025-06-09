import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch cosmic terminology from Supabase
export const fetchCosmicTerminology = async () => {
  try {
    const { data, error } = await supabase
      .from('cosmic_terminology')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cosmic terminology:', error);
    // Fallback to hardcoded data if Supabase fails
    return [
      { term: 'Cosmic Signature', description: 'The unique celestial pattern formed at the moment of birth.' },
      { term: 'Celestial Blueprint', description: 'The cosmic map that reveals one\'s purpose and potential.' },
      { term: 'Astral Resonance', description: 'The vibrational harmony between planetary bodies and human consciousness.' }
    ];
  }
};

// Function to fetch report templates from Supabase
export const fetchReportTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('report_templates')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching report templates:', error);
    // Fallback to hardcoded templates if Supabase fails
    return [
      { section: 'introduction', template: 'Your cosmic signature reveals {sunSign} energy at your core, with {moonSign} emotional patterns and a {ascendant} rising approach to life.' },
      { section: 'sun_sign', template: 'With the Sun in {sunSign}, you express your essential self through {sunTraits}.' },
      { section: 'moon_sign', template: 'Your Moon in {moonSign} shapes your emotional landscape with {moonTraits}.' }
    ];
  }
};

// Function to save a generated cosmic report to Supabase
export const saveCosmicReport = async (reportData) => {
  try {
    const { data, error } = await supabase
      .from('cosmic_reports')
      .insert([reportData]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving cosmic report:', error);
    return null;
  }
};

// Function to fetch a previously generated cosmic report
export const fetchCosmicReport = async (reportData) => {
  try {
    // First try to find an existing report
    const { data: existingReport, error: fetchError } = await supabase
      .from('cosmic_reports')
      .select('*')
      .eq('birth_date', reportData.birth_date)
      .eq('birth_time', reportData.birth_time)
      .eq('latitude', reportData.latitude)
      .eq('longitude', reportData.longitude)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if no report exists
      throw fetchError;
    }
    
    if (existingReport) {
      return existingReport;
    }
    
    // If no existing report, save the new one
    const { data: newReport, error: insertError } = await supabase
      .from('cosmic_reports')
      .insert([reportData])
      .select()
      .single();
    
    if (insertError) throw insertError;
    return newReport;
  } catch (error) {
    console.error('Error with cosmic report:', error);
    return null;
  }
};

export default supabase;
