import { createClient } from '@supabase/supabase-js';

// Clean and sanitize the URL (strip quotes, trailing slashes, or accidental /rest/v1 suffixes)
function sanitizeUrl(url) {
  if (!url) return '';
  let cleaned = url.trim().replace(/^['"]|['"]$/g, '');
  // If user pasted the rest/v1 or auth/v1 endpoint, strip back to base domain
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '').replace(/\/auth\/v1\/?$/, '');
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zqsxohojxleuraazlzbf.supabase.co';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxc3hvaG9qeGxldXJhYXpsemJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NDM4MjIsImV4cCI6MjEwNzIxOTgyMn0.neEOYoQ-TN5vlSsky_ETcSXWx4FAN61-s2lIK2y-8ro';

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = rawAnonKey ? rawAnonKey.trim().replace(/^['"]|['"]$/g, '') : '';

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
