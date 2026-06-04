// Supabase Configuration
// Replace these with your actual Supabase credentials

if (!window.supabaseConfigured) {
    const SUPABASE_URL = 'https://ldyvcimylyermtcxeszi.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeXZjaW15bHllcm10Y3hlc3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzODQ1NDMsImV4cCI6MjA5NTk2MDU0M30.5P80iRJcEzmJcrHcrltO4F3TURx3mEXbUyXTLCnwZ58';

    // Initialize Supabase client
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Export for use in other scripts
    window.supabaseClient = supabase;
    window.supabaseConfigured = true;
}
