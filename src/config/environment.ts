
// Environment configuration
// This file centralizes environment variables and provides defaults

interface Environment {
  // API URLs
  tdahApiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // Feature flags
  enableNotifications: boolean;
  enableVoiceFeatures: boolean;
  
  // Misc
  appVersion: string;
  isDevelopment: boolean;
  isProduction: boolean;
  
  // Production flag to help with conditional logic
  isLocalhost: boolean;
}

// Check if we're running on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const env: Environment = {
  // API URLs with fallbacks - prioritize local development URL when in localhost
  tdahApiUrl: isLocalhost 
    ? 'http://localhost:5678' 
    : (import.meta.env.VITE_TDAH_API_URL || 'https://tdah-api.example.com'),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://qrnkwxdijodfdppfjors.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybmt3eGRpam9kZmRwcGZqb3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjIzMDIsImV4cCI6MjA2MjE5ODMwMn0.QZW7Im_qxhyf3bOeVVDlSwUidRxCE3IY4aScKZyyx3s',
  
  // Feature flags
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  enableVoiceFeatures: import.meta.env.VITE_ENABLE_VOICE_FEATURES === 'true',
  
  // Misc
  appVersion: import.meta.env.VITE_APP_VERSION || '0.1.0',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  
  // Check if we're running on localhost
  isLocalhost: isLocalhost,
};

export default env;
