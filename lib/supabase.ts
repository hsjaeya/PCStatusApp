import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xjopjgrraxjrfyidpnmj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqb3BqZ3JyYXhqcmZ5aWRwbm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTQ2OTAsImV4cCI6MjA5MjgzMDY5MH0.dW47-fOvejSzcpzEyEOlPVZVV1rEYWdMVcknk_f9e3s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
