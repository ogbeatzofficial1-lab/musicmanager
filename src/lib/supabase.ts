import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const url = (import.meta as any).env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  console.log('Supabase Check:', { hasUrl: !!url, hasKey: !!key });

  if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
    console.warn('Supabase credentials missing or default placeholder used. Using local fallback.');
    return null;
  }

  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}
