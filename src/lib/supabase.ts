import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.SUPABASE_URL || process.env.SUPABASE_URL;
const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = (url && key) 
  ? createClient(url, key)
  : null;

export function initSupabase(newUrl: string, newKey: string) {
  if (newUrl && newKey) {
    supabase = createClient(newUrl, newKey);
    return supabase;
  }
  return null;
}

export function getSupabase() {
  return supabase;
}

