import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-supabase')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check connection health
export async function checkSupabaseHealth() {
  if (!supabase) {
    return { configured: false, connected: false, message: 'Supabase credentials not configured in environment variables.' };
  }
  try {
    const { error } = await supabase.from('site_settings').select('key').limit(1);
    if (error) {
      return { configured: true, connected: false, error, message: error.message };
    }
    return { configured: true, connected: true, message: 'Connected to Supabase PostgreSQL!' };
  } catch (err) {
    return { configured: true, connected: false, error: err, message: err.message };
  }
}
