import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const supabaseUrl = 'https://iovmjhrcmveftdokffrf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvdm1qaHJjbXZlZnRkb2tmZnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3OTIzMzMsImV4cCI6MjA1MDM2ODMzM30.CSwFapyih5AroslJ6VVNBpOU1MT4MAKTX9cuDPLPsjY';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Clean and validate URL format
const cleanUrl = supabaseUrl.trim().replace(/\/$/, ''); // Remove trailing slash
if (!cleanUrl.startsWith('https://')) {
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient<Database>(
  cleanUrl,
  supabaseAnonKey.trim(),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'x-my-custom-header': 'my-app-name',
      },
    },
  }
);

// Add better error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  } else if (event === 'USER_UPDATED') {
    console.log('User updated:', session?.user?.id);
  }
});

// Handle token refresh errors
supabase.auth.onAuthStateChange(async (event) => {
  if (event === 'TOKEN_REFRESHED') {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.error('Token refresh failed:', error);
      // Force a new sign in if token refresh fails
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
  }
});