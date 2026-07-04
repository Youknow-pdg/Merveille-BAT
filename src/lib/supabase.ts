import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://emtyxxwwslswrmjabjlq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdHl4eHd3c2xzd3JtamFiamxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDU2NjgsImV4cCI6MjA5MzQ4MTY2OH0.25yVHj_gCdIF7S20_aFetUyMlPHH-pjdhoiDcuDRg1I';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
